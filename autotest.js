// =====================================================
//  autotest.js : logique de la page autotest.html
//  - allerEtape(numero) affiche une étape et cache les autres
//  - chaque bouton de service affiche un message humoristique
//  - afficherVue(nom) change la page web dans le faux navigateur
//  - le bouton « Paramètres » ouvre l'étape 2 (page Compte)
//  - « Récupération » (menu) ouvre l'étape 3 (page Récupération)
//  - « Ajouter des méthodes de récupération » ouvre l'étape 4 (page Vérification)
//  - calepin : la liste « À faire » (NOTES_CALEPIN) s'affiche sur le petit calepin ET sur le calepin ouvert
//  - étape 4 : FAUX champ (un <div>, pas un <input>) à saisie spéciale + calepin interactif ; « Vérifier » ouvre l'étape 5 (page e-mail de récupération)
//  - étape 5 : choix de l'adresse de récupération ; « Ajouter » ouvre l'étape 6 (phrase de récupération)
//  - étape 6 : téléchargement du PDF → fenêtre « Téléchargements » + bulles de dialogue ; la bonne réponse (réponse 2) se sélectionne, puis « Terminé » ouvre l'étape 7
//  - étape 7 : page « Récupération » dans son état COMPLET (Fort 8/10) ; bulle de dialogue ; la suite (étape 8, provisoire)
//    passe par l'icône puzzle de la barre d'adresse > « Gérer les extensions »
//  - la page « Récupération » (étapes 3 et 7) est générée depuis ETATS_RECUPERATION : un objet de données par état
// =====================================================

// ---------- LE MOT DE PASSE (à changer ICI, à un seul endroit) ----------
// Il sert à la saisie automatique dans le champ ET au texte écrit dans le calepin.
const MOT_DE_PASSE = "L6a-gE?2urSsF2!";   // 15 caractères

// ---------- L'ADRESSE DE RÉCUPÉRATION (à changer ICI, à un seul endroit) ----------
const ADRESSE_PRIVEE = "lebgdeneuch@jedi.ch";          // choix 1 : adresse privée déjà existante
const ADRESSE_RECUP = "recup.adresse@jedi.ch";         // choix 2 : nouvelle adresse (écrite aussi dans le calepin)
const MOT_DE_PASSE_RECUP = "R3cup!Jedi-47xQ";          // mot de passe de l'adresse de récupération (valeur provisoire, à remplacer par la valeur voulue)

// ---------- DONNÉES FICTIVES de la page « Récupération » complète (étape 7) ----------
const NUMERO_SMS = "+41 79 000 12 34";                 // faux numéro de téléphone
const DATE_MODIF = "17 nov.";                           // date de « Dernière modification le … »

// ---------- LES NOTES DU CALEPIN (page 1, à changer ICI) ----------
// Une ligne par tâche. Le titre « À faire : » est ajouté par le code (voir remplirNotes plus bas).
// Le petit tiret devant chaque tâche est ajouté par le CSS.
// Chaque tâche est un objet :
//  - texte           : ce qui est écrit dans le calepin
//  - barreDepuisEtape : la note est barrée à partir de cette étape (étape >= ce nombre) ; null = jamais barrée
const NOTES_CALEPIN = [
  { texte: "Sécuriser mon compte en configurant la récupération", barreDepuisEtape: 7 },
  { texte: "Ajouter l'extension SuiteSécurité", barreDepuisEtape: null },
  { texte: "Migrer mes mdp sur SuiteSécurité", barreDepuisEtape: null }
];

// ---------- LES RÉPONSES DU PERSONNAGE (étape 6, bulle de dialogue) ----------
// Les réponses sont des choix sélectionnables (une seule à la fois, comme des boutons radio).
// Chaque réponse a un texte et une « action » (elle devient toujours la réponse sélectionnée) :
//  - "mauvaise-idee" : affiche en plus la 2e bulle « Non, c'est une mauvaise idée... »
//  - "bonne-reponse" : ferme en plus la fenêtre Téléchargements (la bulle reste) et fait pulser « Terminé »
// Aucune réponse ne change d'étape. La bonne réponse est la réponse 2 (le dossier « récup ») :
// elle se sélectionne, puis un clic sur « Terminé » mène à l'étape 7.
// Pour échanger les réponses, il suffit d'échanger les deux actions.
const REPONSES_PDF = [
  { texte: "Je le laisse ici et ça ira", action: "mauvaise-idee" },
  { texte: "Je le stocke dans un dossier Windows nommé « récup » que j'ai fait juste avant", action: "bonne-reponse" }
];

// Choix fait à l'étape 5 : "privee" ou "nouvelle" (vide tant qu'on n'a rien choisi).
// On s'en servira plus tard, dans la suite de l'auto-test.
let choixAdresseRecup = "";

