# Cadre de l’IAM V2.2

Ce document fixe ce que mesure l’instrument, ce qu’il ne mesure pas, et les règles de rédaction de ses items. Il prévaut sur toute autre note pour la V2.2.

## Nom

**IAM — Indice d’Activation et de Maîtrise des mécanismes.**

Le nom de travail « Indice d’Activation des Mécanismes » était trop étroit : l’instrument ne mesure pas seulement l’activation, mais aussi le jugement.

## Ce que l’instrument mesure, et ce qu’il ne mesure pas

L’IAM porte sur les mécanismes sociaux, informationnels et décisionnels du travail en organisation : confiance, soutiens, influence, information, réputation, timing, décision sous incertitude…

| Module | Ce qu’il mesure | Ce qu’il ne mesure pas |
|---|---|---|
| **CAP** | Le jugement : savoir reconnaître, parmi des actions plausibles, la plus et la moins efficace dans une situation donnée. | Ce que la personne ferait réellement. |
| **INT** | Le même jugement, dans des situations neuves qui mettent plusieurs mécanismes en tension. | Une « intégration » observée en conditions réelles. |
| **ACT** | La fréquence de certains comportements, **telle que la personne la déclare**, sur six mois. | La fréquence réelle de ces comportements. |

**Limite assumée.** L’usage effectif des mécanismes n’est mesuré nulle part. L’IAM ne mesure pas l’écart entre « connaître le principe » et « savoir l’utiliser » ; il juxtapose un jugement (CAP, INT) et une auto-déclaration (ACT). Toute communication sur l’instrument doit le dire.

**Statut.** Instrument de recherche non validé. Aucun score n’est étalonné ; aucun percentile n’est calculé.

## Population visée

Adultes ayant une expérience professionnelle : salariat, fonction publique, secteur associatif, profession libérale ou indépendante. Les situations couvrent des secteurs variés (santé, industrie, collectivités, enseignement, commerce, associations, conseil). Elles supposent de travailler avec d’autres, mais pas d’exercer une fonction d’encadrement. Les quelques items où l’on dirige une équipe le précisent dans l’énoncé.

## Cadre d’efficacité

Une action est **efficace** si elle :

1. atteint l’objectif indiqué dans la situation (chaque énoncé finit par « Votre objectif : … ») ;
2. préserve la coopération avec les personnes concernées à moyen terme ;
3. respecte les règles de l’organisation et le droit.

Ce cadre est donné dans la consigne. Il remplace la mention de la V2.1, « pas ce qui vous paraît le plus moral », qui contredisait les items portant sur la confidentialité ou les données personnelles. Il s’impose aussi aux experts qui établissent la clé (voir `PROTOCOLE_CLE_EXPERTE.md`).

## Dimensions

Chaque mécanisme est défini par ce qu’il couvre et par ce qui relève d’un autre, pour limiter les recouvrements.

| Code | Dimension | Couvre | Ne couvre pas |
|---|---|---|---|
| M1 | Lecture du système social | Repérer qui influence réellement, les intérêts derrière les positions, les dynamiques informelles. | Agir sur ces dynamiques (M3, M4). |
| M2 | Construction de confiance | Établir, calibrer et réparer la confiance dans une relation de travail. | Sanctionner une défection (M8). |
| M3 | Construction de soutiens | Rassembler les appuis nécessaires à une décision, choisir avec qui s’allier, se positionner entre des camps. | Le moment de l’action (M12). |
| M4 | Influence | Faire évoluer une position en agissant sur les intérêts, le cadrage, l’essai. | Rassembler des appuis (M3). |
| M5 | Gestion stratégique de l’information | Décider quoi partager, à qui, dans quel ordre ; traiter une information incertaine ou confidentielle. | La réputation qui en découle (M6). |
| M6 | Réputation et visibilité | Gérer la perception de sa contribution, de sa position, de son comportement. | Le partage de l’information en soi (M5). |
| M7 | Création de valeur collective | Contribuer là où l’apport au collectif est le plus grand, même peu visible. | Le règlement des écarts de contribution (M8). |
| M8 | Gestion des conflits et des normes | Traiter un comportement non coopératif, faire évoluer une règle, réguler un conflit. | La confiance interpersonnelle en soi (M2). |
| M9 | Adaptabilité stratégique | Réviser une méthode ou une stratégie quand le contexte change. | Le pari ponctuel sous incertitude (M10). |
| M10 | Décision sous incertitude | Décider avec une information incomplète, **avec un enjeu relationnel** (recrutement, client, équipe, partenaire). | Le calcul probabiliste abstrait. |
| M11 | Autorégulation sous pression | Décider ou réagir sous l’effet de la fatigue, de la pression de délai, de l’échec, du conflit ou de la colère d’autrui. | La résistance réelle à la pression (non mesurable par questionnaire). |
| M12 | Choix du moment | Avancer, retarder ou séquencer une action selon le moment le plus favorable. | Le choix d’un camp (M3). |

