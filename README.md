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
<br>
GET http://localhost:3000/cities
<br>
GET http://localhost:3000/cities/21001
<br>
Routes manquante: le responsable (Jonathan) avait oublié la route d'ajout de ville:
<br>
POST http://localhost:3000/cities
<br>
PUT http://localhost:3000/cities/21001
<br>
DELETE http://localhost:3000/cities/21001
<br><br>
Météo:
<br>
POST http://localhost:3000/cities/21001/weather
<br>
GET http://localhost:3000/cities/21001/weather
<br>
GET http://localhost:3000/cities/21001/weather/1
<br>
GET http://localhost:3000/weather/1
<br>
GET http://localhost:3000/weather
<br>
DELETE http://localhost:3000/weather/1
<br><br><br>


Tout d'abord nous avons commencé par faire les différentes routes  afin d'avoir une base pour les routes (nous avons vu avec le responsable pour ajouter une route POST /cities).
Ensuite nous avons testé chaque route pour s'assurer de leur bon fonctionnement et corriger les erreurs pour celles qui en avaient.
Puis nous avons ajouté la gestion des codes d'erreurs pour chaque route. Par la suite nous avons fait le http file puis différents tests.
Pour finir nous avons ajouté les logs car il nous restait un peu de temps.
<br><br><br>


Jeu d'essai:
On liste les villes,
on ajoute une météo dans une ville,
la météo dominante de cette ville ressort,
on liste les météos afin de voir toutes les publications des météos.
<br><br>
Cas d'erreurs:
On ne peut pas ajouter une météo invalide, c'est à dire différente de "pluie", "beau", "neige" (400 bad request),
On ne peut pas afficher une ville qui n'existe pas (ex: zipCode inconnu),
On ne peut pas afficher une météo d'une ville si aucun bulletin n'est enregistré (/cities/21001/weather/100).
<br><br><br>


Exemples d'utilisations dans Postman:
<br><br>
POST:
<br>
http://localhost:3000/cities/00000
<br>
body:
<br>
{
<br>
"zipCode" : "00000",
<br>
"name" : "test"
<br>
}
<br><br>
GET:
<br>
http://localhost:3000/cities/00000
<br>
réponse:
<br>
{
<br>
"zipCode" : "00000",
<br>
"name" : "test"
<br>
}
<br><br>
PUT:
<br>
http://localhost:3000/cities/00000
<br>
body:
<br>
{
<br>
"zipCode" : "00001",
<br>
"name" : "test"
<br>
}
<br>
réponse:
<br>
{
<br>
"zipCode" : "00001",
<br>
"name" : "test"
<br>
}
<br><br>
DELETE:
<br>
http://localhost:3000/cities/00000
<br>
réponse:
<br>
{
<br>
"zipCode" : "00000",
<br>
"name" : "test"
<br>
}
