// Explications affichées uniquement sur la page de correction finale.
// Clé = identifiant de la question + "-" + identifiant de la réponse (ex. "q03-b" = question q03, réponse b).
const EXPLICATIONS = {
  "q01-a": "Le gestionnaire ne remplit les identifiants que sur le site dont l'adresse correspond exactement à celle enregistrée. S'il ne propose rien, c'est un signal d'alerte : l'adresse est différente et la page est probablement une copie frauduleuse. Taper ses identifiants à la main revient à les donner directement aux pirates.",
  "q01-b": "Le gestionnaire sert aussi de détecteur d'hameçonnage : il ne reconnaît pas le faux site, car l'adresse n'est pas la bonne, même si la page ressemble à l'original. Le bon réflexe est de ne pas cliquer et d'aller soi-même sur le site officiel, en tapant l'adresse ou via un favori.",
  "q01-c": "Transférer un e-mail frauduleux à toute l'équipe multiplie les occasions de cliquer sur le lien piégé. Il faut au contraire le signaler au service informatique ou au responsable, puis le supprimer, sans le faire circuler.",

  "q02-a": "Un mot de passe affiché sur l'écran est visible par tous les visiteurs et peut être photographié en quelques secondes. Le laisser en évidence annule toute la protection du poste.",
  "q02-b": "Cacher un post-it sous le clavier ne le protège pas : c'est le premier endroit où l'on regarde, et le personnel de nettoyage ou un collègue peut le retrouver. Un mot de passe écrit sur papier reste un mot de passe exposé.",
  "q02-c": "Le gestionnaire garde le mot de passe chiffré dans le coffre et le retrouve en un clic, donc plus rien n'a besoin d'être noté sur papier. Comme ce mot de passe a été visible, il est prudent de le changer une fois le post-it retiré.",

  "q03-a": "Un gestionnaire dédié chiffre le coffre avec un mot de passe principal et offre des fonctions en plus, comme l'audit de sécurité, les alias et la double authentification. Les mots de passe enregistrés dans un navigateur sont une cible fréquente des logiciels voleurs d'identifiants. Désactiver l'enregistrement de Chrome évite de laisser une copie exposée.",
  "q03-b": "Multiplier les endroits où les mots de passe sont enregistrés multiplie les endroits où ils peuvent être volés. Le navigateur reste une cible facile pour les logiciels voleurs d'identifiants. Il vaut mieux une seule source, le gestionnaire, et vider celle de Chrome.",
  "q03-c": "Le fait que Chrome soit fabriqué par une grande entreprise ne le rend pas plus sûr pour cet usage. Les mots de passe d'un navigateur sont une cible principale des logiciels voleurs d'identifiants, alors qu'un gestionnaire dédié est conçu pour protéger un coffre chiffré et offre des fonctions de sécurité supplémentaires.",

  "q04-a": "Attendre laisse le temps aux attaquants. Après une fuite, les mots de passe volés sont testés automatiquement sur d'autres services, parfois dans les heures qui suivent. Il faut agir tout de suite.",
  "q04-b": "Changer seulement le mot de passe du site piraté laisse intacts les autres comptes qui utilisent le même. Le mot de passe volé fonctionne encore sur la messagerie, qui est la porte vers beaucoup d'autres comptes.",
  "q04-c": "Un mot de passe qui a fuité doit être considéré comme connu des attaquants, partout où il sert. Commencer par la messagerie est logique : elle permet de réinitialiser les autres comptes. Avec un mot de passe unique par service, une fuite reste limitée à un seul site.",

  "q05-a": "Une phrase de passe de plusieurs mots choisis au hasard est longue, difficile à deviner et facile à retenir. Elle protège tout le coffre, donc le mot de passe principal doit être le plus solide possible. Les mots ne doivent avoir aucun lien entre eux ni avec la vie privée.",
  "q05-b": "Le prénom d'un enfant et une date de naissance se trouvent facilement sur les réseaux sociaux ou dans l'entourage. Les attaquants testent ce type de combinaison en premier. Facile à retenir veut aussi dire facile à deviner, et le « ! » n'y change presque rien.",
  "q05-c": "Ajouter un chiffre ne rend pas un mot de passe imprévisible : les attaquants testent justement ces variantes courantes. Le fond reste le même, une information personnelle devinable.",

  "q06-a": "Attendre laisse à quelqu'un l'occasion d'essayer d'accéder aux comptes avec le téléphone. Il faut réagir tout de suite, sans compter sur le fait de le retrouver.",
  "q06-b": "Verrouiller l'accès et fermer les sessions limite le risque immédiat, et changer les mots de passe importants réduit les dégâts possibles. Les codes de secours permettent de récupérer l'accès sans le téléphone, à condition de les avoir rangés à l'avance dans un endroit sûr.",
  "q06-c": "Un nouveau téléphone ne contient pas les codes TOTP si l'application n'a pas été sauvegardée. Sans codes de secours, la personne reste bloquée hors de ses comptes. Rien ne revient automatiquement.",

  "q07-a": "Commencer par le forum de voile protège un compte peu important et laisse l'e-mail pro et l'e-banking avec leurs anciens mots de passe. Il faut commencer par les comptes qui causeraient le plus de dégâts s'ils étaient piratés.",
  "q07-b": "L'e-mail et l'e-banking sont les comptes les plus critiques : l'e-mail permet de réinitialiser les autres mots de passe, et l'e-banking touche à l'argent. Les protéger d'abord réduit tout de suite le plus gros risque. Les comptes moins sensibles viennent ensuite.",
  "q07-c": "L'ordre alphabétique ne tient pas compte de l'importance des comptes. Les comptes sensibles peuvent rester exposés des semaines pendant que l'on protège des comptes sans enjeu. On classe par risque, pas par ordre alphabétique.",

  "q08-a": "La taille du site ne compte pas : un compte où une carte bancaire est enregistrée donne accès à de l'argent. Un petit site est souvent moins bien protégé, donc plus facile à pirater.",
  "q08-b": "Un compte avec une carte enregistrée permet des achats frauduleux, il est donc important. Un mot de passe unique et la double authentification bloquent la plupart des tentatives de connexion suspectes.",
  "q08-c": "Abandonner le gestionnaire fait revenir aux anciennes habitudes, comme réutiliser un mot de passe faible. C'est justement dans ce cas que le gestionnaire est le plus utile, puisqu'il génère et retient un mot de passe unique pour chaque site.",

  "q09-a": "Importer les mots de passe ne les rend pas plus solides : les anciens, faibles ou réutilisés, restent vulnérables. L'import n'est que le point de départ. L'audit de sécurité sert justement à repérer ceux qu'il faut remplacer.",
  "q09-b": "Garder le fichier Excel laisse tous les mots de passe en clair sur le poste, accessibles à un collègue, à un virus ou à un voleur. Une fois les mots de passe importés, il faut supprimer ce fichier, corbeille comprise.",
  "q09-c": "Remplacer peu à peu les anciens mots de passe par des mots de passe générés, longs et uniques, est réaliste et efficace. Commencer par les comptes importants réduit le risque en premier. L'audit de sécurité permet de suivre les progrès.",

  "q10-a": "Verrouiller le coffre et la session empêche toute personne qui passe sur le poste d'accéder aux mots de passe pendant l'absence. Sur un poste partagé, c'est un réflexe à avoir à chaque fois, même pour quelques minutes.",
  "q10-b": "Dix minutes suffisent pour qu'un collègue ouvre le coffre et consulte des comptes sensibles, ici des données RH. Une absence courte n'est pas une excuse : il suffit d'un instant.",
  "q10-c": "Éteindre l'écran ne verrouille rien : la session et le coffre restent ouverts derrière l'écran noir. Il suffit de le rallumer pour avoir accès à tout. Il faut verrouiller la session, pas seulement l'écran.",

  "q11-a": "Répondre ou cliquer sur « se désinscrire » dans un spam confirme que l'adresse est active et lue, ce qui attire encore plus de messages. Il vaut mieux ne pas répondre et signaler le message comme indésirable.",
  "q11-b": "Un alias est une adresse de redirection qui masque la vraie adresse. Si elle reçoit du spam ou si le site est piraté, on la désactive en un clic sans toucher à son adresse principale. Un alias par inscription limite aussi le suivi entre les sites.",
  "q11-c": "Changer de travail ne résout rien : le problème reviendra à la prochaine inscription avec une adresse réelle. La solution est de protéger l'adresse avec un alias, pas d'en changer.",

  "q12-a": "Envoyer des mots de passe par e-mail les laisse stockés dans les boîtes de messagerie, lisibles par quiconque y accède, bien après le départ. Les mots de passe ne doivent jamais circuler par e-mail.",
  "q12-b": "Un mot de passe bien choisi ne se devine pas, et c'est tant mieux. Sans lui, les accès sont perdus et l'activité peut être bloquée, ici le paiement des fournisseurs.",
  "q12-c": "Prévoir un administrateur de secours et une procédure de récupération garantit que l'entreprise ne dépend pas d'une seule personne. Les accès peuvent être repris proprement, par exemple avec un coffre partagé. Après le départ, il faut aussi changer les mots de passe que la personne connaissait.",

  "q13-a": "Un export en clair contient tous les mots de passe lisibles par n'importe qui, ou n'importe quel logiciel, qui accède au dossier. Il faut le supprimer tout de suite, corbeille comprise. Si une sauvegarde est nécessaire, un export chiffré rangé en lieu sûr protège les données.",
  "q13-b": "Renommer un fichier ne le cache pas : son contenu reste lisible, et un logiciel malveillant le repère par son contenu ou son type, pas par son nom.",
  "q13-c": "Un export en clair n'est pas une sauvegarde sûre : si le poste est volé ou infecté, tous les mots de passe sont lisibles sans aucune protection. Une sauvegarde doit être chiffrée.",

  "q14-a": "Le gestionnaire est conçu pour que le fournisseur ne connaisse pas le mot de passe principal : les données sont chiffrées avec lui. Le support ne peut donc pas le retrouver, et compter sur lui fait perdre du temps.",
  "q14-b": "Comme le support ne connaît pas le mot de passe, la récupération repose sur la clé ou le kit de récupération, à préparer et à ranger à l'avance dans un endroit sûr. Avec lui, l'accès au coffre est rétabli en quelques minutes.",
  "q14-c": "Essayer des combinaisons au hasard peut bloquer temporairement le compte, et taper le mot de passe de son e-mail devant témoin l'expose. Il ne faut pas tester à l'aveugle : on utilise la clé de récupération.",

  "q15-a": "Le SMS est l'un des moyens de double authentification les moins sûrs : un attaquant peut détourner le numéro (SIM swapping) et recevoir les codes. Mieux vaut une application TOTP ou une clé de sécurité.",
  "q15-b": "Un mot de passe seul peut fuiter lors d'un hameçonnage ou d'une fuite de données. Sans seconde preuve d'identité, l'attaquant entre directement. La double authentification ajoute un obstacle même quand le mot de passe est connu.",
  "q15-c": "Une application TOTP génère des codes sur l'appareil, et une clé de sécurité physique résiste encore mieux à l'hameçonnage. Ces deux méthodes ne dépendent pas du réseau téléphonique, contrairement au SMS qui peut être détourné. Même si le mot de passe fuite, le compte reste protégé."
};
