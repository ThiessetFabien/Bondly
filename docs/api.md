# API Bondly - Documentation

Cette API REST permet de gérer les partenaires, classifications et statistiques du système Bondly selon les spécifications du MVP.

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
pnpm install

# 2. Configurer l'environnement
cp .env.example .env
# Puis éditez .env avec vos paramètres de base de données

# 3. Démarrer PostgreSQL et migrer les données
sqitch deploy
node scripts/migrate-json-to-postgres-api.mjs

# 4. Démarrer le serveur de développement
pnpm run dev

# 5. Tester l'API
node scripts/test-api.mjs
```

## 📋 Endpoints disponibles

### 🏠 Dashboard

- `GET /api/dashboard/stats` - Statistiques du dashboard

### 👥 Partenaires

- `GET /api/partners` - Liste des partenaires (avec pagination et filtres)
- `POST /api/partners` - Créer un nouveau partenaire
- `GET /api/partners/{id}` - Récupérer un partenaire par ID
- `PUT /api/partners/{id}` - Mettre à jour un partenaire
- `DELETE /api/partners/{id}` - Archiver un partenaire

### 📋 Classifications

- `GET /api/classifications` - Liste des classifications
- `POST /api/classifications` - Créer une nouvelle classification

### 🔍 Recherche

- `GET /api/search` - Recherche globale
- `POST /api/search/advanced` - Recherche avancée

### 💼 Professions

- `GET /api/professions` - Liste des professions depuis les métadonnées

## 📖 Utilisation détaillée

### Récupérer les partenaires

```typescript
// GET /api/partners
const response = await fetch('/api/partners?page=1&limit=10&search=marie&status=active')
const data = await response.json()

// Réponse
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "firstname": "Marie",
        "lastname": "Dubois",
        "job": "Avocat d'affaires",
        "company": "Cabinet Dubois & Associés",
        "email": "marie.dubois@example.com",
        "phone": "01 23 45 67 89",
        "rating": 5,
        "status": "active",
        "comment": "Excellente collaboration",
        "classifications": ["santé", "spécialiste"],
        "createdAt": "2024-01-15T09:00:00Z",
        "updatedAt": "2024-12-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

### Paramètres de filtrage

| Paramètre        | Type   | Description                                                         |
| ---------------- | ------ | ------------------------------------------------------------------- |
| `page`           | number | Numéro de page (défaut: 1)                                          |
| `limit`          | number | Nombre d'éléments par page (défaut: 20, max: 100)                   |
| `search`         | string | Recherche dans nom, prénom, entreprise, métier, email, téléphone    |
| `status`         | string | Filtre par statut: `active`, `archived`, `blacklisted`              |
| `classification` | string | Filtre par classification                                           |
| `job`            | string | Filtre par métier                                                   |
| `sortBy`         | string | Tri par: `firstname`, `lastname`, `company`, `rating`, `created_at` |
| `sortOrder`      | string | Ordre: `asc`, `desc`                                                |

### Créer un partenaire

```typescript
// POST /api/partners
const newPartner = {
  firstname: 'Jean',
  lastname: 'Martin',
  job: 'Expert-comptable',
  company: 'Cabinet Martin',
  email: 'jean@martin-compta.fr',
  phone: '01 42 58 67 89',
  rating: 4,
  comment: 'Très professionnel',
  classifications: ['comptabilité', 'finance'],
}

const response = await fetch('/api/partners', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newPartner),
})
```

### Statistiques dashboard

```typescript
// GET /api/dashboard/stats
const response = await fetch('/api/dashboard/stats')
const stats = await response.json()

// Réponse
{
  "success": true,
  "data": {
    "totalPartners": 50,
    "activePartners": 45,
    "archivedPartners": 3,
    "blacklistedPartners": 2,
    "averageRating": 4.2,
    "partnersByClassification": {
      "juridique": 15,
      "comptabilité": 12,
      "santé": 8
    },
    "partnersByJob": {
      "Avocat d'affaires": 10,
      "Expert-comptable": 8,
      "Notaire": 5
    },
    "recentPartners": [...]
  }
}
```

### Recherche globale

```typescript
// GET /api/search?q=avocat&type=all
const response = await fetch('/api/search?q=avocat&type=all')
const results = await response.json()

// Types de recherche: 'all', 'partners', 'classifications'
```

## 🎯 Hooks React

Des hooks prêts à l'emploi sont disponibles pour faciliter l'intégration frontend :

```typescript
import { usePartners, useDashboardStats, useClassifications } from '@/hooks'

// Dans votre composant
function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { partners, updateParams } = usePartners()
  const { classifications } = useClassifications()

  // Utilisation...
}
```

## 🔒 Validation et sécurité

- Validation stricte des données d'entrée
- Paramètres de pagination limités (max 100 éléments)
- Validation des UUIDs
- Gestion centralisée des erreurs
- Réponses standardisées

## 🚦 Codes de réponse

| Code | Description           |
| ---- | --------------------- |
| 200  | Succès                |
| 400  | Erreur de validation  |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur        |

## 📊 Format des réponses

Toutes les réponses suivent le même format :

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

## 🔧 Configuration

Variables d'environnement requises :

```bash
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bondly
DB_USER=bondly_user
DB_PASSWORD=bondly_password

# Environnement
NODE_ENV=development
```

## 🧪 Tests

```bash
# Tester tous les endpoints
node scripts/test-api.mjs

# Vérifier l'état de l'API
curl http://localhost:3000/api/dashboard/stats
```

## 📝 Conformité aux spécifications

Cette API implémente les fonctionnalités définies dans les spécifications MVP :

✅ **Dashboard** : Statistiques, partenaires récents, répartition par métiers  
✅ **Partenaires** : CRUD complet, filtres, recherche, pagination  
✅ **Classifications** : Gestion et recherche  
✅ **Recherche** : Globale et avancée  
✅ **Navigation** : Support des filtres par métier et classification

## 🔄 Prochaines étapes

Pour les versions futures :

- Authentification JWT
- Relations entre partenaires
- Gestion des fichiers/photos
- Notifications en temps réel
- API de synchronisation LinkedIn
