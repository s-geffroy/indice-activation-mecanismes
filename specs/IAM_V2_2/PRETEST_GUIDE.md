# Guide du pré-test cognitif — IAM V2.2

**But.** Avant de mobiliser des experts et un échantillon pilote, vérifier sur une dizaine de personnes que les situations sont comprises comme prévu, que la bonne réponse ne se devine pas, que l’écriture inclusive ne gêne pas la lecture, et mesurer la durée réelle.

**Ce que le pré-test n’est pas.** Ni une mesure ni une notation : on ne calcule aucun score. Les personnes ne sont pas évaluées ; c’est le questionnaire qui l’est.

## Participant·es

- **10 personnes**, adultes ayant une expérience professionnelle, extérieures au projet.
- Diversité visée :
  - au moins 4 secteurs (privé, public, associatif, santé ou industrie…) ;
  - 3 à 4 personnes qui encadrent, 6 à 7 qui n’encadrent pas ;
  - âges et genres variés ;
  - au moins 2 personnes peu à l’aise avec la lecture longue ou dont le français n’est pas la langue maternelle.
- **8 personnes** passent la forme courte en entier (28 questions). **2 personnes** passent la forme complète, sans commentaire à voix haute, pour mesurer sa durée réelle.

## Matériel

- Le site : https://s-geffroy.github.io/indice-activation-mecanismes/ (forme courte, ou complète pour les 2 mesures de durée).
- Un ordinateur pour la personne. Pas de téléphone, sauf si l’on veut tester l’affichage mobile : le noter alors.
- Une grille de relevé par personne (`PRETEST_GRILLE.md`) et le tableau commun (`pretest_releve.csv`).
- Un chronomètre ; un enregistrement audio seulement avec accord explicite.

## Déroulé (45 à 60 min par personne pour la forme courte)

### 1. Accueil (5 min)

À dire, en substance :

> « Merci de votre aide. Nous testons un questionnaire, pas vous : s’il y a quelque chose de flou, c’est le questionnaire qui est en cause. Je vais vous demander de penser à voix haute en répondant : dites ce que vous comprenez, ce qui vous fait hésiter, ce qui vous gêne. Il n’y a pas de bonne façon de faire. Vos réponses ne sont pas notées et je ne garderai aucun nom. Vous pouvez arrêter à tout moment. »

Recueillir l’**accord oral** : participation, prise de notes et, le cas échéant, enregistrement. Attribuer un code (`P01`…`P10`) ; ne jamais écrire le nom sur la grille.

### 2. Passation commentée (30 à 40 min)

- La personne choisit la forme indiquée et répond seule. Vous restez à côté, en retrait.
- Notez la **position** de la question à l’écran (« Question 7 sur 28 ») : l’identifiant de l’item sera retrouvé ensuite grâce à l’export.
- **Relances neutres seulement**, si la personne se tait plus de 10 à 15 secondes :
  - « Qu’est-ce que vous vous dites, là ? »
  - « Qu’est-ce qui vous fait hésiter ? »
  - « Comment comprenez-vous cette phrase ? »
- **Ne jamais** expliquer une situation, reformuler une option, ni dire si une réponse est bonne. Si la personne demande « ça veut dire quoi ? », répondre : « Comment le comprenez-vous, vous ? » et noter la question.
- Repérer en particulier :
  - une situation comprise autrement que prévu (autre contexte, autre enjeu, autre personne visée) ;
  - une option jugée absurde, ou qui « saute aux yeux » sans réflexion ;
  - un mot ou une tournure qui bloque, y compris le point médian ;
  - une hésitation longue entre deux options, ce qui est bon signe ;
  - un objectif (« Votre objectif : … ») ignoré ou contesté ;
  - pour ACT, un comportement que la personne ne sait pas rattacher à son expérience, ou un recours à X qu’elle trouve inconfortable.

### 3. Fin de passation (5 min)

- Faire **exporter les réponses en JSON** (bouton de la page de résultats) et récupérer le fichier : il donne l’ordre des questions (`questionOrder`) et les heures de début et de fin.
- Noter la durée au chronomètre, hors relances longues.

### 4. Débriefing (10 min)

Poser ces questions dans cet ordre, sans les commenter :

1. « Globalement, qu’avez-vous pensé de ce questionnaire ? »
2. « Y a-t-il des situations qui vous ont paru irréalistes, ou trop éloignées de votre travail ? Lesquelles ? »
3. « Avez-vous eu l’impression, parfois, de deviner la réponse attendue sans vraiment réfléchir à la situation ? Pour quelles questions ? »
4. « Avez-vous parfois trouvé que deux actions se valaient vraiment ? »
5. « La consigne sur ce qu’est une action efficace vous a-t-elle servi ? L’avez-vous gardée en tête ? »
6. « Pour la partie sur vos comportements : était-ce facile de répondre sur six mois ? Avez-vous utilisé “Situation non rencontrée” ? »
7. « L’écriture inclusive vous a-t-elle gênée ou ralentie, à un endroit précis ? »
8. « La durée vous a-t-elle paru acceptable ? À quel moment avez-vous eu envie d’accélérer ? »
9. « Qu’est-ce que vous changeriez en priorité ? »

## Après chaque entretien (15 min)

- Retrouver les identifiants d’items à partir des positions notées et du `questionOrder` de l’export (ACT, puis CAP, puis INT, dans l’ordre de la liste).
- Reporter les observations dans `pretest_releve.csv`, une ligne par problème observé, en citant les mots exacts de la personne quand c’est possible.

## Analyse (après les 10 entretiens)

**Seuils d’action** (sur les 8 passations commentées de la forme courte) :

| Constat | Seuil | Action |
|---|---|---|
| Situation mal comprise | 2 personnes ou plus | Réécrire l’énoncé |
| Option jugée absurde ou jamais envisagée | 3 personnes ou plus | Remplacer l’option |
| Réponse « devinée » sans réfléchir | 3 personnes ou plus | Rééquilibrer les options |
| Même option PLUS efficace pour tout le monde | 8 sur 8 | Item trop facile : rendre une autre option concurrente |
| Gêne liée à l’écriture inclusive | 2 personnes ou plus au même endroit | Préférer une tournure épicène |
| Item ACT avec X | 4 personnes ou plus | Rendre la situation plus courante, ou la reformuler |
| Durée réelle | Plus de 18 min (courte) ou plus de 65 min (complète) | Raccourcir les énoncés les plus longs |

- Toute réécriture passe par `specs/IAM_V2_2/QUESTIONNAIRE_IAM_V2_2.md`, puis les tests de rédaction (`node --test tests/site/*.test.mjs`).
- Un item réécrit change de texte : si la notation experte a déjà commencé, il doit être renoté.
- Consigner les décisions (item, constat, modification) dans un court compte rendu joint au tableau.

## Données

- Aucun nom, aucune adresse, aucun employeur dans les grilles ni dans le tableau : seulement le code `Pxx`, le secteur, l’encadrement (oui/non) et la tranche d’âge.
- Les exports JSON et les enregistrements éventuels sont conservés hors du dépôt Git, puis supprimés une fois l’analyse terminée.
