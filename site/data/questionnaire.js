// GENERE par tools/build-questionnaire.mjs depuis
// QUESTIONNAIRE_IAM_V2_1.md (voir specs/) -- ne pas editer a la main.
export const QUESTIONNAIRE = {
  "instrument": "IAM",
  "version": "1.0",
  "title": "Indice d’Activation et de Maîtrise des mécanismes",
  "subtitle": "version expérimentale pré-validation",
  "mechanisms": {
    "M1": "Lecture du système social",
    "M2": "Construction de confiance",
    "M3": "Construction de coalitions",
    "M4": "Influence",
    "M5": "Gestion stratégique de l’information",
    "M6": "Gestion de réputation et de menace",
    "M7": "Création de valeur collective",
    "M8": "Gestion des conflits et des normes",
    "M9": "Adaptabilité stratégique",
    "M10": "Décision sous incertitude",
    "M11": "Autorégulation sous pression",
    "M12": "Timing stratégique"
  },
  "modules": {
    "CAP": {
      "consigne": [
        "Pour chaque situation, choisissez :",
        "1. l’action qui vous paraît la **PLUS efficace** ;",
        "2. l’action qui vous paraît la **MOINS efficace**.",
        "Jugez uniquement à partir des informations données. Il ne s’agit pas d’indiquer ce que vous feriez personnellement, ni ce qui vous paraît le plus moral ou sympathique."
      ],
      "scale": []
    },
    "ACT": {
      "consigne": [
        "Pensez aux **six derniers mois**.",
        "Pour chaque comportement, indiquez à quelle fréquence vous l’avez réalisé **lorsque vous avez effectivement rencontré une situation comparable**."
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
          "label": "Pas assez de situations comparables"
        }
      ]
    },
    "INT": {
      "consigne": [
        "Choisissez l’action qui vous paraît la **PLUS efficace** et celle qui vous paraît la **MOINS efficace**."
      ],
      "scale": []
    }
  },
  "items": [
    {
      "id": "Q1",
      "module": "CAP",
      "mechanism": "M1",
      "text": [
        "Vous rejoignez une équipe de huit personnes. Le responsable officiel anime les réunions, mais vous constatez que certaines décisions semblent se former avant même les réunions.",
        "Vous disposez d’une semaine avant une décision importante."
      ],
      "options": [
        {
          "id": "A",
          "text": "Demander au responsable comment les décisions sont habituellement préparées."
        },
        {
          "id": "B",
          "text": "Observer qui consulte qui avant les réunions et quelles interventions modifient ensuite les positions."
        },
        {
          "id": "C",
          "text": "Rencontrer séparément les personnes qui participent le plus aux discussions collectives."
        },
        {
          "id": "D",
          "text": "Présenter rapidement une première proposition afin d’observer les réactions qu’elle provoque."
        }
      ]
    },
    {
      "id": "Q2",
      "module": "CAP",
      "mechanism": "M1",
      "text": [
        "Un groupe reste bloqué depuis trois réunions entre deux solutions. Les prises de parole publiques ne permettent pas d’identifier clairement pourquoi aucune majorité ne se forme.",
        "Vous pouvez mener quatre entretiens individuels."
      ],
      "options": [
        {
          "id": "A",
          "text": "Interroger les quatre personnes qui défendent le plus fortement leur position."
        },
        {
          "id": "B",
          "text": "Interroger deux partisans de chaque solution sur les raisons de leur préférence."
        },
        {
          "id": "C",
          "text": "Interroger des personnes situées entre les deux camps et susceptibles de faire basculer la décision."
        },
        {
          "id": "D",
          "text": "Interroger les personnes occupant les fonctions hiérarchiques les plus élevées."
        }
      ]
    },
    {
      "id": "Q3",
      "module": "CAP",
      "mechanism": "M1",
      "text": [
        "Une personne qui soutenait régulièrement vos propositions adopte soudainement une position opposée.",
        "Aucun changement factuel évident ne l’explique."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui demander directement, en privé, ce qui a fait évoluer sa position."
        },
        {
          "id": "B",
          "text": "Observer ses interactions récentes avant de lui demander une explication."
        },
        {
          "id": "C",
          "text": "Demander à plusieurs membres du groupe pourquoi ils pensent qu’elle a changé d’avis."
        },
        {
          "id": "D",
          "text": "Considérer son nouveau positionnement comme acquis et adapter immédiatement votre propre stratégie."
        }
      ]
    },
    {
      "id": "Q4",
      "module": "CAP",
      "mechanism": "M2",
      "text": [
        "Vous devez commencer à coopérer avec une personne que vous connaissez peu. Dans un mois, vous pourriez devoir lui confier une responsabilité importante."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui confier dès maintenant une responsabilité significative afin de tester sa fiabilité."
        },
        {
          "id": "B",
          "text": "Commencer par plusieurs engagements limités dont chacun peut vérifier facilement l’exécution."
        },
        {
          "id": "C",
          "text": "Expliquer clairement les règles que vous attendez d’elle avant de commencer à travailler ensemble."
        },
        {
          "id": "D",
          "text": "Chercher d’abord auprès de tiers des informations sur sa réputation passée."
        }
      ]
    },
    {
      "id": "Q5",
      "module": "CAP",
      "mechanism": "M2",
      "text": [
        "Une personne fiable depuis plusieurs mois ne respecte pas un engagement important pour la première fois.",
        "Vous ignorez la raison."
      ],
      "options": [
        {
          "id": "A",
          "text": "Réduire immédiatement les responsabilités que vous lui confiez."
        },
        {
          "id": "B",
          "text": "Lui demander ce qui s’est passé avant de modifier votre niveau de confiance."
        },
        {
          "id": "C",
          "text": "Maintenir votre confiance puisque son historique est jusqu’ici très positif."
        },
        {
          "id": "D",
          "text": "Vérifier auprès d’autres personnes si elles ont rencontré récemment le même problème."
        }
      ]
    },
    {
      "id": "Q6",
      "module": "CAP",
      "mechanism": "M2",
      "text": [
        "Vous devez travailler pendant six semaines avec un nouveau partenaire. Votre résultat dépend partiellement du sien, mais vous pouvez organiser librement la répartition du travail."
      ],
      "options": [
        {
          "id": "A",
          "text": "Répartir les responsabilités afin de limiter au maximum votre dépendance mutuelle."
        },
        {
          "id": "B",
          "text": "Prévoir des livrables intermédiaires permettant à chacun d’observer régulièrement la fiabilité de l’autre."
        },
        {
          "id": "C",
          "text": "Définir précisément dès le départ les obligations et conséquences en cas de non-respect."
        },
        {
          "id": "D",
          "text": "Commencer par réaliser vous-même la partie la plus importante puis lui transférer progressivement davantage de travail."
        }
      ]
    },
    {
      "id": "Q7",
      "module": "CAP",
      "mechanism": "M3",
      "text": [
        "Neuf personnes doivent choisir entre trois projets. Votre projet est actuellement préféré par trois personnes.",
        "Deux autres sont indécises ; les quatre restantes se répartissent entre les autres projets.",
        "Vous pouvez avoir deux conversations avant le vote."
      ],
      "options": [
        {
          "id": "A",
          "text": "Parler aux deux personnes indécises pour comprendre quelles conditions pourraient faire évoluer leur choix."
        },
        {
          "id": "B",
          "text": "Parler au partisan le plus influent de chacun des deux projets concurrents."
        },
        {
          "id": "C",
          "text": "Convaincre vos trois soutiens d’argumenter activement auprès de leur entourage."
        },
        {
          "id": "D",
          "text": "Améliorer votre proposition afin de la rendre plus attractive avant toute discussion politique."
        }
      ]
    },
    {
      "id": "Q8",
      "module": "CAP",
      "mechanism": "M3",
      "text": [
        "Deux groupes de taille presque égale s’opposent. Votre petite équipe de trois personnes n’appartient clairement à aucun des deux.",
        "Une décision doit être prise aujourd’hui."
      ],
      "options": [
        {
          "id": "A",
          "text": "Rejoindre le groupe dont la position est la plus proche de la vôtre."
        },
        {
          "id": "B",
          "text": "Identifier une condition sur laquelle l’un des groupes serait prêt à évoluer en échange de votre soutien."
        },
        {
          "id": "C",
          "text": "Proposer publiquement une solution intermédiaire entre les deux positions."
        },
        {
          "id": "D",
          "text": "Refuser de vous positionner jusqu’à ce qu’un groupe possède clairement l’avantage."
        }
      ]
    },
    {
      "id": "Q9",
      "module": "CAP",
      "mechanism": "M3",
      "text": [
        "L’un de vos principaux alliés perd rapidement du soutien dans le groupe. Votre accord avec lui reste avantageux, mais pourrait vous isoler si sa position continue de se dégrader."
      ],
      "options": [
        {
          "id": "A",
          "text": "Maintenir publiquement votre alliance pour montrer que votre parole est fiable."
        },
        {
          "id": "B",
          "text": "Rompre rapidement l’alliance avant que sa perte d’influence ne vous affecte."
        },
        {
          "id": "C",
          "text": "Préserver votre accord tout en développant indépendamment d’autres relations de coopération."
        },
        {
          "id": "D",
          "text": "Lui demander de modifier publiquement certaines de ses positions avant de maintenir votre soutien."
        }
      ]
    },
    {
      "id": "Q10",
      "module": "CAP",
      "mechanism": "M4",
      "text": [
        "Une personne indispensable à votre projet s’y oppose. Elle ne conteste pas vos données, mais estime que votre proposition menace une priorité qu’elle considère essentielle."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui fournir davantage de données démontrant les avantages de votre proposition."
        },
        {
          "id": "B",
          "text": "Modifier la présentation de la proposition pour montrer comment sa priorité peut être protégée."
        },
        {
          "id": "C",
          "text": "Chercher l’appui d’une personne dont elle respecte particulièrement le jugement."
        },
        {
          "id": "D",
          "text": "Réduire l’ambition de votre proposition afin de faciliter un compromis."
        }
      ]
    },
    {
      "id": "Q11",
      "module": "CAP",
      "mechanism": "M4",
      "text": [
        "Deux camps débattent depuis une heure. Chacun répète essentiellement les mêmes arguments et les positions se durcissent.",
        "Vous avez la parole pour deux minutes."
      ],
      "options": [
        {
          "id": "A",
          "text": "Résumer les arguments les plus solides de chaque camp."
        },
        {
          "id": "B",
          "text": "Mettre en évidence un objectif concret que les deux camps déclarent vouloir atteindre."
        },
        {
          "id": "C",
          "text": "Présenter la solution qui vous paraît objectivement la plus efficace."
        },
        {
          "id": "D",
          "text": "Proposer de voter immédiatement entre les deux positions existantes."
        }
      ]
    },
    {
      "id": "Q12",
      "module": "CAP",
      "mechanism": "M4",
      "text": [
        "Une proposition que vous défendiez a été rejetée récemment. Vous apprenez ensuite que le principal obstacle n’était pas son contenu mais la crainte de perdre du contrôle sur sa mise en œuvre.",
        "Vous souhaitez la représenter."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter exactement la même proposition avec des arguments supplémentaires."
        },
        {
          "id": "B",
          "text": "Modifier les modalités de gouvernance avant de remettre la proposition au débat."
        },
        {
          "id": "C",
          "text": "Faire présenter la proposition par une personne moins directement associée au projet."
        },
        {
          "id": "D",
          "text": "Attendre plusieurs semaines afin que le premier rejet perde de son importance."
        }
      ]
    },
    {
      "id": "Q13",
      "module": "CAP",
      "mechanism": "M5",
      "text": [
        "Vous disposez d’une information exacte qui pourrait modifier une décision collective prévue demain.",
        "La partager maintenant permettrait à tous de s’adapter, mais donnerait aussi un avantage à certaines personnes dont les intérêts s’opposent aux vôtres."
      ],
      "options": [
        {
          "id": "A",
          "text": "Diffuser immédiatement l’information à l’ensemble du groupe."
        },
        {
          "id": "B",
          "text": "La conserver jusqu’au moment où la décision sera effectivement prise."
        },
        {
          "id": "C",
          "text": "La transmettre uniquement aux personnes qui doivent agir avant demain."
        },
        {
          "id": "D",
          "text": "Évaluer d’abord les conséquences pratiques de chaque destinataire ayant accès à l’information."
        }
      ]
    },
    {
      "id": "Q14",
      "module": "CAP",
      "mechanism": "M5",
      "text": [
        "Une source généralement fiable vous transmet une information importante mais qu’elle n’a elle-même pas vérifiée.",
        "La décision correspondante doit être prise dans six heures."
      ],
      "options": [
        {
          "id": "A",
          "text": "Chercher une confirmation indépendante avant de vous appuyer sur cette information."
        },
        {
          "id": "B",
          "text": "Prévenir immédiatement les personnes concernées en précisant explicitement que l’information est incertaine."
        },
        {
          "id": "C",
          "text": "Agir comme si l’information était probablement correcte puisque la source est habituellement fiable."
        },
        {
          "id": "D",
          "text": "Ne rien modifier tant qu’une confirmation formelle n’est pas disponible."
        }
      ]
    },
    {
      "id": "Q15",
      "module": "CAP",
      "mechanism": "M5",
      "text": [
        "Pour justifier une décision, votre groupe vous demande une information. Vous disposez du fait nécessaire, mais aussi de détails personnels sur une personne qui n’apportent rien directement à la décision."
      ],
      "options": [
        {
          "id": "A",
          "text": "Communiquer uniquement l’information directement pertinente à la décision."
        },
        {
          "id": "B",
          "text": "Communiquer l’ensemble des informations afin que chacun puisse juger lui-même de leur pertinence."
        },
        {
          "id": "C",
          "text": "Refuser de communiquer l’information puisque sa source contient des éléments personnels."
        },
        {
          "id": "D",
          "text": "Demander d’abord à la personne concernée l’autorisation de communiquer quoi que ce soit."
        }
      ]
    },
    {
      "id": "Q16",
      "module": "CAP",
      "mechanism": "M6",
      "text": [
        "Dans un environnement compétitif, vos résultats sont nettement meilleurs que ceux de vos collègues depuis plusieurs semaines.",
        "Votre réussite est désormais très visible."
      ],
      "options": [
        {
          "id": "A",
          "text": "Continuer exactement comme auparavant puisque diminuer votre performance serait irrationnel."
        },
        {
          "id": "B",
          "text": "Rendre davantage visibles les contributions des personnes qui ont participé à vos résultats."
        },
        {
          "id": "C",
          "text": "Réduire temporairement votre visibilité jusqu’à ce que la compétition diminue."
        },
        {
          "id": "D",
          "text": "Chercher une nouvelle responsabilité dans laquelle votre performance bénéficiera directement au reste du groupe."
        }
      ]
    },
    {
      "id": "Q17",
      "module": "CAP",
      "mechanism": "M6",
      "text": [
        "Une réussite importante repose en majorité sur votre travail, mais trois collègues y ont également contribué.",
        "Vous devez présenter les résultats devant un décideur."
      ],
      "options": [
        {
          "id": "A",
          "text": "Présenter précisément les contributions de chacun, y compris la vôtre."
        },
        {
          "id": "B",
          "text": "Insister principalement sur votre propre rôle afin d’éviter qu’il soit sous-estimé."
        },
        {
          "id": "C",
          "text": "Présenter le résultat comme entièrement collectif sans détailler les contributions."
        },
        {
          "id": "D",
          "text": "Laisser vos collègues expliquer eux-mêmes leurs contributions avant de présenter la vôtre."
        }
      ]
    },
    {
      "id": "Q18",
      "module": "CAP",
      "mechanism": "M6",
      "text": [
        "Plusieurs personnes commencent à vous trouver dominant alors que vous estimez simplement prendre les initiatives nécessaires.",
        "Vous souhaitez conserver votre capacité d’action."
      ],
      "options": [
        {
          "id": "A",
          "text": "Expliquer clairement au groupe pourquoi vos interventions sont nécessaires."
        },
        {
          "id": "B",
          "text": "Solliciter davantage publiquement l’avis des autres avant de proposer votre propre solution."
        },
        {
          "id": "C",
          "text": "Réduire le nombre de sujets sur lesquels vous intervenez, y compris lorsque vous avez une expertise utile."
        },
        {
          "id": "D",
          "text": "Demander individuellement à quelques personnes ce qui leur donne cette impression."
        }
      ]
    },
    {
      "id": "Q19",
      "module": "CAP",
      "mechanism": "M7",
      "text": [
        "Quatre tâches restent à répartir. La plus prestigieuse correspond parfaitement à vos compétences, mais deux autres sont nettement moins bien couvertes.",
        "Votre objectif est la performance du groupe."
      ],
      "options": [
        {
          "id": "A",
          "text": "Prendre la tâche prestigieuse puisque vous y produirez probablement un excellent résultat."
        },
        {
          "id": "B",
          "text": "Prendre la tâche pour laquelle l’absence de compétence disponible risque le plus de pénaliser l’ensemble."
        },
        {
          "id": "C",
          "text": "Prendre la tâche que personne ne souhaite effectuer afin d’éviter un conflit de répartition."
        },
        {
          "id": "D",
          "text": "Laisser le responsable choisir votre affectation puisqu’il possède une vision globale."
        }
      ]
    },
    {
      "id": "Q20",
      "module": "CAP",
      "mechanism": "M7",
      "text": [
        "Votre groupe dispose d’une heure supplémentaire à affecter à une seule activité.",
        "Une activité est déjà performante ; une deuxième est moyenne ; une troisième bloque actuellement plusieurs autres tâches."
      ],
      "options": [
        {
          "id": "A",
          "text": "Consacrer l’heure à l’activité la plus performante pour maximiser son avantage."
        },
        {
          "id": "B",
          "text": "Consacrer l’heure à l’activité moyenne qui offre encore une marge d’amélioration importante."
        },
        {
          "id": "C",
          "text": "Consacrer l’heure à l’activité qui bloque actuellement le reste du travail."
        },
        {
          "id": "D",
          "text": "Répartir les soixante minutes entre les trois activités pour ne pas en négliger une."
        }
      ]
    },
    {
      "id": "Q21",
      "module": "CAP",
      "mechanism": "M7",
      "text": [
        "Votre équipe produit de bons résultats individuels mais perd beaucoup de temps lorsque le travail passe d’une personne à l’autre.",
        "Vous pouvez consacrer trois heures à une seule amélioration."
      ],
      "options": [
        {
          "id": "A",
          "text": "Améliorer encore votre propre méthode de travail afin de produire plus rapidement."
        },
        {
          "id": "B",
          "text": "Documenter clairement la manière dont les tâches doivent être transmises entre les personnes."
        },
        {
          "id": "C",
          "text": "Aider le membre de l’équipe dont la performance individuelle est actuellement la plus faible."
        },
        {
          "id": "D",
          "text": "Réaliser directement une partie du travail accumulé afin de réduire le retard immédiat."
        }
      ]
    },
    {
      "id": "Q22",
      "module": "CAP",
      "mechanism": "M8",
      "text": [
        "Une personne contribue nettement moins que les autres depuis deux semaines tout en bénéficiant du même résultat collectif.",
        "Vous ignorez pourquoi."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui demander directement ce qui explique la différence de contribution."
        },
        {
          "id": "B",
          "text": "Proposer immédiatement au groupe une règle liant contribution et bénéfice."
        },
        {
          "id": "C",
          "text": "Réduire votre propre contribution jusqu’à ce que la répartition redevienne équitable."
        },
        {
          "id": "D",
          "text": "Demander aux autres membres s’ils considèrent eux aussi la situation comme problématique."
        }
      ]
    },
    {
      "id": "Q23",
      "module": "CAP",
      "mechanism": "M8",
      "text": [
        "Une règle informelle avantage systématiquement les membres les plus anciens de votre groupe.",
        "Elle est acceptée depuis longtemps mais crée désormais plusieurs difficultés pratiques."
      ],
      "options": [
        {
          "id": "A",
          "text": "Demander une exception à cette règle pour les situations où elle vous pénalise."
        },
        {
          "id": "B",
          "text": "Proposer une nouvelle règle fondée sur un critère applicable de la même manière à tous."
        },
        {
          "id": "C",
          "text": "Respecter la règle tant que la majorité des membres historiques souhaitent la conserver."
        },
        {
          "id": "D",
          "text": "Chercher d’abord le soutien de plusieurs anciens avant de soulever officiellement le problème."
        }
      ]
    },
    {
      "id": "Q24",
      "module": "CAP",
      "mechanism": "M8",
      "text": [
        "Une personne rompt volontairement un accord important avec vous.",
        "Vous devrez probablement coopérer à nouveau avec elle dans les mois suivants."
      ],
      "options": [
        {
          "id": "A",
          "text": "Mettre fin à toute coopération future pour éviter une seconde défection."
        },
        {
          "id": "B",
          "text": "Continuer à coopérer normalement afin de préserver une relation utile."
        },
        {
          "id": "C",
          "text": "Réduire temporairement votre dépendance et conditionner son rétablissement au respect de nouveaux engagements."
        },
        {
          "id": "D",
          "text": "Exiger une compensation immédiate équivalente au préjudice subi avant toute discussion future."
        }
      ]
    },
    {
      "id": "Q25",
      "module": "CAP",
      "mechanism": "M9",
      "text": [
        "Une méthode vous donne de bons résultats depuis plusieurs mois. Le contexte change : un facteur qui expliquait une partie de son efficacité disparaît, mais les premiers résultats après ce changement restent corrects."
      ],
      "options": [
        {
          "id": "A",
          "text": "Conserver la méthode tant qu’une baisse nette de résultat n’est pas observée."
        },
        {
          "id": "B",
          "text": "Remplacer immédiatement la méthode puisque l’une de ses justifications a disparu."
        },
        {
          "id": "C",
          "text": "Modifier uniquement les éléments de la méthode qui dépendaient du facteur ayant changé."
        },
        {
          "id": "D",
          "text": "Continuer provisoirement tout en suivant séparément les indicateurs liés au facteur disparu."
        }
      ]
    },
    {
      "id": "Q26",
      "module": "CAP",
      "mechanism": "M9",
      "text": [
        "Une stratégie auparavant très efficace est maintenant connue de vos concurrents. Elle continue pourtant à produire de bons résultats."
      ],
      "options": [
        {
          "id": "A",
          "text": "Continuer à l’utiliser jusqu’à ce que son efficacité commence réellement à diminuer."
        },
        {
          "id": "B",
          "text": "Introduire progressivement des variantes afin d’observer comment les autres s’y adaptent."
        },
        {
          "id": "C",
          "text": "Abandonner immédiatement cette stratégie pour éviter de devenir prévisible."
        },
        {
          "id": "D",
          "text": "Conserver la stratégie mais limiter autant que possible les informations sur son fonctionnement."
        }
      ]
    },
    {
      "id": "Q27",
      "module": "CAP",
      "mechanism": "M9",
      "text": [
        "Vous arrivez dans un environnement nouveau où trois approches sont utilisées avec succès par des personnes différentes.",
        "Vous ne savez pas laquelle correspondra le mieux à votre situation."
      ],
      "options": [
        {
          "id": "A",
          "text": "Reproduire l’approche utilisée par la personne qui obtient actuellement les meilleurs résultats."
        },
        {
          "id": "B",
          "text": "Choisir l’approche qui correspond le mieux à votre expérience antérieure."
        },
        {
          "id": "C",
          "text": "Tester successivement les approches sur des enjeux limités avant de vous engager davantage."
        },
        {
          "id": "D",
          "text": "Observer plus longtemps les performances des trois approches avant d’en utiliser une."
        }
      ]
    },
    {
      "id": "Q28",
      "module": "CAP",
      "mechanism": "M10",
      "text": [
        "Vous devez prendre une décision aujourd’hui avec des informations incomplètes.",
        "Attendre deux jours apportera probablement davantage d’information, mais réduira la valeur de l’opportunité."
      ],
      "options": [
        {
          "id": "A",
          "text": "Décider aujourd’hui puisque l’attente a un coût certain."
        },
        {
          "id": "B",
          "text": "Attendre deux jours puisque davantage d’information réduit le risque d’erreur."
        },
        {
          "id": "C",
          "text": "Comparer la valeur probable de l’information supplémentaire au coût probable du délai."
        },
        {
          "id": "D",
          "text": "Choisir aujourd’hui l’option qui sera la plus facile à modifier ultérieurement."
        }
      ]
    },
    {
      "id": "Q29",
      "module": "CAP",
      "mechanism": "M10",
      "text": [
        "Vous devez choisir entre deux projets.",
        "Le premier offre un gain modéré avec une probabilité élevée. Le second offre un gain beaucoup plus important mais avec une forte incertitude. Un échec du second resterait supportable."
      ],
      "options": [
        {
          "id": "A",
          "text": "Choisir le premier afin de maximiser la probabilité d’obtenir un résultat positif."
        },
        {
          "id": "B",
          "text": "Choisir le second puisque son échec ne menace pas la continuité de votre activité."
        },
        {
          "id": "C",
          "text": "Comparer les distributions plausibles de résultats avant de décider entre les deux."
        },
        {
          "id": "D",
          "text": "Répartir les ressources entre les deux afin de diminuer l’effet d’une erreur de choix."
        }
      ]
    },
    {
      "id": "Q30",
      "module": "CAP",
      "mechanism": "M10",
      "text": [
        "Trois sources vous donnent des prévisions incompatibles.",
        "L’une est experte du sujet mais dispose de peu de données ; une autre possède beaucoup de données mais peu d’expertise ; la troisième est habituellement fiable mais ne justifie pas sa conclusion."
      ],
      "options": [
        {
          "id": "A",
          "text": "Suivre la source qui s’est révélée la plus fiable dans le passé."
        },
        {
          "id": "B",
          "text": "Donner davantage de poids aux sources dont la méthode et les données peuvent être examinées."
        },
        {
          "id": "C",
          "text": "Retenir la conclusion soutenue par le plus grand nombre de sources."
        },
        {
          "id": "D",
          "text": "Choisir une décision qui reste acceptable sous plusieurs des scénarios jugés plausibles."
        }
      ]
    },
    {
      "id": "Q31",
      "module": "CAP",
      "mechanism": "M11",
      "text": [
        "Vous êtes très fatigué au moment où l’on vous demande une décision relationnelle importante.",
        "La décision peut être reportée jusqu’au lendemain avec un coût faible."
      ],
      "options": [
        {
          "id": "A",
          "text": "Décider immédiatement afin d’éviter que le problème continue à occuper votre attention."
        },
        {
          "id": "B",
          "text": "Reporter la décision jusqu’au lendemain puisque son coût d’attente est limité."
        },
        {
          "id": "C",
          "text": "Prendre seulement les mesures réversibles nécessaires aujourd’hui et décider du reste demain."
        },
        {
          "id": "D",
          "text": "Demander à une personne de confiance de prendre la décision à votre place."
        }
      ]
    },
    {
      "id": "Q32",
      "module": "CAP",
      "mechanism": "M11",
      "text": [
        "Une personne vous critique publiquement de manière que vous jugez injuste.",
        "Une discussion collective importante commence dix minutes plus tard."
      ],
      "options": [
        {
          "id": "A",
          "text": "Répondre immédiatement afin que l’accusation ne reste pas sans contradiction."
        },
        {
          "id": "B",
          "text": "Demander brièvement un exemple factuel puis reporter le débat complet après la réunion."
        },
        {
          "id": "C",
          "text": "Ignorer totalement la critique pour ne pas lui donner davantage d’importance."
        },
        {
          "id": "D",
          "text": "Quitter momentanément la discussion afin d’éviter une réponse émotionnelle."
        }
      ]
    },
    {
      "id": "Q33",
      "module": "CAP",
      "mechanism": "M11",
      "text": [
        "Vous savez qu’une période de fatigue importante va durer plusieurs jours et que vous devrez continuer à prendre des décisions importantes."
      ],
      "options": [
        {
          "id": "A",
          "text": "Maintenir votre organisation habituelle pour ne pas laisser la fatigue modifier votre fonctionnement."
        },
        {
          "id": "B",
          "text": "Reporter les décisions non essentielles afin de réserver votre attention aux plus importantes."
        },
        {
          "id": "C",
          "text": "Prendre davantage de décisions à l’avance avant que la fatigue n’augmente."
        },
        {
          "id": "D",
          "text": "Réduire les choix répétitifs en définissant à l’avance quelques règles simples de fonctionnement."
        }
      ]
    },
    {
      "id": "Q34",
      "module": "CAP",
      "mechanism": "M12",
      "text": [
        "Deux acteurs deviennent progressivement plus influents et pourraient bientôt réduire fortement votre marge de manœuvre.",
        "Pour l’instant, aucun des deux ne vous considère comme une menace."
      ],
      "options": [
        {
          "id": "A",
          "text": "Vous opposer rapidement à leur progression avant qu’ils ne soient trop puissants."
        },
        {
          "id": "B",
          "text": "Renforcer discrètement votre position pendant qu’ils ne cherchent pas à vous contrer."
        },
        {
          "id": "C",
          "text": "Attendre qu’une menace concrète apparaisse avant de consacrer des ressources au problème."
        },
        {
          "id": "D",
          "text": "Chercher immédiatement une alliance avec l’un des deux pour équilibrer l’autre."
        }
      ]
    },
    {
      "id": "Q35",
      "module": "CAP",
      "mechanism": "M12",
      "text": [
        "Une opportunité devient probablement plus avantageuse si vous attendez quelques jours, mais elle peut également disparaître sans préavis."
      ],
      "options": [
        {
          "id": "A",
          "text": "La saisir immédiatement pour éliminer le risque de la perdre."
        },
        {
          "id": "B",
          "text": "Attendre tant que sa valeur continue à augmenter."
        },
        {
          "id": "C",
          "text": "Définir un niveau minimal de gain ou de risque qui déclenchera votre action."
        },
        {
          "id": "D",
          "text": "Chercher une manière de préserver temporairement l’opportunité sans prendre immédiatement la décision finale."
        }
      ]
    },
    {
      "id": "Q36",
      "module": "CAP",
      "mechanism": "M12",
      "text": [
        "Deux groupes sont en conflit. Votre soutien pourrait devenir décisif, mais prendre parti trop tôt vous exposerait si le rapport de force change."
      ],
      "options": [
        {
          "id": "A",
          "text": "Soutenir immédiatement le groupe dont la position est la plus proche de la vôtre."
        },
        {
          "id": "B",
          "text": "Rester neutre jusqu’à ce que l’issue soit pratiquement certaine."
        },
        {
          "id": "C",
          "text": "Déterminer à partir de quel changement du rapport de force votre intervention devient réellement décisive."
        },
        {
          "id": "D",
          "text": "Proposer immédiatement votre médiation afin d’éviter d’avoir à choisir un camp."
        }
      ]
    },
    {
      "id": "Q37",
      "module": "ACT",
      "mechanism": "M1",
      "text": [
        "J’ai cherché à comprendre qui influençait réellement les décisions au-delà des rôles ou titres officiels."
      ],
      "options": []
    },
    {
      "id": "Q38",
      "module": "ACT",
      "mechanism": "M2",
      "text": [
        "J’ai construit progressivement une relation de confiance par des engagements limités et vérifiables."
      ],
      "options": []
    },
    {
      "id": "Q39",
      "module": "ACT",
      "mechanism": "M3",
      "text": [
        "J’ai rapproché des personnes aux intérêts différents afin de rendre possible une décision ou une action commune."
      ],
      "options": []
    },
    {
      "id": "Q40",
      "module": "ACT",
      "mechanism": "M4",
      "text": [
        "J’ai fait évoluer une position en agissant sur les intérêts ou préoccupations de la personne plutôt qu’en répétant mes arguments."
      ],
      "options": []
    },
    {
      "id": "Q41",
      "module": "ACT",
      "mechanism": "M5",
      "text": [
        "J’ai choisi volontairement quoi communiquer, à qui et à quel moment en tenant compte des effets de la diffusion."
      ],
      "options": []
    },
    {
      "id": "Q42",
      "module": "ACT",
      "mechanism": "M6",
      "text": [
        "J’ai adapté ma visibilité ou ma manière d’agir parce que la perception de ma position pouvait modifier le comportement des autres."
      ],
      "options": []
    },
    {
      "id": "Q43",
      "module": "ACT",
      "mechanism": "M7",
      "text": [
        "J’ai choisi une tâche principalement parce qu’elle augmentait fortement la performance collective, même lorsqu’elle était peu visible."
      ],
      "options": []
    },
    {
      "id": "Q44",
      "module": "ACT",
      "mechanism": "M8",
      "text": [
        "J’ai traité un comportement non coopératif en cherchant à restaurer une règle ou une coopération viable plutôt qu’à simplement punir ou ignorer."
      ],
      "options": []
    },
    {
      "id": "Q45",
      "module": "ACT",
      "mechanism": "M9",
      "text": [
        "J’ai modifié une stratégie encore défendable parce que des éléments nouveaux indiquaient qu’elle risquait de devenir moins efficace."
      ],
      "options": []
    },
    {
      "id": "Q46",
      "module": "ACT",
      "mechanism": "M10",
      "text": [
        "J’ai pris une décision importante malgré une information incomplète après avoir explicitement considéré les conséquences d’une erreur."
      ],
      "options": []
    },
    {
      "id": "Q47",
      "module": "ACT",
      "mechanism": "M11",
      "text": [
        "Lorsque j’étais fatigué, stressé ou irrité, j’ai modifié ma manière de décider pour limiter l’influence de cet état."
      ],
      "options": []
    },
    {
      "id": "Q48",
      "module": "ACT",
      "mechanism": "M12",
      "text": [
        "J’ai volontairement avancé ou retardé une action parce que son efficacité dépendait fortement du moment choisi."
      ],
      "options": []
    },
    {
      "id": "Q49",
      "module": "INT",
      "mechanism": null,
      "text": [
        "Une personne généralement fiable vous avertit qu’une coalition pourrait être en train de se former contre votre position.",
        "Une décision aura lieu demain.",
        "Vous disposez de trente minutes avant de ne plus pouvoir parler individuellement aux membres du groupe et ne pouvez entreprendre qu’une seule démarche."
      ],
      "options": [
        {
          "id": "A",
          "text": "Chercher une seconde source susceptible de confirmer ou d’infirmer l’information."
        },
        {
          "id": "B",
          "text": "Contacter deux personnes dont le soutien empêcherait une majorité adverse de se former."
        },
        {
          "id": "C",
          "text": "Parler directement à la personne supposée organiser la coalition."
        },
        {
          "id": "D",
          "text": "Ne contacter personne et observer les interactions jusqu’à la décision."
        }
      ]
    },
    {
      "id": "Q50",
      "module": "INT",
      "mechanism": null,
      "text": [
        "Une réussite importante repose majoritairement sur votre travail.",
        "Dans trois semaines, le groupe devra choisir une personne pour une fonction très recherchée. Votre compétence constitue un avantage pour cette fonction mais augmente aussi la perception que vous représentez un concurrent sérieux.",
        "Vous devez présenter les résultats aujourd’hui."
      ],
      "options": [
        {
          "id": "A",
          "text": "Mettre précisément en évidence votre contribution personnelle au résultat."
        },
        {
          "id": "B",
          "text": "Présenter principalement les résultats comme une réussite collective."
        },
        {
          "id": "C",
          "text": "Mettre en évidence votre contribution tout en attribuant explicitement aux autres leurs contributions propres."
        },
        {
          "id": "D",
          "text": "Présenter surtout ce que le groupe pourrait désormais reproduire grâce aux méthodes développées."
        }
      ]
    },
    {
      "id": "Q51",
      "module": "INT",
      "mechanism": null,
      "text": [
        "Un allié influent contribue nettement moins que prévu au travail collectif.",
        "Plusieurs personnes vous demandent de réagir. Vous ne connaissez pas la raison de sa baisse de contribution.",
        "Vous pouvez entreprendre une seule démarche aujourd’hui."
      ],
      "options": [
        {
          "id": "A",
          "text": "Lui demander directement ce qui explique la situation."
        },
        {
          "id": "B",
          "text": "Proposer au groupe une règle générale précisant les contributions attendues de chacun."
        },
        {
          "id": "C",
          "text": "Défendre temporairement votre allié pour préserver votre relation avec lui."
        },
        {
          "id": "D",
          "text": "Demander aux membres mécontents de présenter eux-mêmes publiquement le problème."
        }
      ]
    },
    {
      "id": "Q52",
      "module": "INT",
      "mechanism": null,
      "text": [
        "Votre méthode actuelle reste rentable mais son avantage diminue depuis trois périodes consécutives.",
        "Une nouvelle méthode semble prometteuse mais vous disposez encore de très peu de données.",
        "Votre budget permet cette semaine une seule action."
      ],
      "options": [
        {
          "id": "A",
          "text": "Continuer intégralement avec la méthode actuelle."
        },
        {
          "id": "B",
          "text": "Transférer intégralement les ressources vers la nouvelle méthode."
        },
        {
          "id": "C",
          "text": "Consacrer une partie limitée des ressources à tester la nouvelle méthode."
        },
        {
          "id": "D",
          "text": "Conserver les ressources disponibles jusqu’à disposer de davantage d’informations externes."
        }
      ]
    },
    {
      "id": "Q53",
      "module": "INT",
      "mechanism": null,
      "text": [
        "Vous avez très peu dormi depuis plusieurs jours.",
        "Vingt minutes avant une décision collective importante, quelqu’un vous accuse publiquement d’avoir manipulé le groupe.",
        "Vous estimez l’accusation fausse."
      ],
      "options": [
        {
          "id": "A",
          "text": "Répondre immédiatement en réfutant point par point l’accusation."
        },
        {
          "id": "B",
          "text": "Contester brièvement l’accusation et proposer d’en discuter complètement après la décision."
        },
        {
          "id": "C",
          "text": "Ne pas répondre et vous concentrer exclusivement sur la décision à venir."
        },
        {
          "id": "D",
          "text": "Chercher immédiatement les personnes dont l’opinion semble avoir changé après l’accusation."
        }
      ]
    },
    {
      "id": "Q54",
      "module": "INT",
      "mechanism": null,
      "text": [
        "Un allié vous communique une information personnelle sous couvert de confidentialité.",
        "Une partie de cette information révèle un risque important pour une décision collective imminente.",
        "Vous ne pouvez pas à la fois préserver complètement la confidentialité et fournir au groupe toutes les informations pertinentes."
      ],
      "options": [
        {
          "id": "A",
          "text": "Respecter entièrement la confidentialité et ne rien transmettre."
        },
        {
          "id": "B",
          "text": "Communiquer au groupe toute l’information reçue afin qu’il puisse décider en connaissance de cause."
        },
        {
          "id": "C",
          "text": "Demander à votre allié de révéler lui-même l’élément strictement nécessaire à la décision."
        },
        {
          "id": "D",
          "text": "Utiliser l’information uniquement pour modifier votre propre choix sans expliquer pourquoi."
        }
      ]
    },
    {
      "id": "Q55",
      "module": "INT",
      "mechanism": null,
      "text": [
        "Deux groupes presque égaux cherchent tous les deux votre soutien.",
        "Vous êtes l’une des rares personnes ayant encore de bonnes relations avec chacun d’eux.",
        "Une décision doit intervenir demain."
      ],
      "options": [
        {
          "id": "A",
          "text": "Rejoindre immédiatement le camp dont la position est la plus proche de la vôtre."
        },
        {
          "id": "B",
          "text": "Proposer aux deux groupes une condition commune qui permettrait d’obtenir votre soutien."
        },
        {
          "id": "C",
          "text": "Conserver votre neutralité jusqu’au moment du vote."
        },
        {
          "id": "D",
          "text": "Négocier séparément avec chacun ce qu’il accepterait de modifier en échange de votre soutien."
        }
      ]
    },
    {
      "id": "Q56",
      "module": "INT",
      "mechanism": null,
      "text": [
        "Une stratégie vous procure encore de bons résultats.",
        "Vous constatez cependant que les autres commencent à reconnaître votre manière de fonctionner et à mieux l’anticiper.",
        "Vous pouvez modifier votre stratégie maintenant sans coût majeur."
      ],
      "options": [
        {
          "id": "A",
          "text": "Continuer tant que les résultats restent supérieurs à ceux des alternatives."
        },
        {
          "id": "B",
          "text": "Changer complètement de stratégie avant que l’ancienne ne perde son efficacité."
        },
        {
          "id": "C",
          "text": "Introduire une variation limitée afin d’observer comment les autres y réagissent."
        },
        {
          "id": "D",
          "text": "Conserver la stratégie actuelle tout en préparant une solution de remplacement."
        }
      ]
    }
  ],
  "source": "QUESTIONNAIRE_IAM_V2_1.md"
};
