# 🚀 API Bondly - Guide de démarrage

L'API REST Bondly permet de gérer les partenaires, classifications et statistiques selon les spécifications MVP du projet.

## ⚡ Démarrage rapide

```bash
# Configuration automatique complète
pnpm api:setup

# Ou démarrage manuel
pnpm db:deploy          # Déployer les migrations Sqitch
pnpm api:migrate        # Migrer les données JSON
pnpm dev                # Démarrer le serveur

# Vérifier l'état
pnpm api:status
```

## 📁 Structure créée

```
src/
├── app/api/                    # Endpoints API Next.js
│   ├── partners/               # CRUD partenaires
│   │   ├── route.ts           # GET, POST /api/partners
│   │   └── [id]/route.ts      # GET, PUT, DELETE /api/partners/{id}
│   ├── classifications/        # Gestion classifications
│   │   └── route.ts           # GET, POST /api/classifications
│   ├── dashboard/stats/        # Statistiques dashboard
│   │   └── route.ts           # GET /api/dashboard/stats
│   ├── search/                 # Recherche globale
│   │   └── route.ts           # GET /api/search, POST /api/search/advanced
│   └── professions/            # Métadonnées professions
│       └── route.ts           # GET /api/professions
├── lib/                        # Couche service et utilitaires
│   ├── db.ts                  # Configuration PostgreSQL
│   ├── types.ts               # Types TypeScript API
│   ├── services.ts            # Services partenaires/classifications
│   └── api-utils.ts           # Validation et réponses standardisées
└── hooks/                      # Hooks React pour frontend
    ├── usePartners.ts         # Gestion partenaires
    ├── useClassifications.ts  # Gestion classifications
    ├── useDashboard.ts        # Stats et recherche
    ├── useProfessions.ts      # Métadonnées professions
    └── index.ts               # Exports centralisés

scripts/
├── migrate-json-to-postgres-api.mjs    # Migration données JSON → PostgreSQL
├── test-api.mjs                        # Tests API complets
├── setup-and-start.sh                  # Configuration automatique
├── check-api-status.sh                 # Vérification état
└── start-api-dev.sh                    # Démarrage développement

migrations/                     # Migrations Sqitch (mises à jour)
├── deploy/migrate_partners_data.sql    # Classifications de base
├── revert/migrate_partners_data.sql    # Rollback
└── verify/migrate_partners_data.sql    # Vérifications

docs/
└── api.md                     # Documentation complète API
```

## 🎯 Endpoints principaux

| Endpoint               | Méthode | Description            | Exemple                                              |
| ---------------------- | ------- | ---------------------- | ---------------------------------------------------- |
| `/api/partners`        | GET     | Liste partenaires      | `?search=marie&status=active&page=1`                 |
| `/api/partners`        | POST    | Créer partenaire       | `{"firstname":"Jean","lastname":"Martin",...}`       |
| `/api/partners/{id}`   | GET     | Détail partenaire      | `/api/partners/123e4567-e89b-12d3-a456-426614174000` |
| `/api/partners/{id}`   | PUT     | Modifier partenaire    | `{"rating":5,"comment":"Excellent"}`                 |
| `/api/partners/{id}`   | DELETE  | Archiver partenaire    | (soft delete → status='archived')                    |
| `/api/classifications` | GET     | Liste classifications  | `?withUsageCount=true`                               |
| `/api/dashboard/stats` | GET     | Statistiques dashboard | Totaux, moyennes, répartitions                       |
| `/api/search`          | GET     | Recherche globale      | `?q=avocat&type=all`                                 |
| `/api/professions`     | GET     | Liste métiers          | `?category=legal`                                    |

## 🔧 Configuration requise

### Variables d'environnement (.env)

```bash
# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bondly
DB_USER=bondly_user
DB_PASSWORD=your_password

# Environnement
NODE_ENV=development
```

### Prérequis système

- Node.js 18+
- PostgreSQL 12+
- Sqitch (gestionnaire migrations)
- pnpm (gestionnaire paquets)

## 📊 Fonctionnalités implémentées

### ✅ MVP Dashboard