// ---------- LES MESSAGES (facile à modifier) ----------
// Pour chaque service : un tableau de messages.
// Le premier est le message principal, les deux autres sont des variantes.
const MESSAGES = {
  courriel: [
    "Je dois vraiment aller là ? Bon... mais je n'ai rien à vérifier ici.",
    "Mes e-mails survivront très bien sans moi.",
    "Zéro message important, je le sens."
  ],
  agenda: [
    "Bizarre, il me semble que ce n'est pas ça que je cherche.",
    "Pas de réunion à l'horizon. Ce n'est pas ici.",
    "Mon agenda peut garder ses secrets."
  ],
  motsdepasse: [
    "Hmm... pas encore. Il y a un autre bouton qui m'appelle.",
    "Tentant, mais mon instinct dit non.",
    "Un autre bouton me fait de l'œil."
  ],
  vpn: [
    "Je ne vais pas sur une île déserte, j'ai juste besoin de réglages.",
    "Un tunnel sécurisé ? Pas aujourd'hui.",
    "Je reste sur mon réseau, merci."
  ],
  assistant: [
    "Je lui demande ? Non, il va encore me répondre par un poème.",
    "Pas de poème aujourd'hui, merci.",
    "Il est trop bavard pour ce matin."
  ],
  fichiers: [
    "Mon dossier 'Nouveau dossier (7)' peut attendre.",
    "'final_v3_VRAI' peut aussi attendre.",
    "Trop de dossiers, pas assez de courage."
  ],
  documents: [
    "Ça ressemble à du travail, ça. Pas aujourd'hui.",
    "Ça sent la réunion, je passe.",
    "Pas de rapport à rendre maintenant."
  ],
  tableur: [
    "Des chiffres ?! Je suis venu chercher des paramètres, pas des maths.",
    "Les cellules, ce n'est pas pour moi.",
    "Pas de formules aujourd'hui, merci."
  ],
  visio: [
    "Caméra allumée, cheveux pas coiffés... non merci.",
    "Micro coupé, caméra coupée, moi aussi.",
    "Ce n'est pas le bon moment pour apparaître."
  ],
  portefeuille: [
    "Mon portefeuille est vide, ça ne sert à rien d'y aller.",
    "Rien à voir ici, vraiment.",
    "Même mon portefeuille s'ennuie."
  ],

  // ----- Page « Compte » (étape 2) : menu de gauche -----
  "menu-accueil": [
    "Je suis déjà sur l'accueil... on tourne en rond là.",
    "L'accueil ? J'y suis déjà, merci.",
    "Encore l'accueil ? Je fais du surplace."
  ],
  "menu-abonnement": [
    "Un abonnement ? Mon budget a dit non.",
    "Mon budget préfère que je regarde sans toucher.",
    "Un abonnement ? Redemande-moi après le café."
  ],
  "menu-changer": [
    "Changer d'abonnement ? Je viens à peine d'arriver !",
    "Changer quoi ? Je n'ai encore rien visité.",
    "Pas encore, laisse-moi respirer."
  ],
  "menu-compte": [
    "Hmm... je sens que ce n'est pas encore le bon endroit.",
    "Pas encore, mon instinct hésite.",
    "Ça ne ressemble pas à ce que je cherche."
  ],
  "menu-langue": [
    "Je parle déjà assez bien français, merci.",
    "Ma langue maternelle me suffit pour aujourd'hui.",
    "L'heure ? Je l'ai déjà : il est 09:41."
  ],
  "menu-apparence": [
    "Clair ou sombre ? Ce n'est pas le moment de faire du style.",
    "Mon look attendra, j'ai une mission.",
    "Pas de relooking aujourd'hui."
  ],
  "menu-securite": [
    "Bizarre, il me semble que ce n'est pas ça que je cherche.",
    "La sécurité ? J'y reviendrai peut-être.",
    "Ce n'est pas tout à fait ça non plus."
  ],
  "menu-parrainer": [
    "Mes amis ne veulent déjà plus que je leur parle de ça.",
    "Parrainer ? Je n'ai plus d'amis disponibles.",
    "Mon ami est occupé, il me l'a dit."
  ],
  grille: [
    "Plein de petits carrés... mais pas de réponse.",
    "Quatre carrés, zéro solution.",
    "Joli damier, mais je cherche autre chose."
  ],

  // ----- Page « Compte » : barre du haut et contenu -----
  recherche: [
    "Je cherche quoi, déjà ? Ah oui, je ne sais pas.",
    "Ma barre de recherche est timide aujourd'hui.",
    "Chercher quoi ? J'ai oublié en route."
  ],
  premium: [
    "Premium ? Mon portefeuille a déjà répondu non.",
    "Je reste en classe économique, merci.",
    "Le diamant est joli, mais non."
  ],
  comparer: [
    "Comparer ? Je n'ai pas fini de comparer mes chaussettes.",
    "Comparer des offres ? Quelle drôle d'idée !",
    "Trop de choix donne mal à la tête."
  ],
  info: [
    "Une petite info... mais pas la bonne.",
    "Ce « i » ne m'apprend rien d'utile.",
    "Intéressant, mais ce n'est pas ça."
  ],
  // Les 3 boutons « Changer d'abonnement » du panneau partagent ces 3 messages
  "bouton-abonnement": [
    "Changer d'abonnement ? Je viens à peine d'arriver !",
    "Pas si vite, je n'ai même pas fini ma tasse de café.",
    "On m'a dit de ne rien acheter aujourd'hui."
  ],

  // ----- Page « Récupération » (étape 3) -----
  // (le menu, la grille, la recherche et « Premium » réutilisent les messages de la page Compte)
  // Entrée « Récupération » du menu, quand on est déjà sur cette page
  "recup-ici": [
    "J'y suis déjà... on tourne en rond là.",
    "Récupération ? Je suis déjà dessus.",
    "Je ne peux pas aller là où je suis déjà."
  ],
  "info-faible": [
    "Faible ? Moi aussi le lundi matin.",
    "Faible, mais plein de bonne volonté.",
    "Je préfère dire « en progression »."
  ],
  "verif-email": [
    "Mon e-mail ? Il est déjà assez rempli de publicités.",
    "Encore un e-mail ? Ma boîte est au bord de l'explosion.",
    "Mon e-mail a besoin de vacances."
  ],
  "verif-sms": [
    "Mon téléphone est en mode silencieux depuis 2019.",
    "Un SMS ? Je ne les lis que le dimanche.",
    "Mon téléphone dort, ne le réveillons pas."
  ],
  "ajouter-option": [
    "Une option ? Je préfère garder le suspense.",
    "Pas d'option, je suis un aventurier.",
    "Les options, c'est pour les gens organisés."
  ],
  "sauvegarde-appareil": [
    "Activée ? Je ne me souviens même pas de l'avoir fait.",
    "Activée... ou alors je rêve.",
    "Si c'est activé, ça ne se voit pas beaucoup."
  ],
  "fichier-recup": [
    "Un fichier ? Je vais encore le renommer 'nouveau_final_v3'.",
    "Un fichier de plus à égarer, merci.",
    "Je le rangerai sûrement dans « Téléchargements »."
  ],
  "contacts-recup": [
    "Mes contacts ? Je ne leur confierais même pas mon grille-pain.",
    "Un contact de confiance ? J'y réfléchis... longtemps.",
    "Mes contacts ont déjà assez de soucis."
  ],

  // ----- Page « Vérification » (étape 4) -----
  "plus-tard": [
    "Plus tard ? C'est ce que je dis depuis trois ans.",
    "Plus tard... après le café, peut-être.",
    "Je vérifierai demain. Ou après-demain."
  ],
  "mdp-oublie": [
    "Oublié ? Non, non, je l'ai noté quelque part...",
    "Je l'avais sur le bout de la langue... ou du calepin.",
    "Oublié ? Pas du tout, je sais où il est."
  ],
  "demi-tour": [
    "Faire demi-tour maintenant ? Jamais !",
    "Reculer ? Je n'ai pas de marche arrière.",
    "Pas question de rebrousser chemin."
  ],
  "logo": [
    "Je clique sur le logo... il ne se passe rien. Classique.",
    "Le logo ne répond pas. Il boude.",
    "Cliquer sur un logo, mon sport préféré."
  ],

  // ----- Page « Phrase de récupération » (étape 6) -----
  // (« Plus tard », la flèche et le logo réutilisent les messages de la page Vérification)
  "phrase-termine": [
    "Terminé ? Je n'ai même pas encore rangé ce PDF !",
    "Terminé ? Pas tant que mon PDF traîne par là.",
    "Fini ? Il me reste au moins un fichier à égarer."
  ],
  "phrase-copier": [
    "Copier une phrase... pour la coller où, exactement ?",
    "Copier-coller ? Mon presse-papiers est déjà complet.",
    "Je la copie, et après ? Je la colle sur un post-it ?"
  ],

  // ----- Page « Récupération » complète (étape 7) -----
  // (le menu, la grille, la recherche et « Premium » réutilisent les messages de la page Compte ;
  //  « Sauvegarde » et « Contacts » réutilisent ceux de la page Récupération faible)
  "menu-reduire": [
    "Réduire le menu ? Je ne veux rien réduire du tout.",
    "Réduire ? Je préfère que tout reste bien visible.",
    "Cette petite flèche ne m'inspire pas confiance."
  ],
  "menu-parametres": [
    "Les paramètres de l'application ? Je viens à peine de finir ceux du compte.",
    "Encore des paramètres ? Laissez-moi souffler.",
    "Les réglages de l'application attendront."
  ],
  "info-fort": [
    "Fort ? Moi aussi, après un bon café.",
    "Fort, fort... je reste prudent.",
    "Fort ? Disons que je progresse."
  ],
  "examiner": [
    "Examiner ? J'ai déjà passé ma matinée à ça.",
    "Examiner encore ? Mes yeux demandent une pause.",
    "Je les ai déjà examinées sous toutes les coutures."
  ],
  "verif-email-ok": [
    "Mon e-mail de récupération est déjà là, inutile de le revérifier.",
    "Mon e-mail est bien rangé, merci.",
    "Revérifier ? Une fois par siècle, ça suffit."
  ],
  "verif-sms-ok": [
    "Mon numéro est à jour... enfin, je crois.",
    "Mon numéro ? Je ne l'ai jamais changé. Je crois.",
    "Un SMS ? Mon téléphone dort encore."
  ],
  "fichier-recup-ok": [
    "Mon PDF est quelque part... dans un dossier... normalement.",
    "Le PDF ? Il doit traîner du côté de « Téléchargements ».",
    "Mon PDF se cache très bien, c'est rassurant."
  ],

  // ----- Fenêtre « Téléchargements » (étape 6) : les 4 autres fichiers -----
  "dl-facture": [
    "Ma facture du garage ? Pas maintenant, ça fait mal au portefeuille.",
    "Cette facture peut rester bien tranquille.",
    "Le garage attendra mon courage."
  ],
  "dl-photo": [
    "Ah, mes vacances... mais je suis ici pour autre chose.",
    "Belle photo, mais ce n'est pas le moment.",
    "Les vacances, c'est fini. Retour à la mission."
  ],
  "dl-plan": [
    "Le plan de la salle de réunion ? Aucun rapport.",
    "Une salle de réunion ? Ça ne me dit rien qui vaille.",
    "Pas de réunion aujourd'hui, merci."
  ],
  "dl-exe": [
    "Un installateur ? On évite de cliquer sur n'importe quoi.",
    "Un .exe inconnu ? Non merci.",
    "Mon antivirus me regarde, je m'abstiens."
  ]
};

