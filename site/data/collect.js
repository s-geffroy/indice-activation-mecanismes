// Configuration de la collecte du pilote. null : aucune collecte, le
// questionnaire ne transmet rien (etat par defaut, et seul etat autorise tant
// que la liste de COLLECTE_RGPD.md n'est pas entierement cochee).
//
// Pour ouvrir la collecte :
//
//   export const COLLECT = {
//     url: "<origine HTTPS du service, sans barre finale>",
//     endDate: "AAAA-MM-JJ",        // identique a COLLECTE_FIN du service
//     consentVersion: "1",          // identique a CONSENT_VERSION du service
//     controller: "<nom du responsable du traitement>",
//     contact: "<adresse de contact pour exercer ses droits>",
//     host: "<hebergeur du serveur et pays>",
//     logsRetention: "<duree de conservation des journaux du serveur>",
//   };
//
// et remplacer connect-src 'none' par l'origine du service dans la CSP de
// site/index.html et de site/confidentialite/index.html (un test le verifie).
export const COLLECT = null;