- [x] Statistiques complètes (totaux, moyennes, répartitions)
- [x] Partenaires récents
- [x] Répartition par métiers et classifications
- [x] Hook React `useDashboardStats()`

### ✅ Gestion Partenaires

- [x] CRUD complet (Create, Read, Update, Delete)
- [x] Pagination et filtres avancés
- [x] Recherche multicritères (nom, entreprise, métier, email, téléphone)
- [x] Tri par tous les champs
- [x] Gestion des classifications
- [x] Validation stricte des données
- [x] Hooks React `usePartners()`, `usePartnerMutations()`

### ✅ Classifications

- [x] Gestion complète (création, lecture, recherche)
- [x] Comptage d'utilisation
- [x] Association aux partenaires
- [x] Hook React `useClassifications()`

### ✅ Recherche et Navigation

- [x] Recherche globale (partenaires + classifications)
- [x] Recherche avancée avec filtres multiples
- [x] Support filtres par métier, classification, statut
- [x] Hooks React `useGlobalSearch()`, `useAdvancedSearch()`

### ✅ Professions/Métiers

- [x] API basée sur metadata.json
- [x] Filtrage par catégorie
- [x] Recherche dans professions
- [x] Hook React `useProfessions()`

## 🧪 Tests et validation

```bash
# Tester tous les endpoints
pnpm test:api

# Vérifier l'état complet
pnpm api:status

# Tests spécifiques
curl http://localhost:3000/api/dashboard/stats
curl "http://localhost:3000/api/partners?search=marie&limit=5"
curl "http://localhost:3000/api/classifications?withUsageCount=true"
```

## 🔄 Workflow de développement

```bash
# 1. Configuration initiale (une seule fois)
pnpm api:setup

# 2. Développement quotidien
pnpm dev                 # Démarrer serveur
pnpm api:status         # Vérifier état
pnpm test:api           # Tester API

# 3. Migrations de données
pnpm db:deploy          # Nouvelles migrations Sqitch
pnpm api:migrate        # Re-migrer données JSON

# 4. Gestion base de données
pnpm db:status          # Statut migrations
pnpm db:revert          # Rollback si nécessaire
pnpm db:verify          # Vérifier intégrité
```

## 🎨 Utilisation frontend

```typescript
import {
  usePartners,
  useDashboardStats,
  useClassifications
} from '@/hooks'

function Dashboard() {
  // Statistiques
  const { stats, loading, error } = useDashboardStats()

  // Partenaires avec filtres
  const { partners, updateParams } = usePartners({
    page: 1,
    limit: 10,
    status: 'active'
  })

  // Classifications
  const { classifications } = useClassifications()

  // Recherche
  const handleSearch = (term: string) => {
    updateParams({ search: term })
  }

  return (
    <div>
      {stats && <StatsCards stats={stats} />}
      {partners && <PartnersTable data={partners.data} />}
    </div>
  )
}
```

## 🔒 Sécurité et validation

- ✅ Validation stricte des données d'entrée
- ✅ Paramètres de pagination limités (max 100)
- ✅ Validation des UUIDs
- ✅ Gestion centralisée des erreurs
- ✅ Réponses API standardisées
- ✅ Protection contre l'injection SQL (requêtes préparées)

## 📈 Conformité spécifications

Cette API implémente intégralement les fonctionnalités définies dans `docs/specifications.md` pour le MVP :

- **Dashboard** : Tableau de bord avec statistiques épurées ✅
- **Partenaires** : Gestion complète (création, modification, archivage) ✅
- **Classifications** : Système de catégorisation ✅
- **Recherche** : Filtres avancés et recherche multi-critères ✅
- **Navigation** : Support filtrage par métier et classification ✅

## 🚀 Prochaines étapes (post-MVP)

- [ ] Authentification JWT
- [ ] Gestion des relations entre partenaires
- [ ] Upload de fichiers/photos
- [ ] Notifications temps réel
- [ ] API de synchronisation LinkedIn
- [ ] Cache Redis pour performances
- [ ] Rate limiting
- [ ] Logs et monitoring

---

**🎯 L'API est maintenant prête pour le développement frontend !**

Utilisez `pnpm api:setup` pour une configuration automatique complète, ou consultez `docs/api.md` pour la documentation détaillée.
