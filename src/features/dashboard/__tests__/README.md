# Guide des Tests Dashboard

## Structure des fichiers de tests

Cette structure organisée facilite la maintenance et la compréhension des tests.

### 📁 Components Tests (`components/__tests__/`)

#### **Dashboard Tests**

- **`Dashboard.spec.tsx`** - Tests généraux/principaux du composant Dashboard
  - Tests de base avec données réelles du projet
  - Structure fondamentale et rendu principal

- **`Dashboard.display.spec.tsx`** - Tests d'affichage et contenu
  - Vérification de l'affichage des éléments UI
  - Tests de contenu et structure visuelle

- **`Dashboard.selection.spec.tsx`** - Tests d'état de sélection (affichage uniquement)
  - États visuels des checkboxes (coché, indéterminé, non-coché)
  - Affichage des éléments de sélection
  - **Note**: Ne teste PAS les interactions (gérées au niveau parent)

- **`Dashboard.integration.spec.tsx`** - Tests d'intégration
  - Tests de fonctionnement avec les dépendances
  - Vérification de l'intégration des composants

- **`Dashboard.features.spec.tsx`** - Tests de fonctionnalités unifiées
  - Tests complets des fonctionnalités
  - Scénarios d'utilisation complexes

- **`Dashboard.real-data.spec.tsx`** - Tests avec vraies données du projet
  - Utilise les données réelles de `partnersData`
  - Validation avec les données de production

#### **Autres Composants**

- **`SettingsDashboard.spec.tsx`** - Tests du composant SettingsDashboard

### 📁 Hooks Tests (`hooks/__tests__/`)

- **`useSortedPartners.spec.ts`** - Tests du hook principal
  - Logique de tri des partenaires
  - Fonctionnalités de base du hook

- **`useSortedPartners.filters.spec.ts`** - Tests des filtres
  - Tests spécifiques aux filtres et recherche
  - Combinaisons de filtres

## Conventions de nommage

### **Extensions de fichiers**

- `.spec.tsx` - Tests de composants React
- `.spec.ts` - Tests de hooks/utilitaires TypeScript

### **Nomenclature**

- `[ComponentName].spec.tsx` - Tests principaux
- `[ComponentName].[aspect].spec.tsx` - Tests spécialisés par aspect
- `[hookName].spec.ts` - Tests de hooks
- `[hookName].[feature].spec.ts` - Tests spécialisés de fonctionnalités

## Principes de test

### ✅ **Ce que nous testons**

- **Affichage** : Rendu correct des composants
- **Structure** : Accessibilité et sémantique HTML
- **États visuels** : États des éléments UI
- **Données** : Affichage correct des données
- **Logique métier** : Hooks et utilitaires

### ❌ **Ce que nous ne testons PAS au niveau composant**

- **Interactions de sélection** : Gérées par le composant parent (`page.tsx`)
- **État global** : Géré par `DashboardContext`
- **Navigation** : Responsabilité des composants de navigation

## Architecture des tests

```
Dashboard Component Architecture:
┌─────────────────────────────┐
│        page.tsx             │ ← Gère la sélection (selectedRows, onSelectionChange)
│  (Parent Component)         │
└─────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│      Dashboard.tsx          │ ← Affiche les données et l'UI
│   (Child Component)         │   Tests: affichage, structure, états visuels
└─────────────────────────────┘
```

## Commandes utiles

```bash
# Exécuter tous les tests Dashboard
pnpm test src/features/dashboard/

# Exécuter un fichier de test spécifique
pnpm test Dashboard.display.spec.tsx

# Exécuter en mode watch
pnpm test --watch src/features/dashboard/

# Exécuter avec couverture
pnpm test --coverage src/features/dashboard/
```

## Maintenance

- **Ajouter un nouveau test** : Utiliser la nomenclature établie
- **Test d'un nouveau composant** : Créer `[ComponentName].spec.tsx`
- **Test d'une nouvelle fonctionnalité** : Utiliser `[Component].[feature].spec.tsx`
- **Refactoring** : Vérifier que tous les tests passent après les modifications

---

_Dernière mise à jour : 26 août 2025_