## Formes et volumes

| Module | Forme complète | Forme courte (sous-ensemble) |
|---|---|---|
| ACT | 36 items (3 par mécanisme, dont 1 ou 2 inversés) + 2 contrôles d’attention | 12 items (1 par mécanisme, dont 4 inversés) + 1 contrôle |
| CAP | 60 items (5 par mécanisme) | 12 items (1 par mécanisme) |
| INT | 10 items (2 à 3 mécanismes chacun) | 3 items |
| Durée estimée¹ | 57 min | 14 min |

¹ Lecture à 200 mots/min, plus 8 s par choix. La durée est calculée à partir du texte par `tools/build-questionnaire.mjs`, et les tests imposent 16 min au plus pour la forme courte, 60 min au plus pour la complète.

**Forme courte.** Elle reprend, pour chaque mécanisme, l’item jugé a priori le plus discriminant, et 3 items INT qui couvrent 9 mécanismes. Elle ne donne que des scores globaux. Sa composition sera révisée après le pilote (voir `PLAN_VALIDATION.md`), à partir des corrélations item-total et de la corrélation forme courte / forme complète.

**Ordre de passation : ACT, CAP, INT.** ACT est passé d’abord : la personne déclare ses conduites avant d’avoir jugé des situations, ce qui limite l’effet de cohérence (répondre en ACT ce que l’on vient de juger efficace). En V2.1, l’ordre était inverse parce qu’ACT révélait le modèle ; les items ACT ne contiennent plus de théorie. L’ordre des items dans chaque module et l’ordre des options sont tirés au hasard.

## Règles de rédaction

Les règles marquées ✓ sont vérifiées par `tests/site/core.test.mjs` ; les autres relèvent de la relecture.

### Situations (CAP, INT)

- ✓ Quatre options A à D, chacune une **action concrète observable**. Aucune option ne commence par évaluer, comparer, déterminer, analyser, réfléchir ou considérer : ces options « méta » gagnaient d’office en V2.1.
- ✓ Aucune option ne contient : puisque, car, immédiatement, objectivement, exactement, intégralement, totalement, complètement, « tout en ». Ces mots marquaient les options extrêmes ou les options composées en V2.1. Les contraintes de temps vont dans l’énoncé.
- ✓ La plus longue option d’un item fait au plus 1,6 fois la plus courte (en mots) : la longueur ne doit pas signaler la bonne réponse.
- ✓ Énoncé de 90 mots au plus, terminé par « Votre objectif : … ».
- Au moins **deux options plausibles et concurrentes** par item. Ni « troisième voie » qui fait échapper au dilemme posé, ni option qui cumule deux bonnes choses.
- L’option attendue n’est pas toujours la plus prudente ni la plus nuancée : selon la situation, l’action directe ou rapide est la meilleure.
- Aucun scénario n’en reprend un autre. Les items INT sont des situations neuves, pas des variantes d’items CAP, et leur en-tête déclare les mécanismes qu’ils combinent.
- Contextes exclusivement professionnels et variés.

### Comportements (ACT)

- ✓ Un seul comportement par item (pas de « X ou Y »), sans « plutôt que… » qui indique la conduite attendue.
- ✓ Au moins un item inversé par mécanisme. Il décrit une conduite courante et non caricaturale, que l’on peut reconnaître sans se dévaloriser.
- Pas de justification théorique dans le libellé.
- Fréquence conditionnelle (« lorsque la situation s’est présentée »), avec X pour une situation non rencontrée.