// ---------- ÉLÉMENTS DE LA PAGE ----------
const etapes = document.querySelectorAll(".etape");   // les <section> des étapes
const toast = document.getElementById("toast");       // la bulle de message

// Mémoire : dernier message affiché pour chaque service (pour ne pas le répéter)
const dernierMessage = {};
// Minuteur qui fait disparaître la bulle après 3 secondes
let minuteur = null;

// ---------- LES VUES DU FAUX NAVIGATEUR ----------
// Texte de l'onglet et adresse affichés pour chaque vue
const VUES = {
  accueil: { onglet: "SuiteSécurité – Accueil", adresse: "https://suite-securite.example" },
  compte:  { onglet: "SuiteSécurité – Compte",  adresse: "https://suite-securite.example/compte" },
  recuperation: { onglet: "SuiteSécurité – Récupération", adresse: "https://suite-securite.example/compte/recuperation" },
  verification: { onglet: "SuiteSécurité – Vérification", adresse: "https://suite-securite.example/compte/recuperation/verification" },
  email: { onglet: "SuiteSécurité – E-mail de récupération", adresse: "https://suite-securite.example/compte/recuperation/email" },
  phrase: { onglet: "SuiteSécurité – Phrase de récupération", adresse: "https://suite-securite.example/compte/recuperation/phrase" },
  // Même page « Récupération » que la vue « recuperation », mais dans son état « complet » (étape 7)
  "recuperation-complet": { onglet: "SuiteSécurité – Récupération", adresse: "https://suite-securite.example/compte/recuperation" }
};

// Vue actuellement affichée (« accueil », « compte », « recuperation », « verification », « email », « phrase » ou « recuperation-complet »)
let vueCourante = "accueil";

// Numéro de l'étape actuelle (0 tant qu'aucune étape n'est affichée)
let etapeCourante = 0;

// Affiche une seule vue dans la zone de page web
// et met à jour l'onglet et l'adresse du navigateur.
// « compte » et « recuperation » partagent le même menu et la même barre du haut :
// seul le contenu (.c-contenu) et l'entrée de menu sélectionnée changent.
function afficherVue(nom) {
  vueCourante = nom;
  // Un bloc .vue peut servir à plusieurs vues : data-vues="compte recuperation"
  document.querySelectorAll(".vue").forEach(function (vue) {
    vue.hidden = !vue.dataset.vues.split(" ").includes(nom);
  });
  // Contenu propre à chaque page (menu et barre du haut restent en place)
  document.querySelectorAll(".c-contenu").forEach(function (contenu) {
    contenu.hidden = contenu.dataset.sous !== nom;
  });
  marquerMenu(nom);
  document.getElementById("onglet-texte").textContent = VUES[nom].onglet;
  document.getElementById("adresse-texte").textContent = VUES[nom].adresse;
}

// ---------- LA BARRE « PROTECTION DU COMPTE » (vues verification, email et phrase) ----------
// Chaque bloc .v-protection se règle avec des attributs data-* dans le HTML :
//  data-remplis      = nombre de segments colorés (sur 10)
//  data-chiffre      = nombre écrit dans le bouclier
//  data-couleur      = couleur du mot « Faible » et du bouclier
//  data-couleur-barre = couleur des segments colorés
function dessinerProtection(bloc) {
  const remplis = Number(bloc.dataset.remplis);
  // Les couleurs passent par des variables CSS (lues dans autotest.css)
  bloc.style.setProperty("--prot-couleur", bloc.dataset.couleur);
  bloc.style.setProperty("--prot-barre", bloc.dataset.couleurBarre);
  bloc.querySelector(".v-bouclier b").textContent = bloc.dataset.chiffre;
  // 10 segments : les premiers sont colorés (classe « plein »), les autres restent gris
  const barre = bloc.querySelector(".v-segments");
  barre.textContent = "";
  for (let i = 0; i < 10; i++) {
    const segment = document.createElement("span");
    if (i < remplis) segment.className = "plein";
    barre.appendChild(segment);
  }
}
document.querySelectorAll(".v-protection").forEach(dessinerProtection);

// Marque l'entrée de menu sélectionnée : « Accueil » sur la page compte,
// « Récupération » sur la page récupération (faible ou complète)
function marquerMenu(nom) {
  document.querySelectorAll(".c-entree").forEach(function (entree) {
    // data-vue-menu peut contenir plusieurs vues : « recuperation recuperation-complet »
    entree.classList.toggle("actif", (entree.dataset.vueMenu || "").split(" ").includes(nom));
  });
}

// ---------- CHANGER D'ÉTAPE ----------
// Étape 1 = bureau + vue « accueil » ; étape 2 = le MÊME bureau + vue « compte » ;
// étape 3 = le MÊME bureau + vue « recuperation » ; étape 4 = le MÊME bureau + vue « verification » ;
// étape 5 = le MÊME bureau + vue « email » ; étape 6 = le MÊME bureau + vue « phrase » ; étape 7 = le MÊME bureau + page « Récupération » complète ;
// étape 8 = carte provisoire. Chaque <section> déclare ses étapes dans data-etapes.
function allerEtape(numero) {
  const etapePrecedente = etapeCourante;        // d'où l'on vient (0 au démarrage)
  etapeCourante = numero;
  etapes.forEach(function (section) {
    const siennes = section.dataset.etapes.split(" ");
    section.hidden = !siennes.includes(String(numero));
  });
  if (numero === 1) afficherVue("accueil");
  if (numero === 2) afficherVue("compte");
  if (numero === 3) afficherVue("recuperation");
  if (numero === 4) afficherVue("verification");
  if (numero === 5) afficherVue("email");
  if (numero === 6) afficherVue("phrase");
  if (numero === 7) afficherVue("recuperation-complet");
  cacherMessage();
  // Bulle, calepin et champ du mot de passe : actifs seulement à l'étape 4 (remis à zéro à chaque arrivée)
  preparerEtape4(numero === 4);
  // Choix de l'adresse : remis à zéro à chaque arrivée sur l'étape 5
  if (numero === 5) preparerEtape5();
  // Fenêtre Téléchargements, bulles et bouton de téléchargement : actifs seulement à l'étape 6 (remis à zéro à chaque arrivée)
  preparerEtape6(numero === 6);
  // Page « Récupération » complète : adresse à jour et défilement en haut à chaque arrivée sur l'étape 7
  if (numero === 7) preparerEtape7();
  // Étape 7 : bulle de dialogue (après le trait barré) et bouton puzzle actif ; ailleurs : bulle et panneau fermés
  preparerExtensions(numero === 7);
  // Notes du calepin : barrées ou non selon l'étape (petit calepin ET calepin ouvert)
  majNotes(numero, etapePrecedente);
  // On garde l'étape dans l'adresse (#2 à #8), pour qu'un rechargement reste sur la même étape
  history.replaceState(null, "", numero === 1 ? location.pathname + location.search : "#" + numero);
}

