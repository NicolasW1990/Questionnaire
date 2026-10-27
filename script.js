// =====================================================
//  Quiz : accueil -> question -> conséquence -> ... -> résultat
//  Les questions sont dans questions.js (variable QUESTIONS)
// =====================================================

// ---------- RÉGLAGES (tu peux les modifier) ----------

// Ta clé Web3Forms (à obtenir sur https://web3forms.com avec l'adresse qui doit recevoir les résultats)
const CLE_WEB3FORMS = "VOTRE_CLE_ACCES";

// true  = on mélange l'ordre des réponses A/B/C à chaque question
// false = on garde l'ordre du fichier questions.js
const MELANGER_REPONSES = false;

// true  = on affiche ❌ / 😊 dès la page de conséquence
// false = on les cache jusqu'à la page de résultat final
const MONTRER_VERDICT_DE_SUITE = false;

// ---------- ÉTAT DU QUIZ ----------
const app = document.getElementById("app");
let prenom = "";         // le prénom saisi à l'accueil
let numero = 0;          // numéro de la question en cours (0 = première)
let choix = [];          // choix[i] = la réponse choisie à la question i
let ordre = [];          // ordre[i] = les réponses de la question i, dans l'ordre affiché
let mailEnvoye = false;  // pour ne pas envoyer le mail deux fois

// ---------- PETITES FONCTIONS UTILES ----------

// Crée un élément HTML : el("p", "ma-classe", "Mon texte")
// On utilise textContent (et pas innerHTML) : plus sûr si quelqu'un tape du HTML dans son nom.
function el(balise, classe, texte) {
  const e = document.createElement(balise);
  if (classe) e.className = classe;
  if (texte !== undefined) e.textContent = texte;
  return e;
}

// Crée la zone d'image paysage. Si le fichier n'existe pas, un texte « Image à venir » s'affiche.
function creerImage(nomFichier, texteAlt) {
  const cadre = el("div", "image-cadre");
  const img = document.createElement("img");
  img.src = "images/" + nomFichier + ".webp";
  img.alt = texteAlt;
  img.addEventListener("error", function () {
    cadre.textContent = "";
    cadre.appendChild(el("span", "image-vide", "Image à venir : images/" + nomFichier + ".webp (1280 × 720 px)"));
  });
  cadre.appendChild(img);
  return cadre;
}

// Mélange un tableau (algorithme de Fisher-Yates)
function melanger(tableau) {
  const copie = tableau.slice();
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

// Vide la page et remonte en haut
function nouvellePage() {
  app.textContent = "";
  window.scrollTo(0, 0);
}

function bonneReponse(question) {
  return question.reponses.find(function (r) { return r.correcte; });
}

function calculerScore() {
  let score = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    if (choix[i] && choix[i].correcte) score++;
  }
  return score;
}

// ---------- PAGE 1 : ACCUEIL ----------
function pageAccueil() {
  nouvellePage();
  app.appendChild(creerImage("accueil", "Image d'accueil du quiz"));
  app.appendChild(el("h1", "", "Quiz : le gestionnaire de mots de passe"));
  app.appendChild(el("p", "", "15 situations, 3 réponses possibles à chaque fois. Inscris ton prénom pour commencer : il sera envoyé avec tes résultats à la fin."));

  const label = el("label", "", "Ton prénom *");
  label.setAttribute("for", "champ-prenom");
  const champ = document.createElement("input");
  champ.type = "text";
  champ.id = "champ-prenom";
  champ.autocomplete = "given-name";
  const erreur = el("p", "erreur-champ");

  const bouton = el("button", "bouton", "Commencer");
  bouton.type = "button";

  function demarrer() {
    if (champ.value.trim() === "") {
      erreur.textContent = "Merci d'écrire ton prénom pour continuer.";
      champ.focus();
      return;
    }
    prenom = champ.value.trim();
    numero = 0;
    choix = [];
    ordre = QUESTIONS.map(function (q) {
      return MELANGER_REPONSES ? melanger(q.reponses) : q.reponses.slice();
    });
    mailEnvoye = false;
    pageQuestion();
  }

  bouton.addEventListener("click", demarrer);
  champ.addEventListener("keydown", function (e) { if (e.key === "Enter") demarrer(); });

  app.append(label, champ, erreur, bouton);
  champ.focus();
}

// ---------- PAGES 2 : UNE QUESTION ----------
function pageQuestion() {
  nouvellePage();
  const q = QUESTIONS[numero];

  app.appendChild(creerImage(q.id, "Illustration de la question " + (numero + 1)));
  app.appendChild(el("p", "progression", "Question " + (numero + 1) + " sur " + QUESTIONS.length));
  app.appendChild(el("h2", "", q.texte));

  const liste = el("div", "reponses");
  const lettres = ["A", "B", "C"];
  ordre[numero].forEach(function (reponse, position) {
    const bouton = el("button", "reponse", lettres[position] + ". " + reponse.texte);
    bouton.type = "button";
    bouton.addEventListener("click", function () {
      choix[numero] = reponse;   // on mémorise le choix
      pageConsequence();
    });
    liste.appendChild(bouton);
  });
  app.appendChild(liste);
}

