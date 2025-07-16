# Guide d'analyse du code mort

## 🎯 Objectif

Ce guide explique comment utiliser les outils d'analyse du code mort mis en place dans le projet pour maintenir un code propre et optimisé.

## 🛠️ Outils disponibles

### 1. **oxlint** - Linter principal

Configuration avancée pour détecter :

- Variables inutilisées
- Expressions mortes
- Imports/exports inutilisés
- Code inaccessible

### 2. **depcheck** - Analyse des dépendances

Détecte :

- Dépendances inutilisées dans package.json
- Dépendances manquantes
- Dépendances de développement inutilisées

### 3. **ts-unused-exports** - Exports inutilisés

Identifie :

- Exports TypeScript non utilisés
- Fonctions exportées mais jamais importées
- Types/interfaces exportés inutilement

## 📋 Scripts disponibles

### Scripts de base

```bash
# Linting standard
pnpm run lint

# Linting avec correction automatique
pnpm run lint:fix

# Analyse spécifique du code mort
pnpm run lint:dead-code

# Analyse des imports/exports
pnpm run lint:imports
```

### Scripts d'analyse approfondie

```bash
# Analyse des dépendances inutilisées
pnpm run analyze:deps

# Analyse des exports inutilisés
pnpm run analyze:unused-exports

# Analyse complète automatisée
pnpm run analyze:full
```

## 📊 Interprétation des résultats

### Dépendances inutilisées détectées

Les dépendances suivantes sont actuellement inutilisées :

- `@commitlint/config-conventional` - Configuration commitlint
- `@tailwindcss/postcss` - PostCSS Tailwind
- `commitlint-config-gitmoji` - Configuration gitmoji
- `commitlint-plugin-function-rules` - Plugin commitlint
- `jest-environment-jsdom` - Environnement Jest
- `lint-staged` - Linting sur les fichiers staged
- `tw-animate-css` - Animations CSS

### Exports inutilisés détectés

19 modules avec des exports inutilisés, incluant :

- Hooks personnalisés (`useLayout`, `useTheme`)
- Services API non utilisés
- Types/interfaces de l'état Redux
- Composants utilitaires

## 🔧 Actions recommandées

### 1. Nettoyage immédiat

```bash
# Supprimer les dépendances inutilisées
pnpm remove @commitlint/config-conventional @tailwindcss/postcss tw-animate-css

# Ou garder si nécessaires pour l'infrastructure
# (certaines peuvent être utilisées dans des configs)
```

### 2. Révision des exports

Pour chaque export inutilisé, décider si :

- ✅ **Garder** : Fonctionnalité prévue pour l'avenir
- ❌ **Supprimer** : Code vraiment mort
- 🔄 **Refactorer** : Consolider avec d'autres exports

### 3. Automatisation

Les analyses sont automatiquement lancées :

- ✅ **Pre-commit hooks** : Analyse rapide avant chaque commit
- ✅ **GitHub Actions** : Analyse complète sur les PR
- ✅ **Analyse hebdomadaire** : Rapport automatique le dimanche

## 📈 Monitoring continu

### Intégration CI/CD

Le workflow `.github/workflows/dead-code-analysis.yml` :

- Lance une analyse complète sur chaque PR
- Génère un rapport JSON détaillé
- Commente automatiquement les PR avec les résultats
- Archive les rapports pour suivi historique

### Seuils d'alerte

- 🟢 **0-5 problèmes** : Code propre
- 🟡 **6-15 problèmes** : Nettoyage recommandé
- 🔴 **16+ problèmes** : Nettoyage urgent requis

## 🚀 Bonnes pratiques

### 1. Développement

```bash
# Avant de commencer à coder
pnpm run lint

# Pendant le développement
pnpm run lint:fix

# Avant de commit
pnpm run analyze:full
```

### 2. Révision de code

- Vérifier les nouveaux exports inutilisés
- Valider la suppression des imports obsolètes
- S'assurer que les dépendances ajoutées sont utilisées

### 3. Maintenance périodique

- Analyse complète mensuelle
- Révision des exports "utilitaires" non utilisés
- Nettoyage des dépendances de développement

## 📝 Rapports

### Rapport JSON automatique

Le fichier `dead-code-analysis.json` contient :

- Timestamp de l'analyse
- Résultats détaillés de chaque outil
- Résumé avec compteurs par catégorie
- Détails des problèmes détectés

### Lecture du rapport

```javascript
const report = require('./dead-code-analysis.json')
console.log(`Total des problèmes: ${report.summary.totalIssues}`)
console.log(`Exports inutilisés: ${report.summary.categories.unusedExports}`)
```

## 🎯 Objectifs de qualité

### Court terme (1-2 sprints)

- [ ] Réduire les exports inutilisés de 19 à < 10
- [ ] Nettoyer les dépendances inutilisées
- [ ] Intégrer l'analyse dans le workflow quotidien

### Moyen terme (1-2 mois)

- [ ] Atteindre 0 export inutilisé dans le code métier
- [ ] Automatiser les suggestions de nettoyage
- [ ] Mettre en place des métriques de qualité

### Long terme (6 mois)

- [ ] Maintenir un code sans code mort
- [ ] Intégrer l'analyse dans les outils IDE
- [ ] Former l'équipe aux bonnes pratiques

---

_Guide créé le 10 juillet 2025 - Version 1.0_
