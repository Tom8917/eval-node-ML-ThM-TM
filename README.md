Évaluation Node.js: Matthieu Luiggi, Thomas Michelin, Tom Martin.

Ce projet est une petite API en Node.js, Express et TypeScript, permettant de gérer la publication de météo dans différentes villes.
L’objectif est d'executer des routes REST simples (GET, POST, PUT, DELETE) pour les villes et leurs bulletins météo.

Le projet est accessible sur https://github.com/Tom8917/eval-node-ML-ThM-TM.

Pour initialiser le projet, il faut:

exécuter "npm install";
exécuter "npm run dev" (lance le serveur sur le http://localhost:3000);
exécuter "npm run test" (lance les tests);



Nos routes sont:

Villes:
GET http://localhost:3000/cities
GET http://localhost:3000/cities/21001

Routes manquante: le responsable (Jonathan) avait oublié la route d'ajout de ville:
POST http://localhost:3000/cities

PUT http://localhost:3000/cities/21001
DELETE http://localhost:3000/cities/21001

Météo:
POST http://localhost:3000/cities/21001/weather
GET http://localhost:3000/cities/21001/weather
GET http://localhost:3000/cities/21001/weather/1
GET http://localhost:3000/weather/1
GET http://localhost:3000/weather
DELETE http://localhost:3000/weather/1



Tout d'abord nous avons commencé par faire les différentes routes  afin d'avoir une base pour les routes (nous avons vu avec le responsable pour ajouter une route POST /cities).
Ensuite nous avons testé chaque route pour s'assurer de leur bon fonctionnement et corriger les erreurs pour celles qui en avaient.
Puis nous avons ajouté la gestion des codes d'erreurs pour chaque route. Par la suite nous avons fait le http file puis différents tests.
Pour finir nous avons ajouté les logs car il nous restait un peu de temps.



Jeu d'essai:
On liste les villes,
on ajoute une météo dans une ville,
la météo dominante de cette ville ressort,
on liste les météos afin de voir toutes les publications des météos.

Cas d'erreurs:
On ne peut pas ajouter une météo invalide, c'est à dire différente de "pluie", "beau", "neige" (400 bad request),
On ne peut pas afficher une ville qui n'existe pas (ex: zipCode inconnu),
On ne peut pas afficher une météo d'une ville si aucun bulletin n'est enregistré (/cities/21001/weather/100).



Exemples d'utilisations dans Postman:

POST:
http://localhost:3000/cities/00000
body:
{
"zipCode" : "00000",
"name" : "test"
}

GET:
http://localhost:3000/cities/00000
réponse:
{
"zipCode" : "00000",
"name" : "test"
}

PUT:
http://localhost:3000/cities/00000
body:
{
"zipCode" : "00001",
"name" : "test"
}
réponse:
{
"zipCode" : "00001",
"name" : "test"
}

DELETE:
http://localhost:3000/cities/00000
réponse:
{
"zipCode" : "00000",
"name" : "test"
}