// Lit l'adresse : « autotest.html#2 » à « #8 » ouvre cette étape, sinon étape 1
function etapeDepuisAdresse() {
  const numero = Number(location.hash.slice(1));
  return [2, 3, 4, 5, 6, 7, 8].includes(numero) ? numero : 1;
}

// ---------- LES MESSAGES HUMORISTIQUES ----------
// Choisit un message au hasard, différent du précédent pour ce service
function choisirMessage(service) {
  const liste = MESSAGES[service];
  let texte;
  do {
    texte = liste[Math.floor(Math.random() * liste.length)];
  } while (texte === dernierMessage[service] && liste.length > 1);
  dernierMessage[service] = texte;
  return texte;
}

// Affiche la bulle (avec animation) puis la cache après 3 secondes
function afficherMessage(texte) {
  clearTimeout(minuteur);
  toast.textContent = texte;
  toast.hidden = true;
  void toast.offsetWidth;          // astuce : force le navigateur à rejouer l'animation
  toast.hidden = false;
  minuteur = setTimeout(cacherMessage, 3000);
}

function cacherMessage() {
  clearTimeout(minuteur);
  toast.hidden = true;
}

// =====================================================
//  LA PAGE « RÉCUPÉRATION » : UN ÉTAT = UN OBJET DE DONNÉES
//  « faible » = étape 3 (3/10, rouge) ; « complet » = étape 7 (8/10, vert).
//  La mise en page est la même : construireRecuperation() fabrique les éléments à partir des données.
// =====================================================

// Petits dessins (SVG génériques) réutilisés par les lignes
const ICONES = {
  enveloppe: '<svg class="r-icone" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  telephone: '<svg class="r-icone" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  appareil: '<svg class="r-icone" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  fichier: '<svg class="r-icone" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>',
  contacts: '<svg class="r-icone" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6M17 11a3 3 0 1 0 0-6M19 14c2 .5 3 2.5 3 5"/></svg>'
};
const SVG_FLECHE = '<svg class="r-fleche" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
const SVG_BOUCLIER = '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z"/></svg>';
const SVG_INFO = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>';
const SVG_ALERTE = '<svg viewBox="0 0 24 24"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.01"/></svg>';
const SVG_COCHE = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>';
const SVG_BANDEAU = '<svg viewBox="0 0 24 24"><path d="M12 11v6M12 7.5v.01"/></svg>';

// Textes communs aux deux états
const INTRO_RECUP = "Le chiffrement de bout en bout de SuiteSécurité signifie que seul vous pouvez déverrouiller vos données. Configurez des options de récupération afin de ne jamais perdre vos accès.";
const TEXTE_REINIT = "Ceci permet de récupérer les accès à votre compte SuiteSécurité mais ne permet de récupérer vos données chiffrées.";
const TEXTE_DONNEES = "Comment déverrouiller mes données chiffrées si je perds mon mot de passe.";

// L'adresse e-mail de récupération affichée : celle choisie à l'étape 5 (ADRESSE_RECUP si rien n'est choisi)
function adresseRecuperation() {
  return choixAdresseRecup === "privee" ? ADRESSE_PRIVEE : ADRESSE_RECUP;
}

// Les données de chaque état. Une ligne = { icone, nom, msg } + soit une « pastille » (statut), soit une « valeur » + « date ».
const ETATS_RECUPERATION = {
  // ----- Étape 3 : récupération faible (rouge, 3/10, bandeau beige) -----
  faible: {
    classe: "r-etat-faible",
    capacite: {
      bouclier: "3/10", niveau: "Faible", msgInfo: "info-faible",
      remplis: 3, classeSegment: "rouge",
      titre: "Évitez toute perte de données en prenant quelques précautions.",
      texte: "Votre configuration de récupération est incomplète. Si vous oubliez votre mot de passe, vous risquez toujours de ne plus pouvoir accéder à vos e-mails, à vos fichiers et à vos mots de passe.",
      // SEUL bouton qui change de page : étape 4
      bouton: { texte: "Ajouter des méthodes de récupération", classe: "r-bouton-rose", id: "btn-methodes" }
    },
    reinit: {
      titre: "Options de réinitialisation du mot de passe",
      lignes: [
        { icone: "enveloppe", nom: "Vérification par e-mail", msg: "verif-email",
          pastille: { classe: "r-orange", picto: SVG_ALERTE, texte: "Ajouter une adresse e-mail" } },
        { icone: "telephone", nom: "Vérification SMS", msg: "verif-sms",
          pastille: { classe: "r-orange", picto: SVG_ALERTE, texte: "Ajouter un numéro de téléphone" } }
      ]
    },
    donnees: {
      titre: "Options de récupération de données",
      bandeau: { texte: "La récupération des données nécessite une option de réinitialisation du mot de passe (e-mail ou SMS).", bouton: "Ajouter une option", msg: "ajouter-option" },
      lignes: [
        { icone: "appareil", nom: "Sauvegarde des données de l'appareil", msg: "sauvegarde-appareil",
          pastille: { classe: "r-bleu", picto: SVG_COCHE, texte: "Activée" } },
        { icone: "fichier", nom: "Fichier de récupération", msg: "fichier-recup",
          pastille: { classe: "r-orange", picto: SVG_ALERTE, texte: "Non enregistré" } },
        { icone: "contacts", nom: "Contacts de récupération des données", msg: "contacts-recup",
          pastille: { classe: "r-orange", picto: SVG_ALERTE, texte: "Ajouter un contact de récupération" } }
      ]
    }
  },

  // ----- Étape 7 : récupération complète (vert, 8/10, pas de bandeau) -----
  complet: {
    classe: "r-etat-fort",
    capacite: {
      bouclier: "8/10", niveau: "Fort", msgInfo: "info-fort",
      remplis: 8, classeSegment: "vert",
      titre: "Vérifiez si vous avez accès à vos options de récupération",
      texte: "Votre configuration de récupération est excellente. Veillez à maintenir vos options à jour afin qu'elles fonctionnent toujours lorsque vous en aurez besoin.",
      // (Rien ici ne change d'étape : la suite passe par l'icône puzzle de la barre d'adresse > « Gérer les extensions »)
      bouton: { texte: "Examiner les options de récupération", classe: "r-bouton-vert", msg: "examiner" }
    },
    reinit: {
      titre: "Options de réinitialisation du mot de passe",
      lignes: [
        // « valeur » est une fonction : l'adresse dépend du choix fait à l'étape 5
        { icone: "enveloppe", nom: "Vérification par e-mail", msg: "verif-email-ok",
          valeur: adresseRecuperation, date: "Dernière modification le " + DATE_MODIF },
        { icone: "telephone", nom: "Vérification SMS", msg: "verif-sms-ok",
          valeur: function () { return NUMERO_SMS; }, date: "Dernière modification le " + DATE_MODIF }
      ]
    },
    donnees: {
      titre: "Options de récupération de données",
      bandeau: null,                                       // pas de bandeau beige dans cet état
      lignes: [
        { icone: "appareil", nom: "Sauvegarde des données de l'appareil", msg: "sauvegarde-appareil",
          pastille: { classe: "r-bleu", picto: SVG_COCHE, texte: "Activée" } },
        { icone: "fichier", nom: "Fichier de récupération", msg: "fichier-recup-ok",
          pastille: { classe: "r-bleu", picto: SVG_COCHE, texte: "Enregistré" } },
        { icone: "contacts", nom: "Contacts de récupération des données", msg: "contacts-recup",
          pastille: { classe: "r-orange", picto: SVG_ALERTE, texte: "Ajouter un contact de récupération" } }
      ]
    }
  }
};

