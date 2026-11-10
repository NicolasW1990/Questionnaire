// =====================================================
//  autotest.js : logique de la page autotest.html
//  - allerEtape(numero) affiche une étape et cache les autres
//  - chaque bouton de service affiche un message humoristique
//  - afficherVue(nom) change la page web dans le faux navigateur
//  - le bouton « Paramètres » ouvre l'étape 2 (page Compte)
//  - « Récupération » (menu) ouvre l'étape 3 (page Récupération)
//  - « Ajouter des méthodes de récupération » ouvre l'étape 4 (page Vérification)
//  - étape 4 : champ à saisie spéciale + calepin interactif ; « Vérifier » ouvre l'étape 5 (provisoire)
// =====================================================

// ---------- LE MOT DE PASSE (à changer ICI, à un seul endroit) ----------
// Il sert à la saisie automatique dans le champ ET au texte écrit dans le calepin.
const MOT_DE_PASSE = "L6a-gE?2urSsF2!";   // 15 caractères

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
  verification: { onglet: "SuiteSécurité – Vérification", adresse: "https://suite-securite.example/compte/recuperation/verification" }
};

// Vue actuellement affichée (« accueil », « compte » ou « recuperation »)
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
// étape 5 = carte provisoire. Chaque <section> déclare ses étapes dans data-etapes.
function allerEtape(numero) {
  etapes.forEach(function (section) {
    const siennes = section.dataset.etapes.split(" ");
    section.hidden = !siennes.includes(String(numero));
  });
  if (numero === 1) afficherVue("accueil");
  if (numero === 2) afficherVue("compte");
  if (numero === 3) afficherVue("recuperation");
  if (numero === 4) afficherVue("verification");
  cacherMessage();
  // Bulle, calepin et champ du mot de passe : actifs seulement à l'étape 4 (remis à zéro à chaque arrivée)
  preparerEtape4(numero === 4);
  // On garde l'étape dans l'adresse (#2 à #5), pour qu'un rechargement reste sur la même étape
  history.replaceState(null, "", numero === 1 ? location.pathname + location.search : "#" + numero);
}

// Lit l'adresse : « autotest.html#2 » à « #5 » ouvre cette étape, sinon étape 1
function etapeDepuisAdresse() {
  const numero = Number(location.hash.slice(1));
  return [2, 3, 4, 5].includes(numero) ? numero : 1;
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

// « Retour au bureau » (étape 5) : retour à l'étape 4 (la page Vérification, remise à zéro)
document.getElementById("btn-retour-bureau").addEventListener("click", function () {
  allerEtape(4);
});

// =====================================================
//  ÉTAPE 4 : CHAMP « MOT DE PASSE » SPÉCIAL + CALEPIN INTERACTIF
// =====================================================
const champ = document.getElementById("champ-mdp");          // le champ de saisie
const btnOeil = document.getElementById("btn-oeil");         // l'œil (afficher / masquer)
const btnVerifier = document.getElementById("btn-verifier"); // le bouton « Vérifier »
const calepin = document.getElementById("calepin");          // le calepin du bureau
const carnetFond = document.getElementById("carnet-fond");   // fond assombri + carnet ouvert
const carnetFermer = document.getElementById("carnet-fermer");
const bulleCalepin = document.getElementById("bulle-calepin");

// Nombre de lettres déjà « saisies » (0 à 15)
let nbSaisis = 0;

// On écrit le mot de passe dans le calepin (page 2) depuis la constante
document.getElementById("carnet-mdp").textContent = MOT_DE_PASSE;

// Le mot de passe est-il complet ?
function motDePasseComplet() {
  return nbSaisis === MOT_DE_PASSE.length;
}

// Met à jour le champ et le bouton « Vérifier » d'après nbSaisis
function majChamp() {
  champ.value = MOT_DE_PASSE.slice(0, nbSaisis);
  champ.setSelectionRange(nbSaisis, nbSaisis);               // le curseur reste à la fin
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
    if (motDePasseComplet()) allerEtape(5);
  } else if (e.key.length === 1) {              // touche imprimable (lettre, chiffre, symbole, espace)
    e.preventDefault();                         // la vraie touche n'écrit rien
    if (nbSaisis < MOT_DE_PASSE.length) nbSaisis++;
    majChamp();
  }
  // Les autres touches (Tab, F1…F12, Échap, flèches…) gardent leur comportement normal
});

// Aucune autre façon de remplir le champ : tout le reste est bloqué
["beforeinput", "paste", "cut", "copy", "drop", "dragstart"].forEach(function (nomEvenement) {
  champ.addEventListener(nomEvenement, function (e) { e.preventDefault(); });
});

// L'œil : bascule points / texte, sans changer le contenu (pas de message humoristique)
btnOeil.addEventListener("click", function () {
  const visible = champ.type === "password";
  champ.type = visible ? "text" : "password";
  btnOeil.setAttribute("aria-pressed", String(visible));
  btnOeil.setAttribute("aria-label", visible ? "Masquer le mot de passe" : "Afficher le mot de passe");
  champ.focus();
});

// « Vérifier » (actif seulement quand le mot de passe est complet) → étape 5
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
    champ.type = "password";        // points
    btnOeil.setAttribute("aria-pressed", "false");
    btnOeil.setAttribute("aria-label", "Afficher le mot de passe");
    majChamp();                     // champ vide, « Vérifier » grisé
    champ.focus();                  // focus automatique
  }
}

// Si on modifie le # dans l'adresse, on change d'étape
window.addEventListener("hashchange", function () {
  allerEtape(etapeDepuisAdresse());
});

// TODO : contenu à définir (calepin et téléphone du bureau : décoratifs pour l'instant)

// ---------- DÉMARRAGE ----------
allerEtape(etapeDepuisAdresse());
