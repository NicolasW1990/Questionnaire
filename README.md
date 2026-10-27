# Quiz : le gestionnaire de mots de passe

Quiz en ligne (HTML / CSS / JavaScript) : accueil avec prénom, 15 questions, une page de conséquence par réponse, puis un résultat avec correction détaillée. Les résultats sont envoyés par e-mail via [Web3Forms](https://web3forms.com).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page unique qui contient le quiz |
| `style.css` | Le design (à personnaliser) |
| `questions.js` | Les 15 questions, réponses et conséquences |
| `script.js` | La logique : pages, score, envoi du mail |
| `images/` | Les illustrations (voir ci-dessous) |

## Mise en place de l'e-mail

1. Sur https://web3forms.com, saisis l'adresse qui doit recevoir les résultats et récupère la clé d'accès.
2. Dans `script.js`, remplace `VOTRE_CLE_ACCES` par cette clé.

## Images (format paysage 16:9, 1280 × 720 px, WebP ou JPG, moins de 150 Ko)

- `accueil.webp` : page d'accueil
- `q01.webp` … `q15.webp` : une par question
- `q01-a.webp`, `q01-b.webp`, `q01-c.webp` … : une par réponse (conséquence)
- `fin.webp` : page de résultat

Tant qu'une image n'existe pas, un cadre gris « Image à venir » s'affiche à sa place. Si tu utilises du JPG, change `.webp` en `.jpg` dans la fonction `creerImage` de `script.js`.

## Réglages (en haut de `script.js`)

- `MELANGER_REPONSES` : mélange l'ordre A/B/C
- `MONTRER_VERDICT_DE_SUITE` : affiche ❌ / 😊 dès la page de conséquence

## Publier sur GitHub Pages

Dépôt GitHub > *Settings* > *Pages* > branche `main`, dossier `/ (root)` > *Save*.
