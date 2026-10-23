// GENERE par tools/build-questionnaire.mjs depuis
// QUESTIONNAIRE_IAM_V2_2.md (voir specs/) -- ne pas editer a la main.
export const QUESTIONNAIRE = {
  "instrument": "IAM",
  "version": "2.2",
  "title": "Indice d’Activation et de Maîtrise des mécanismes",
  "subtitle": "version expérimentale pré-validation",
  "mechanisms": {
    "M1": "Lecture du système social",
    "M2": "Construction de confiance",
    "M3": "Construction de soutiens",
    "M4": "Influence",
    "M5": "Gestion stratégique de l’information",
    "M6": "Réputation et visibilité",
    "M7": "Création de valeur collective",
    "M8": "Gestion des conflits et des normes",
    "M9": "Adaptabilité stratégique",
    "M10": "Décision sous incertitude",
    "M11": "Autorégulation sous pression",
    "M12": "Choix du moment"
  },
  "modules": {
    "ACT": {
      "consigne": [
        "Pensez aux **six derniers mois** de votre vie professionnelle.",
        "Pour chaque comportement, indiquez à quelle fréquence vous l’avez eu **lorsque la situation s’est présentée**. Si elle ne s’est pas présentée, choisissez X.",
        "Il n’y a pas de bonne réponse : répondez au plus près de ce que vous avez réellement fait."
      ],
      "scale": [
        {
          "value": 0,
          "label": "Jamais"
        },
        {
          "value": 1,
          "label": "Rarement"
        },
        {
          "value": 2,
          "label": "Parfois"
        },
        {
          "value": 3,
          "label": "Souvent"
        },
        {
          "value": 4,
          "label": "Presque toujours"
        },
        {
          "value": "X",
          "label": "Situation non rencontrée ces six derniers mois"
        }
      ]
    },
    "CAP": {
      "consigne": [
        "Chaque situation se déroule dans un cadre professionnel et précise votre objectif. Pour chacune, choisissez :",
        "1. l’action qui vous paraît la **PLUS efficace** ;",
        "2. l’action qui vous paraît la **MOINS efficace**.",
        "Une action est efficace si elle atteint l’objectif indiqué, préserve la coopération avec les personnes concernées à moyen terme et respecte les règles de l’organisation ainsi que le droit.",
        "Jugez à partir des seules informations données. Plusieurs actions peuvent sembler raisonnables : c’est voulu."
      ],
      "scale": []
    },
    "INT": {
      "consigne": [
        "Ces situations combinent plusieurs enjeux à la fois. La consigne ne change pas : choisissez l’action la **PLUS efficace** et l’action la **MOINS efficace**, selon les mêmes critères."
      ],
      "scale": []
    }
  },
  "items": [
    {
      "id": "A01",
      "module": "ACT",
      "mechanism": "M1",
      "reversed": false,
      "short": true,
      "text": [
        "Avant une décision importante, j’ai cherché à savoir qui influençait réellement les autres."
      ],
      "options": []
    },
    {
      "id": "A02",
      "module": "ACT",
      "mechanism": "M1",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai demandé à une personne ce qui comptait pour elle avant de lui présenter une proposition."
      ],
      "options": []
    },
    {
      "id": "A03",
      "module": "ACT",
      "mechanism": "M1",
      "reversed": true,
      "short": false,
      "text": [
        "J’ai pris part à une décision sans savoir qui l’avait préparée en amont."
      ],
      "options": []
    },
    {
      "id": "A04",
      "module": "ACT",
      "mechanism": "M2",
      "reversed": false,
      "short": true,
      "text": [
        "J’ai confié une petite tâche à une personne nouvelle avant de lui confier un dossier important."
      ],
      "options": []
    },
    {
      "id": "A05",
      "module": "ACT",
      "mechanism": "M2",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai prévenu une personne dès que j’ai su que je ne pourrais pas tenir un engagement pris envers elle."
      ],
      "options": []
    },
    {
      "id": "A06",
      "module": "ACT",
      "mechanism": "M2",
      "reversed": true,
      "short": false,
      "text": [
        "J’ai retiré ma confiance à une personne après une seule erreur de sa part."
      ],
      "options": []
    },
    {
      "id": "A07",
      "module": "ACT",
      "mechanism": "M3",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai rencontré les personnes concernées avant de présenter une proposition en réunion."
      ],
      "options": []
    },
    {
      "id": "A08",
      "module": "ACT",
      "mechanism": "M3",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai cherché l’appui d’une personne qui était en désaccord avec moi au départ."
      ],
      "options": []
    },
    {
      "id": "A09",
      "module": "ACT",
      "mechanism": "M3",
      "reversed": true,
      "short": true,
      "text": [
        "J’ai présenté une proposition importante sans savoir qui la soutiendrait."
      ],
      "options": []
    },
    {
      "id": "A10",
      "module": "ACT",
      "mechanism": "M4",
      "reversed": false,
      "short": true,
      "text": [
        "J’ai adapté la présentation d’une proposition aux priorités de la personne à convaincre."
      ],
      "options": []
    },
    {
      "id": "A11",
      "module": "ACT",
      "mechanism": "M4",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai proposé un essai limité à une personne réticente à un changement."
      ],
      "options": []
    },
    {
      "id": "A12",
      "module": "ACT",
      "mechanism": "M4",
      "reversed": true,
      "short": false,
      "text": [
        "Face à un désaccord, j’ai répété les mêmes arguments jusqu’à la fin de la discussion."
      ],
      "options": []
    },
    {
      "id": "A13",
      "module": "ACT",
      "mechanism": "M5",
      "reversed": false,
      "short": true,
      "text": [
        "Avant de diffuser une information sensible, j’ai choisi à qui l’annoncer en premier."
      ],
      "options": []
    },
    {
      "id": "A14",
      "module": "ACT",
      "mechanism": "M5",
      "reversed": false,
      "short": false,
      "text": [
        "En transmettant une information non vérifiée, j’ai précisé qu’elle n’était pas vérifiée."
      ],
      "options": []
    },
    {
      "id": "A15",
      "module": "ACT",
      "mechanism": "M5",
      "reversed": true,
      "short": false,
      "text": [
        "J’ai transmis une information confidentielle sans m’assurer d’en avoir le droit."
      ],
      "options": []
    },
    {
      "id": "A16",
      "module": "ACT",
      "mechanism": "M6",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai mis en avant, devant d’autres, la contribution d’une personne à un résultat."
      ],
      "options": []
    },
    {
      "id": "A17",
      "module": "ACT",
      "mechanism": "M6",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai demandé à une personne de confiance comment mon attitude était perçue."
      ],
      "options": []
    },
    {
      "id": "A18",
      "module": "ACT",
      "mechanism": "M6",
      "reversed": true,
      "short": true,
      "text": [
        "J’ai gardé une habitude de travail que des collègues m’avaient signalée comme gênante."
      ],
      "options": []
    },
    {
      "id": "A19",
      "module": "ACT",
      "mechanism": "M7",
      "reversed": false,
      "short": true,
      "text": [
        "J’ai pris en charge une tâche peu visible qui débloquait le travail des autres."
      ],
      "options": []
    },
    {
      "id": "A20",
      "module": "ACT",
      "mechanism": "M7",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai partagé avec mes collègues une méthode de travail que j’avais mise au point."
      ],
      "options": []
    },
    {
      "id": "A21",
      "module": "ACT",
      "mechanism": "M7",
      "reversed": true,
      "short": false,
      "text": [
        "J’ai refusé d’aider une autre équipe sans chercher d’autre solution avec elle."
      ],
      "options": []
    },
    {
      "id": "A22",
      "module": "ACT",
      "mechanism": "M8",
      "reversed": false,
      "short": true,
      "text": [
        "J’ai parlé directement à une personne dont le comportement posait problème au groupe."
      ],
      "options": []
    },
    {
      "id": "A23",
      "module": "ACT",
      "mechanism": "M8",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai proposé une règle commune pour régler un désaccord qui revenait souvent."
      ],
      "options": []
    },
    {
      "id": "A24",
      "module": "ACT",
      "mechanism": "M8",
      "reversed": true,
      "short": false,
      "text": [
        "J’ai laissé un conflit entre collègues s’installer en espérant qu’il se règle de lui-même."
      ],
      "options": []
    },
    {
      "id": "A25",
      "module": "ACT",
      "mechanism": "M9",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai modifié ma façon de travailler après un changement dans mon environnement professionnel."
      ],
      "options": []
    },
    {
      "id": "A26",
      "module": "ACT",
      "mechanism": "M9",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai testé une nouvelle méthode sur un petit périmètre avant de l’adopter."
      ],
      "options": []
    },
    {
      "id": "A27",
      "module": "ACT",
      "mechanism": "M9",
      "reversed": true,
      "short": true,
      "text": [
        "J’ai continué à appliquer une méthode alors que des signes montraient qu’elle fonctionnait moins bien."
      ],
      "options": []
    },
    {
      "id": "A28",
      "module": "ACT",
      "mechanism": "M10",
      "reversed": false,
      "short": true,
      "text": [
        "J’ai tranché à la date prévue, sans attendre des informations qui manquaient encore."
      ],
      "options": []
    },
    {
      "id": "A29",
      "module": "ACT",
      "mechanism": "M10",
      "reversed": false,
      "short": false,
      "text": [
        "Avant une décision incertaine, j’ai prévu ce que je ferais si elle se révélait mauvaise."
      ],
      "options": []
    },
    {
      "id": "A30",
      "module": "ACT",
      "mechanism": "M10",
      "reversed": true,
      "short": false,
      "text": [
        "J’ai retardé une décision en attendant une information qui n’est jamais venue."
      ],
      "options": []
    },
    {
      "id": "A31",
      "module": "ACT",
      "mechanism": "M11",
      "reversed": false,
      "short": false,
      "text": [
        "Après une journée épuisante, j’ai reporté au lendemain une décision qui pouvait attendre."
      ],
      "options": []
    },
    {
      "id": "A32",
      "module": "ACT",
      "mechanism": "M11",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai attendu d’avoir retrouvé mon calme pour répondre à un message irritant."
      ],
      "options": []
    },
    {
      "id": "A33",
      "module": "ACT",
      "mechanism": "M11",
      "reversed": true,
      "short": true,
      "text": [
        "J’ai réagi sous le coup de l’agacement d’une façon que j’ai regrettée ensuite."
      ],
      "options": []
    },
    {
      "id": "A34",
      "module": "ACT",
      "mechanism": "M12",
      "reversed": false,
      "short": true,
      "text": [
        "J’ai retardé une demande pour la présenter à un moment plus favorable."
      ],
      "options": []
    },
    {
      "id": "A35",
      "module": "ACT",
      "mechanism": "M12",
      "reversed": false,
      "short": false,
      "text": [
        "J’ai avancé une action pour profiter d’une occasion qui risquait de passer."
      ],
      "options": []
    },
    {
      "id": "A36",
      "module": "ACT",
      "mechanism": "M12",
      "reversed": true,
      "short": false,
      "text": [
        "J’ai présenté une proposition à une personne qui n’était pas en état de l’écouter."
      ],
      "options": []
    },
    {
      "id": "V1",
      "module": "ACT",
      "mechanism": null,
      "reversed": false,
      "check": 3,
      "short": true,
      "text": [
        "Pour vérifier votre attention, choisissez « Souvent » sur cette ligne."
      ],
      "options": []
    },
    {
      "id": "V2",
      "module": "ACT",
      "mechanism": null,
      "reversed": false,
      "check": 1,
      "short": false,
      "text": [
        "Pour vérifier votre attention, choisissez « Rarement » sur cette ligne."
      ],
      "options": []
    },
    {
      "id": "C01",
      "module": "CAP",
      "mechanism": "M1",
      "short": true,
      "text": [
        "Vous rejoignez un service hospitalier de huit personnes. La cadre de santé anime les réunions, mais certaines décisions semblent arrêtées avant d’y être discutées. Une décision sur l’organisation des gardes aura lieu dans une semaine.",
        "Votre objectif : comprendre comment cette décision va réellement se prendre."
      ],
      "options": [
        {
          "id": "A",
          "text": "Demander à la cadre de santé comment les décisions sont préparées dans le service."
        },
        {
          "id": "B",
          "text": "Observer pendant la semaine qui échange avec qui en dehors des réunions."
        },
        {
          "id": "C",
          "text": "Rencontrer en tête-à-tête les deux collègues qui interviennent le plus en réunion."
        },
        {
          "id": "D",
          "text": "Proposer dès cette semaine une organisation des gardes pour voir les réactions."
        }
      ]
    },
    {
      "id": "C02",
      "module": "CAP",
      "mechanism": "M1",
      "short": false,
      "text": [
        "Dans une collectivité, un comité reste bloqué depuis trois réunions entre deux tracés de piste cyclable. Les débats ne montrent pas pourquoi aucune majorité ne se dégage. Vous pouvez mener quatre entretiens individuels avant la prochaine séance.",
        "Votre objectif : comprendre ce qui empêche la décision."
      ],
      "options": [
        {
          "id": "A",
          "text": "Interroger les quatre membres qui défendent leur tracé avec le plus de vigueur."
        },
        {
          "id": "B",
          "text": "Interroger deux personnes favorables à chaque tracé sur les raisons de leur choix."
        },
        {
          "id": "C",
          "text": "Interroger les membres qui hésitent encore et pourraient faire basculer le vote."
        },
        {
          "id": "D",
          "text": "Interroger les quatre membres qui ont le plus d’ancienneté dans le comité."
        }
      ]
    },
    {
      "id": "C03",
      "module": "CAP",
      "mechanism": "M1",
      "short": false,
      "text": [
        "Une personne d’un autre service soutenait jusqu’ici vos propositions en comité de pilotage. À la dernière séance, elle s’y est opposée sans avancer d’argument nouveau. Le prochain comité a lieu dans dix jours.",
        "Votre objectif : comprendre ce revirement avant le prochain comité."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui demander en privé ce qui l’a amenée à changer de position."
        },
        {
          "id": "B",
          "text": "Repérer avec qui elle a travaillé récemment et ce que ces personnes défendent."
        },
        {
          "id": "C",
          "text": "Demander à plusieurs membres du comité ce qui explique, à leur avis, ce revirement."
        },
        {
          "id": "D",
          "text": "Adapter votre prochaine proposition en tenant ce désaccord pour acquis."
        }
      ]
    },
    {
      "id": "C04",
      "module": "CAP",
      "mechanism": "M1",
      "short": false,
      "text": [
        "Vous proposez un logiciel de planification dans une PME industrielle. La directrice générale signera la décision. Vous apprenez qu’elle ne valide jamais un achat de ce type sans l’accord du chef d’atelier, qui n’a aucun rôle officiel dans le projet.",
        "Votre objectif : faire adopter le logiciel le plus adapté."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter le projet au chef d’atelier avant la réunion de décision."
        },
        {
          "id": "B",
          "text": "Soigner le dossier destiné à la directrice générale, qui reste décisionnaire."
        },
        {
          "id": "C",
          "text": "Demander à la directrice d’associer officiellement le chef d’atelier au projet."
        },
        {
          "id": "D",
          "text": "Inviter le chef d’atelier à la démonstration organisée pour toute l’équipe."
        }
      ]
    },
    {
      "id": "C05",
      "module": "CAP",
      "mechanism": "M1",
      "short": false,
      "text": [
        "Dans une association, deux responsables de pôle refusent chacune de céder une salle partagée le mardi. En réunion, leurs arguments portent sur le nombre de bénéficiaires, mais les chiffres des deux pôles sont proches.",
        "Votre objectif : trouver ce qui bloque vraiment, pour débloquer la situation."
      ],
      "options": [
        {
          "id": "A",
          "text": "Demander à chaque responsable ce que perdrait concrètement son pôle sans la salle."
        },
        {
          "id": "B",
          "text": "Recompter la fréquentation des deux activités du mardi sur les trois derniers mois."
        },
        {
          "id": "C",
          "text": "Réunir les deux responsables pour lister ensemble leurs contraintes du mardi."
        },
        {
          "id": "D",
          "text": "Soumettre la question au bureau de l’association pour qu’il tranche."
        }
      ]
    },
    {
      "id": "C06",
      "module": "CAP",
      "mechanism": "M2",
      "short": true,
      "text": [
        "Vous commencez à travailler avec une entreprise prestataire que vous connaissez peu. Dans un mois, vous devrez peut-être lui confier la migration de toutes les données de votre clientèle.",
        "Votre objectif : savoir si vous pourrez lui confier cette migration."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui confier dès maintenant une partie sensible du projet pour tester sa fiabilité."
        },
        {
          "id": "B",
          "text": "Lui confier d’abord plusieurs petites tâches dont le résultat se vérifie facilement."
        },
        {
          "id": "C",
          "text": "Rédiger avec elle un cahier des charges détaillé avant toute tâche."
        },
        {
          "id": "D",
          "text": "Interroger deux organisations clientes sur leur expérience passée avec elle."
        }
      ]
    },
    {
      "id": "C07",
      "module": "CAP",
      "mechanism": "M2",
      "short": false,
      "text": [
        "Une collègue fiable depuis deux ans n’a pas envoyé le rapport promis à une entreprise cliente, pour la première fois. Vous ignorez pourquoi. Elle est absente aujourd’hui, et un autre rapport pour cette entreprise est prévu dans trois jours.",
        "Votre objectif : tenir l’engagement pris sans abîmer la relation avec votre collègue."
      ],
      "options": [
        {
          "id": "A",
          "text": "Confier le prochain rapport à une autre personne sans lui en parler."
        },
        {
          "id": "B",
          "text": "Attendre son retour pour lui demander ce qui s’est passé avant toute décision."
        },
        {
          "id": "C",
          "text": "Lui laisser le prochain rapport et lui écrire pour savoir ce qui s’est passé."
        },
        {
          "id": "D",
          "text": "Commencer par précaution une version de secours du prochain rapport."
        }
      ]
    },
    {
      "id": "C08",
      "module": "CAP",
      "mechanism": "M2",
      "short": false,
      "text": [
        "Vous menez un projet de six semaines avec une structure partenaire. Votre résultat dépend en partie du sien, et vous organisez librement le partage du travail.",
        "Votre objectif : réussir le projet et pouvoir retravailler ensemble ensuite."
      ],
      "options": [
        {
          "id": "A",
          "text": "Découper le travail pour que chaque structure dépende le moins possible de l’autre."
        },
        {
          "id": "B",
          "text": "Prévoir des livrables intermédiaires que chacune des deux structures peut vérifier."
        },
        {
          "id": "C",
          "text": "Écrire une convention précisant les obligations et les pénalités en cas de retard."
        },
        {
          "id": "D",
          "text": "Réaliser vous-même la partie critique, puis lui confier progressivement davantage de travail."
        }
      ]
    },
    {
      "id": "C09",
      "module": "CAP",
      "mechanism": "M2",
      "short": false,
      "text": [
        "Vous avez promis à une équipe voisine un jeu de données pour lundi. Vendredi soir, vous découvrez une erreur dont vous ignorez l’ampleur : le retard pourrait aller de deux jours à deux semaines. L’équipe a déjà planifié son travail autour de cette date.",
        "Votre objectif : préserver la confiance de cette équipe."
      ],
      "options": [
        {
          "id": "A",
          "text": "Prévenir l’équipe dès ce soir du retard, sans pouvoir encore donner de date."
        },
        {
          "id": "B",
          "text": "Livrer lundi la partie des données que l’erreur ne touche pas."
        },
        {
          "id": "C",
          "text": "Mesurer l’ampleur de l’erreur ce week-end, puis prévenir l’équipe lundi avec une date."
        },
        {
          "id": "D",
          "text": "Demander à votre responsable d’informer l’équipe du retard et de ses raisons."
        }
      ]
    },
    {
      "id": "C10",
      "module": "CAP",
      "mechanism": "M2",
      "short": false,
      "text": [
        "Une nouvelle collègue affirme maîtriser un outil d’analyse que vous ne maîtrisez pas vous-même. Un dossier qui dépend de cet outil doit partir chez un financeur dans quinze jours.",
        "Votre objectif : rendre un dossier fiable dans les délais."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui confier l’analyse et relire avec elle les résultats avant l’envoi."
        },
        {
          "id": "B",
          "text": "Lui confier l’analyse et la laisser organiser son travail jusqu’à l’envoi."
        },
        {
          "id": "C",
          "text": "Faire l’analyse vous-même avec un outil que vous connaissez mieux."
        },
        {
          "id": "D",
          "text": "Lui faire refaire cette semaine une analyse passée, puis décider qui s’en charge."
        }
      ]
    },
    {
      "id": "C11",
      "module": "CAP",
      "mechanism": "M3",
      "short": true,
      "text": [
        "Le conseil pédagogique d’un lycée, qui compte neuf membres, choisit demain un projet parmi trois, à la majorité de cinq voix. Le vôtre a trois soutiens, deux membres hésitent, les quatre autres se partagent entre les projets concurrents. Vous avez le temps de mener deux conversations.",
        "Votre objectif : faire adopter votre projet."
      ],
      "options": [
        {
          "id": "A",
          "text": "Demander aux deux membres qui hésitent ce qui pourrait emporter leur adhésion."
        },
        {
          "id": "B",
          "text": "Proposer à la personne qui porte le projet le moins soutenu d’en intégrer une partie au vôtre."
        },
        {
          "id": "C",
          "text": "Demander à vos trois soutiens de convaincre leur entourage d’ici demain."
        },
        {
          "id": "D",
          "text": "Retravailler votre projet pour le rendre plus attractif aux yeux du conseil."
        }
      ]
    },
    {
      "id": "C12",
      "module": "CAP",
      "mechanism": "M3",
      "short": false,
      "text": [
        "Deux groupes de taille comparable s’opposent sur le choix d’un fournisseur. Votre équipe de trois personnes n’appartient à aucun des deux. La décision se prend aujourd’hui, et le fournisseur retenu conditionnera votre travail pendant deux ans.",
        "Votre objectif : obtenir un choix compatible avec les besoins de votre équipe."
      ],
      "options": [
        {
          "id": "A",
          "text": "Rejoindre le groupe dont le fournisseur convient le mieux à votre équipe."
        },
        {
          "id": "B",
          "text": "Proposer votre soutien à un groupe en échange d’une garantie pour votre équipe."
        },
        {
          "id": "C",
          "text": "Proposer en séance un cahier des charges commun aux deux fournisseurs."
        },
        {
          "id": "D",
          "text": "Attendre que l’un des groupes l’emporte pour vous rallier à sa décision."
        }
      ]
    },
    {
      "id": "C13",
      "module": "CAP",
      "mechanism": "M3",
      "short": false,
      "text": [
        "Une alliée de longue date perd rapidement du crédit auprès de la direction. Votre partenariat avec elle reste utile, mais il pourrait vous isoler si sa situation continue de se dégrader.",
        "Votre objectif : préserver votre capacité d’action et votre fiabilité."
      ],
      "options": [
        {
          "id": "A",
          "text": "Afficher votre soutien en comité et continuer à défendre ses dossiers en cours."
        },
        {
          "id": "B",
          "text": "Prendre vos distances avant que sa perte de crédit ne vous atteigne."
        },
        {
          "id": "C",
          "text": "Garder le partenariat sur les dossiers en cours sans en ouvrir de nouveaux."
        },
        {
          "id": "D",
          "text": "Lui demander de revoir certaines de ses positions avant de la soutenir de nouveau."
        }
      ]
    },
    {
      "id": "C14",
      "module": "CAP",
      "mechanism": "M3",
      "short": false,
      "text": [
        "Vous voulez faire adopter par votre direction un dispositif de télétravail pour votre service. Deux collègues peuvent vous appuyer : l’une est très appréciée de la direction mais peu concernée ; l’autre a conçu le dispositif et en maîtrise la technique, mais il est en conflit ouvert avec la direction. Une seule personne peut porter le dossier avec vous.",
        "Votre objectif : obtenir l’accord de la direction."
      ],
      "options": [
        {
          "id": "A",
          "text": "Porter le dossier avec la collègue appréciée de la direction."
        },
        {
          "id": "B",
          "text": "Porter le dossier avec le collègue qui a conçu le dispositif."
        },
        {
          "id": "C",
          "text": "Porter le dossier seul·e pour éviter les risques liés à un appui."
        },
        {
          "id": "D",
          "text": "Proposer à vos deux collègues de désigner qui vous accompagnera."
        }
      ]
    },
    {
      "id": "C15",
      "module": "CAP",
      "mechanism": "M3",
      "short": false,
      "text": [
        "Vous voulez proposer au conseil d’administration d’une association de fusionner deux antennes locales. Plusieurs membres du conseil sont attachés à leur antenne. Le conseil se réunit dans trois semaines.",
        "Votre objectif : faire adopter la fusion sans fracturer le conseil."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter la proposition au conseil avec un dossier chiffré solide."
        },
        {
          "id": "B",
          "text": "Rencontrer avant le conseil les membres attachés à leur antenne pour les écouter."
        },
        {
          "id": "C",
          "text": "Faire circuler une note sur la fusion à l’ensemble du conseil deux semaines avant."
        },
        {
          "id": "D",
          "text": "Proposer d’abord au conseil une étude sur l’opportunité d’une fusion."
        }
      ]
    },
    {
      "id": "C16",
      "module": "CAP",
      "mechanism": "M4",
      "short": true,
      "text": [
        "Une responsable indispensable à votre projet de réorganisation s’y oppose. Elle ne conteste pas vos chiffres, mais craint que le projet dégrade la qualité de service, qui est sa priorité.",
        "Votre objectif : obtenir son adhésion au projet."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui présenter des chiffres supplémentaires sur les gains attendus du projet."
        },
        {
          "id": "B",
          "text": "Lui proposer de définir avec vous les indicateurs suivis pendant la réorganisation."
        },
        {
          "id": "C",
          "text": "Demander à une personne dont elle respecte le jugement de lui en parler."
        },
        {
          "id": "D",
          "text": "Réduire l’ampleur du projet pour faciliter un compromis avec elle."
        }
      ]
    },
    {
      "id": "C17",
      "module": "CAP",
      "mechanism": "M4",
      "short": false,
      "text": [
        "Lors d’une réunion de chantier, deux corps de métier débattent du planning depuis une heure. Chaque camp répète ses arguments et les positions se durcissent. Vous avez la parole pour deux minutes.",
        "Votre objectif : faire avancer la réunion vers une décision."
      ],
      "options": [
        {
          "id": "A",
          "text": "Résumer les arguments les plus solides de chaque camp."
        },
        {
          "id": "B",
          "text": "Rappeler la date de livraison que les deux camps veulent tenir."
        },
        {
          "id": "C",
          "text": "Présenter le planning qui vous paraît le plus réaliste."
        },
        {
          "id": "D",
          "text": "Proposer de trancher par un vote entre les deux plannings."
        }
      ]
    },
    {
      "id": "C18",
      "module": "CAP",
      "mechanism": "M4",
      "short": false,
      "text": [
        "Votre proposition d’un nouvel outil de suivi a été rejetée le mois dernier. Vous apprenez que le principal obstacle était la crainte, chez plusieurs responsables d’équipe, de perdre la main sur l’organisation de leur travail. Vous souhaitez présenter de nouveau la proposition.",
        "Votre objectif : faire adopter l’outil."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter la même proposition avec des arguments supplémentaires sur ses bénéfices."
        },
        {
          "id": "B",
          "text": "Revoir la proposition pour laisser à chaque équipe le choix de ses réglages."
        },
        {
          "id": "C",
          "text": "Proposer aux responsables d’équipe un essai de trois mois, réversible à tout moment."
        },
        {
          "id": "D",
          "text": "Attendre plusieurs mois que le premier refus soit oublié."
        }
      ]
    },
    {
      "id": "C19",
      "module": "CAP",
      "mechanism": "M4",
      "short": false,
      "text": [
        "Vous voulez obtenir un budget de formation pour votre équipe. Votre directeur n’affiche qu’une priorité cette année : réduire les démissions.",
        "Votre objectif : obtenir le budget."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter la formation comme un moyen de fidéliser les membres de l’équipe."
        },
        {
          "id": "B",
          "text": "Présenter le catalogue de formation et le coût détaillé de chaque module."
        },
        {
          "id": "C",
          "text": "Faire remonter la demande par la responsable des ressources humaines."
        },
        {
          "id": "D",
          "text": "Joindre les entretiens de départ récents qui citent le manque de formation."
        }
      ]
    },
    {
      "id": "C20",
      "module": "CAP",
      "mechanism": "M4",
      "short": false,
      "text": [
        "Une pharmacienne hospitalière refuse le nouveau circuit de commande que vous proposez. Elle juge le circuit actuel plus sûr, et c’est elle qui l’a construit il y a dix ans.",
        "Votre objectif : faire adopter le nouveau circuit."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui proposer de tester le nouveau circuit dans un seul service pendant un mois."
        },
        {
          "id": "B",
          "text": "Lui présenter les incidents survenus avec le circuit actuel l’an dernier."
        },
        {
          "id": "C",
          "text": "Demander à la direction de rendre le nouveau circuit obligatoire."
        },
        {
          "id": "D",
          "text": "Lui proposer de piloter elle-même l’adaptation du nouveau circuit."
        }
      ]
    },
    {
      "id": "C21",
      "module": "CAP",
      "mechanism": "M5",
      "short": false,
      "text": [
        "Vous apprenez de source sûre qu’un fournisseur clé augmentera ses prix de 20 % le mois prochain. Le comité d’achats valide demain la commande annuelle sur la base des prix actuels. L’information n’est pas encore officielle, mais vous a été donnée sans demande de discrétion.",
        "Votre objectif : une décision d’achat bien informée."
      ],
      "options": [
        {
          "id": "A",
          "text": "Transmettre l’information à tout le comité avant la réunion, en citant sa source."
        },
        {
          "id": "B",
          "text": "Garder l’information pour vous jusqu’à ce qu’elle devienne officielle."
        },
        {
          "id": "C",
          "text": "Transmettre l’information à la présidente du comité seulement, avant la réunion."
        },
        {
          "id": "D",
          "text": "Demander au fournisseur de confirmer par écrit avant la réunion."
        }
      ]
    },
    {
      "id": "C22",
      "module": "CAP",
      "mechanism": "M5",
      "short": true,
      "text": [
        "Une collègue habituellement fiable vous signale qu’une entreprise cliente importante s’apprête à résilier son contrat. Elle tient l’information d’un tiers et ne l’a pas vérifiée. La réunion commerciale qui fixe les priorités a lieu dans six heures.",
        "Votre objectif : que la réunion décide sur la meilleure information disponible."
      ],
      "options": [
        {
          "id": "A",
          "text": "Appeler votre contact dans cette entreprise pour vérifier avant la réunion."
        },
        {
          "id": "B",
          "text": "Annoncer l’information en réunion en précisant qu’elle n’est pas vérifiée."
        },
        {
          "id": "C",
          "text": "Réorganiser les priorités en tenant l’information pour probablement vraie."
        },
        {
          "id": "D",
          "text": "Ne rien dire en réunion tant que l’information n’est pas confirmée."
        }
      ]
    },
    {
      "id": "C23",
      "module": "CAP",
      "mechanism": "M5",
      "short": false,
      "text": [
        "Pour justifier le report d’un projet, votre direction vous demande pourquoi l’équipe a pris du retard. La cause principale est l’arrêt maladie d’une personne de l’équipe, dont vous connaissez aussi le diagnostic.",
        "Votre objectif : une explication utile à la direction, conforme aux règles."
      ],
      "options": [
        {
          "id": "A",
          "text": "Expliquer le retard par une absence imprévue, sans donner d’autre détail."
        },
        {
          "id": "B",
          "text": "Donner à la direction les éléments dont vous disposez, diagnostic compris."
        },
        {
          "id": "C",
          "text": "Refuser d’expliquer le retard pour protéger la personne concernée."
        },
        {
          "id": "D",
          "text": "Demander d’abord à la personne ce qu’elle accepte que vous disiez."
        }
      ]
    },
    {
      "id": "C24",
      "module": "CAP",
      "mechanism": "M5",
      "short": false,
      "text": [
        "Votre service va être réorganisé et deux postes de coordination vont changer de périmètre. Vous devez annoncer la nouvelle organisation la semaine prochaine. Des bruits circulent déjà dans le service.",
        "Votre objectif : une annonce bien reçue, sans rumeur."
      ],
      "options": [
        {
          "id": "A",
          "text": "Informer d’abord en tête-à-tête les deux personnes concernées, puis toute l’équipe."
        },
        {
          "id": "B",
          "text": "Annoncer la réorganisation à toute l’équipe en même temps, en réunion."
        },
        {
          "id": "C",
          "text": "Envoyer le même jour un message écrit détaillé à l’ensemble du service."
        },
        {
          "id": "D",
          "text": "Laisser les deux personnes concernées l’annoncer elles-mêmes à l’équipe."
        }
      ]
    },
    {
      "id": "C25",
      "module": "CAP",
      "mechanism": "M5",
      "short": false,
      "text": [
        "Une rumeur circule : votre site de production fermerait l’an prochain. Vous savez que la direction étudie plusieurs scénarios, dont celui-ci, sans avoir rien décidé. Plusieurs membres de votre équipe vous interrogent.",
        "Votre objectif : limiter les effets de la rumeur sans trahir d’information interne."
      ],
      "options": [
        {
          "id": "A",
          "text": "Dire que vous n’avez aucune information sur le sujet."
        },
        {
          "id": "B",
          "text": "Dire que plusieurs scénarios sont à l’étude et qu’aucun n’est décidé."
        },
        {
          "id": "C",
          "text": "Demander à la direction une communication officielle rapide à l’équipe."
        },
        {
          "id": "D",
          "text": "Démentir la rumeur pour rassurer l’équipe dans l’immédiat."
        }
      ]
    },
    {
      "id": "C26",
      "module": "CAP",
      "mechanism": "M6",
      "short": false,
      "text": [
        "Depuis plusieurs mois, vos résultats commerciaux dépassent nettement ceux de vos collègues, et la direction le souligne en public. Vous sentez une distance s’installer avec vos collègues.",
        "Votre objectif : rester performant·e et garder la coopération de l’équipe."
      ],
      "options": [
        {
          "id": "A",
          "text": "Continuer à travailler de la même manière sans changer votre comportement."
        },
        {
          "id": "B",
          "text": "Mettre en avant, en réunion, l’appui de collègues dans vos ventes récentes."
        },
        {
          "id": "C",
          "text": "Réduire volontairement vos résultats le temps que les tensions retombent."
        },
        {
          "id": "D",
          "text": "Proposer de partager avec l’équipe vos méthodes de prospection."
        }
      ]
    },
    {
      "id": "C27",
      "module": "CAP",
      "mechanism": "M6",
      "short": false,
      "text": [
        "Un projet réussi repose surtout sur votre travail, mais trois collègues y ont aussi contribué. Vous présentez les résultats au comité de direction.",
        "Votre objectif : une présentation fidèle, qui serve aussi votre crédibilité."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter la contribution de chaque personne, la vôtre comprise."
        },
        {
          "id": "B",
          "text": "Insister surtout sur votre rôle pour qu’il ne soit pas sous-estimé."
        },
        {
          "id": "C",
          "text": "Présenter le résultat comme collectif sans détailler les contributions."
        },
        {
          "id": "D",
          "text": "Associer les trois collègues à la présentation devant le comité."
        }
      ]
    },
    {
      "id": "C28",
      "module": "CAP",
      "mechanism": "M6",
      "short": true,
      "text": [
        "Une collègue proche vous apprend que plusieurs personnes vous trouvent trop dominant·e en réunion. Vous estimez simplement prendre les initiatives nécessaires.",
        "Votre objectif : garder votre capacité d’action et le soutien de l’équipe."
      ],
      "options": [
        {
          "id": "A",
          "text": "Expliquer en réunion pourquoi vos interventions sont nécessaires au projet."
        },
        {
          "id": "B",
          "text": "Demander l’avis des autres en réunion avant de proposer votre solution."
        },
        {
          "id": "C",
          "text": "Intervenir moins souvent, y compris sur les sujets où vous êtes expert·e."
        },
        {
          "id": "D",
          "text": "Demander en privé à quelques collègues ce qui leur donne cette impression."
        }
      ]
    },
    {
      "id": "C29",
      "module": "CAP",
      "mechanism": "M6",
      "short": false,
      "text": [
        "Le directeur vous sollicite souvent en direct sur des sujets qui relèvent de votre responsable. Elle paraît de plus en plus agacée.",
        "Votre objectif : préserver la relation avec votre responsable sans froisser le directeur."
      ],
      "options": [
        {
          "id": "A",
          "text": "Informer à chaque fois votre responsable des demandes du directeur."
        },
        {
          "id": "B",
          "text": "Demander au directeur de passer par votre responsable à l’avenir."
        },
        {
          "id": "C",
          "text": "Répondre au directeur, qui est le plus haut placé dans la hiérarchie."
        },
        {
          "id": "D",
          "text": "Proposer à votre responsable de convenir ensemble d’une façon de répondre."
        }
      ]
    },
    {
      "id": "C30",
      "module": "CAP",
      "mechanism": "M6",
      "short": false,
      "text": [
        "Après un incident chez une entreprise cliente, plusieurs personnes de votre entreprise vous en attribuent la responsabilité. Vous savez que l’erreur vient d’une procédure mal conçue, que vous n’avez pas écrite.",
        "Votre objectif : rétablir votre crédibilité sans créer de conflit."
      ],
      "options": [
        {
          "id": "A",
          "text": "Envoyer aux personnes concernées un courriel qui rétablit les faits."
        },
        {
          "id": "B",
          "text": "Proposer à votre responsable une correction de la procédure, avec votre analyse de l’incident."
        },
        {
          "id": "C",
          "text": "Expliquer à chaque personne qui vous en parle ce qui s’est réellement passé."
        },
        {
          "id": "D",
          "text": "Laisser passer quelques semaines pour que l’incident soit oublié."
        }
      ]
    },
    {
      "id": "C31",
      "module": "CAP",
      "mechanism": "M7",
      "short": false,
      "text": [
        "Il reste deux tâches à répartir dans votre équipe projet. La présentation à l’entreprise cliente, très visible, correspond à vos compétences, mais une collègue s’en chargerait correctement. L’analyse des coûts, peu visible, n’est maîtrisée par personne d’autre que vous.",
        "Votre objectif : la réussite du projet."
      ],
      "options": [
        {
          "id": "A",
          "text": "Prendre la présentation à l’entreprise cliente, où vous produirez le meilleur résultat."
        },
        {
          "id": "B",
          "text": "Prendre l’analyse des coûts et laisser la présentation à votre collègue."
        },
        {
          "id": "C",
          "text": "Prendre la présentation et former votre collègue à l’analyse des coûts."
        },
        {
          "id": "D",
          "text": "Laisser la cheffe de projet décider de votre affectation."
        }
      ]
    },
    {
      "id": "C32",
      "module": "CAP",
      "mechanism": "M7",
      "short": false,
      "text": [
        "Votre équipe dispose d’une journée de renfort à affecter à une seule activité. Les ventes sont performantes ; le support est moyen ; la validation qualité retarde plusieurs livraisons, mais une recrue arrive dans dix jours pour la renforcer.",
        "Votre objectif : le meilleur résultat global pour l’équipe ce mois-ci."
      ],
      "options": [
        {
          "id": "A",
          "text": "Affecter la journée aux ventes pour accroître leur avance."
        },
        {
          "id": "B",
          "text": "Affecter la journée au support, qui a la plus grande marge de progrès."
        },
        {
          "id": "C",
          "text": "Affecter la journée à la validation qualité pour débloquer les livraisons."
        },
        {
          "id": "D",
          "text": "Répartir la journée entre les trois activités pour n’en négliger aucune."
        }
      ]
    },
    {
      "id": "C33",
      "module": "CAP",
      "mechanism": "M7",
      "short": true,
      "text": [
        "Votre équipe obtient de bons résultats individuels, mais perd beaucoup de temps lorsque les dossiers passent d’une personne à l’autre. Vous disposez de trois heures pour une seule amélioration.",
        "Votre objectif : rendre l’équipe plus efficace."
      ],
      "options": [
        {
          "id": "A",
          "text": "Améliorer votre propre méthode pour traiter vos dossiers plus vite."
        },
        {
          "id": "B",
          "text": "Rédiger avec l’équipe une fiche de transmission commune aux dossiers."
        },
        {
          "id": "C",
          "text": "Aider la personne de l’équipe dont les résultats sont les plus faibles."
        },
        {
          "id": "D",
          "text": "Instaurer un point quotidien de dix minutes sur les dossiers en cours."
        }
      ]
    },
    {
      "id": "C34",
      "module": "CAP",
      "mechanism": "M7",
      "short": false,
      "text": [
        "Vous avez développé un modèle de tableur qui vous fait gagner deux heures par semaine. Vos collègues font le même travail à la main. Le partager demanderait une journée de documentation, alors que vos propres objectifs sont serrés ce mois-ci.",
        "Votre objectif : la meilleure contribution au travail de l’équipe sur l’année."
      ],
      "options": [
        {
          "id": "A",
          "text": "Documenter le modèle ce mois-ci et le partager avec l’équipe."
        },
        {
          "id": "B",
          "text": "Partager le modèle tel quel et répondre aux questions au fil de l’eau."
        },
        {
          "id": "C",
          "text": "Garder le modèle pour vous jusqu’à ce que vos objectifs soient atteints."
        },
        {
          "id": "D",
          "text": "Présenter le modèle à votre responsable et lui laisser décider de sa diffusion."
        }
      ]
    },
    {
      "id": "C35",
      "module": "CAP",
      "mechanism": "M7",
      "short": false,
      "text": [
        "Une équipe voisine est débordée avant une échéance importante pour l’entreprise. Elle vous demande deux personnes pendant une semaine. Les objectifs de votre équipe, moins urgents, prendraient alors du retard.",
        "Votre objectif : servir au mieux les intérêts de l’organisation."
      ],
      "options": [
        {
          "id": "A",
          "text": "Prêter deux personnes pendant la semaine et prévenir vos interlocuteurs du retard."
        },
        {
          "id": "B",
          "text": "Refuser la demande pour protéger les objectifs de votre équipe."
        },
        {
          "id": "C",
          "text": "Prêter une seule personne pour limiter le retard de vos propres objectifs."
        },
        {
          "id": "D",
          "text": "Renvoyer la demande à la direction pour qu’elle arbitre entre les deux équipes."
        }
      ]
    },
    {
      "id": "C36",
      "module": "CAP",
      "mechanism": "M8",
      "short": true,
      "text": [
        "Depuis trois semaines, un membre de votre groupe de travail contribue nettement moins que les autres, tout en bénéficiant du même résultat collectif. Vous ignorez pourquoi.",
        "Votre objectif : rétablir une contribution équilibrée sans dégrader l’ambiance."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui demander en privé ce qui explique cette baisse de contribution."
        },
        {
          "id": "B",
          "text": "Proposer au groupe de répartir par écrit, nommément, les tâches restantes."
        },
        {
          "id": "C",
          "text": "Réduire votre propre contribution jusqu’à un partage plus équitable."
        },
        {
          "id": "D",
          "text": "Demander aux autres membres si la situation leur pose aussi problème."
        }
      ]
    },
    {
      "id": "C37",
      "module": "CAP",
      "mechanism": "M8",
      "short": false,
      "text": [
        "Dans votre établissement, une règle informelle réserve les créneaux de formation aux personnes les plus anciennes. Elle est acceptée depuis longtemps, mais empêche désormais de former les recrues à temps.",
        "Votre objectif : faire évoluer la règle sans conflit ouvert."
      ],
      "options": [
        {
          "id": "A",
          "text": "Demander une exception pour les recrues de votre propre équipe."
        },
        {
          "id": "B",
          "text": "Proposer une règle fondée sur les besoins de formation de chaque poste."
        },
        {
          "id": "C",
          "text": "Appliquer la règle tant qu’une majorité de l’établissement souhaite la garder."
        },
        {
          "id": "D",
          "text": "Rallier quelques personnes anciennes avant de soulever le sujet en réunion."
        }
      ]
    },
    {
      "id": "C38",
      "module": "CAP",
      "mechanism": "M8",
      "short": false,
      "text": [
        "Une entreprise partenaire a rompu volontairement un accord d’exclusivité avec vous pour signer avec la concurrence. Vous devrez sans doute retravailler avec elle dans les prochains mois.",
        "Votre objectif : protéger vos intérêts et garder possible une coopération future."
      ],
      "options": [
        {
          "id": "A",
          "text": "Mettre fin à toute coopération pour éviter une nouvelle défection."
        },
        {
          "id": "B",
          "text": "Continuer à travailler avec elle comme avant pour préserver la relation."
        },
        {
          "id": "C",
          "text": "Conditionner toute reprise à de nouveaux engagements écrits de sa part."
        },
        {
          "id": "D",
          "text": "Exiger une compensation financière avant toute nouvelle discussion."
        }
      ]
    },
    {
      "id": "C39",
      "module": "CAP",
      "mechanism": "M8",
      "short": false,
      "text": [
        "Deux personnes de votre équipe ne se parlent plus depuis un désaccord sur un dossier. Le travail commence à en souffrir : les informations circulent mal entre elles. Vous êtes leur responsable.",
        "Votre objectif : rétablir une collaboration de travail."
      ],
      "options": [
        {
          "id": "A",
          "text": "Réunir les deux personnes pour clarifier ensemble les règles du travail commun."
        },
        {
          "id": "B",
          "text": "Réorganiser les dossiers pour qu’elles n’aient plus à travailler ensemble."
        },
        {
          "id": "C",
          "text": "Rencontrer chaque personne séparément pour entendre sa version du désaccord."
        },
        {
          "id": "D",
          "text": "Attendre que la tension retombe d’elle-même dans les prochaines semaines."
        }
      ]
    },
    {
      "id": "C40",
      "module": "CAP",
      "mechanism": "M8",
      "short": false,
      "text": [
        "La meilleure vendeuse de votre équipe ne respecte pas la procédure de saisie des commandes, ce qui crée des erreurs de facturation pour la comptabilité. Plusieurs collègues commencent à l’imiter.",
        "Votre objectif : faire respecter la procédure sans perdre sa contribution."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui rappeler la procédure en privé et lui expliquer ses effets sur la comptabilité."
        },
        {
          "id": "B",
          "text": "Rappeler la procédure à toute l’équipe sans citer personne."
        },
        {
          "id": "C",
          "text": "Tolérer cet écart compte tenu de ses très bons résultats commerciaux."
        },
        {
          "id": "D",
          "text": "Simplifier la procédure avec la comptabilité pour la rendre plus facile à suivre."
        }
      ]
    },
    {
      "id": "C41",
      "module": "CAP",
      "mechanism": "M9",
      "short": false,
      "text": [
        "Une méthode de recrutement vous donne de bons résultats depuis deux ans. Le marché change : les candidatures spontanées, qui expliquaient une partie de son succès, se raréfient. Les derniers recrutements restent pourtant corrects.",
        "Votre objectif : continuer à recruter efficacement."
      ],
      "options": [
        {
          "id": "A",
          "text": "Garder la méthode tant qu’une baisse nette des résultats n’est pas constatée."
        },
        {
          "id": "B",
          "text": "Remplacer la méthode, l’une de ses conditions de succès ayant disparu."
        },
        {
          "id": "C",
          "text": "Revoir uniquement les étapes de la méthode qui reposaient sur les candidatures spontanées."
        },
        {
          "id": "D",
          "text": "Garder la méthode et suivre de près le volume de candidatures reçues."
        }
      ]
    },
    {
      "id": "C42",
      "module": "CAP",
      "mechanism": "M9",
      "short": true,
      "text": [
        "Une offre tarifaire assure de bons résultats commerciaux à votre entreprise, mais la concurrence la connaît désormais et commence à l’imiter. Elle produit encore de bons résultats.",
        "Votre objectif : garder l’avantage de votre entreprise dans la durée."
      ],
      "options": [
        {
          "id": "A",
          "text": "Garder l’offre telle quelle jusqu’à ce que ses résultats baissent."
        },
        {
          "id": "B",
          "text": "Tester des variantes de l’offre auprès d’une partie de la clientèle."
        },
        {
          "id": "C",
          "text": "Retirer l’offre pour ne pas devenir prévisible."
        },
        {
          "id": "D",
          "text": "Préparer une nouvelle offre à lancer dès que les résultats baissent."
        }
      ]
    },
    {
      "id": "C43",
      "module": "CAP",
      "mechanism": "M9",
      "short": false,
      "text": [
        "Vous arrivez dans une nouvelle agence où trois façons de prospecter coexistent, chacune pratiquée avec succès par une personne différente. Vous ne savez pas laquelle conviendra à votre secteur.",
        "Votre objectif : trouver vite la façon de prospecter qui vous convient."
      ],
      "options": [
        {
          "id": "A",
          "text": "Adopter la façon de faire de la personne qui a les meilleurs chiffres."
        },
        {
          "id": "B",
          "text": "Adopter la façon de faire la plus proche de votre expérience passée."
        },
        {
          "id": "C",
          "text": "Essayer chaque façon de faire sur quelques prospects avant de choisir."
        },
        {
          "id": "D",
          "text": "Accompagner chaque personne en rendez-vous avant de prospecter vous-même."
        }
      ]
    },
    {
      "id": "C44",
      "module": "CAP",
      "mechanism": "M9",
      "short": false,
      "text": [
        "Votre service déménage dans un mois. L’entreprise de mobilier annonce que la moitié des bureaux arrivera trois semaines après cette date ; le reste sera livré à temps.",
        "Votre objectif : réussir l’emménagement avec le moins de perturbations possible."
      ],
      "options": [
        {
          "id": "A",
          "text": "Maintenir la date et installer un mobilier provisoire en attendant."
        },
        {
          "id": "B",
          "text": "Reporter l’emménagement de trois semaines et prévenir les équipes concernées."
        },
        {
          "id": "C",
          "text": "Exiger de l’entreprise le respect du délai initial sous peine de pénalités."
        },
        {
          "id": "D",
          "text": "Emménager par étapes en commençant par les équipes dont le mobilier est livré."
        }
      ]
    },
    {
      "id": "C45",
      "module": "CAP",
      "mechanism": "M9",
      "short": false,
      "text": [
        "Votre nouvelle directrice semble préférer les échanges écrits courts, alors que vous aviez l’habitude de longues réunions de suivi avec son prédécesseur. Vos deux premiers points avec elle se sont mal passés, sans qu’elle dise pourquoi.",
        "Votre objectif : établir une relation de travail efficace avec elle."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui demander comment elle préfère être tenue informée."
        },
        {
          "id": "B",
          "text": "Passer à des notes écrites courtes dès le prochain point."
        },
        {
          "id": "C",
          "text": "Continuer les réunions, le temps qu’elle en mesure l’intérêt."
        },
        {
          "id": "D",
          "text": "Observer comment les autres responsables travaillent avec elle."
        }
      ]
    },
    {
      "id": "C46",
      "module": "CAP",
      "mechanism": "M10",
      "short": true,
      "text": [
        "Une candidate solide accepte votre offre d’embauche si vous lui répondez aujourd’hui ; une autre entreprise lui a fait une offre. Vous attendez encore l’avis de son ancienne responsable, qui arrivera dans deux jours.",
        "Votre objectif : recruter une personne fiable pour le poste."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui confirmer l’embauche dès aujourd’hui, sans attendre l’avis de son ancienne responsable."
        },
        {
          "id": "B",
          "text": "Lui demander deux jours de délai, le temps de recevoir l’avis."
        },
        {
          "id": "C",
          "text": "Appeler aujourd’hui, avec son accord, une autre personne qui l’a encadrée."
        },
        {
          "id": "D",
          "text": "Renoncer à cette candidature faute d’avis et relancer le recrutement."
        }
      ]
    },
    {
      "id": "C47",
      "module": "CAP",
      "mechanism": "M10",
      "short": false,
      "text": [
        "Vous dirigez une petite entreprise et devez choisir entre deux appels d’offres. Le premier offre un gain modéré avec une forte probabilité. Le second promet un gain bien plus élevé, mais très incertain. Un échec sur le second fragiliserait votre relation avec votre banque, sans menacer l’entreprise.",
        "Votre objectif : développer l’entreprise sans la mettre en danger."
      ],
      "options": [
        {
          "id": "A",
          "text": "Répondre au premier appel d’offres pour sécuriser un résultat positif."
        },
        {
          "id": "B",
          "text": "Répondre au second appel d’offres pour viser le gain le plus élevé."
        },
        {
          "id": "C",
          "text": "Répondre aux deux appels d’offres avec des moyens réduits sur chacun."
        },
        {
          "id": "D",
          "text": "Répondre au second après avoir présenté le risque à votre banque."
        }
      ]
    },
    {
      "id": "C48",
      "module": "CAP",
      "mechanism": "M10",
      "short": false,
      "text": [
        "Pour planifier les effectifs de l’été, trois personnes vous donnent des prévisions d’activité incompatibles : une experte du secteur qui a peu de données, un analyste qui a beaucoup de données mais connaît mal le secteur, et un collègue habituellement fiable qui ne justifie pas son chiffre.",
        "Votre objectif : une planification des effectifs fiable, acceptée par les trois personnes."
      ],
      "options": [
        {
          "id": "A",
          "text": "Retenir la prévision du collègue qui s’est le plus souvent montré fiable."
        },
        {
          "id": "B",
          "text": "Réunir l’experte et l’analyste pour confronter leurs hypothèses."
        },
        {
          "id": "C",
          "text": "Retenir la moyenne des trois prévisions pour fixer les effectifs."
        },
        {
          "id": "D",
          "text": "Prévoir un effectif de base et une réserve mobilisable si l’activité monte."
        }
      ]
    },
    {
      "id": "C49",
      "module": "CAP",
      "mechanism": "M10",
      "short": false,
      "text": [
        "Une cliente importante ne répond plus à vos messages depuis trois semaines, alors que le renouvellement de son contrat approche. Vous ignorez si elle est simplement débordée ou si elle envisage de partir.",
        "Votre objectif : maximiser les chances de renouvellement."
      ],
      "options": [
        {
          "id": "A",
          "text": "Préparer une offre de renouvellement améliorée et la lui envoyer."
        },
        {
          "id": "B",
          "text": "Passer par une autre personne de son entreprise pour prendre des nouvelles."
        },
        {
          "id": "C",
          "text": "Attendre sa réponse pour ne pas paraître insistant·e."
        },
        {
          "id": "D",
          "text": "Lui proposer un rendez-vous court à une date précise."
        }
      ]
    },
    {
      "id": "C50",
      "module": "CAP",
      "mechanism": "M10",
      "short": false,
      "text": [
        "Vous devez désigner aujourd’hui la personne qui remplacera une cheffe d’équipe absente pendant trois mois. Deux personnes se proposent : l’une expérimentée mais peu appréciée de l’équipe, l’autre appréciée mais sans expérience d’encadrement.",
        "Votre objectif : faire fonctionner l’équipe pendant ces trois mois."
      ],
      "options": [
        {
          "id": "A",
          "text": "Désigner la personne expérimentée, qui connaît le mieux le poste."
        },
        {
          "id": "B",
          "text": "Désigner la personne appréciée, qui a la confiance de l’équipe."
        },
        {
          "id": "C",
          "text": "Désigner les deux personnes en binôme pour assurer l’intérim."
        },
        {
          "id": "D",
          "text": "Assurer vous-même l’intérim pour éviter de trancher entre elles."
        }
      ]
    },
    {
      "id": "C51",
      "module": "CAP",
      "mechanism": "M11",
      "short": false,
      "text": [
        "En fin de journée très chargée, vous êtes épuisé·e lorsqu’une collègue vous demande de trancher un différend délicat entre deux membres de votre équipe. La décision peut attendre le lendemain sans coût important.",
        "Votre objectif : une décision juste et bien acceptée."
      ],
      "options": [
        {
          "id": "A",
          "text": "Trancher tout de suite pour ne plus avoir le sujet en tête."
        },
        {
          "id": "B",
          "text": "Annoncer que vous trancherez demain matin, après une nuit de repos."
        },
        {
          "id": "C",
          "text": "Demander à la collègue de trancher à votre place."
        },
        {
          "id": "D",
          "text": "Trancher maintenant, puis en reparler demain avec les deux personnes."
        }
      ]
    },
    {
      "id": "C52",
      "module": "CAP",
      "mechanism": "M11",
      "short": true,
      "text": [
        "Lors d’une réunion d’équipe, un collègue vous reproche devant tout le monde, et selon vous à tort, d’avoir retardé un dossier. Un point important pour toute l’équipe est le suivant à l’ordre du jour.",
        "Votre objectif : préserver la réunion et votre crédibilité."
      ],
      "options": [
        {
          "id": "A",
          "text": "Répondre en détail au reproche avant de passer au point suivant."
        },
        {
          "id": "B",
          "text": "Contester brièvement les faits et proposer d’en reparler après la réunion."
        },
        {
          "id": "C",
          "text": "Ne pas répondre et passer au point suivant de l’ordre du jour."
        },
        {
          "id": "D",
          "text": "Demander une courte pause pour retrouver votre calme avant de répondre."
        }
      ]
    },
    {
      "id": "C53",
      "module": "CAP",
      "mechanism": "M11",
      "short": false,
      "text": [
        "Une période de surcharge de trois semaines commence : clôture comptable et audit en même temps. Vous devrez continuer à prendre des décisions importantes.",
        "Votre objectif : préserver la qualité de vos décisions jusqu’à la fin de la période."
      ],
      "options": [
        {
          "id": "A",
          "text": "Garder votre organisation habituelle pour ne pas vous disperser."
        },
        {
          "id": "B",
          "text": "Reporter après la période les décisions qui peuvent attendre."
        },
        {
          "id": "C",
          "text": "Fixer à l’avance quelques règles simples pour les décisions répétitives."
        },
        {
          "id": "D",
          "text": "Allonger vos journées pour garder votre temps de réflexion habituel."
        }
      ]
    },
    {
      "id": "C54",
      "module": "CAP",
      "mechanism": "M11",
      "short": false,
      "text": [
        "Votre réponse à un appel d’offres important vient d’être refusée, après deux mois de travail de votre équipe. Une réunion d’équipe est prévue dans une heure ; vous êtes très déçu·e et irrité·e par les motifs du refus.",
        "Votre objectif : préserver la motivation de l’équipe."
      ],
      "options": [
        {
          "id": "A",
          "text": "Annuler la réunion et la reporter à la semaine prochaine."
        },
        {
          "id": "B",
          "text": "Dire votre déception, puis ce que l’équipe peut retenir de ce refus."
        },
        {
          "id": "C",
          "text": "Présenter les motifs du refus et votre désaccord avec eux."
        },
        {
          "id": "D",
          "text": "Tenir la réunion comme prévu sans laisser paraître votre déception."
        }
      ]
    },
    {
      "id": "C55",
      "module": "CAP",
      "mechanism": "M11",
      "short": false,
      "text": [
        "Une cliente vous appelle, très en colère, pour une erreur de livraison dont vous n’êtes pas responsable. Elle hausse le ton et vous accuse de négligence. Vous avez une autre réunion dans dix minutes.",
        "Votre objectif : régler la situation sans perdre la cliente."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui préciser que l’erreur ne vient pas de vous et l’orienter ailleurs."
        },
        {
          "id": "B",
          "text": "La laisser exprimer sa colère, puis lui proposer un rappel avec une solution."
        },
        {
          "id": "C",
          "text": "Lui demander poliment de rappeler lorsqu’elle sera plus calme."
        },
        {
          "id": "D",
          "text": "Lui proposer un geste commercial pour mettre fin à l’appel au plus vite."
        }
      ]
    },
    {
      "id": "C56",
      "module": "CAP",
      "mechanism": "M12",
      "short": true,
      "text": [
        "Vous voulez proposer une refonte du circuit de validation des dépenses. La direction financière vient d’annoncer un audit externe qui pointera sans doute les lenteurs actuelles ; ses conclusions sont attendues dans deux mois.",
        "Votre objectif : faire adopter la refonte."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter la refonte dès maintenant, sans attendre les conclusions de l’audit."
        },
        {
          "id": "B",
          "text": "Préparer la refonte et la présenter à la sortie des conclusions de l’audit."
        },
        {
          "id": "C",
          "text": "Proposer à l’équipe d’audit d’examiner votre projet de refonte."
        },
        {
          "id": "D",
          "text": "Attendre la fin de l’année budgétaire pour présenter la refonte."
        }
      ]
    },
    {
      "id": "C57",
      "module": "CAP",
      "mechanism": "M12",
      "short": false,
      "text": [
        "Une entreprise vous propose un partenariat. Ses conditions deviendraient probablement plus favorables si vous attendiez quelques semaines, mais elle pourrait aussi se tourner vers une autre structure sans prévenir.",
        "Votre objectif : obtenir un bon partenariat sans le perdre."
      ],
      "options": [
        {
          "id": "A",
          "text": "Signer dès cette semaine pour ne pas risquer de perdre l’offre."
        },
        {
          "id": "B",
          "text": "Attendre que les conditions s’améliorent avant de signer."
        },
        {
          "id": "C",
          "text": "Annoncer à l’entreprise que vous signerez d’ici trois semaines."
        },
        {
          "id": "D",
          "text": "Relancer l’entreprise dans quinze jours pour rouvrir la négociation."
        }
      ]
    },
    {
      "id": "C58",
      "module": "CAP",
      "mechanism": "M12",
      "short": false,
      "text": [
        "Une personne de votre équipe a commis une erreur sérieuse ce matin, lors d’une présentation à une cliente. Elle est visiblement affectée. Vous devez lui en parler.",
        "Votre objectif : qu’elle comprenne l’erreur et ne la reproduise pas."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui en parler à chaud, dès la fin du rendez-vous avec la cliente."
        },
        {
          "id": "B",
          "text": "Lui en parler dans un ou deux jours, lors d’un point prévu entre vous."
        },
        {
          "id": "C",
          "text": "Attendre son prochain entretien annuel pour aborder l’erreur avec elle."
        },
        {
          "id": "D",
          "text": "Lui demander, en fin de journée, comment elle a vécu la présentation."
        }
      ]
    },
    {
      "id": "C59",
      "module": "CAP",
      "mechanism": "M12",
      "short": false,
      "text": [
        "Vous souhaitez demander à votre responsable de passer à quatre jours par semaine. Elle est sous forte pression jusqu’à la fin du mois, et l’équipe vient de perdre une personne.",
        "Votre objectif : obtenir son accord."
      ],
      "options": [
        {
          "id": "A",
          "text": "Faire la demande dès cette semaine avec une proposition d’organisation."
        },
        {
          "id": "B",
          "text": "Attendre le début du mois prochain pour faire la demande."
        },
        {
          "id": "C",
          "text": "Faire la demande lors de votre entretien annuel, dans six mois."
        },
        {
          "id": "D",
          "text": "Faire la demande par écrit pour qu’elle y réponde à son rythme."
        }
      ]
    },
    {
      "id": "C60",
      "module": "CAP",
      "mechanism": "M12",
      "short": false,
      "text": [
        "Une entreprise sous-traitante prend du retard sur des pièces critiques et promet chaque semaine de le rattraper la suivante. Le retard atteint une semaine ; au-delà de trois, la production s’arrêterait. Votre direction ne le sait pas encore.",
        "Votre objectif : éviter l’arrêt de la production."
      ],
      "options": [
        {
          "id": "A",
          "text": "Prévenir votre direction dès maintenant du risque d’arrêt de la production."
        },
        {
          "id": "B",
          "text": "Attendre une semaine de plus avant d’alerter votre direction."
        },
        {
          "id": "C",
          "text": "Chercher dès cette semaine une autre entreprise sous-traitante, sans alerter la direction."
        },
        {
          "id": "D",
          "text": "Alerter la direction seulement si le retard atteint deux semaines."
        }
      ]
    },
    {
      "id": "I01",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M5",
        "M3",
        "M12"
      ],
      "short": true,
      "text": [
        "Une collègue fiable vous apprend qu’un projet concurrent du vôtre sera présenté demain au comité d’investissement, avec l’appui d’un directeur influent. Vous ignorez si les membres du comité ont déjà fait leur choix. Vous avez une heure et ne pouvez faire qu’une démarche.",
        "Votre objectif : que votre projet reste en lice."
      ],
      "options": [
        {
          "id": "A",
          "text": "Vérifier l’information auprès du secrétariat du comité d’investissement, dans l’heure."
        },
        {
          "id": "B",
          "text": "Appeler les deux membres du comité les plus proches de votre projet."
        },
        {
          "id": "C",
          "text": "Appeler le directeur qui soutient l’autre projet pour en discuter."
        },
        {
          "id": "D",
          "text": "Attendre la séance pour défendre votre projet face à l’autre."
        }
      ]
    },
    {
      "id": "I02",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M6",
        "M7",
        "M12"
      ],
      "short": false,
      "text": [
        "Vous repérez une économie importante dans les achats de votre service. Cette économie remet en cause un contrat négocié par une collègue respectée, candidate comme vous à une promotion qui sera décidée le mois prochain.",
        "Votre objectif : faire réaliser l’économie sans compromettre vos relations de travail."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter l’économie à la direction dès cette semaine, avec vos chiffres."
        },
        {
          "id": "B",
          "text": "Proposer à la collègue de présenter elle-même l’économie à la direction."
        },
        {
          "id": "C",
          "text": "Attendre que la promotion soit décidée pour présenter l’économie."
        },
        {
          "id": "D",
          "text": "Signaler l’économie à la direction des achats dans un courriel factuel."
        }
      ]
    },
    {
      "id": "I03",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M8",
        "M2",
        "M4"
      ],
      "short": true,
      "text": [
        "Une association partenaire, avec qui vous organisez un événement annuel, n’a pas fourni cette année les bénévoles promis, ce qui a mis l’événement en difficulté. Plusieurs membres de votre conseil veulent rompre le partenariat. Vous ignorez ce qui s’est passé de son côté. Le conseil vote dans deux jours ; la présidence partenaire ne peut vous recevoir que la semaine prochaine.",
        "Votre objectif : décider de l’avenir du partenariat sur de bonnes bases."
      ],
      "options": [
        {
          "id": "A",
          "text": "Proposer au conseil de rompre le partenariat dès ce vote."
        },
        {
          "id": "B",
          "text": "Demander au conseil de reporter le vote après votre rencontre avec la présidence."
        },
        {
          "id": "C",
          "text": "Proposer au conseil de reconduire le partenariat avec des engagements écrits."
        },
        {
          "id": "D",
          "text": "Laisser le conseil voter sur le partenariat sans donner votre avis."
        }
      ]
    },
    {
      "id": "I04",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M9",
        "M10",
        "M11"
      ],
      "short": false,
      "text": [
        "Votre équipe applique depuis deux ans une organisation des tournées qui reste rentable, mais dont la marge baisse depuis trois trimestres. Un nouveau logiciel promet mieux, sans retour d’expérience fiable. L’entreprise qui le vend ne garantit son tarif de lancement que pour un déploiement complet signé avant vendredi, et la direction vous presse.",
        "Votre objectif : améliorer la rentabilité des tournées sans perturber le service."
      ],
      "options": [
        {
          "id": "A",
          "text": "Garder l’organisation actuelle et revoir la question dans six mois."
        },
        {
          "id": "B",
          "text": "Déployer le logiciel sur toutes les tournées dès le mois prochain."
        },
        {
          "id": "C",
          "text": "Tester le logiciel sur deux tournées pendant un mois, au tarif normal."
        },
        {
          "id": "D",
          "text": "Demander un délai pour recueillir l’avis d’autres entreprises utilisatrices."
        }
      ]
    },
    {
      "id": "I05",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M11",
        "M6",
        "M1"
      ],
      "short": true,
      "text": [
        "Lors d’un séminaire avec des partenaires, vous découvrez qu’un document interne critique envers l’une des structures présentes a circulé par erreur. Sa représentante vous interpelle devant tout le monde. Vous êtes fatigué·e et pris·e au dépourvu.",
        "Votre objectif : préserver la relation avec cette structure et votre crédibilité."
      ],
      "options": [
        {
          "id": "A",
          "text": "Reconnaître l’erreur de diffusion devant tout le monde et présenter des excuses."
        },
        {
          "id": "B",
          "text": "Proposer à la représentante d’en parler en aparté à la pause."
        },
        {
          "id": "C",
          "text": "Minimiser devant tout le monde la portée du document pour clore l’incident."
        },
        {
          "id": "D",
          "text": "Renvoyer la question vers la personne qui a rédigé le document."
        }
      ]
    },
    {
      "id": "I06",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M5",
        "M2",
        "M8"
      ],
      "short": false,
      "text": [
        "Une collègue avec qui vous travaillez étroitement vous confie qu’elle quittera l’entreprise dans un mois. Elle vous demande de garder le secret jusqu’à la semaine prochaine et refuse de l’annoncer plus tôt. Demain, votre équipe doit lui confier la responsabilité d’un projet de deux ans.",
        "Votre objectif : une bonne décision pour le projet, sans trahir sa confiance."
      ],
      "options": [
        {
          "id": "A",
          "text": "Garder le secret et laisser la décision se prendre."
        },
        {
          "id": "B",
          "text": "Informer l’équipe de son départ avant la réunion."
        },
        {
          "id": "C",
          "text": "La prévenir que vous parlerez si le projet lui est confié."
        },
        {
          "id": "D",
          "text": "Proposer en réunion un autre nom, sans dire pourquoi."
        }
      ]
    },
    {
      "id": "I07",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M3",
        "M12",
        "M4"
      ],
      "short": false,
      "text": [
        "Deux directions s’opposent sur l’implantation d’un nouveau site. Vous êtes l’une des rares personnes à garder la confiance des deux, et votre avis pèsera dans l’arbitrage final, prévu dans dix jours.",
        "Votre objectif : un choix solide, accepté par les deux directions."
      ],
      "options": [
        {
          "id": "A",
          "text": "Donner rapidement votre avis en faveur de l’implantation que vous jugez meilleure."
        },
        {
          "id": "B",
          "text": "Rencontrer chaque direction pour cerner ce qu’elle ne peut pas céder."
        },
        {
          "id": "C",
          "text": "Garder votre avis pour vous jusqu’à l’arbitrage final."
        },
        {
          "id": "D",
          "text": "Proposer aux deux directions une grille de critères que vous aurez rédigée."
        }
      ]
    },
    {
      "id": "I08",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M7",
        "M10",
        "M1"
      ],
      "short": false,
      "text": [
        "Dans une ONG, vous devez attribuer un budget imprévu à l’un de trois programmes. Les données d’impact sont fragiles et le budget, trop limité pour être divisé, ira à un seul programme. Le programme le plus visible a le soutien appuyé du conseil ; un autre, discret, touche davantage de bénéficiaires selon les premiers chiffres.",
        "Votre objectif : le plus grand impact pour les bénéficiaires, avec l’accord du conseil."
      ],
      "options": [
        {
          "id": "A",
          "text": "Attribuer le budget au programme que soutient le conseil."
        },
        {
          "id": "B",
          "text": "Attribuer le budget au programme discret, en présentant les chiffres au conseil."
        },
        {
          "id": "C",
          "text": "Reporter l’attribution jusqu’à disposer de données d’impact plus solides."
        },
        {
          "id": "D",
          "text": "Présenter les chiffres des deux programmes au conseil et le laisser trancher."
        }
      ]
    },
    {
      "id": "I09",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M2",
        "M5",
        "M11"
      ],
      "short": false,
      "text": [
        "Vous dirigez une petite équipe. Un incident de sécurité mineur a eu lieu cette nuit, à cause d’un oubli d’une personne de l’équipe, qui vous l’avoue spontanément. Votre direction veut un rapport dans deux heures et vous reproche déjà d’avoir tardé.",
        "Votre objectif : un rapport exact, sans abîmer la confiance de l’équipe."
      ],
      "options": [
        {
          "id": "A",
          "text": "Rédiger un rapport factuel sur l’incident et ses causes, sans nommer la personne."
        },
        {
          "id": "B",
          "text": "Nommer la personne en précisant qu’elle a signalé l’oubli d’elle-même."
        },
        {
          "id": "C",
          "text": "Présenter l’incident comme une défaillance technique pour protéger la personne."
        },
        {
          "id": "D",
          "text": "Demander deux heures de plus pour en parler d’abord avec l’équipe."
        }
      ]
    },
    {
      "id": "I10",
      "module": "INT",
      "mechanism": null,
      "mechanisms": [
        "M4",
        "M6",
        "M9"
      ],
      "short": false,
      "text": [
        "Vous travaillez à votre compte. L’entreprise qui représente la moitié de votre chiffre d’affaires vous demande une baisse de tarif de 15 %, non négociable. Une autre entreprise vous propose une mission au tarif actuel, qui commencerait dans quatre mois.",
        "Votre objectif : préserver vos revenus sur l’année."
      ],
      "options": [
        {
          "id": "A",
          "text": "Accepter la baisse pour garder cette entreprise."
        },
        {
          "id": "B",
          "text": "Refuser la baisse en rappelant la qualité de votre travail."
        },
        {
          "id": "C",
          "text": "Accepter la baisse pour six mois, en attendant la nouvelle mission."
        },
        {
          "id": "D",
          "text": "Refuser la baisse et compter sur la mission à venir."
        }
      ]
    }
  ],
  "forms": {
    "court": [
      "A01",
      "A04",
      "A09",
      "A10",
      "A13",
      "A18",
      "A19",
      "A22",
      "A27",
      "A28",
      "A33",
      "A34",
      "V1",
      "C01",
      "C06",
      "C11",
      "C16",
      "C22",
      "C28",
      "C33",
      "C36",
      "C42",
      "C46",
      "C52",
      "C56",
      "I01",
      "I03",
      "I05"
    ],
    "complet": [
      "A01",
      "A02",
      "A03",
      "A04",
      "A05",
      "A06",
      "A07",
      "A08",
      "A09",
      "A10",
      "A11",
      "A12",
      "A13",
      "A14",
      "A15",
      "A16",
      "A17",
      "A18",
      "A19",
      "A20",
      "A21",
      "A22",
      "A23",
      "A24",
      "A25",
      "A26",
      "A27",
      "A28",
      "A29",
      "A30",
      "A31",
      "A32",
      "A33",
      "A34",
      "A35",
      "A36",
      "V1",
      "V2",
      "C01",
      "C02",
      "C03",
      "C04",
      "C05",
      "C06",
      "C07",
      "C08",
      "C09",
      "C10",
      "C11",
      "C12",
      "C13",
      "C14",
      "C15",
      "C16",
      "C17",
      "C18",
      "C19",
      "C20",
      "C21",
      "C22",
      "C23",
      "C24",
      "C25",
      "C26",
      "C27",
      "C28",
      "C29",
      "C30",
      "C31",
      "C32",
      "C33",
      "C34",
      "C35",
      "C36",
      "C37",
      "C38",
      "C39",
      "C40",
      "C41",
      "C42",
      "C43",
      "C44",
      "C45",
      "C46",
      "C47",
      "C48",
      "C49",
      "C50",
      "C51",
      "C52",
      "C53",
      "C54",
      "C55",
      "C56",
      "C57",
      "C58",
      "C59",
      "C60",
      "I01",
      "I02",
      "I03",
      "I04",
      "I05",
      "I06",
      "I07",
      "I08",
      "I09",
      "I10"
    ]
  },
  "estimatedMinutes": {
    "court": 14,
    "complet": 57
  },
  "source": "QUESTIONNAIRE_IAM_V2_2.md"
};
