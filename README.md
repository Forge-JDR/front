# Forge JDR — application web

Le MVP de la branche `reprise` permet de gérer ses JDR personnalisés, modèles de fiche, parties, personnages et journal de campagne depuis l'atelier accessible après connexion.

## Lancer en développement

Prérequis : Node.js 22 ou 24 et npm. Démarrer d'abord l'API avec le README du dépôt [back](https://github.com/Forge-JDR/back/tree/reprise).

```sh
npm ci
# Créer .env.local depuis .env.example si ce fichier n'existe pas encore.
test -e .env.local || cp .env.example .env.local
npm start
```

Ouvrir `http://localhost:3000`, créer un compte, puis créer un JDR avec ses champs de personnage. Créer ensuite une partie, y ajouter plusieurs personnages et renseigner la progression et les séances.

`REACT_APP_URL_BACK` doit contenir l'origine du serveur, par exemple `http://localhost:8741`, **sans `/api` final**. Les paramètres EmailJS sont facultatifs pour le parcours MVP ; ils concernent l'ancien formulaire de contact.

## Vérifier

```sh
node --test tests/reprise/auth.test.mjs
npm test -- --watchAll=false --runInBand
npm run build
```

La CI utilise Node 24 et ajoute `--test-isolation=none` aux tests de session pour afficher chaque cas. Les tests de l'atelier vérifient les types des valeurs et les erreurs de chargement/sauvegarde.

## Image de production

```sh
docker build -f docker/react/Dockerfile --build-arg REACT_APP_URL_BACK=https://api.example.com -t forge-jdr-front:reprise .
```

Le paramètre API est intégré **au build** : modifier l'environnement d'un conteneur déjà construit ne le change pas. Le conteneur Nginx écoute sur le port 3000 et gère les routes de l'application. `docker compose up --build` expose cette image localement sur `http://localhost:3000` avec l'API locale par défaut.

Les builds cloud avec interception TLS acceptent un secret BuildKit `proxy_ca`, sans désactiver la validation TLS.

Voir [le plan de reprise](docs/REPRISE.md). Le MVP conserve les fonctions historiques ; invitations, collaboration et jeu en temps réel sont différés.

## Refonte UI/UX

La branche `refonte-uiux`, issue de `reprise`, apporte le nouveau système de composants, l’interface responsive et les parcours d’atelier refondus. Voir [les choix et vérifications](docs/REFONTE_UIUX.md).

```sh
npm run lint:ui
npx playwright install chromium
npm run test:browser
```

Les tests navigateur utilisent une API simulée et démarrent le front sur le port 3100 ; aucun compte de production ni service de messagerie n’est sollicité.
