# Spécification du scoring — IAM V2.2

Implémentée dans `site/assets/core.js` et vérifiée par `tests/site/core.test.mjs`. En cas d’écart, ce document fait foi et le code doit être corrigé.

## Principes

- Trois scores distincts, **jamais additionnés** : ACT, CAP, INT.
- Aucun score n’est étalonné ; **aucun percentile** n’est calculé ni affiché.
- Chaque score est calculé sur les items de la forme passée (courte ou complète).
- La forme courte ne donne que des scores globaux : un item par mécanisme ne suffit pas pour un sous-score.

## ACT — activation déclarée (score descriptif)

**Points par réponse.**

| Réponse | Item direct | Item inversé |
|---|---|---|
| 0 Jamais | 0 | 100 |
| 1 Rarement | 25 | 75 |
| 2 Parfois | 50 | 50 |
| 3 Souvent | 75 | 25 |
| 4 Presque toujours | 100 | 0 |
| X Situation non rencontrée | manquant | manquant |

X n’est **jamais** compté comme 0.

**Score global** = moyenne des points disponibles, si le nombre de réponses non X atteint au moins ⌈2/3 × nombre d’items⌉ :
- 24 sur 36 en forme complète ;
- 8 sur 12 en forme courte.

Sinon : « non calculable — trop peu de situations rencontrées ». En V2.1, onze X et un seul « 4 » donnaient 100.

**Score par mécanisme** (forme complète seulement) = moyenne des points disponibles du mécanisme, s’il en a au moins 2 sur 3. Sinon : manquant.

**Contrôles d’attention** (V1, et V2 en forme complète) :
- ils ne sont jamais scorés ;
- l’export indique pour chacun `true` (réponse attendue), `false` ou `null` (non répondu) ;
- l’analyse décide quoi faire d’une passation qui en échoue (voir `PLAN_VALIDATION.md`) ; le site n’exclut rien.

## CAP et INT — jugement (score expérimental)

Ils ne sont calculés **qu’avec une clé experte** établie selon `PROTOCOLE_CLE_EXPERTE.md`. Sans clé, le site affiche « CAP non scoré — clé experte requise » et « INT non scoré — clé experte requise ».

### Format de la clé (`site/data/expert_key.js`)

```js
export const EXPERT_KEY = {
  version: "2.2",          // doit égaler la version du questionnaire
  excluded: ["C17"],       // items sans consensus d’experts : ni scorés, ni bloquants
  items: {
    C01: { A: 40, B: 85, C: 60, D: 15 },  // K_o : efficacité de chaque option, 0 à 100
    // …
  },
};
```

Les identifiants A à D sont **canoniques**, c’est-à-dire ceux du questionnaire, et non l’ordre affiché.

**Conditions pour qu’un module soit scoré.** Chaque item non exclu de la forme doit être présent, avec quatre valeurs numériques entre 0 et 100 qui ne sont pas toutes égales. Sinon le module reste non scoré. Une clé d’une autre version est refusée.

### Score par item

    S_item = (K_best + (100 − K_worst)) / 2

Le calcul se fait sur les **valeurs K brutes**, sans normalisation min–max par item. En V2.1, la normalisation étirait sur 0–100 un item où les experts voyaient peu de différence : il pesait autant qu’un item tranché. Désormais, un item peu discriminant reste proche de 50 pour tout le monde.

### Agrégation

- **CAP par mécanisme** (forme complète) : moyenne des S_item non exclus du mécanisme.
- **CAP global** : moyenne des moyennes par mécanisme, pour que chaque mécanisme pèse autant. En forme courte, c’est la moyenne des 12 items.
- **INT global** : moyenne des S_item non exclus ; le détail par item est conservé.
- Si un item non exclu n’a pas de réponse, le module n’est pas scoré : le site n’affiche de résultats qu’après une passation complète.

## Export

**JSON** :
- forme, version, ordre des modules, ordre présenté des items et des options ;
- réponses avec identifiants canoniques ;
- liste des items inversés, résultat des contrôles d’attention ;
- scores.

**CSV**, une ligne par item dans l’ordre de passation. Colonnes :
- `form`, `module`, `item`, `mechanism` (mécanismes joints par « + » pour INT) ;
- `reversed`, `check`, `position` ;
- `best`, `worst`, `act_value` ;
- `act_points`, après retournement, vide pour un contrôle ;
- `presented_order`.
