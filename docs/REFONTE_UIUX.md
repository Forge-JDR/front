# Refonte de l’interface Forge JDR

Branche `refonte-uiux`, créée depuis `reprise` au commit `3c5d3f3` dans le dépôt front. Le contrat API et le dépôt back restent ceux de la reprise.

## Direction visuelle

Un atelier inspiré du carnet d’aventures : toile claire, navigation vert profond, touches de cuivre et illustrations de paysages vectoriels. Manrope compose l’interface ; DM Serif Display porte les titres éditoriaux. Les polices sont servies depuis les dépendances locales.

Les couleurs, espacements et contrôles communs sont définis dans `src/styles/design-system.css`. Les composants `Button`, `Field`, `Notice`, `Modal`, `EmptyState`, `PageHeader`, `Brand`, `Landscape` et `LibraryCard` vivent dans `src/components/design-system`.

## Parcours refondus

- Accueil public : présentation des possibilités, aperçu illustratif clairement identifié et actions d’inscription/connexion.
- Connexion/inscription : formulaires natifs, complétion automatique, visibilité des mots de passe, validation et erreurs dans la page. L’inscription ne relance plus une seconde connexion inutile.
- Atelier : vue d’ensemble, collections de JDR/parties/personnages, recherche, états vides, état indisponible avec nouvelle tentative et compteurs provenant des données réelles.
- Création/édition : fenêtres natives avec retour du focus, fermeture par Escape et verrouillage pendant les requêtes. Les erreurs conservent la saisie.
- Partie : onglets campagne/personnages/journal, navigation clavier, notes indépendantes des opérations sur les personnages ou séances.
- Compte : profil et mot de passe séparés ; confirmation dans la page au lieu d’alertes bloquantes.
- Contact et conditions : présentations cohérentes. Le contact reste indisponible si son service n’est pas configuré ; aucun envoi réel n’a été effectué pendant la validation.
- Bibliothèque : accès conservé aux wikis, fiches libres et univers publiés. Cartes, dialogues de création/suppression et contrôles utilisent les composants communs. Les éditeurs de contenu restent disponibles et rechargent le bon wiki lorsque l’identifiant change.

La navigation et le pied de page sont rendus une seule fois par `Layout`. Le mobile dispose d’un panneau de navigation avec fermeture par Escape et gestion du focus. Les styles d’étiquettes historiques ont été isolés pour supprimer les collisions entre formulaires.

## Vérifications

- Tests de session : 11 cas.
- Tests React : saisie typée des personnages, erreurs et nouvelle tentative, conservation des brouillons, redirection après expiration de session, confirmation de mot de passe et résultats de connexion/inscription.
- Playwright : mobile, fenêtres, recherche, navigation clavier, six pages et journal contrôlés avec axe-core (règles WCAG A/AA automatisées).
- Parcours navigateur réel avec l’API de reprise et MariaDB : compte, modèle de fiche, partie, personnage, campagne, séance et modification sur mobile.
- Lint strict sur les composants refondus et build de production.

Les tests Playwright de CI simulent l’API pour être indépendants d’une installation du back. Ils complètent le parcours réel effectué localement. Les anciens modules conservent certains avertissements de lint ; le build et leurs styles n’impliquent pas une réécriture intégrale de leur logique métier.

## Lancer les vérifications navigateur

```sh
npx playwright install chromium
npm run test:browser
```

Playwright démarre le front sur le port 3100. Pour un front déjà lancé, définir `UI_TEST_URL` sur son origine. `npm run lint:ui`, les tests React et les tests de session sont documentés dans le README.

La CI s’exécute aussi sur `refonte-uiux`. Cette refonte ne déploie pas le site et ne migre pas Create React App : la modernisation de l’outillage et l’audit des dépendances restent un chantier distinct.