// Les valeurs qui peuvent changer (l'adresse e-mail) : [élément, fonction]
const valeursRecuperation = [];

// Crée un élément avec une classe et un texte (le texte est optionnel)
function creer(balise, classe, texte) {
  const element = document.createElement(balise);
  if (classe) element.className = classe;
  if (texte !== undefined) element.textContent = texte;
  return element;
}

// Transforme un petit SVG écrit à la main (constantes ci-dessus) en élément
function creerSvg(codeSvg) {
  const modele = document.createElement("template");
  modele.innerHTML = codeSvg;
  return modele.content.firstChild;
}

// Fabrique une ligne cliquable (bouton .r-ligne) à partir d'un objet de données
function creerLigne(donnees) {
  const ligne = creer("button", "r-ligne");
  ligne.type = "button";
  ligne.dataset.msg = donnees.msg;                         // message humoristique au clic
  ligne.appendChild(creerSvg(ICONES[donnees.icone]));
  ligne.appendChild(creer("span", "r-nom", donnees.nom));
  if (donnees.pastille) {
    // Pastille de statut (coche bleue, alerte orange…)
    const pastille = creer("span", "r-pastille " + donnees.pastille.classe);
    pastille.appendChild(creerSvg(donnees.pastille.picto));
    pastille.appendChild(document.createTextNode(donnees.pastille.texte));
    ligne.appendChild(pastille);
  } else {
    // Valeur (à partir de la moitié de la carte) + date en petit gris
    ligne.classList.add("r-ligne-valeur");
    const valeur = creer("span", "r-valeur", donnees.valeur());
    valeursRecuperation.push([valeur, donnees.valeur]);
    ligne.appendChild(valeur);
    ligne.appendChild(creer("span", "r-date", donnees.date));
  }
  ligne.appendChild(creerSvg(SVG_FLECHE));
  return ligne;
}

// Fabrique toute la page « Récupération » d'un état dans le conteneur donné
function construireRecuperation(nomEtat, conteneur) {
  const etat = ETATS_RECUPERATION[nomEtat];
  const cap = etat.capacite;
  conteneur.classList.add(etat.classe);

  // 1. Titre + paragraphe
  conteneur.appendChild(creer("h2", "r-titre", "Récupération"));
  conteneur.appendChild(creer("p", "r-intro", INTRO_RECUP));

  // 2. Carte « Capacité de récupération » : en-tête (bouclier, titre, niveau, barre de 10 segments)
  const carte = creer("section", "r-carte");
  const entete = creer("div", "r-entete");
  const bouclier = creer("span", "r-bouclier");
  bouclier.setAttribute("aria-hidden", "true");
  bouclier.appendChild(creerSvg(SVG_BOUCLIER));
  bouclier.appendChild(creer("b", "", cap.bouclier));
  entete.appendChild(bouclier);
  entete.appendChild(creer("strong", "r-cap-titre", "Capacité de récupération"));
  const niveau = creer("span", "r-faible");              // (« r-faible » sert aussi pour « Fort » : la couleur change avec l'état)
  niveau.appendChild(document.createTextNode(cap.niveau));
  const info = creer("button", "c-info r-info");
  info.type = "button";
  info.dataset.msg = cap.msgInfo;
  info.setAttribute("aria-label", "Information");
  info.appendChild(creerSvg(SVG_INFO));
  niveau.appendChild(info);
  entete.appendChild(niveau);
  const segments = creer("div", "r-segments");
  segments.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 10; i++) {
    segments.appendChild(creer("span", i < cap.remplis ? cap.classeSegment : ""));
  }
  entete.appendChild(segments);
  carte.appendChild(entete);

  // Corps de la carte : phrase en gras, texte gris, bouton
  const corps = creer("div", "r-corps");
  corps.appendChild(creer("strong", "", cap.titre));
  corps.appendChild(creer("p", "r-gris", cap.texte));
  const bouton = creer("button", cap.bouton.classe, cap.bouton.texte);
  bouton.type = "button";
  if (cap.bouton.id) bouton.id = cap.bouton.id;
  if (cap.bouton.msg) bouton.dataset.msg = cap.bouton.msg;
  corps.appendChild(bouton);
  carte.appendChild(corps);
  conteneur.appendChild(carte);

  // 3. Options de réinitialisation du mot de passe
  conteneur.appendChild(creer("h3", "r-section", etat.reinit.titre));
  conteneur.appendChild(creer("p", "r-gris r-section-texte", TEXTE_REINIT));
  const carteReinit = creer("div", "r-carte");
  etat.reinit.lignes.forEach(function (ligne) { carteReinit.appendChild(creerLigne(ligne)); });
  conteneur.appendChild(carteReinit);

  // 4. Options de récupération de données (avec le bandeau beige seulement si l'état en a un)
  conteneur.appendChild(creer("h3", "r-section", etat.donnees.titre));
  conteneur.appendChild(creer("p", "r-gris r-section-texte", TEXTE_DONNEES));
  const carteDonnees = creer("div", "r-carte");
  const bandeau = etat.donnees.bandeau;
  if (bandeau) {
    const zone = creer("div", "r-bandeau");
    const icone = creer("span", "r-bandeau-icone");
    icone.setAttribute("aria-hidden", "true");
    icone.appendChild(creerSvg(SVG_BANDEAU));
    zone.appendChild(icone);
    zone.appendChild(creer("p", "", bandeau.texte));
    const boutonBandeau = creer("button", "r-bouton-blanc", bandeau.bouton);
    boutonBandeau.type = "button";
    boutonBandeau.dataset.msg = bandeau.msg;
    zone.appendChild(boutonBandeau);
    carteDonnees.appendChild(zone);
  }
  etat.donnees.lignes.forEach(function (ligne) { carteDonnees.appendChild(creerLigne(ligne)); });
  conteneur.appendChild(carteDonnees);
}

// On construit les deux états AVANT de brancher les messages (voir plus bas), pour que leurs boutons réagissent aussi
construireRecuperation("faible", document.getElementById("r-colonne-faible"));
construireRecuperation("complet", document.getElementById("r-colonne-complet"));

// Met à jour les valeurs qui dépendent d'un choix (l'adresse e-mail choisie à l'étape 5)
function majValeursRecuperation() {
  valeursRecuperation.forEach(function (paire) { paire[0].textContent = paire[1](); });
}

// ---------- BRANCHEMENT DES BOUTONS ----------
// Tous les éléments qui affichent un message :
//  - les 10 services de l'accueil (attribut data-service)
//  - les éléments de la page Compte (attribut data-msg)
// La clé choisit la liste de messages dans MESSAGES.
const ELEMENTS_A_MESSAGE = ".service, [data-msg]";

document.querySelectorAll(ELEMENTS_A_MESSAGE).forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    afficherMessage(choisirMessage(bouton.dataset.msg || bouton.dataset.service));
  });
});

// Champ de recherche factice : un message aussi quand on y arrive au clavier (Tab).
// (Au clic souris, le « click » ci-dessus s'en occupe déjà.)
document.getElementById("c-recherche").addEventListener("focus", function (e) {
  if (e.target.matches(":focus-visible")) {
    afficherMessage(choisirMessage("recherche"));
  }
});

// Un clic ailleurs sur la page fait disparaître la bulle
// (sauf si on clique sur un élément à message : lui il affiche un nouveau message)
// (« Récupération » du menu est aussi un élément à message quand on est déjà sur sa page)
document.addEventListener("click", function (e) {
  if (!e.target.closest(ELEMENTS_A_MESSAGE + ", #btn-recuperation, #btn-terminer")) cacherMessage();
});

// « Paramètres » (page des services) : le seul bouton sans message, il ouvre l'étape 2
document.getElementById("btn-parametres").addEventListener("click", function () {
  allerEtape(2);
});

