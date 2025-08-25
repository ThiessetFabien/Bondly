# Application de gestion des relations partenaires

## Ce que j'ai appris

### Conception avec le client

- Concevoir une application répondant au besoin d'un cabinet d'expert comptable
- Appréhender et comprendre la logique du métier d'expert comptable dans le périmètre de son besoin

### Environnement de développement

- Configurer et assure la qualité du code délivré avec linter, formattage, typage strict en amont de chaques commits
- Mettre en place, configurer et utiliser un container (Docker)

### Testes

- Configurer et tester le projet selon la méthodologie "Test Driven Development" à base de données fictives dans une API Json afin d'assurer la robustesse de l'application avec (Jest, Playwright)

### Développement Frontend

- Utiliser Tailwind pour séparer clairement les préoccupations de style et garantir la cohérence visuelle.
- Gérer les états applicatifs avec Redux Toolkit pour une architecture prévisible et scalable.
- Séparer les responsabilités : déplacer la logique métier (récupération d'items, gestion du toggle, etc.) dans des hooks dédiés.
- Préparer les classes CSS ou les éléments en amont pour éviter les calculs conditionnels dans le rendu et améliorer la lisibilité du JSX.
- Utiliser des noms de variables explicites pour les classes CSS, les éléments conditionnels et la logique métier.
- Retirer le code mort et les blocs inutilisés pour garder le code propre et maintenable.
- Remplacer les usages de `opacity-0` par `hidden` ou ne pas rendre l'élément selon le contexte pour une meilleure accessibilité et performance.
- Documenter chaque composant, sous-composant et chaque hook pour faciliter la prise en main et la maintenance du projet.
