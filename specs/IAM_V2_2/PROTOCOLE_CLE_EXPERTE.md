# Protocole d’établissement de la clé experte — IAM V2.2

Tant que ce protocole n’a pas été suivi, `site/data/expert_key.js` reste à `null` et CAP et INT ne sont pas scorés. Une clé inventée ou devinée serait pire que l’absence de score.

## Experts

- **8 au minimum**, 12 visés.
- Expérience d’au moins 10 ans dans des fonctions où les mécanismes évalués sont centraux : encadrement, direction de projet, négociation, ressources humaines, médiation. Ou recherche en psychologie du travail ou des organisations.
- **Diversité** de secteurs (privé, public, associatif, santé…) et de genres ; au plus un tiers d’un même secteur.
- Aucun expert n’a participé à la rédaction des items.

## Consigne donnée aux experts

Les experts reçoivent :
- le **cadre d’efficacité** de `CADRE_IAM_V2_2.md` (objectif indiqué, coopération à moyen terme, règles et droit) ;
- les items dans un ordre aléatoire, les options dans un ordre aléatoire ;
- **pas** les codes de mécanisme.

Pour chaque option, ils notent l’efficacité **K de 0 à 100**. Ils peuvent signaler un item ambigu en le commentant.

## Delphi en deux tours

1. **Tour 1** : notation individuelle, indépendante.
2. **Retour** : pour chaque option, chaque expert reçoit la médiane, l’intervalle interquartile et les commentaires anonymisés du groupe.
3. **Tour 2** : chaque expert peut réviser ses notes ; il justifie tout écart à la médiane de plus de 25 points.

## Critères d’accord (calculés sur le tour 2)

Pour chaque item :
- **ICC(2,k)** sur les 4 options × k experts ≥ **0,70** ;
- **écart-type des K** ≤ **20** pour chacune des deux options extrêmes (la plus et la moins efficace selon la médiane) ;
- **écart de médianes** ≥ **30** points entre la meilleure et la moins bonne option. En dessous, l’item ne discrimine pas assez.

Un item qui ne remplit pas ces trois critères est **exclu**. Il figure dans `excluded` et n’est ni scoré ni bloquant. Il peut être réécrit pour une version ultérieure.

## Valeur de la clé

**K_o = médiane** des notes du tour 2. La médiane est préférée à la moyenne, plus sensible aux experts isolés.

## Garde-fous

- Si plus de **20 %** des items d’un mécanisme sont exclus, le score par mécanisme est signalé comme fragile dans le rapport de validation.
- Si plus de **2 items INT sur 10** sont exclus, INT n’est pas publié.
- Le tableau des notes brutes (anonymisées) et le calcul des critères sont archivés avec la clé, dans le dépôt de recherche et non sur le site public.
- La clé est versionnée : `version: "2.2"`. Toute modification d’un item invalide sa valeur K et impose de le renoter.

## Complément empirique (après le pilote)

La clé experte peut être confrontée à une **clé de consensus**, c’est-à-dire les proportions de choix dans l’échantillon pilote. Un item où la clé experte et le consensus divergent fortement est réexaminé par les experts, sans être modifié automatiquement.