// « Récupération » (menu de gauche) :
//  - depuis la page Compte, ouvre la page Récupération (étape 3)
//  - depuis la page Récupération (déjà sélectionnée), affiche un message
document.getElementById("btn-recuperation").addEventListener("click", function () {
  if (vueCourante.startsWith("recuperation")) {      // déjà sur la page Récupération (faible ou complète)
    afficherMessage(choisirMessage("recup-ici"));
  } else {
    allerEtape(3);
  }
});

// « Ajouter des méthodes de récupération » (bouton rose) : le seul élément de la page
// Récupération qui change de page → étape 4 (page Vérification)
document.getElementById("btn-methodes").addEventListener("click", function () {
  allerEtape(4);
});

// « Retour au bureau » (étape 8) : retour à l'étape 7 (la page « Récupération » complète)
document.getElementById("btn-retour-bureau").addEventListener("click", function () {
  allerEtape(7);
});

// =====================================================
//  ÉTAPE 4 : CHAMP « MOT DE PASSE » SPÉCIAL + CALEPIN INTERACTIF
// =====================================================
// Le « champ » est un simple <div> (pas un <input>) : les gestionnaires de mots de passe ne le voient pas.
const champ = document.getElementById("champMdp");           // le faux champ (reçoit le focus et les touches)
const champTexte = document.getElementById("champMdpTexte"); // le <span> où s'affiche le texte
const btnOeil = document.getElementById("btn-oeil");         // l'œil (afficher / masquer)
const btnVerifier = document.getElementById("btn-verifier"); // le bouton « Vérifier »
const calepin = document.getElementById("calepin");          // le calepin du bureau
const carnetFond = document.getElementById("carnet-fond");   // fond assombri + carnet ouvert
const carnetFermer = document.getElementById("carnet-fermer");
const bulleCalepin = document.getElementById("bulle-calepin");

// Nombre de lettres déjà « saisies » (0 à 15) : c'est la SEULE trace de la saisie
let nbSaisis = 0;
// Le mot de passe est-il caché (points) ? false = on voit les vraies lettres (œil actif)
let masque = true;

// Écrit la liste « À faire » (titre + une ligne par tâche) dans un élément.
// Sert pour le petit calepin ET pour la page 1 du calepin ouvert : même contenu partout.
// Les lignes créées (des deux calepins), avec leur note : majNotes s'en sert pour les barrer
const lignesNotes = [];

function remplirNotes(conteneur) {
  const titre = document.createElement("span");
  titre.className = "notes-titre";
  titre.textContent = "À faire :";
  conteneur.appendChild(titre);
  NOTES_CALEPIN.forEach(function (note) {
    const ligne = document.createElement("span");
    ligne.className = "notes-ligne";
    // Le texte est dans un <span> à part : le trait suit le texte, même sur 2 lignes
    const texte = document.createElement("span");
    texte.className = "notes-texte";
    texte.textContent = note.texte;
    ligne.appendChild(texte);
    conteneur.appendChild(ligne);
    lignesNotes.push({ ligne: ligne, note: note });
  });
}
remplirNotes(document.getElementById("calepin-notes"));
remplirNotes(document.getElementById("carnet-notes"));

// Barre ou non chaque note d'après le numéro d'étape actuel (pas d'après un historique) :
// barrée si étape >= barreDepuisEtape. Le trait ne s'anime que lorsqu'on ARRIVE sur cette étape
// depuis l'étape juste avant (6 → 7) ; ailleurs (#7 direct, 7 → 8, retour de 8 à 7) il est déjà là, sans animation.
function majNotes(numero, etapePrecedente) {
  lignesNotes.forEach(function (element) {
    const depuis = element.note.barreDepuisEtape;
    const barre = depuis !== null && numero >= depuis;
    const dejaBarre = element.ligne.classList.contains("barre");
    if (barre === dejaBarre) return;              // rien ne change pour cette ligne
    if (!barre) {
      element.ligne.classList.remove("barre");
      return;
    }
    const animer = (numero === depuis && etapePrecedente === depuis - 1);
    element.ligne.classList.toggle("instant", !animer);   // « instant » = sans animation
    void element.ligne.offsetWidth;               // astuce : le navigateur prend en compte l'état de départ
    element.ligne.classList.add("barre");
  });
}

// On écrit les valeurs dans le calepin (page 2) depuis les constantes
document.getElementById("carnet-mdp").textContent = MOT_DE_PASSE;
document.getElementById("carnet-adresse").textContent = ADRESSE_RECUP;
document.getElementById("carnet-mdp-adresse").textContent = MOT_DE_PASSE_RECUP;

// Le mot de passe est-il complet ?
function motDePasseComplet() {
  return nbSaisis === MOT_DE_PASSE.length;
}

// Met à jour le champ et le bouton « Vérifier » d'après nbSaisis
function majChamp() {
  // Points « • » (nbSaisis fois) si masqué, sinon les vraies lettres
  const valeur = MOT_DE_PASSE.slice(0, nbSaisis);
  champTexte.textContent = masque ? "•".repeat(nbSaisis) : valeur;
  const complet = motDePasseComplet();
  btnVerifier.disabled = !complet;
  // Petite pulsation, une seule fois, au moment où le mot de passe devient complet
  btnVerifier.classList.toggle("pret", complet);
}

// Touches : CHAQUE touche imprimable ajoute la lettre SUIVANTE du mot de passe
champ.addEventListener("keydown", function (e) {
  // On laisse passer les raccourcis (Ctrl+R, etc.), sauf AltGr (= Ctrl + Alt sous Windows)
  const altGr = e.getModifierState && e.getModifierState("AltGraph");
  if ((e.ctrlKey || e.altKey || e.metaKey) && !altGr) return;

  if (e.key === "Backspace") {                  // efface la dernière lettre
    e.preventDefault();
    if (nbSaisis > 0) nbSaisis--;
    majChamp();
  } else if (e.key === "Enter") {               // Entrée = « Vérifier », seulement si complet
    e.preventDefault();
    if (motDePasseComplet()) allerEtape(5);   // Entrée = « Vérifier » → étape 5
  } else if (e.key.length === 1) {              // touche imprimable (lettre, chiffre, symbole, espace)
    e.preventDefault();                         // la vraie touche n'écrit rien
    if (nbSaisis < MOT_DE_PASSE.length) nbSaisis++;
    majChamp();
  }
  // Les autres touches (Tab, F1…F12, Échap, flèches…) gardent leur comportement normal
});

// Aucune autre façon de remplir le champ : coller et glisser-déposer ne font rien
["beforeinput", "paste", "cut", "copy", "drop", "dragstart"].forEach(function (nomEvenement) {
  champ.addEventListener(nomEvenement, function (e) { e.preventDefault(); });
});

// L'œil : bascule points / texte, sans changer le contenu (pas de message humoristique)
btnOeil.addEventListener("click", function () {
  masque = !masque;
  const visible = !masque;
  majChamp();                                   // réaffiche le même contenu, en points ou en lettres
  btnOeil.setAttribute("aria-pressed", String(visible));
  btnOeil.setAttribute("aria-label", visible ? "Masquer le mot de passe" : "Afficher le mot de passe");
  champ.focus();
});

// « Vérifier » (actif seulement quand le mot de passe est complet) → étape 5 (page e-mail)
btnVerifier.addEventListener("click", function () {
  if (motDePasseComplet()) allerEtape(5);
});

// ---------- Le calepin interactif ----------
function ouvrirCarnet() {
  carnetFond.hidden = false;
  carnetFermer.focus();             // le focus quitte le champ : les touches ne le remplissent plus
}

