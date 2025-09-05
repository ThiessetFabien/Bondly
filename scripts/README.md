# 📁 Scr├── api/ ├── database/ # Scripts base de données

│ ├── init-database-with-migration.sh # Initialisation base + migration JSON
│ └── init-docker-postgresql.sh # Setup PostgreSQL 17 avec Docker
├── setup/ # Scripts de configuration
│ └── setup-and-start.sh # Configuration complète automatique
├── commitlint/ # Scripts Git et commits
│ ├── commit-help.sh # Guide des conventions de commit
│ ├── setup-husky.sh # Configuration Husky
│ └── test-commit-format.sh # Test format des commits
├── docker/ # Scripts Docker
│ ├── docker-help.sh # Aide Docker
│ ├── docker-security-check.sh # Vérification sécurité Docker
│ ├── docker-test.sh # Tests Docker
│ └── setup-docker.sh # Configuration Docker
├── playwright/ # Scripts tests E2E
│ └── quick-test.js # Test rapide Playwright
└── analyze-dead-code.js # Analyse code mort et optimisation # Scripts API et backend
│ ├── check-api-status.sh # Vérification état de l'API
│ ├── migrate-json-to-postgres-api.mjs # Migration des données JSON → PostgreSQL
│ ├── start-api-dev.sh # Démarrage développement API
│ └── test-api.mjs # Tests manuels des endpoints API
├── database/ # Scripts base de données
│ ├── init-database-with-migration.sh # Initialisation base + migration JSON
│ └── init-docker-postgresql.sh # Setup PostgreSQL 17 avec Docker
├── setup/ # Scripts de configuration
│ └── setup-and-start.sh # Configuration complète automatique

Organisation des scripts de développement et déploiement.

## 📂 Structure

```
scripts/
├── api/                        # Scripts API et tests
│   ├── migrate-json-to-postgres-api.mjs    # Migration des données JSON → PostgreSQL
│   ├── test-api.mjs                        # Tests manuels des endpoints API
│   ├── check-api-status.sh                 # Vérification état de l'API
│   └── start-api-dev.sh                    # Démarrage développement API
├── database/                   # Scripts base de données
│   ├── backup.sh                           # Sauvegarde base de données
│   ├── init-database-with-migration.sh     # Initialisation base + migration JSON
│   └── init-docker-postgresql.sh           # Setup PostgreSQL 17 avec Docker
├── setup/                      # Scripts de configuration
│   └── setup-and-start.sh                  # Configuration complète automatique
├── commitlint/                 # Scripts Git et commits
│   ├── commit-help.sh
│   ├── setup-husky.sh
│   └── test-commit-format.sh
├── docker/                     # Scripts Docker
│   ├── docker-help.sh
│   ├── docker-security-check.sh
│   ├── docker-test.sh
│   └── setup-docker.sh
├── playwright/                 # Scripts tests E2E
│   └── quick-test.js
└── analyze-dead-code.js        # Analyse du code
```

## 🚀 Commandes npm

### API et développement

```bash
npm run api:setup       # Configuration complète automatique
npm run api:dev         # Démarrage serveur développement
npm run api:status      # Vérifier l'état de l'API
npm run test:api        # Tests manuels API
npm run api:migrate     # Migrer données JSON → PostgreSQL
```

### Base de données

```bash
npm run db:deploy       # Déployer migrations Sqitch
npm run db:status       # Statut migrations
npm run db:revert       # Rollback migrations
npm run db:verify       # Vérifier intégrité
```

### Tests

```bash
npm run test            # Tests unitaires (Vitest)
npm run test:watch      # Tests unitaires en mode watch
npm run test:coverage   # Tests avec couverture de code
npm run test:e2e        # Tests E2E (Playwright)
npm run test:e2e:ui     # Tests E2E avec interface
```

### Développement

```bash
npm run dev             # Serveur Next.js
npm run build           # Build production
npm run lint            # Linting
npm run format          # Formatage code
```

## 📋 Scripts par catégorie

### 🔧 API

- **migrate-json-to-postgres-api.mjs** : Migre les données depuis `src/data/*.json` vers PostgreSQL
- **test-api.mjs** : Tests manuels de tous les endpoints API
- **check-api-status.sh** : Diagnostic complet (DB, API, fichiers)
- **start-api-dev.sh** : Démarrage avec vérifications préalables

### 🗄️ Base de données

- **backup.sh** : Sauvegarde PostgreSQL avec compression
- **init-database-with-migration.sh** : Création base et utilisateur + migration données JSON
- **init-docker-postgresql.sh** : Installation et configuration PostgreSQL 17 avec Docker

### ⚙️ Setup

- **setup-and-start.sh** : Configuration automatique complète (prérequis, DB, migration, démarrage)

### 🧪 Tests

- **quick-test.js** : Tests Playwright rapides
- Tests Vitest dans `src/**/__tests__/`
- Tests E2E dans `e2e/`

## 🎯 Workflow recommandé

### Premier démarrage

```bash
# Configuration automatique complète
npm run api:setup
```

### Développement quotidien

```bash
# Vérifier l'état
npm run api:status

# Démarrer le développement
npm run dev

# Tests
npm run test:watch     # Tests unitaires
npm run test:e2e       # Tests E2E
```

### Après modifications DB

```bash
# Déployer nouvelles migrations
npm run db:deploy

# Re-migrer les données si nécessaire
npm run api:migrate
```

## 🔍 Diagnostic

Si problème, utilisez dans l'ordre :

1. `npm run api:status` - État général
2. `npm run db:status` - État migrations
3. `npm run test:api` - Tests endpoints
4. Logs dans la console du serveur Next.js
