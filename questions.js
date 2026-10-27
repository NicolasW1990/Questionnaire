// ===== Les questions du quiz =====
// Pour corriger un texte, modifie-le simplement ici.
// - texte       : la question affichée
// - reponses    : les 3 choix (id a, b ou c)
// - correcte    : true pour la bonne réponse (une seule par question)
// - consequence : le texte affiché après le choix (et l'explication à la fin)
// Images : images/q01.webp (question), images/q01-a.webp, q01-b.webp, q01-c.webp (conséquences)

const QUESTIONS = [
  {
    "id": "q01",
    "texte": "Karine a reçu un e-mail de la banque. La page de connexion est identique à l’originale, mais le gestionnaire ne propose pas de remplir ses identifiants. Que dites-vous à Karine ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Tape tes identifiants à la main, ça marche sûrement. »",
        "correcte": false,
        "consequence": "Karine saisit ses identifiants sur le faux site. Le lendemain, le compte de l’entreprise est vidé."
      },
      {
        "id": "b",
        "texte": "« Ne clique pas : c’est probablement un faux site. Va directement sur le site officiel de la banque. »",
        "correcte": true,
        "consequence": "Karine ferme la page et se connecte via le site officiel. La banque confirme que l’e-mail était une arnaque et la comptabilité reste intacte."
      },
      {
        "id": "c",
        "texte": "« Transfère l’e-mail à toute l’équipe pour savoir ce qu’ils en pensent. »",
        "correcte": false,
        "consequence": "Trois collègues cliquent sur le lien par curiosité. L’un d’eux saisit son mot de passe sur le faux site."
      }
    ]
  },
  {
    "id": "q02",
    "texte": "James a collé sur son écran un post-it avec le mot de passe de l’ordinateur d’accueil. Que dites-vous à James ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Garde-le, c’est pratique et personne ne regarde. »",
        "correcte": false,
        "consequence": "Un visiteur prend le post-it en photo. Le soir même, quelqu’un se connecte au poste d’accueil."
      },
      {
        "id": "b",
        "texte": "« Cache-le sous ton clavier, ce sera plus discret. »",
        "correcte": false,
        "consequence": "Une personne du nettoyage le retrouve et le laisse traîner. Le mot de passe circule dans le bâtiment."
      },
      {
        "id": "c",
        "texte": "« Enlève-le et enregistre ce mot de passe dans le gestionnaire. »",
        "correcte": true,
        "consequence": "Le poste d’accueil n’affiche plus rien d’exposé. James retrouve son mot de passe en un clic, et la direction félicite l’équipe pour l’ordre du bureau."
      }
    ]
  },
  {
    "id": "q03",
    "texte": "Karine dit : « Pas besoin de gestionnaire, j’enregistre mes mots de passe dans Chrome, c’est gratuit et déjà installé. » Que dites-vous à Karine ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Un gestionnaire dédié offre plus de fonctions et résiste mieux aux logiciels de vol de données. Utilise Proton Pass et désactive l’enregistrement de Chrome. »",
        "correcte": true,
        "consequence": "Karine migre ses comptes et profite de l’audit de sécurité. Un virus voleur de données passe sur son poste quelques semaines plus tard, sans rien trouver d’exploitable."
      },
      {
        "id": "b",
        "texte": "« Parfait, garde les deux : plus il y a d’endroits où ils sont enregistrés, mieux c’est. »",
        "correcte": false,
        "consequence": "Un logiciel voleur d’identifiants récupère les mots de passe restés dans Chrome. Karine perd l’accès à son compte de paiement."
      },
      {
        "id": "c",
        "texte": "« Chrome est plus sûr qu’un gestionnaire dédié, car il est fabriqué par Google. »",
        "correcte": false,
        "consequence": "Karine reste sur Chrome. Un infostealer vide tout son navigateur, et elle doit changer des dizaines de mots de passe dans l’urgence."
      }
    ]
  },
  {
    "id": "q04",
    "texte": "Arthur apprend qu’un site de commande a subi une fuite de données. Il utilise le même mot de passe sur sa messagerie professionnelle. Que dites-vous à Arthur ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Pas de panique, attends de voir si quelqu’un se connecte. »",
        "correcte": false,
        "consequence": "Un attaquant teste le mot de passe sur sa messagerie et s’y connecte dès la nuit suivante."
      },
      {
        "id": "b",
        "texte": "« Change seulement le mot de passe du site piraté. »",
        "correcte": false,
        "consequence": "Le site est sécurisé, mais la messagerie garde le même mot de passe. Elle est piratée à son tour."
      },
      {
        "id": "c",
        "texte": "« Change tout de suite le mot de passe partout où tu l’as utilisé, en commençant par la messagerie, avec des mots de passe uniques. »",
        "correcte": true,
        "consequence": "Les attaquants essaient le mot de passe volé sur plusieurs services et échouent partout. Arthur n’a rien perdu."
      }
    ]
  },
  {
    "id": "q05",
    "texte": "Marion veut choisir comme mot de passe principal : le prénom de sa fille + sa date de naissance + « ! ». Que dites-vous à Marion ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Choisis plutôt une phrase de passe de plusieurs mots sans lien entre eux. »",
        "correcte": true,
        "consequence": "Marion choisit une phrase de cinq mots au hasard. Elle s’en souvient facilement et personne ne la devine."
      },
      {
        "id": "b",
        "texte": "« C’est parfait, c’est facile à retenir. »",
        "correcte": false,
        "consequence": "Son profil en ligne affiche le prénom de sa fille et sa date de naissance. Un attaquant devine le mot de passe en quelques essais et ouvre tout le coffre."
      },
      {
        "id": "c",
        "texte": "« Ajoute juste un chiffre à la fin. »",
        "correcte": false,
        "consequence": "Le mot de passe reste prévisible. Un attaquant le trouve grâce aux variantes classiques."
      }
    ]
  },
  {
    "id": "q06",
    "texte": "Karine a perdu son téléphone, qui contient Proton Pass et son application TOTP. Que dites-vous à Karine ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Attends quelques jours, il sera sûrement retrouvé. »",
        "correcte": false,
        "consequence": "Le téléphone n’est jamais retrouvé. Pendant ce temps, quelqu’un essaie d’accéder à ses comptes."
      },
      {
        "id": "b",
        "texte": "« Verrouille tout de suite l’accès, change les mots de passe importants et utilise tes codes de secours. »",
        "correcte": true,
        "consequence": "Karine bloque la session et récupère ses accès avec ses codes de secours. Quand quelqu’un tente de se connecter, il est bloqué."
      },
      {
        "id": "c",
        "texte": "« Rachète le même téléphone, tout reviendra automatiquement. »",
        "correcte": false,
        "consequence": "Le nouveau téléphone ne contient pas ses codes TOTP. Elle est bloquée hors de plusieurs comptes pendant des jours."
      }
    ]
  },
  {
    "id": "q07",
    "texte": "James veut migrer ses comptes vers le gestionnaire. Il a son e-mail pro, son e-banking, un forum de voile et une carte de fidélité de librairie. Que dites-vous à James ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Commence par le forum de voile, c’est le plus simple. »",
        "correcte": false,
        "consequence": "Le forum est sécurisé, mais l’e-mail pro garde son vieux mot de passe. Il est piraté deux semaines plus tard."
      },
      {
        "id": "b",
        "texte": "« Commence par l’e-mail et l’e-banking, puis les autres. »",
        "correcte": true,
        "consequence": "James protège d’abord ce qui compte vraiment. Une tentative de réinitialisation sur son e-mail échoue grâce au mot de passe généré."
      },
      {
        "id": "c",
        "texte": "« Fais-les dans l’ordre alphabétique. »",
        "correcte": false,
        "consequence": "L’e-banking passe après une dizaine de comptes sans importance. Il reste exposé des semaines."
      }
    ]
  },
  {
    "id": "q08",
    "texte": "Henri pense que son compte sur un site de vente en ligne n’est pas important, mais sa carte bancaire y est enregistrée. Que dites-vous à Henri ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Pas de souci, c’est un petit site. »",
        "correcte": false,
        "consequence": "Le site est piraté. Des achats frauduleux apparaissent sur la carte d’Henri."
      },
      {
        "id": "b",
        "texte": "« Il est important, parce qu’une carte bancaire y est enregistrée : protège-le en priorité. »",
        "correcte": true,
        "consequence": "Henri active la 2FA et génère un mot de passe unique. Quand une tentative de connexion suspecte arrive, elle échoue."
      },
      {
        "id": "c",
        "texte": "« Supprime ton gestionnaire, il ne sert à rien ici. »",
        "correcte": false,
        "consequence": "Henri retourne à ses vieilles habitudes et réutilise un mot de passe faible. Le compte est piraté peu après."
      }
    ]
  },
  {
    "id": "q09",
    "texte": "Arthur a importé tous ses anciens mots de passe dans Proton Pass sans en changer aucun et pense avoir terminé. Que dites-vous à Arthur ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« C’est bon, tu es complètement protégé maintenant. »",
        "correcte": false,
        "consequence": "Ses vieux mots de passe faibles sont toujours là. L’audit de sécurité les signale en rouge, trop tard : l’un d’eux est déjà compromis."
      },
      {
        "id": "b",
        "texte": "« Garde aussi ton fichier Excel au cas où. »",
        "correcte": false,
        "consequence": "Le fichier Excel traîne sur son poste. Un collègue l’ouvre par hasard et voit tous ses mots de passe."
      },
      {
        "id": "c",
        "texte": "« Remplace-les peu à peu par des mots de passe générés, en commençant par les comptes importants. »",
        "correcte": true,
        "consequence": "Après quelques semaines, ses comptes importants sont protégés. L’audit affiche enfin tout en vert."
      }
    ]
  },
  {
    "id": "q10",
    "texte": "Marion laisse son coffre ouvert sur le poste partagé de la logistique en partant en réunion. Que dites-vous à Marion ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Verrouille ton coffre et ta session avant de quitter le poste. »",
        "correcte": true,
        "consequence": "Marion verrouille en un clic. Un collègue utilise le poste pendant son absence sans rien pouvoir voir."
      },
      {
        "id": "b",
        "texte": "« Laisse-le ouvert, tu reviens dans dix minutes. »",
        "correcte": false,
        "consequence": "Un collègue de passage ouvre ses comptes RH. Des données du personnel sont consultées sans qu’elle le sache."
      },
      {
        "id": "c",
        "texte": "« Ferme simplement l’écran, ça suffit. »",
        "correcte": false,
        "consequence": "Le coffre reste déverrouillé derrière l’écran noir. Quelqu’un rallume l’écran et accède à tout."
      }
    ]
  },
  {
    "id": "q11",
    "texte": "Henri s’est inscrit à un salon professionnel avec son adresse de travail et reçoit des dizaines de publicités. Que dites-vous à Henri ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Réponds à chaque e-mail pour te désinscrire. »",
        "correcte": false,
        "consequence": "Certains expéditeurs voient que l’adresse est active. Le nombre de spams augmente."
      },
      {
        "id": "b",
        "texte": "« La prochaine fois, utilise un alias e-mail Proton Pass, que tu pourras désactiver. »",
        "correcte": true,
        "consequence": "Henri s’inscrit avec un alias. Quand le spam arrive, il désactive l’alias en un clic et sa vraie adresse reste tranquille."
      },
      {
        "id": "c",
        "texte": "« Change de travail pour changer d’adresse. »",
        "correcte": false,
        "consequence": "Henri perd du temps et le problème se reproduit à la prochaine inscription."
      }
    ]
  },
  {
    "id": "q12",
    "texte": "James s’inquiète : Karine quitte l’entreprise et elle seule connaît certains accès de la comptabilité. Que dites-vous à James ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Elle nous les enverra par e-mail avant de partir. »",
        "correcte": false,
        "consequence": "Les mots de passe traînent dans les boîtes mail. Ils restent lisibles après son départ."
      },
      {
        "id": "b",
        "texte": "« Ce n’est pas grave, on les devinera. »",
        "correcte": false,
        "consequence": "Impossible de retrouver les accès. Le paiement des fournisseurs est bloqué pendant une semaine."
      },
      {
        "id": "c",
        "texte": "« Il faut prévoir un administrateur de secours et une procédure de récupération des accès. »",
        "correcte": true,
        "consequence": "Le jour du départ de Karine, l’administrateur reprend les accès en quelques minutes. L’activité continue sans interruption."
      }
    ]
  },
  {
    "id": "q13",
    "texte": "Arthur a laissé un export de son coffre en clair (CSV) dans le dossier Téléchargements. Que dites-vous à Arthur ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Supprime-le tout de suite, corbeille comprise, et fais plutôt un export chiffré. »",
        "correcte": true,
        "consequence": "Le fichier en clair disparaît. Quand un virus fouille le dossier Téléchargements, il ne trouve rien. Arthur garde un export chiffré en lieu sûr."
      },
      {
        "id": "b",
        "texte": "« Renomme-le pour que personne ne le trouve. »",
        "correcte": false,
        "consequence": "Le fichier est toujours lisible. Un logiciel malveillant le repère et l’envoie à un pirate."
      },
      {
        "id": "c",
        "texte": "« Garde-le, c’est ta sauvegarde. »",
        "correcte": false,
        "consequence": "Le poste d’Arthur est volé. Tous ses mots de passe sont lisibles en clair."
      }
    ]
  },
  {
    "id": "q14",
    "texte": "Marion a oublié son mot de passe principal Proton Pass et demande d’appeler le support pour le réinitialiser. Que dites-vous à Marion ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Le support peut le retrouver sans problème. »",
        "correcte": false,
        "consequence": "Marion perd une journée à attendre. Le support lui confirme qu’il ne peut rien faire, et elle n’a pas préparé de solution de secours."
      },
      {
        "id": "b",
        "texte": "« Le support ne peut pas : il ne le connaît pas. Utilise ta clé de récupération. »",
        "correcte": true,
        "consequence": "Marion retrouve son kit d’urgence rangé dans son classeur. En dix minutes, elle récupère l’accès à son coffre."
      },
      {
        "id": "c",
        "texte": "« Essaye simplement le mot de passe de ton e-mail. »",
        "correcte": false,
        "consequence": "Elle essaie plusieurs combinaisons et verrouille temporairement son compte. Pire, elle révèle son vrai mot de passe e-mail à l’écran devant témoin."
      }
    ]
  },
  {
    "id": "q15",
    "texte": "James hésite entre SMS, application TOTP et clé de sécurité physique pour la double authentification de son e-mail pro. Que dites-vous à James ?",
    "reponses": [
      {
        "id": "a",
        "texte": "« Le SMS, c’est le plus sûr de tous. »",
        "correcte": false,
        "consequence": "Un attaquant détourne son numéro (SIM swapping) et reçoit les codes. Il accède à son e-mail pro."
      },
      {
        "id": "b",
        "texte": "« Pas besoin de double authentification, ton mot de passe suffit. »",
        "correcte": false,
        "consequence": "Son mot de passe fuite lors d’un hameçonnage. Sans seconde preuve d’identité, l’attaquant entre directement."
      },
      {
        "id": "c",
        "texte": "« Privilégie une clé de sécurité ou une application TOTP : le SMS peut être détourné. »",
        "correcte": true,
        "consequence": "James active une application TOTP. Quand un pirate découvre son mot de passe, il reste bloqué sans le code."
      }
    ]
  }
];
