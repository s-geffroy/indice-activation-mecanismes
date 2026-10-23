# Collecte des passations — conception et conformité RGPD

Ce document décrit la collecte des réponses pour le pilote de validation (`PLAN_VALIDATION.md`) : son architecture, les données collectées, leur base légale, leur durée de conservation, les droits des personnes et la sécurité. Il se termine par la **liste de ce qui doit être fait avant d’ouvrir** la collecte.

État actuel : **tout est prêt, rien n’est ouvert.**

- Le site ne transmet rien, parce que `COLLECT = null` et que la CSP impose `connect-src 'none'`.
- Le service n’est joignable par personne (`exposure: none`).
- `COLLECTE_FIN` est vide, donc le service refuse toute passation.

## Décisions prises

| Sujet | Décision |
|---|---|
| Exposition | Service public en HTTPS sur ce VPS, via Traefik, posé par `app-exposure.py` |
| Stockage | SQLite, volume nommé `iam_data` |
| Responsable du traitement | Le porteur du projet, à titre personnel |
| Conservation | 3 ans après le dernier jour de collecte, puis suppression automatique |
| Base légale | Consentement (RGPD, art. 6.1.a) |

## Architecture

```
navigateur ── page statique (GitHub Pages)
    │  consentement avant la passation, puis clic « Transmettre » à la fin
    ▼
Traefik (HTTPS) ──► collect  (src/collect/server.py, port interne 8080)
                        │  valide, filtre, stocke
                        ▼
                   iam_data : /data/collecte.sqlite3
                        ▲
                   worker (src/worker.py) : purge à l’échéance
```

**Le site** (`site/assets/collect.js`, le seul fichier autorisé à parler au réseau, ce qu’un test vérifie) :
- si une collecte est configurée et ouverte, l’accueil mène à un écran de consentement avant la passation ;
- la personne peut toujours répondre sans rien transmettre ;
- à la fin, elle clique elle-même sur « Transmettre » et reçoit un **code de participation** ;
- la page `confidentialite/` porte la notice complète et permet, avec ce code, de **consulter**, **télécharger** ou **effacer** ses réponses.

**Le service** (`src/collect/server.py`, bibliothèque standard Python seule) :

| Route | Rôle |
|---|---|
| `POST /v1/passations` | Dépôt d’une passation complète avec son consentement. Renvoie le code de participation. |
| `GET /v1/passations/moi` | Droit d’accès et de portabilité. Le code est passé dans l’en-tête `X-Code-Participation`, jamais dans l’URL. |
| `DELETE /v1/passations/moi` | Droit d’effacement, qui vaut retrait du consentement. |
| `GET /healthz` | Sonde du healthcheck. |

**Le worker** supprime toutes les passations le lendemain de l’échéance (`COLLECTE_FIN` + 3 ans). Il journalise à chaque cycle le nombre de passations et la date de suppression.

## Données

| Donnée | Collectée | Pourquoi |
|---|---|---|
| Réponses (choix PLUS/MOINS efficace, fréquences ACT) | oui | objet de l’étude |
| Forme, version du questionnaire | oui | analyse |
| Ordre présenté des items et des options | oui | contrôle des effets d’ordre |
| Heure de début à la minute, durée en minutes | oui | durée réelle, détection des passations bâclées |
| Date de réception (jour) | oui | suivi de la collecte |
| Version du consentement | oui | preuve du consentement |
| Empreinte SHA-256 du code de participation | oui | exercice des droits, sans pouvoir reconstituer le code |
| Scores calculés, statut | non : filtrés par le service | recalculables, inutiles |
| Nom, courriel, adresse IP, navigateur, appareil | **non** | minimisation |

**Données sensibles** (art. 9) : aucune.

**Identification.** Les données sont pseudonymes au mieux, sans doute anonymes en pratique : rien ne relie une passation à une personne sans son code. D’où l’article 11 : sans code, la personne ne peut pas être retrouvée, et la notice le dit.

**Adresse IP.** Le service la lit en mémoire pour limiter le débit (10 écritures par heure et par adresse, 600 au total). Il ne l’écrit jamais, et son journal HTTP par défaut est désactivé. **Traefik peut journaliser les adresses IP** : voir la liste d’ouverture.

## Base légale et information

- **Consentement** libre, spécifique, éclairé et univoque :
  - deux cases non précochées (« 18 ans ou plus » ; « j’ai lu la notice et j’accepte ») ;
  - un refus sans conséquence (« Répondre sans rien transmettre ») ;
  - la transmission n’a lieu que sur clic à la fin.
- **Preuve du consentement** : la version de la notice est enregistrée avec chaque passation. Toute modification de la notice ou du consentement impose d’incrémenter `CONSENT_VERSION` dans le service et `consentVersion` dans `site/data/collect.js`.
- **Retrait** : effacer ses réponses avec son code. Le retrait ne remet pas en cause les analyses agrégées déjà publiées ; la notice peut le préciser si nécessaire.
- **Notice (art. 13)** : `site/confidentialite/index.html`. Elle couvre :
  - le responsable et son contact ;
  - la finalité, la base légale et les données ;
  - les destinataires et l’hébergement, y compris GitHub Pages et les adresses IP de visite ;
  - les durées de conservation ;
  - les droits, l’article 11 et la réclamation auprès de la CNIL ;
  - l’absence de décision automatisée.

## Conservation

