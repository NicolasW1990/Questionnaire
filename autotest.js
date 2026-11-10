// =====================================================
//  autotest.js : logique de la page autotest.html
//  - allerEtape(numero) affiche une étape et cache les autres
//  - chaque bouton de service affiche un message humoristique
//  - le bouton « Paramètres » ouvre l'étape 2
// =====================================================

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
  ]
};

// ---------- ÉLÉMENTS DE LA PAGE ----------
const etapes = document.querySelectorAll(".etape");   // les <section> des étapes
const toast = document.getElementById("toast");       // la bulle de message

// Mémoire : dernier message affiché pour chaque service (pour ne pas le répéter)
const dernierMessage = {};
// Minuteur qui fait disparaître la bulle après 3 secondes
let minuteur = null;

// ---------- CHANGER D'ÉTAPE ----------
// Affiche l'étape demandée (1 ou 2) et cache les autres
function allerEtape(numero) {
  etapes.forEach(function (section) {
    section.hidden = Number(section.dataset.etape) !== numero;
  });
  cacherMessage();
  // On garde l'étape dans l'adresse (#2), pour qu'un rechargement reste sur la même étape
  history.replaceState(null, "", numero === 2 ? "#2" : location.pathname + location.search);
}

// Lit l'adresse : « autotest.html#2 » ouvre l'étape 2, sinon étape 1
function etapeDepuisAdresse() {
  return location.hash === "#2" ? 2 : 1;
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
// Les 10 services : chacun affiche un message
document.querySelectorAll(".service").forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    afficherMessage(choisirMessage(bouton.dataset.service));
  });
});

// Un clic ailleurs sur la page fait disparaître la bulle
// (sauf si on clique sur un service : lui il affiche un nouveau message)
document.addEventListener("click", function (e) {
  if (!e.target.closest(".service")) cacherMessage();
});

// « Paramètres » : le seul bouton sans message, il ouvre l'étape 2
document.getElementById("btn-parametres").addEventListener("click", function () {
  allerEtape(2);
});

// « Retour au bureau » (étape 2) : retour à l'étape 1
document.getElementById("btn-retour-bureau").addEventListener("click", function () {
  allerEtape(1);
});

// Si on modifie le # dans l'adresse, on change d'étape
window.addEventListener("hashchange", function () {
  allerEtape(etapeDepuisAdresse());
});

// TODO : contenu à définir (calepin et téléphone du bureau : décoratifs pour l'instant)

// ---------- DÉMARRAGE ----------
allerEtape(etapeDepuisAdresse());