// Ferme le carnet ; redonnerFocus = true → le focus retourne dans le champ
function fermerCarnet(redonnerFocus) {
  carnetFond.hidden = true;
  if (redonnerFocus) champ.focus();
}

calepin.addEventListener("click", ouvrirCarnet);
carnetFermer.addEventListener("click", function () { fermerCarnet(true); });
// Clic sur le fond assombri (mais pas sur le carnet lui-même) : fermeture
carnetFond.addEventListener("click", function (e) {
  if (e.target === carnetFond) fermerCarnet(true);
});
// Touche Échap : fermeture (seulement si le carnet est ouvert)
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !carnetFond.hidden) fermerCarnet(true);
});

// ---------- Préparation de l'étape 4 (appelée par allerEtape) ----------
// actif = true : on arrive à l'étape 4 → tout est remis à zéro
// actif = false : on est ailleurs → bulle cachée, calepin décoratif
function preparerEtape4(actif) {
  bulleCalepin.hidden = !actif;
  // Le bureau réserve de la place en haut de la colonne pour la bulle (utile sur les écrans courts)
  document.getElementById("etape-bureau").classList.toggle("avec-bulle", actif);

  // Le calepin n'est un vrai bouton cliquable qu'à l'étape 4
  calepin.disabled = !actif;
  if (actif) {
    calepin.removeAttribute("tabindex");
    calepin.removeAttribute("aria-hidden");
    calepin.setAttribute("aria-label", "Ouvrir le calepin");
  } else {
    calepin.tabIndex = -1;
    calepin.setAttribute("aria-hidden", "true");
    calepin.removeAttribute("aria-label");
  }

  fermerCarnet(false);              // calepin fermé
  if (actif) {
    nbSaisis = 0;                   // compteur à 0
    masque = true;                  // points
    btnOeil.setAttribute("aria-pressed", "false");
    btnOeil.setAttribute("aria-label", "Afficher le mot de passe");
    majChamp();                     // champ vide, « Vérifier » grisé
    champ.focus();                  // focus automatique
  }
}

// =====================================================
//  ÉTAPE 5 : CHOIX DE L'ADRESSE E-MAIL DE RÉCUPÉRATION
// =====================================================
const radiosAdresse = document.querySelectorAll('input[name="adresseRecup"]');   // les 2 boutons radio
const btnAjouter = document.getElementById("btn-ajouter");                       // le bouton « Ajouter »

// Les adresses affichées viennent des constantes
document.getElementById("adresse-privee").textContent = ADRESSE_PRIVEE;
document.getElementById("adresse-nouvelle").textContent = ADRESSE_RECUP;

// Dès qu'un choix est sélectionné, « Ajouter » devient actif (avec une seule pulsation)
radiosAdresse.forEach(function (radio) {
  radio.addEventListener("change", function () {
    btnAjouter.disabled = false;
    btnAjouter.classList.add("pret");
  });
});

// « Ajouter » : on garde le choix en mémoire puis on passe à l'étape 6
btnAjouter.addEventListener("click", function () {
  const choisi = document.querySelector('input[name="adresseRecup"]:checked');
  if (!choisi) return;                        // sécurité : rien n'est choisi
  choixAdresseRecup = choisi.value;           // "privee" ou "nouvelle"
  allerEtape(6);
});

// Remet l'étape 5 à zéro (appelée par allerEtape à chaque arrivée) :
// aucun choix coché, « Ajouter » grisé, page remontée tout en haut
function preparerEtape5() {
  radiosAdresse.forEach(function (radio) { radio.checked = false; });
  choixAdresseRecup = "";
  btnAjouter.disabled = true;
  btnAjouter.classList.remove("pret");
  document.getElementById("vue-email").scrollTop = 0;
}

// =====================================================
//  ÉTAPE 6 : TÉLÉCHARGEMENT, FENÊTRE « TÉLÉCHARGEMENTS » ET BULLES DE DIALOGUE
// =====================================================
const btnTelecharger = document.getElementById("btn-telecharger"); // la boîte de téléchargement
const rondDl = document.getElementById("rond-dl");                 // son bouton rond (flèche, anneau, coche)
const dlFond = document.getElementById("dl-fond");                 // fond transparent derrière la fenêtre
const dlFenetre = document.getElementById("dl-fenetre");           // la fenêtre « Téléchargements »
const dlFermer = document.getElementById("dl-fermer");             // son bouton ✕
const dlLignes = document.querySelectorAll(".dl-ligne");           // les 5 fichiers
const tacheDl = document.getElementById("tache-dl");               // pastille dans la barre des tâches
const bullePdf = document.getElementById("bulle-pdf");             // 1re bulle : question + réponses
const bulleMauvaise = document.getElementById("bulle-mauvaise");   // 2e bulle : « mauvaise idée »
const bulleReponses = document.getElementById("bulle-reponses");   // les boutons de réponse

const btnTerminer = document.getElementById("btn-terminer");       // le bouton « Terminé » de la page web

// Minuteurs : fin de l'animation du bouton rond, disparition de la 2e bulle, fermeture automatique de la fenêtre
let minuteurDl = null;
let minuteurBulle = null;
let minuteurFermeture = null;

// Réponse actuellement sélectionnée (un objet de REPONSES_PDF), ou null si aucune
let reponseChoisie = null;
// Les boutons de réponse, dans le même ordre que REPONSES_PDF
const boutonsReponse = [];

// Ce que fait chaque « action » des réponses (voir REPONSES_PDF). Aucune ne change d'étape.
const ACTIONS_REPONSE = {
  "mauvaise-idee": function () {
    afficherMauvaiseIdee();
  },
  "bonne-reponse": function () {
    // On ferme la fenêtre après 0,6 s pour dégager « Terminé » ; la bulle, elle, reste affichée
    minuteurFermeture = setTimeout(masquerFenetreDl, 600);
    // « Terminé » fait une petite pulsation (une seule fois) pour montrer qu'il est prêt
    btnTerminer.classList.remove("pret");
    void btnTerminer.offsetWidth;               // astuce : rejoue l'animation
    btnTerminer.classList.add("pret");
  }
};

// Sélectionne une réponse (une seule à la fois) ; null = on efface la sélection
function choisirReponse(reponse) {
  clearTimeout(minuteurFermeture);              // on change de réponse : plus de fermeture automatique
  reponseChoisie = reponse;
  boutonsReponse.forEach(function (bouton, i) {
    bouton.setAttribute("aria-checked", String(REPONSES_PDF[i] === reponse));
  });
  if (!reponse || reponse.action !== "bonne-reponse") btnTerminer.classList.remove("pret");
}

// On crée les boutons de réponse à partir du tableau REPONSES_PDF (groupe de type « bouton radio »)
REPONSES_PDF.forEach(function (reponse) {
  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.className = "bulle-reponse";
  bouton.setAttribute("role", "radio");
  bouton.setAttribute("aria-checked", "false");
  bouton.textContent = reponse.texte;
  bouton.addEventListener("click", function () {
    choisirReponse(reponse);                    // la dernière réponse cliquée est la sélectionnée
    ACTIONS_REPONSE[reponse.action]();
  });
  // Clavier : Tab/Entrée/Espace comme un bouton, et les flèches passent d'une réponse à l'autre
  bouton.addEventListener("keydown", function (e) {
    const i = boutonsReponse.indexOf(bouton);
    let suivant = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") suivant = (i + 1) % boutonsReponse.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") suivant = (i - 1 + boutonsReponse.length) % boutonsReponse.length;
    if (suivant >= 0) {
      e.preventDefault();
      boutonsReponse[suivant].focus();
    }
  });
  boutonsReponse.push(bouton);
  bulleReponses.appendChild(bouton);
});

