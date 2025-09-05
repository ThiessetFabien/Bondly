# Bondly - Gestionnaire de Relations Partenaires

> Application de gestion des relations partenaires pour cabinets d'expertise comptable

## 📋 Vue d'ensemble

Bondly est une application web moderne conçue pour faciliter la gestion des relations partenaires dans un environnement professionnel. Développée avec **Next.js 15**, **TypeScript**, et **PostgreSQL**, elle offre une interface intuitive pour organiser, classer et suivre les interactions avec les partenaires commerciaux.

### 🎯 Fonctionnalités principales

- **Gestion complète des partenaires** : Contacts, entreprises, évaluations
- **Classification métier** : Catégorisation par domaines (santé, juridique, finance...)
- **Relations inter-partenaires** : Mapping des connexions professionnelles
- **Interface responsive** : Optimisée mobile et desktop
- **Base de données robuste** : PostgreSQL avec migrations versionnées

### 🛠️ Stack technique

- **Frontend** : Next.js 15, React 19, TypeScript, Tailwind CSS
- **Base de données** : PostgreSQL 17.5
- **Migrations** : Sqitch (versioning professionnel)
- **Tests** : Vitest, Playwright, Testing Library
- **Containerisation** : Docker & Docker Compose
- **Qualité** : ESLint, Prettier, Husky, lint-staged

## Ce que j'ai appris

### Conception avec le client

- Concevoir une application répondant au besoin d'un cabinet d'expert comptable
- Appréhender et comprendre la logique métier dans le périmètre du besoin client

### Environnement de développement

- Configurer la qualité du code avec linter, formattage et typage strict en amont des commits
- Mettre en place et utiliser Docker pour containeriser l'environnement
- Gérer les variables d'environnement pour séparer dev/prod

### Tests

- Appliquer la méthodologie "Test Driven Development" avec des données fictives
- Migrer de Jest vers Vitest pour améliorer les performances de test
- Implémenter des tests d'accessibilité, performance et navigation avec Vitest et Playwright
- Assurer la robustesse de l'application à travers une suite de tests complète

### Développement Frontend

- Utiliser Tailwind pour le prototypage rapide et séparer les préoccupations de style
- Accélérer le développement avec les classes utilitaires pour tester rapidement des interfaces
- Garantir la cohérence visuelle sans écrire de CSS custom
- Migrer de Redux Toolkit vers useContext de React pour simplifier la gestion d'état global
- Séparer les responsabilités en déplaçant la logique métier dans des hooks dédiés
- Optimiser le rendu avec des noms explicites et en évitant les calculs conditionnels
- Maintenir un code propre en retirant le code mort et en documentant les composants
- Améliorer l'accessibilité en remplaçant `opacity-0` par `hidden` selon le contexte

### Architecture et Infrastructure

- Faire évoluer un prototype JSON vers une architecture production-ready
- Migrer d'un stockage fichier vers une base de données relationnelle PostgreSQL
- Maîtriser Sqitch pour le versioning professionnel des migrations de base de données
- Comprendre l'importance du rollback sécurisé et de la traçabilité des changements
- Gérer la cohérence des types entre TypeScript et les schémas de base de données

### Gestion de Base de Données

- Concevoir un schéma relationnel avec contraintes d'intégrité appropriées
- Installer et configurer des outils complexes (Sqitch) sur EndeavourOS/Arch Linux
- Utiliser PostgreSQL avancé : extensions, triggers, fonctions PL/pgSQL
- Maintenir la synchronisation entre différents environnements (dev, staging, prod)

## Structure du projet

### 📁 Organisation des dossiers

```
/
├── src/                     # Code source de l'application
│   ├── app/                 # Pages Next.js (App Router)
│   ├── components/          # Composants réutilisables
│   ├── features/            # Fonctionnalités par domaine métier
│   ├── services/            # Services et utilitaires
│   └── types/               # Types TypeScript globaux
├── migrations/              # 🆕 Migrations de base de données (Sqitch)
│   ├── deploy/              # Scripts de déploiement
│   ├── revert/              # Scripts de rollback
│   ├── verify/              # Scripts de vérification
│   └── sqitch.plan          # Plan des migrations
├── database/                # Configuration PostgreSQL
│   ├── postgresql.conf      # Configuration serveur
│   ├── backup.sh           # Script de sauvegarde
│   └── test-security.sh    # Tests de sécurité
├── scripts/                 # Scripts utilitaires
│   ├── migrate-json-to-postgres.mjs  # Migration des données
│   ├── init-database-with-migration.sh  # Initialisation DB + migration
│   └── backup.sh           # Sauvegarde automatisée
├── e2e/                    # Tests end-to-end (Playwright)
└── docs/                   # Documentation technique
```

