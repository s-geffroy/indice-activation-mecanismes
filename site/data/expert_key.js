// Cle experte IAM V2.1 -- VIDE par defaut, et elle doit le rester tant
// qu'aucune cle n'a ete etablie et validee par des experts.
//
// Sans cle, le site affiche « CAP non scoré — clé experte requise » et
// « INT non scoré — clé experte requise ». Ne jamais remplir ce fichier avec
// des valeurs devinees : un score CAP/INT invente serait pire que pas de score.
//
// Format attendu, une fois la cle validee : pour chaque item CAP (Q1-Q36) et
// INT (Q49-Q56), la valeur d'efficacite K_o (0-100) de chaque option, par
// identifiant CANONIQUE (A/B/C/D du questionnaire, pas l'ordre affiche) :
//
//   export const EXPERT_KEY = {
//     Q1: { A: 40, B: 90, C: 60, D: 20 },
//     ...
//   };
//
// Un module n'est score que si TOUS ses items sont presents et valides.
export const EXPERT_KEY = null;