// « Terminé » : si la bonne réponse (réponse 2) est sélectionnée → étape 7 ;
// sinon → message humoristique (il ne change pas d'étape et n'est jamais désactivé)
btnTerminer.addEventListener("click", function () {
  if (reponseChoisie && reponseChoisie.action === "bonne-reponse") {
    allerEtape(7);
  } else {
    afficherMessage(choisirMessage("phrase-termine"));
  }
});

// 2e bulle : apparaît sous la première, puis disparaît seule après 3,5 secondes
function afficherMauvaiseIdee() {
  clearTimeout(minuteurBulle);
  bulleMauvaise.hidden = true;
  void bulleMauvaise.offsetWidth;               // astuce : rejoue l'animation d'apparition
  bulleMauvaise.hidden = false;
  minuteurBulle = setTimeout(function () { bulleMauvaise.hidden = true; }, 3500);
}

function ouvrirFenetreDl() {
  dlFond.hidden = false;
  dlFenetre.hidden = false;
  tacheDl.hidden = false;
  dlLignes[0].focus();                          // le clavier arrive sur le 1er fichier
}

// Cache seulement la fenêtre (utilisé par la fermeture automatique : les bulles restent affichées)
function masquerFenetreDl() {
  dlFond.hidden = true;
  dlFenetre.hidden = true;
  tacheDl.hidden = true;
}

// Bouton ✕ : ferme la fenêtre ET les bulles, et efface la sélection de réponse
function fermerFenetreDl() {
  masquerFenetreDl();
  clearTimeout(minuteurBulle);
  choisirReponse(null);
  bullePdf.hidden = true;
  bulleMauvaise.hidden = true;
  dlLignes.forEach(function (ligne) { ligne.classList.remove("selection"); });
}

// Clic sur la boîte de téléchargement : anneau 0,8 s, puis coche, puis la fenêtre s'ouvre.
// Si le téléchargement est déjà fait, on rouvre simplement la fenêtre.
btnTelecharger.addEventListener("click", function () {
  const etat = rondDl.dataset.etat;
  if (etat === "charge") return;                // déjà en cours
  if (etat === "ok") {
    ouvrirFenetreDl();
    return;
  }
  rondDl.dataset.etat = "charge";
  minuteurDl = setTimeout(function () {
    rondDl.dataset.etat = "ok";
    ouvrirFenetreDl();
  }, 800);
});

dlFermer.addEventListener("click", fermerFenetreDl);

// Clic sur une ligne : elle devient sélectionnée.
// Le PDF de récupération affiche la bulle ; les 4 autres ont un message (attribut data-msg, voir plus haut).
dlLignes.forEach(function (ligne) {
  ligne.addEventListener("click", function () {
    dlLignes.forEach(function (autre) { autre.classList.toggle("selection", autre === ligne); });
    if (ligne.id === "dl-pdf") {
      bullePdf.hidden = true;
      void bullePdf.offsetWidth;                // rejoue l'animation d'apparition
      bullePdf.hidden = false;
    }
  });
});

// Prépare l'étape 6 (appelée par allerEtape) :
// actif = true → tout est remis à zéro ; actif = false → on est ailleurs, tout est fermé
function preparerEtape6(actif) {
  clearTimeout(minuteurDl);
  fermerFenetreDl();                            // fenêtre fermée, bulles masquées
  rondDl.dataset.etat = "initial";              // bouton de téléchargement : flèche
  if (actif) document.getElementById("vue-phrase").scrollTop = 0;
}

// =====================================================
//  ÉTAPE 7 : PAGE « RÉCUPÉRATION » COMPLÈTE
// =====================================================
// Dans la page elle-même, AUCUN élément ne mène à une autre étape : tout affiche un message humoristique.
// La suite passe par le navigateur : icône puzzle (barre d'adresse) > « Gérer les extensions » > étape 8.

// Prépare l'étape 7 (appelée par allerEtape à chaque arrivée) :
// l'adresse affichée suit le choix de l'étape 5, et la page remonte tout en haut.
// (La fenêtre Téléchargements et les bulles sont déjà fermées par preparerEtape6(false).)
function preparerEtape7() {
  majValeursRecuperation();
  document.querySelector('.c-contenu[data-sous="recuperation-complet"] .r-defile').scrollTop = 0;
}

// ---------- Bulle de dialogue, bouton puzzle « Extensions » et son panneau (étape 7) ----------
const bulleExtension = document.getElementById("bulle-extension");   // bulle « Je dois ajouter l'extension… »
const boutonExt = document.getElementById("btn-extensions");         // bouton puzzle (barre d'adresse)
const panneauExt = document.getElementById("ext-panneau");           // petit panneau déroulant
const boutonGerer = document.getElementById("btn-gerer-ext");        // son entrée « Gérer les extensions »
let minuteurBulleExt = null;                                         // minuteur : apparition de la bulle

// Le bouton puzzle est-il actif ? (seulement à l'étape 7)
function extensionsActives() {
  return boutonExt.getAttribute("aria-disabled") !== "true";
}

function panneauExtOuvert() {
  return !panneauExt.hidden;
}

function ouvrirPanneauExt() {
  panneauExt.hidden = false;
  boutonExt.setAttribute("aria-expanded", "true");
  boutonGerer.focus();                           // le clavier arrive sur l'entrée du panneau
}

// Ferme le panneau ; redonnerFocus = true → le focus retourne sur le bouton puzzle
function fermerPanneauExt(redonnerFocus) {
  panneauExt.hidden = true;
  boutonExt.setAttribute("aria-expanded", "false");
  if (redonnerFocus) boutonExt.focus();
}

// Clic sur le bouton puzzle : ouvre le panneau, ou le ferme au 2e clic (rien aux autres étapes)
boutonExt.addEventListener("click", function () {
  if (!extensionsActives()) return;
  if (panneauExtOuvert()) fermerPanneauExt(true);
  else ouvrirPanneauExt();
});

// « Gérer les extensions » : ferme le panneau puis passe à l'étape 8 (page provisoire)
boutonGerer.addEventListener("click", function () {
  fermerPanneauExt(true);
  allerEtape(8);
});

// Clic ailleurs : le panneau se ferme (le focus reste là où l'on a cliqué)
document.addEventListener("click", function (e) {
  if (panneauExtOuvert() && !e.target.closest(".ext-zone")) fermerPanneauExt(false);
});

// Touche Échap : le panneau se ferme et le focus revient sur le bouton puzzle
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && panneauExtOuvert()) fermerPanneauExt(true);
});

// Prépare l'étape 7 pour la bulle et le bouton puzzle (appelée par allerEtape à chaque changement d'étape) :
// actif = true → bouton actif, panneau fermé, la bulle apparaît 0,8 s plus tard (le trait du calepin a fini de se dessiner)
// actif = false → bouton décoratif, panneau et bulle cachés
function preparerExtensions(actif) {
  clearTimeout(minuteurBulleExt);
  bulleExtension.hidden = true;
  fermerPanneauExt(false);
  boutonExt.setAttribute("aria-disabled", String(!actif));
  if (actif) {
    boutonExt.removeAttribute("tabindex");
    // Comme à l'étape 4, la colonne de gauche réserve de la place en haut pour la bulle (utile sur les écrans courts)
    document.getElementById("etape-bureau").classList.add("avec-bulle");
    minuteurBulleExt = setTimeout(function () { bulleExtension.hidden = false; }, 800);
  } else {
    boutonExt.tabIndex = -1;                     // décoratif : pas de focus clavier
  }
}

// Si on modifie le # dans l'adresse, on change d'étape
window.addEventListener("hashchange", function () {
  allerEtape(etapeDepuisAdresse());
});

// TODO : contenu à définir (calepin et téléphone du bureau : décoratifs pour l'instant)

// ---------- DÉMARRAGE ----------
allerEtape(etapeDepuisAdresse());