// ---------- PAGES 3 : LA CONSÉQUENCE DE LA RÉPONSE CHOISIE ----------
function pageConsequence() {
  nouvellePage();
  const q = QUESTIONS[numero];
  const reponse = choix[numero];

  // Image propre à la réponse choisie : q01-a, q01-b ou q01-c
  app.appendChild(creerImage(q.id + "-" + reponse.id, "Illustration de la conséquence"));
  app.appendChild(el("p", "progression", "Question " + (numero + 1) + " sur " + QUESTIONS.length));
  app.appendChild(el("p", "rappel", "Ta réponse : " + reponse.texte));

  let texte = reponse.consequence;
  if (MONTRER_VERDICT_DE_SUITE) {
    texte = (reponse.correcte ? "😊 " : "❌ ") + texte;
  }
  app.appendChild(el("p", "consequence", texte));

  const dernier = numero === QUESTIONS.length - 1;
  const bouton = el("button", "bouton", dernier ? "Voir mon résultat" : "Continuer");
  bouton.type = "button";
  bouton.addEventListener("click", function () {
    if (dernier) {
      pageResultat();
    } else {
      numero++;
      pageQuestion();
    }
  });
  app.appendChild(bouton);
}

// Message d'encouragement affiché sous le score, selon le nombre de bonnes réponses
function messageSelonScore(score) {
  if (score <= 5) {
    return "Ne te décourage pas, chaque erreur est une occasion d'apprendre !";
  }
  if (score <= 10) {
    return "C'est un début, mais il reste du travail pour progresser. Concentre-toi sur les points que tu as manqués.";
  }
  if (score <= 14) {
    return "Quelques révisions sur les derniers détails et tu seras au top.";
  }
  return "Félicitations, tu as toutes les bonnes réponses ! Tu maîtrises parfaitement le sujet.";
}

// ---------- PAGE FINALE : SCORE + CORRECTION + ENVOI PAR MAIL ----------
function pageResultat() {
  nouvellePage();
  const score = calculerScore();

  app.appendChild(creerImage("fin", "Image de fin du quiz"));
  app.appendChild(el("h1", "", messageSelonScore(score)));
  app.appendChild(el("p", "score", score + " / " + QUESTIONS.length));

  // Message sur l'envoi du mail (rempli plus bas)
  const statut = el("p", "statut");
  app.appendChild(statut);
  const boutonRetry = el("button", "bouton", "Réessayer l'envoi");
  boutonRetry.type = "button";
  boutonRetry.hidden = true;
  app.appendChild(boutonRetry);

  // Correction détaillée : pour chaque question, seulement la réponse choisie + son explication
  const bilan = el("div", "bilan");
  bilan.appendChild(el("h2", "", "La correction"));

  QUESTIONS.forEach(function (q, i) {
    const reponse = choix[i];   // la réponse que la personne a choisie
    bilan.appendChild(el("h3", "", (i + 1) + ". " + q.texte));

    const bloc = el("div", "bilan-reponse " + (reponse.correcte ? "bonne" : "mauvaise"));
    // D'abord le verdict, puis le texte de la réponse choisie
    bloc.appendChild(el("strong", "", reponse.correcte ? "✅ Juste" : "❌ Faux"));
    bloc.appendChild(el("p", "", reponse.texte));
    // Puis l'explication (clé du type "q03-b" dans explications.js)
    bloc.appendChild(el("small", "", EXPLICATIONS[q.id + "-" + reponse.id]));
    bilan.appendChild(bloc);
  });
  app.appendChild(bilan);

  // Bouton pour recommencer
  const recommencer = el("button", "bouton", "Recommencer le quiz");
  recommencer.type = "button";
  recommencer.addEventListener("click", pageAccueil);
  app.appendChild(recommencer);

  // Envoi automatique du mail (une seule fois)
  function envoyer() {
    boutonRetry.hidden = true;
    envoyerMail(statut).then(function (ok) {
      boutonRetry.hidden = ok;
    });
  }
  boutonRetry.addEventListener("click", envoyer);
  if (!mailEnvoye) envoyer();
}

// ---------- ENVOI DU MAIL VIA WEB3FORMS ----------
function construireMessage(score) {
  const lettres = ["A", "B", "C"];
  const lignes = [];
  lignes.push("Prénom : " + prenom);
  lignes.push("Score : " + score + " / " + QUESTIONS.length);
  lignes.push("");
  QUESTIONS.forEach(function (q, i) {
    const bonne = bonneReponse(q);
    const c = choix[i];
    lignes.push("Question " + (i + 1) + " : " + (c.correcte ? "JUSTE" : "FAUX"));
    lignes.push("  " + q.texte);
    lignes.push("  Réponse choisie : " + c.texte);
    if (!c.correcte) lignes.push("  Bonne réponse : " + bonne.texte);
    lignes.push("");
  });
  return lignes.join("\n");
}

async function envoyerMail(statut) {
  statut.className = "statut";
  statut.textContent = "Envoi de tes résultats par e-mail…";

  if (CLE_WEB3FORMS === "VOTRE_CLE_ACCES") {
    statut.className = "statut erreur";
    statut.textContent = "Envoi impossible : la clé Web3Forms n'est pas encore configurée dans script.js.";
    return false;
  }

  const score = calculerScore();
  try {
    const reponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: CLE_WEB3FORMS,
        subject: "Quiz mots de passe : " + prenom + " (" + score + "/" + QUESTIONS.length + ")",
        from_name: "Quiz en ligne",
        Prénom: prenom,
        Score: score + " / " + QUESTIONS.length,
        message: construireMessage(score)
      })
    });
    const resultat = await reponse.json();
    if (resultat.success) {
      mailEnvoye = true;
      statut.className = "statut ok";
      statut.textContent = "Tes résultats ont bien été envoyés par e-mail.";
      return true;
    }
    statut.className = "statut erreur";
    statut.textContent = "Erreur d'envoi : " + resultat.message;
    return false;
  } catch (erreur) {
    statut.className = "statut erreur";
    statut.textContent = "Impossible d'envoyer : vérifie ta connexion puis réessaie.";
    return false;
  }
}

// ---------- DÉMARRAGE ----------
pageAccueil();