### 🗄️ Base de données

**PostgreSQL 17.5** avec gestion professionnelle des migrations via **Sqitch**

**Tables principales :**

- `partners` : Partenaires avec données complètes (contact, rating, statut)
- `classifications` : Catégories métier (santé, juridique, finance, etc.)
- `partner_classifications` : Relations partenaires ↔ classifications
- `partner_relations` : Relations entre partenaires
- `users` : Utilisateurs de l'application

**Fonctionnalités avancées :**

- ✅ Contraintes d'intégrité (ratings 1-5, statuts validés)
- ✅ Index optimisés pour les performances
- ✅ Triggers automatiques (timestamps)
- ✅ Clés étrangères avec CASCADE DELETE
- ✅ Support UUID pour les identifiants

### 🚀 Déploiement et environnements

**Docker :**

- `docker-compose.yml` : Application Next.js complète
- `docker-compose.postgres.yml` : PostgreSQL standalone
- `docker-compose.postgresql-17.yml` : PostgreSQL 17.5 optimisé

**Variables d'environnement :**

- `.env` : Configuration locale de développement
- `.env.development` : Spécifique à l'environnement de dev
- Support complet de `dotenv` pour Node.js

**Migration des données :**

- Migration automatisée depuis JSON vers PostgreSQL
- Gestion des conflits et doublons
- Support ESM (ECMAScript Modules)

## Installation et utilisation

### Prérequis

- Node.js 18+
- PostgreSQL 17.5
- Sqitch (pour les migrations)
- Docker (optionnel)

### Démarrage rapide

```bash
# Installation des dépendances
pnpm install

# Configuration des variables d'environnement
cp .env.example .env
# Éditez .env avec vos paramètres locaux

# Initialisation de la base de données
./scripts/database/init-database-with-migration.sh

# Déploiement des migrations
sqitch deploy

# Migration des données de test
node scripts/migrate-json-to-postgres.mjs

# Démarrage de l'application
pnpm dev
```

### Variables d'environnement

Le projet utilise plusieurs fichiers de configuration :

- **`.env`** : Configuration principale (ne pas commiter)
- **`.env.development`** : Spécifique au développement local
- **`.env.example`** : Modèle avec toutes les variables disponibles

**Variables principales :**

```bash
# Base de données
DB_NAME="bondly"
DB_USER="bondly_user"
DB_PASSWORD="your_password"
DB_HOST="localhost"
DB_PORT="5432"

# Docker
COMPOSE_PROJECT_NAME="bondly"
DOCKER_POSTGRES_VERSION="17.5-alpine"

# Sqitch
SQITCH_TARGET="dev"
SQITCH_TOP_DIR="migrations"
```

### Configuration Sqitch

Le projet utilise Sqitch pour la gestion des migrations de base de données. Pour configurer Sqitch :

```bash
# Copier le template de configuration
cp sqitch.conf.example sqitch.conf

# Éditer avec vos paramètres de base de données
# Remplacer YOUR_USERNAME et YOUR_PASSWORD
```

⚠️ **Important** : Le fichier `sqitch.conf` contient des informations sensibles et ne doit jamais être committé dans Git.

### Utilisation avec Docker

Le projet propose plusieurs configurations Docker :

```bash
# PostgreSQL standalone (développement)
docker-compose -f docker-compose.postgres.yml up -d

# PostgreSQL 17.5 optimisé (production)
docker-compose -f docker-compose.postgresql-17.yml up -d

# Application complète
docker-compose up -d
```

**Avec Docker, Sqitch peut utiliser la target `docker` :**

```bash
# Migrations vers conteneur Docker
sqitch deploy docker
sqitch status docker
```

### Gestion des migrations

```bash
# Statut des migrations
sqitch status

# Déploiement des migrations
sqitch deploy

# Vérification de l'intégrité
sqitch verify

# Rollback (si nécessaire)
sqitch revert
```

### Tests

```bash
# Tests unitaires
pnpm test

# Tests e2e
pnpm test:e2e

# Build de production
pnpm build
```

## 📊 État du projet

- ✅ **Base de données** : PostgreSQL 17.5 configuré avec 10 partenaires et 13 classifications
- ✅ **Migrations** : Système Sqitch opérationnel avec rollback sécurisé
- ✅ **Configuration** : Variables d'environnement centralisées et sécurisées
- ✅ **Docker** : Multi-environnements avec variables d'env protégées
- ✅ **Tests** : Suite complète (unitaires, intégration, e2e, accessibilité)
- ✅ **Build** : Production-ready avec optimisations Next.js 15.5.2

## 📝 Licence

Ce projet est développé dans un cadre d'apprentissage professionnel.

---

**Bondly** - Développé avec ❤️ et **Next.js**
