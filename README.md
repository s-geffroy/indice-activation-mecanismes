# iam

Deux choses distinctes vivent dans ce depot :

- `site/` : le **questionnaire IAM V2.1** (Indice d'Activation et de Maitrise
  des mecanismes), site 100 % statique publie par
  GitHub Pages (voir plus bas). Il ne passe pas par le VPS.
- `src/` : un worker heberge sur le VPS multi-applications, du travail de fond,
  **aucune surface HTTP**. Il n'a aucun role dans le questionnaire.

## Questionnaire IAM V2.1 (GitHub Pages)

Instrument experimental pre-validation : 56 items, passes dans l'ordre
CAP (Q1-Q36), INT (Q49-Q56), puis ACT (Q37-Q48). Le nom publie
est fixe par `IDENTITY` dans `tools/build-questionnaire.mjs`, la version y
reste alignee sur le questionnaire source. Source :
`specs/koh-lanta_IAM/` (questionnaire, accroche, kit et `SCORING_SPEC.md`).

| fichier | role |
|---|---|
| `site/index.html` | page unique ; CSP stricte, aucune ressource distante |
| `site/assets/core.js` | logique sans DOM : session, scoring, sauvegarde, export |
| `site/assets/app.js` | affichage et navigation, delegue tout a `core.js` |
| `site/assets/theme.js` | theme clair/sombre (cle `ldc-theme`, comme l'Atlas) |
| `site/data/questionnaire.js` | **genere** depuis le Markdown, ne pas editer |
| `site/data/expert_key.js` | cle experte, `null` tant qu'elle n'est pas validee |
| `site/fonts/` | IBM Plex embarquee (licence OFL jointe) |
| `tools/build-questionnaire.mjs` | Markdown -> `questionnaire.js` |
| `tests/site/` | tests `node --test` |

Charte (jetons, polices, bascule de theme, ancre `#test`) reprise de
[economic-doctrine-atlas](https://github.com/s-geffroy/economic-doctrine-atlas).

### Ce que le site affiche

- ACT : « Activation declaree -- score descriptif », 0/25/50/75/100, `X` =
  manquant (jamais 0), global = moyenne des valeurs disponibles, et par
  mecanisme M1-M12.
- CAP et INT : « non score -- cle experte requise ». Ils ne sont calcules que
  si `expert_key.js` couvre **tous** les items du module (valeurs 0-100 pour
  A-D, non toutes egales), selon `SCORING_SPEC.md`, avec la mention « score
  experimental -- non etalonne ».
- Jamais de percentile, jamais de fusion CAP + ACT.

Les codes M1-M12 ne sont jamais affiches pendant la passation. L'ordre des
items (dans chaque module) et des options est tire au demarrage puis
sauvegarde ; l'export garde les identifiants canoniques A-D et l'ordre
presente (`presentation`, `questionOrder`). Reglage : `CONFIG` dans `core.js`.

Rien ne quitte le navigateur : `localStorage` seulement, pas de cookie, pas de
requete (la CSP l'interdit et un test le verifie). Export JSON, CSV, copie.

### Modifier le questionnaire

```bash
# apres modification de specs/koh-lanta_IAM/QUESTIONNAIRE_IAM_V2_1.md
node tools/build-questionnaire.mjs
node --test tests/site/
```

Previsualiser : les modules ES ne se chargent pas en `file://`, il faut un
serveur statique quelconque servant `site/` (ou simplement pousser sur une
branche et ouvrir la PR : le workflow teste sans publier).

### Publication

`.github/workflows/pages.yml` : a chaque push sur `main`, verifie que les
donnees sont a jour, lance `node --test tests/site/`, puis publie `site/` sur
<https://s-geffroy.github.io/indice-activation-mecanismes/>. Une version qui
echoue aux tests n'est jamais publiee. Sur une PR, seuls les tests tournent.

Activation (une seule fois) : depot GitHub -> **Settings** -> **Pages** ->
*Build and deployment* -> *Source* : **GitHub Actions**. Puis pousser sur
`main` (ou *Actions* -> *Pages* -> *Run workflow*). Pages gratuit exige un
depot public (ou un plan payant pour un depot prive).

## Worker

## Ou est le travail

`src/worker.py`, fonction `cycle()`. Tout le reste est la charpente :

| element | role |
|---|---|
| boucle | rappelle `cycle()` toutes les `WORKER_INTERVAL` secondes |
| battement | `/tmp/heartbeat`, touche a chaque tour, lu par le healthcheck |
| arret propre | SIGTERM honore, sommeil fractionne, fin du cycle en cours |
| `/state` | volume `iam_state`, ce qui doit survivre a un redemarrage |

## Cycle de developpement

```bash
sudo -iu iam
cd /srv/apps/iam
claude
```

Puis, apres modification :

```bash
tests/test_smoke.sh      # un cycle, un battement, un arret propre
sudo appctl validate
sudo appctl rebuild
sudo appctl status       # le conteneur doit passer 'healthy'
sudo appctl logs -f      # c'est ici qu'on voit si le travail se fait
```

Un worker n'a pas d'URL a ouvrir : **les logs sont l'interface**. `status` dit
que la boucle tourne, `logs` dit que le travail se fait. Les deux sont
necessaires.

## Reglages

| variable | defaut | role |
|---|---|---|
| `WORKER_INTERVAL` | `30` | secondes entre deux cycles |
| `WORKER_STATE` | `/state` | repertoire d'etat (volume persistant) |
| `WORKER_HEARTBEAT` | `/tmp/heartbeat` | fichier de battement |

Le seuil du healthcheck (180 s dans `compose.yaml`) doit rester superieur a
deux fois `WORKER_INTERVAL`.

## Exposition

`app.yaml` le declare en `none` : le conteneur ne parle qu'au reseau interne de
l'application. Pour ouvrir une page de metriques ou une sonde :

```bash
sudo /opt/infra/scripts/app-exposure.py iam --set worker=tailnet --port worker=9100
```

`app.yaml` et les labels Traefik sont mis a jour ensemble.

## Secrets

Les secrets reels vont dans `/etc/app-secrets/iam/` (root uniquement),
jamais dans ce depot :

```bash
printf '%s\n' "<la cle>" | sudo tee /etc/app-secrets/iam/api_key
sudo chmod 0444 /etc/app-secrets/iam/api_key   # lisible dans le conteneur
```

et dans `compose.yaml` :

```yaml
    secrets:
      - api_key
    environment:
      API_KEY_FILE: /run/secrets/api_key

secrets:
  api_key:
    file: /etc/app-secrets/iam/api_key
```

`0444` et non `0400` : le mode est reporte tel quel dans le conteneur, ou le
worker tourne en utilisateur non privilegie. Sur l'hote, c'est le repertoire
(0700 root) qui protege le secret.