- **Réponses** : jusqu’à `COLLECTE_FIN` + 3 ans. Le worker les supprime ensuite (`DELETE` puis `VACUUM`). Le site affiche la même date, calculée de la même façon (un test vérifie la cohérence).
- **Journaux du service** : aucune donnée de réponse, aucune IP ; seulement des événements (« passation reçue », « passation effacée à la demande de la personne »).
- **Journaux Traefik et Docker** : selon la configuration de l’infrastructure. Leur durée doit être connue avant l’ouverture, car la notice l’annonce (`logsRetention`).
- **Sauvegardes** : `appctl backup` n’est pas activé sur ce VPS. Sans sauvegarde, une panne du volume fait perdre les données du pilote. Avec une sauvegarde, il faut l’inclure dans la durée de conservation (purge des sauvegardes à l’échéance).

## Sécurité

- **HTTPS** assuré par Traefik.
- **CORS** restreint à `https://s-geffroy.github.io`, les autres origines reçoivent 403.
- **Corps de requête** limité à 256 Ko, JSON validé contre le questionnaire et filtré champ par champ.
- **Conteneur** : non-root, système de fichiers en lecture seule (sauf `/data` et `/tmp`), limites CPU, mémoire et processus.
- **Code de participation** : 128 bits aléatoires (`secrets.token_urlsafe(16)`), seule son empreinte est stockée.
- **Site** : CSP stricte. `connect-src` passe de `'none'` à la seule origine du service à l’ouverture (un test vérifie la cohérence).

## Registre des traitements (fiche à reprendre)

| Rubrique | Contenu |
|---|---|
| Traitement | Validation psychométrique du questionnaire IAM (pilote) |
| Responsable | [nom], à titre personnel — [contact] |
| Finalité | Évaluer la qualité scientifique du questionnaire ; aucune décision sur les personnes |
| Base légale | Consentement, art. 6.1.a |
| Personnes concernées | Adultes volontaires ayant une expérience professionnelle |
| Données | Réponses, forme, ordre présenté, début à la minute, durée, date de réception, version du consentement, empreinte du code |
| Destinataires | Le responsable seul ; publication agrégée |
| Sous-traitants | Hébergeur du VPS [nom, pays] ; GitHub Pages pour la page statique (sans accès aux réponses) |
| Transferts hors UE | Aucun pour les réponses ; visites de la page servies par GitHub (États-Unis) |
| Durée | Fin de collecte + 3 ans |
| Sécurité | Voir la section Sécurité |

## Analyse d’impact (AIPD)

Les lignes directrices européennes rendent une AIPD probable à partir de **deux** des neuf critères. Ici, un seul critère est discutable : « évaluation ou notation ». Le questionnaire produit des scores, mais ils restent dans le navigateur, ne sont pas transmis et ne fondent aucune décision.

Les autres critères ne s’appliquent pas : pas de données sensibles, pas de personnes vulnérables (étude réservée aux adultes), pas de grande échelle (quelques centaines de passations), pas de croisement de données ni de technologie innovante.

**Conclusion : AIPD non requise.** Cette analyse est à conserver ; elle est à revoir si l’on ajoute des données (âge, secteur, employeur) ou si l’on change de finalité.

## Avant d’ouvrir la collecte

À faire dans l’ordre. Tant qu’une case n’est pas cochée, `COLLECT` reste à `null`.

1. ☐ **Nom de domaine** du service, par exemple `collecte.<domaine>`, pointant vers ce VPS.
2. ☐ **Exposition publique** du service `collect` (port 8080) par l’outil de l’infrastructure, jamais à la main :
   ```bash
   sudo /opt/infra/scripts/app-exposure.py iam --set collect=<mode public> --port collect=8080
   ```
   Le nom du mode public et la manière d’associer le domaine sont à vérifier avec `--help` ou auprès de l’administration du VPS. Seul `tailnet` est documenté dans `CLAUDE.md`.
3. ☐ **Journaux Traefik** : savoir s’ils enregistrent les adresses IP et combien de temps. Idéalement, ne pas journaliser les IP pour ce routeur, ou les tronquer. Reporter la durée dans `logsRetention`.
4. ☐ **Sauvegarde** de `iam_data` : décider si l’on sauvegarde (recommandé pour un pilote) et comment purger les sauvegardes à l’échéance.
5. ☐ **Date de fin** : `COLLECTE_FIN=AAAA-MM-JJ` dans `.env`, puis `sudo appctl rebuild`.
6. ☐ **Configuration du site**, dans `site/data/collect.js` :
   - `url` (origine du service), `endDate` (identique à `COLLECTE_FIN`), `consentVersion` (identique à `CONSENT_VERSION`) ;
   - `controller` (ton nom), `contact` (adresse publiée pour les droits) ;
   - `host` (hébergeur et pays), `logsRetention`.
7. ☐ **CSP** : remplacer `connect-src 'none'` par `connect-src <origine du service>` dans `site/index.html` et `site/confidentialite/index.html`. Les tests échouent tant que ce n’est pas cohérent.
8. ☐ **Registre** : compléter la fiche ci-dessus et la conserver.
9. ☐ **Essai de bout en bout** :
   - une passation courte transmise ;
   - code reçu ;
   - consultation et effacement depuis `confidentialite/` ;
   - `sudo appctl logs` montre « passation reçue » puis « passation effacée », sans IP.
10. ☐ Publier (push sur `main`).

## Points ouverts

- **Données de profil** pour l’analyse du pilote (secteur, encadrement, tranche d’âge, ancienneté) : utiles pour les quotas et les analyses. Les ajouter suppose de modifier la notice, le consentement (nouvelle version), la validation du service et de revoir l’AIPD.
- **Mesures complémentaires du pilote** (désirabilité sociale, aptitude cognitive, PSI) : instruments à choisir et à intégrer, sous réserve de leurs licences.
