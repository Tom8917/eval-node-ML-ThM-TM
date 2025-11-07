Évaluation Node.js : Matthieu Luiggi, Thomas Michelin, Tom Martin.

Ce projet est une petite API en Node.js, Express et TypeScript, permettant de gérer la publication de météo dans différentes villes.
L’objectif est d'executer des routes REST simples (GET, POST, PUT, DELETE) pour les villes et leurs bulletins météo.

Le projet est accessible sur https://github.com/Tom8917/eval-node-ML-ThM-TM.

Pour initialiser le projet, il faut :

exécuter "npm install";
exécuter "npm run dev" (lance le serveur sur le http://localhost:3000);
exécuter "npm run test" (lance les tests);



Nos routes sont :

Villes :
GET http://localhost:3000/cities
GET http://localhost:3000/cities/21001

Routes manquante : le responsable (Jonathan) avait oublié la route d'ajout de ville:
POST http://localhost:3000/cities

PUT http://localhost:3000/cities/21001
DELETE http://localhost:3000/cities/21001

Météo :
POST http://localhost:3000/cities/21001/weather
GET http://localhost:3000/cities/21001/weather
GET http://localhost:3000/cities/21001/weather/1
GET http://localhost:3000/weather/1
GET http://localhost:3000/weather
DELETE http://localhost:3000/weather/1