### Écriture inclusive

- Tournures épicènes d’abord : « la personne », « l’équipe », « les membres », « en état de fatigue ».
- Point médian quand aucune tournure épicène ne convient : « épuisé·e », « indépendant·e ».
- Jamais de masculin générique pour désigner des personnes en général. Un rôle qui désigne une personne précise de la situation peut être genré (« la directrice générale », « le chef d’atelier »), en variant les genres d’un item à l’autre.
- ✓ Une liste de formes masculines connues (fatigué, candidat, clients, utilisateurs…) est interdite par test. La couverture est partielle : la relecture reste nécessaire.

## Correspondance V2.1 → V2.2

| V2.1 | V2.2 | Changement |
|---|---|---|
| Q1 | C01 | Contexte hospitalier ; option D reformulée. |
| Q2 | C02 | Contexte collectivité ; plus de « fonctions hiérarchiques ». |
| Q3 | C03 | Option C sans masculin générique. |
| Q4 | C06 | Entreprise prestataire ; option D concrète. |
| Q5 | C07 | Rendu plus difficile : décision à prendre en l’absence de la personne. |
| Q6 | C08 | Objectif explicite (retravailler ensemble). |
| Q7 | C11 | Conseil pédagogique ; option D sans masculin générique. |
| Q8 | C12 | Enjeu concret pour l’équipe ; reste en M3. |
| Q9 | C13 | Options rééquilibrées (toutes composées ou simples). |
| Q10 | C16 | Inchangé sur le fond. |
| Q11 | C17 | « Objectivement » retiré. |
| Q12 | C18 | « Représenter » remplacé par « présenter de nouveau ». |
| Q13 | C21 | Option méta D remplacée par une demande de confirmation écrite. |
| Q14 | C22 | Inchangé sur le fond. |
| Q15 | C23 | Situation de santé : le cadre d’efficacité inclut désormais le droit. |
| Q16 | C26 | Justification « irrationnel » retirée de l’option A. |
| Q17 | C27 | Inchangé sur le fond. |
| Q18 | C28 | Accord inclusif (« dominant·e »). |
| Q19 | C31 | La tâche visible a désormais une remplaçante crédible. |
| Q20 | C32 | Rendu plus difficile : le goulot sera renforcé dans dix jours. |
| Q21 | C33 | Inchangé sur le fond. |
| Q22 | C36 | Option D sans masculin générique. |
| Q23 | C37 | Option D concrète. |
| Q24 | C38 | Rupture d’exclusivité entre entreprises. |
| Q25 | C41 | Méthode de recrutement. |
| Q26 | C42 | Option B sans « progressivement afin d’observer ». |
| Q27 | C43 | Option D concrète (accompagner en rendez-vous). |
| Q28 | C46 | Option méta C remplacée par un appel à une autre référence. |
| Q29 | C47 | Indice « échec supportable » retiré ; enjeu relationnel (banque). |
| Q30 | C48 | Option D concrète (réserve mobilisable). |
| Q31 | C51 | Accord inclusif ; situation relationnelle précisée. |
| Q32 | C52 | Option A sans « immédiatement ». |
| Q33 | C53 | Option C moins dominante, D concrète. |
| Q34 | — | Supprimé : stratégie de dissimulation incompatible avec le cadre d’efficacité. |
| Q35 | C57 | Option méta C remplacée par une lettre d’intention. |
| Q36 | — | Supprimé : doublon de Q8 ; M12 est recentré sur le moment. |
| Q37–Q48 | A01, A04, A07, A10, A13, A16, A19, A22, A25, A28, A31, A34 (environ) | Réécrits sans théorie ; un comportement par item. |
| Q49–Q56 | — | Supprimés : variantes d’items CAP. I01 à I10 sont des situations neuves. |

Les items C04, C05, C09, C10, C14, C15, C19, C20, C24, C25, C29, C30, C34, C35, C39, C40, C44, C45, C49, C50, C54 à C56 et C58 à C60 sont nouveaux.
