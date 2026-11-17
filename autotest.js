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
//  - étape 6 : téléchargement du PDF → fenêtre « Téléchargements » + bulles de dialogue ; la bonne réponse (réponse 2) ouvre l'étape 7 (provisoire)
// =====================================================

// ---------- LE MOT DE PASSE (à changer ICI, à un seul endroit) ----------
// Il sert à la saisie automatique dans le champ ET au texte écrit dans le calepin.
const MOT_DE_PASSE = "L6a-gE?2urSsF2!";   // 15 caractères

// ---------- L'ADRESSE DE RÉCUPÉRATION (à changer ICI, à un seul endroit) ----------
const ADRESSE_PRIVEE = "lebgdeneuch@jedi.ch";          // choix 1 : adresse privée déjà existante
const ADRESSE_RECUP = "recup.adresse@jedi.ch";         // choix 2 : nouvelle adresse (écrite aussi dans le calepin)
const MOT_DE_PASSE_RECUP = "R3cup!Jedi-47xQ";          // mot de passe de l'adresse de récupération (valeur provisoire, à remplacer par la valeur voulue)

// ---------- LES NOTES DU CALEPIN (page 1, à changer ICI) ----------
// Une ligne par tâche. Le titre « À faire : » est ajouté par le code (voir remplirNotes plus bas).
// Le petit tiret devant chaque tâche est ajouté par le CSS.
const NOTES_CALEPIN = [
  "Sécuriser mon compte en configurant la récupération",
  "Ajouter l'extension SuiteSécurité",
  "Migrer mes mdp sur SuiteSécurité"
];

// ---------- LES RÉPONSES DU PERSONNAGE (étape 6, bulle de dialogue) ----------
// Chaque réponse a un texte et une « action » :
//  - "suivant"       : la BONNE réponse : passe à l'étape 7
//  - "mauvaise-idee" : affiche la 2e bulle « Non, c'est une mauvaise idée... »
// Ici, la bonne réponse est la réponse 2 (le dossier « récup »).
// Pour échanger les réponses, il suffit d'échanger les deux actions.
const REPONSES_PDF = [
  { texte: "Je le laisse ici et ça ira", action: "mauvaise-idee" },
  { texte: "Je le stocke dans un dossier Windows nommé « récup » que j'ai fait juste avant", action: "suivant" }
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
  phrase: { onglet: "SuiteSécurité – Phrase de récupération", adresse: "https://suite-securite.example/compte/recuperation/phrase" }
};

// Vue actuellement affichée (« accueil », « compte », « recuperation », « verification », « email » ou « phrase »)
let vueCourante = "accueil";

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
// « Récupération » sur la page récupération
function marquerMenu(nom) {
  document.querySelectorAll(".c-entree").forEach(function (entree) {
    entree.classList.toggle("actif", entree.dataset.vueMenu === nom);
  });
}

// ---------- CHANGER D'ÉTAPE ----------
// Étape 1 = bureau + vue « accueil » ; étape 2 = le MÊME bureau + vue « compte » ;
// étape 3 = le MÊME bureau + vue « recuperation » ; étape 4 = le MÊME bureau + vue « verification » ;
// étape 5 = le MÊME bureau + vue « email » ; étape 6 = le MÊME bureau + vue « phrase » ; étape 7 = carte provisoire. Chaque <section> déclare ses étapes dans data-etapes.
function allerEtape(numero) {
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
  cacherMessage();
  // Bulle, calepin et champ du mot de passe : actifs seulement à l'étape 4 (remis à zéro à chaque arrivée)
  preparerEtape4(numero === 4);
  // Choix de l'adresse : remis à zéro à chaque arrivée sur l'étape 5
  if (numero === 5) preparerEtape5();
  // Fenêtre Téléchargements, bulles et bouton de téléchargement : actifs seulement à l'étape 6 (remis à zéro à chaque arrivée)
  preparerEtape6(numero === 6);
  // On garde l'étape dans l'adresse (#2 à #7), pour qu'un rechargement reste sur la même étape
  history.replaceState(null, "", numero === 1 ? location.pathname + location.search : "#" + numero);
}

// Lit l'adresse : « autotest.html#2 » à « #7 » ouvre cette étape, sinon étape 1
function etapeDepuisAdresse() {
  const numero = Number(location.hash.slice(1));
  return [2, 3, 4, 5, 6, 7].includes(numero) ? numero : 1;
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
  if (!e.target.closest(ELEMENTS_A_MESSAGE + ", #btn-recuperation")) cacherMessage();
});

// « Paramètres » (page des services) : le seul bouton sans message, il ouvre l'étape 2
document.getElementById("btn-parametres").addEventListener("click", function () {
  allerEtape(2);
});

// « Récupération » (menu de gauche) :
//  - depuis la page Compte, ouvre la page Récupération (étape 3)
//  - depuis la page Récupération (déjà sélectionnée), affiche un message
document.getElementById("btn-recuperation").addEventListener("click", function () {
  if (vueCourante === "recuperation") {
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

// « Retour au bureau » (étape 7) : retour à l'étape 6 (la page phrase, remise à zéro)
document.getElementById("btn-retour-bureau").addEventListener("click", function () {
  allerEtape(6);
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
function remplirNotes(conteneur) {
  const titre = document.createElement("span");
  titre.className = "notes-titre";
  titre.textContent = "À faire :";
  conteneur.appendChild(titre);
  NOTES_CALEPIN.forEach(function (texte) {
    const ligne = document.createElement("span");
    ligne.className = "notes-ligne";
    ligne.textContent = texte;
    conteneur.appendChild(ligne);
  });
}
remplirNotes(document.getElementById("calepin-notes"));
remplirNotes(document.getElementById("carnet-notes"));

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

// Minuteurs : fin de l'animation du bouton rond, et disparition de la 2e bulle
let minuteurDl = null;
let minuteurBulle = null;

// Ce que fait chaque « action » des réponses (voir REPONSES_PDF)
const ACTIONS_REPONSE = {
  "suivant": function () { allerEtape(7); },
  "mauvaise-idee": function () { afficherMauvaiseIdee(); }
};

// On crée les boutons de réponse à partir du tableau REPONSES_PDF
REPONSES_PDF.forEach(function (reponse) {
  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.className = "bulle-reponse";
  bouton.textContent = reponse.texte;
  bouton.addEventListener("click", function () {
    ACTIONS_REPONSE[reponse.action]();
  });
  bulleReponses.appendChild(bouton);
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

// Ferme la fenêtre ET les bulles
function fermerFenetreDl() {
  dlFond.hidden = true;
  dlFenetre.hidden = true;
  tacheDl.hidden = true;
  clearTimeout(minuteurBulle);
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

// Si on modifie le # dans l'adresse, on change d'étape
window.addEventListener("hashchange", function () {
  allerEtape(etapeDepuisAdresse());
});

// TODO : contenu à définir (calepin et téléphone du bureau : décoratifs pour l'instant)

// ---------- DÉMARRAGE ----------
allerEtape(etapeDepuisAdresse());
