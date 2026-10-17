# Guitar Practice Cloud

## Réalisation

**Léo RODRIGUEZ — M1 MIAGE SIRIS, année 2026-2027**

## Présentation

Guitar Practice Cloud est une application web qui permet de gérer et d’écouter
des pistes audio pour accompagner le travail musical. Un utilisateur peut créer
un compte, se connecter, modifier son profil et gérer sa bibliothèque de
morceaux : importer des fichiers audio, les renommer, les écouter ou les
supprimer.

Le lecteur propose les commandes de lecture, une playlist et plusieurs
visualisations audio, notamment le spectre fréquentiel, l’oscilloscope et les
figures de Chladni. Les préférences de visualisation sont enregistrées avec le
profil.

## Architecture de l’application

L’application se compose d’un frontend Angular et d’un backend Node.js /
Express, reliés par une API REST :

```text
Navigateur
└── frontend-starter/ — Angular
    ├── pages : connexion, inscription, profil et bibliothèque audio
    ├── services : authentification, pistes et lecteur
    └── garde de routes et intercepteur JWT
             │ requêtes HTTP /api
             ▼
backend/ — Node.js et Express
    ├── API REST, authentification JWT et validation des requêtes
    ├── modèles Mongoose : utilisateurs et pistes
    └── fichiers audio dans data/uploads/
             │ métadonnées
             ▼
         MongoDB Atlas
```

MongoDB Atlas conserve les utilisateurs et les métadonnées des pistes. Les
fichiers audio sont stockés sur le disque du backend. En développement, Angular
est servi sur `http://localhost:4200` et transmet les requêtes `/api` au
backend, qui écoute sur `http://localhost:3000`.

## Retrouver et lancer l’application

Le code source est hébergé sur GitHub :
[ilyzaelle/AngularM1_Miage_2026_2027_TP123](https://github.com/ilyzaelle/AngularM1_Miage_2026_2027_TP123).
Pour récupérer le dépôt :

```bash
git clone https://github.com/ilyzaelle/AngularM1_Miage_2026_2027_TP123.git
cd AngularM1_Miage_2026_2027_TP123
```

Il faut Node.js 22 ou une version plus récente, ainsi qu’une base MongoDB Atlas.
Suivre [ATLAS_SETUP.md](ATLAS_SETUP.md) pour configurer cette base.

Configurer puis démarrer le backend :

```bash
cd backend
cp .env.example .env
```

Renseigner l’URI MongoDB Atlas et un secret JWT dans `backend/.env`, puis :

```bash
npm install
npm start
```

Dans un autre terminal, démarrer le frontend :

```bash
cd frontend-starter
npm install
npm start
```

Ouvrir ensuite [http://localhost:4200](http://localhost:4200) dans un
navigateur. Ne pas publier le fichier `.env` ni ses secrets.
