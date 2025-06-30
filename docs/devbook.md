# DevBook - RPM-CL (Partner Relationship Management - Cabinet Laurent)

> **Guide technique complet pour le développement de l'application de gestion des relations partenaires**

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Architecture technique détaillée](#2-architecture-technique-détaillée)
3. [Guide de mise en place](#3-guide-de-mise-en-place)
4. [Structure des projets](#4-structure-des-projets)
5. [Guide de développement](#5-guide-de-développement)
6. [Documentation API](#6-documentation-api)
7. [Base de données](#7-base-de-données)
8. [Tests et qualité](#8-tests-et-qualité)
9. [Sécurité et RGPD](#9-sécurité-et-rgpd)
10. [Déploiement et production](#10-déploiement-et-production)

---

## 1. Vue d'ensemble du projet

### 1.1. Contexte métier et objectifs

**RPM-CL** est une application web de **gestion des relations partenaires (PRM)** développée spécifiquement pour structurer, suivre et optimiser les contacts professionnels du cabinet Laurent.

#### Objectifs principaux :
- **Organiser efficacement** les partenaires professionnels
- **Retrouver rapidement** les bons contacts selon différents critères
- **Suivre l'historique** des recommandations et des mises en relation
- **Améliorer la qualité** du réseau et la stratégie de cross-selling/up-selling

#### Valeur ajoutée :
- **Gain de temps** : Recherche et filtrage avancés
- **Professionnalisme** : Interface épurée et mobile-first
- **Sécurité** : Conformité RGPD stricte avec audit trail
- **Évolutivité** : Architecture modulaire et scalable

### 1.2. Périmètre fonctionnel MVP

#### Fonctionnalités principales :
- ✅ **Gestion des fiches partenaires** : création, modification, archivage, notation (1-5 étoiles)
- ✅ **Recherche et filtres avancés** : par métier, nom, notation, statut
- ✅ **Classifications hiérarchiques** : métiers, sous-métiers, tags
- ✅ **Actions rapides** : appel direct, email, liens LinkedIn
- ✅ **Historique des recommandations** : clients envoyés/reçus
- ✅ **Interface mobile-first** : optimisée pour la saisie rapide
- ✅ **Gestion des rôles** : Admin/Consultant/Collaborateur
- ✅ **Scan OCR** : cartes de visite automatisées

#### Spécialités métiers supportées :
- Avocats d'affaires, Fiscalistes, Spécialistes droit du travail
- Huissiers de justice, Banques, Compagnies d'affacturage
- Assureurs, Cabinets de gestion de patrimoine
- Experts en gestion de paie & RH, Cabinets de recrutement, Notaires

### 1.3. Contraintes et exigences

#### Contraintes techniques :
- **Compatibilité** : Chrome, Firefox, Edge (desktop) + Chrome, Firefox (mobile)
- **Performance** : Temps de chargement < 2s, First Contentful Paint < 1.2s
- **Éco-conception** : < 1g CO2 par page vue, bundle < 150kb
- **Accessibilité** : Conformité WCAG, navigation clavier, contrastes

#### Contraintes réglementaires :
- **RGPD** : Chiffrement, droit à l'oubli, consentement explicite
- **Audit trail** : Traçabilité complète des actions sensibles
- **Authentification** : OAuth2 LinkedIn, gestion des sessions sécurisées

---

## 2. Architecture technique détaillée

### 2.1. Stack technologique

#### Vue d'ensemble de l'architecture
```mermaid
graph TB
    subgraph "Frontend - Vercel"
        A[Next.js 15 App Router] --> B[React 18 + TypeScript]
        B --> C[Tailwind CSS + Headless UI]
        C --> D[OAuth2 LinkedIn]
    end
    
    subgraph "Backend - Railway"
        E[AdonisJS v6] --> F[Lucid ORM]
        F --> G[Node.js + TypeScript]
        G --> H[API REST privée]
    end
    
    subgraph "Base de données - Supabase"
        I[PostgreSQL 15]
        J[Redis Cache]
    end
    
    subgraph "Services externes"
        K[LinkedIn API]
        L[Tesseract.js OCR]
        M[Sentry Monitoring]
    end
    
    A --> H
    F --> I
    E --> J
    H --> K
    A --> L
    A --> M
```

#### Justifications des choix techniques

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Frontend** | Next.js 15 | App Router, RSC, optimisations natives, SSR/CSR hybride |
| **Backend** | AdonisJS v6 | TypeScript natif, ORM Lucid, architecture MVC robuste |
| **Base de données** | PostgreSQL | Recherches complexes, relations, performance, ACID |
| **Cache** | Redis | Sessions, cache API, performance temps réel |
| **Hébergement** | Vercel + Railway | Edge computing, scaling auto, CI/CD intégré |
| **Monitoring** | Sentry + Vercel Analytics | Debugging production, métriques temps réel |

### 2.2. Architecture par features

#### Principe d'organisation
```
/features
├── partners/          # Gestion des partenaires
├── users/            # Gestion des utilisateurs
├── classifications/  # Métiers, sous-métiers, tags
├── notifications/    # Système de notifications
├── stats/           # Statistiques et analytics
├── auth/            # Authentification OAuth2
└── shared/          # Composants transverses
```

#### Avantages de cette approche :
- **Isolation** : Chaque feature est autonome
- **Maintenabilité** : Refactoring facilité
- **Tests** : Tests au plus près du code métier
- **Onboarding** : Structure claire pour nouveaux développeurs

### 2.3. Optimisations performance et éco-conception

#### Configuration Next.js optimisée
```typescript
// next.config.js
const nextConfig = {
  // Optimisation images automatique
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  // Compression maximale
  compress: true,
  // Tree shaking agressif
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Hybrid SSR/CSR pour performance
  hybridRendering: true,
}
```

#### Stratégie de cache multi-niveaux
```typescript
const cacheStrategy = {
  // Browser cache
  'static-assets': '1y',
  'api-responses': '5m',
  
  // CDN cache (Vercel Edge)
  'partner-list': '1h',
  'classifications': '24h',
  
  // Server cache (Redis)
  'search-results': '15m',
  'user-session': '30m',
}
```

#### Métriques éco-responsabilité cibles
- **Empreinte carbone** : < 1g CO2 par page vue
- **Transfer de données** : < 2MB par session
- **Cache hit ratio** : > 85%
- **Optimisation images** : > 90% WebP/AVIF

---

## 3. Guide de mise en place

### 3.1. Prérequis système

#### Outils requis
```fish
# Node.js et gestionnaire de paquets
node --version  # >= 18.17.0
npm --version   # >= 9.0.0
# ou
bun --version   # >= 1.0.0 (recommandé pour performance)

# Base de données
psql --version  # PostgreSQL >= 15
redis-server --version  # Redis >= 7.0

# Outils de développement
git --version
docker --version  # Optionnel pour conteneurisation
```

#### Services externes requis
- **Compte Vercel** : Hébergement frontend
- **Compte Railway** : Hébergement backend
- **Compte Supabase** : Base de données managée
- **LinkedIn Developer** : OAuth2 et API
- **Sentry** : Monitoring erreurs

### 3.2. Installation complète du projet

#### 1. Clonage et setup initial
```fish
# Cloner le repository
git clone https://github.com/cabinet-laurent/rpm-cl.git
cd rpm-cl

# Installation des dépendances
bun install

# Setup des workspaces
bun install --workspaces
```

#### 2. Configuration des variables d'environnement

**Frontend (.env.local)**
```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3333/api
NEXT_PUBLIC_APP_ENV=development

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

**Backend (.env)**
```bash
# Application
NODE_ENV=development
PORT=3333
APP_KEY=your-app-key-32-characters-long
HOST=0.0.0.0

# Database
DB_CONNECTION=pg
PG_HOST=localhost
PG_PORT=5432
PG_USER=rpm_user
PG_PASSWORD=rpm_password
PG_DB_NAME=rpm_development

# Redis Cache
REDIS_CONNECTION=local
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# LinkedIn API
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Security
SESSION_DRIVER=redis
HASH_DRIVER=bcrypt
```

#### 3. Setup base de données
```fish
# Démarrer PostgreSQL et Redis
sudo service postgresql start
sudo service redis-server start

# Créer la base de données
createdb rpm_development
createdb rpm_test

# Migrations et seeds
cd backend
node ace migration:run
node ace db:seed
```

#### 4. Démarrage en mode développement
```fish
# Terminal 1 - Backend AdonisJS
cd backend
bun run dev

# Terminal 2 - Frontend Next.js
cd frontend
bun run dev

# Terminal 3 - Tests en mode watch
bun run test:watch
```

### 3.3. Configuration Docker (optionnelle)

#### docker-compose.yml
```yaml
version: '3.8'
services:
  # Base de données
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: rpm_user
      POSTGRES_PASSWORD: rpm_password
      POSTGRES_DB: rpm_development
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  # Cache Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  # Backend AdonisJS
  backend:
    build: ./backend
    ports:
      - "3333:3333"
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=development
    volumes:
      - ./backend:/app
      - /app/node_modules
  
  # Frontend Next.js
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NODE_ENV=development
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
```

#### Commandes Docker
```fish
# Démarrer tous les services
docker-compose up -d

# Logs en temps réel
docker-compose logs -f

# Arrêter les services
docker-compose down

# Reset complet
docker-compose down -v
docker-compose up --build
```

---

## 4. Structure des projets

### 4.1. Organisation globale du monorepo

```
rpm-cl/
├── frontend/                 # Next.js 15 Application
├── backend/                  # AdonisJS v6 API
├── shared/                   # Types et utilitaires partagés
├── docs/                     # Documentation projet
├── .github/                  # CI/CD GitHub Actions
├── docker-compose.yml        # Environnement de développement
├── package.json              # Workspace root
└── README.md
```

### 4.2. Structure Frontend (Next.js 15)

```
frontend/
├── public/                   # Assets statiques
│   ├── icons/               # Icônes application
│   ├── images/              # Images optimisées
│   └── robots.txt
├── src/
│   ├── app/                 # App Router Next.js 15
│   │   ├── (auth)/          # Route group authentication
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/     # Route group application
│   │   │   ├── partners/
│   │   │   ├── stats/
│   │   │   └── settings/
│   │   ├── api/             # API Routes Next.js
│   │   ├── globals.css      # Styles globaux
│   │   ├── layout.tsx       # Layout racine
│   │   └── page.tsx         # Page d'accueil
│   ├── features/            # Architecture par features
│   │   ├── partners/
│   │   │   ├── components/  # Composants UI spécifiques
│   │   │   │   ├── PartnerCard.tsx
│   │   │   │   ├── PartnerForm.tsx
│   │   │   │   ├── PartnerList.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/       # Hooks React spécifiques
│   │   │   │   ├── usePartners.ts
│   │   │   │   ├── usePartnerForm.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/    # API calls et logique métier
│   │   │   │   ├── partnerApi.ts
│   │   │   │   ├── partnerValidation.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/       # Types TypeScript spécifiques
│   │   │   │   ├── Partner.ts
│   │   │   │   ├── PartnerForm.ts
│   │   │   │   └── index.ts
│   │   │   └── __tests__/   # Tests unitaires feature
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       └── services/
│   │   ├── users/
│   │   ├── classifications/
│   │   ├── notifications/
│   │   ├── stats/
│   │   └── auth/
│   ├── shared/              # Composants et utils réutilisables
│   │   ├── components/      # Composants UI transverses
│   │   │   ├── ui/          # Composants base (Button, Input, etc.)
│   │   │   ├── layout/      # Composants layout (Header, Sidebar)
│   │   │   ├── forms/       # Composants formulaires
│   │   │   └── feedback/    # Toasts, modales, alerts
│   │   ├── hooks/           # Hooks React globaux
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── utils/           # Utilitaires transverses
│   │   │   ├── api.ts
│   │   │   ├── validation.ts
│   │   │   ├── formatting.ts
│   │   │   └── constants.ts
│   │   ├── types/           # Types globaux
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── common.ts
│   │   └── styles/          # Styles partagés
│   │       ├── components.css
│   │       └── utilities.css
│   ├── contexts/            # React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   └── middleware.ts        # Middleware Next.js
├── e2e/                     # Tests end-to-end Playwright
│   ├── tests/
│   │   ├── auth.spec.ts
│   │   ├── partners.spec.ts
│   │   └── search.spec.ts
│   ├── fixtures/
│   └── playwright.config.ts
├── .env.local               # Variables d'environnement
├── .eslintrc.js             # Configuration ESLint
├── .prettierrc              # Configuration Prettier
├── next.config.js           # Configuration Next.js
├── tailwind.config.js       # Configuration Tailwind
├── tsconfig.json            # Configuration TypeScript
├── jest.config.js           # Configuration Jest
└── package.json
```

#### Exemple de composant Partner avec architecture par feature

**`src/features/partners/components/PartnerCard.tsx`**
```tsx
import { type FC } from 'react'
import { Phone, Mail, Star, Archive, AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { type Partner } from '../types'

interface PartnerCardProps {
  partner: Partner
  onEdit: (id: string) => void
  onArchive: (id: string) => void
  onCall: (phone: string) => void
  onEmail: (email: string) => void
}

export const PartnerCard: FC<PartnerCardProps> = ({
  partner,
  onEdit,
  onArchive,
  onCall,
  onEmail,
}) => {
  const { id, firstName, lastName, email, phone, company, rating, isBlacklisted, classifications } = partner

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-gray-600">{company}</p>
        </div>
        
        {/* Status badges */}
        <div className="flex gap-2">
          {isBlacklisted && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Blacklisté
            </Badge>
          )}
          {rating && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Classifications */}
      {classifications && classifications.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {classifications.map((classification) => (
            <Badge key={classification.id} variant="secondary">
              {classification.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCall(phone)}
              className="flex items-center gap-1"
            >
              <Phone className="w-4 h-4" />
              Appeler
            </Button>
          )}
          {email && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEmail(email)}
              className="flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
            Modifier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onArchive(id)}
            className="text-red-600 hover:text-red-700"
          >
            <Archive className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**`src/features/partners/hooks/usePartners.ts`**
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partnerApi } from '../services/partnerApi'
import { type Partner, type PartnerFilters } from '../types'

export const usePartners = (filters?: PartnerFilters) => {
  return useQuery({
    queryKey: ['partners', filters],
    queryFn: () => partnerApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePartner = (id: string) => {
  return useQuery({
    queryKey: ['partner', id],
    queryFn: () => partnerApi.getById(id),
    enabled: !!id,
  })
}

export const useCreatePartner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: partnerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}

export const useUpdatePartner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Partner> }) =>
      partnerApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
      queryClient.invalidateQueries({ queryKey: ['partner', id] })
    },
  })
}

export const useArchivePartner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: partnerApi.archive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}
```

### 4.3. Structure Backend (AdonisJS v6)

```
backend/
├── app/
│   ├── features/            # Architecture par features
│   │   ├── partners/
│   │   │   ├── controllers/ # Contrôleurs HTTP
│   │   │   │   ├── PartnerController.ts
│   │   │   │   └── PartnerSearchController.ts
│   │   │   ├── services/    # Services métier
│   │   │   │   ├── PartnerService.ts
│   │   │   │   ├── PartnerSearchService.ts
│   │   │   │   └── PartnerValidationService.ts
│   │   │   ├── validators/  # Validation des requêtes
│   │   │   │   ├── CreatePartnerValidator.ts
│   │   │   │   ├── UpdatePartnerValidator.ts
│   │   │   │   └── SearchPartnerValidator.ts
│   │   │   ├── models/      # Modèles ORM
│   │   │   │   ├── Partner.ts
│   │   │   │   └── PartnerClassification.ts
│   │   │   ├── policies/    # Politiques d'autorisation
│   │   │   │   └── PartnerPolicy.ts
│   │   │   ├── jobs/        # Jobs asynchrones
│   │   │   │   └── SyncLinkedInJob.ts
│   │   │   └── __tests__/   # Tests feature
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       └── models/
│   │   ├── users/
│   │   ├── classifications/
│   │   ├── notifications/
│   │   ├── auth/
│   │   └── stats/
│   ├── shared/              # Éléments transverses
│   │   ├── middleware/      # Middlewares globaux
│   │   │   ├── AuthMiddleware.ts
│   │   │   ├── RoleMiddleware.ts
│   │   │   └── AuditMiddleware.ts
│   │   ├── exceptions/      # Exceptions personnalisées
│   │   │   ├── BusinessException.ts
│   │   │   ├── ValidationException.ts
│   │   │   └── AuthorizationException.ts
│   │   ├── helpers/         # Utilitaires
│   │   │   ├── encryption.ts
│   │   │   ├── audit.ts
│   │   │   └── validation.ts
│   │   ├── contracts/       # Interfaces globales
│   │   │   ├── auth.ts
│   │   │   ├── pagination.ts
│   │   │   └── audit.ts
│   │   └── services/        # Services transverses
│   │       ├── EmailService.ts
│   │       ├── CacheService.ts
│   │       └── AuditService.ts
│   └── Models/              # Modèles base Adonis
├── config/                  # Configuration Adonis
│   ├── app.ts
│   ├── database.ts
│   ├── cors.ts
│   └── auth.ts
├── database/
│   ├── migrations/          # Migrations base de données
│   │   ├── 001_create_users_table.ts
│   │   ├── 002_create_partners_table.ts
│   │   ├── 003_create_classifications_table.ts
│   │   └── 004_create_audit_trails_table.ts
│   ├── seeders/            # Données de test
│   │   ├── UserSeeder.ts
│   │   ├── ClassificationSeeder.ts
│   │   └── PartnerSeeder.ts
│   └── factories/          # Factories pour tests
│       ├── UserFactory.ts
│       ├── PartnerFactory.ts
│       └── ClassificationFactory.ts
├── start/
│   ├── routes/             # Définition des routes
│   │   ├── api.ts          # Routes API principales
│   │   ├── auth.ts         # Routes authentification
│   │   └── webhooks.ts     # Webhooks externes
│   ├── kernel.ts           # Configuration noyau
│   └── env.ts              # Validation variables d'environnement
├── tests/                  # Tests globaux et E2E
├── .env                    # Variables d'environnement
├── .adonisrc.json          # Configuration Adonis
├── tsconfig.json           # Configuration TypeScript
├── package.json
└── ace                     # CLI Adonis
```

#### Exemple de contrôleur Partner avec architecture par feature

**`app/features/partners/controllers/PartnerController.ts`**
```typescript
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PartnerService } from '../services/PartnerService'
import { CreatePartnerValidator, UpdatePartnerValidator } from '../validators'

@inject()
export default class PartnerController {
  constructor(private partnerService: PartnerService) {}

  /**
   * GET /api/partners
   * Liste des partenaires avec filtres et pagination
   */
  public async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const filters = request.qs()
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)

      const partners = await this.partnerService.paginate(
        { page, limit },
        filters,
        user
      )

      return response.ok({
        data: partners.data,
        meta: {
          total: partners.total,
          page: partners.currentPage,
          limit: partners.perPage,
          lastPage: partners.lastPage,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération des partenaires',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/partners/:id
   * Détail d'un partenaire
   */
  public async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const partner = await this.partnerService.findById(params.id, user)

      if (!partner) {
        return response.notFound({
          message: 'Partenaire non trouvé',
        })
      }

      return response.ok({ data: partner })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération du partenaire',
        error: error.message,
      })
    }
  }

  /**
   * POST /api/partners
   * Création d'un nouveau partenaire
   */
  public async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const payload = await request.validateUsing(CreatePartnerValidator)

      const partner = await this.partnerService.create(payload, user)

      return response.created({
        message: 'Partenaire créé avec succès',
        data: partner,
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Données invalides',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Erreur lors de la création du partenaire',
        error: error.message,
      })
    }
  }

  /**
   * PUT /api/partners/:id
   * Mise à jour d'un partenaire
   */
  public async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const payload = await request.validateUsing(UpdatePartnerValidator)

      const partner = await this.partnerService.update(params.id, payload, user)

      if (!partner) {
        return response.notFound({
          message: 'Partenaire non trouvé',
        })
      }

      return response.ok({
        message: 'Partenaire mis à jour avec succès',
        data: partner,
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Données invalides',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Erreur lors de la mise à jour du partenaire',
        error: error.message,
      })
    }
  }

  /**
   * PUT /api/partners/:id/archive
   * Archivage d'un partenaire (soft delete)
   */
  public async archive({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const success = await this.partnerService.archive(params.id, user)

      if (!success) {
        return response.notFound({
          message: 'Partenaire non trouvé',
        })
      }

      return response.ok({
        message: 'Partenaire archivé avec succès',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de l\'archivage du partenaire',
        error: error.message,
      })
    }
  }
}
```

**`app/features/partners/services/PartnerService.ts`**
```typescript
import { inject } from '@adonisjs/core'
import Partner from '../models/Partner'
import Classification from '../../classifications/models/Classification'
import { AuditService } from '../../../shared/services/AuditService'
import type { CreatePartnerData, UpdatePartnerData, PartnerFilters } from '../types'
import type User from '../../users/models/User'

@inject()
export class PartnerService {
  constructor(private auditService: AuditService) {}

  /**
   * Recherche paginée des partenaires avec filtres
   */
  public async paginate(
    pagination: { page: number; limit: number },
    filters: PartnerFilters,
    user: User
  ) {
    const query = Partner.query()
      .preload('classifications')
      .preload('createdBy')
      .where('isArchived', false) // Exclure les partenaires archivés par défaut

    // Appliquer les filtres
    if (filters.search) {
      query.where((subQuery) => {
        subQuery
          .whereILike('firstName', `%${filters.search}%`)
          .orWhereILike('lastName', `%${filters.search}%`)
          .orWhereILike('company', `%${filters.search}%`)
          .orWhereILike('email', `%${filters.search}%`)
      })
    }

    if (filters.classification) {
      query.whereHas('classifications', (classificationQuery) => {
        classificationQuery.where('id', filters.classification)
      })
    }

    if (filters.rating) {
      query.where('rating', filters.rating)
    }

    if (filters.isBlacklisted !== undefined) {
      query.where('isBlacklisted', filters.isBlacklisted)
    }

    // Tri par défaut : nom, prénom
    query.orderBy('lastName', 'asc').orderBy('firstName', 'asc')

    const partners = await query.paginate(pagination.page, pagination.limit)

    // Audit de la consultation
    await this.auditService.log(user.id, 'PARTNER_LIST_VIEWED', 'Partner', null, {
      filters,
      resultCount: partners.total,
    })

    return partners
  }

  /**
   * Trouver un partenaire par ID
   */
  public async findById(id: string, user: User): Promise<Partner | null> {
    const partner = await Partner.query()
      .where('id', id)
      .where('isArchived', false)
      .preload('classifications')
      .preload('recommendations')
      .preload('createdBy')
      .first()

    if (partner) {
      // Audit de la consultation
      await this.auditService.log(user.id, 'PARTNER_VIEWED', 'Partner', id, {
        partnerName: `${partner.firstName} ${partner.lastName}`,
      })
    }

    return partner
  }

  /**
   * Créer un nouveau partenaire
   */
  public async create(data: CreatePartnerData, user: User): Promise<Partner> {
    const partner = await Partner.create({
      ...data,
      createdById: user.id,
    })

    // Associer les classifications si fournies
    if (data.classificationIds && data.classificationIds.length > 0) {
      await partner.related('classifications').sync(data.classificationIds)
    }

    // Recharger avec les relations
    await partner.load('classifications')
    await partner.load('createdBy')

    // Audit de la création
    await this.auditService.log(user.id, 'PARTNER_CREATED', 'Partner', partner.id, {
      partnerData: {
        name: `${partner.firstName} ${partner.lastName}`,
        company: partner.company,
        email: partner.email,
      },
    })

    return partner
  }

  /**
   * Mettre à jour un partenaire
   */
  public async update(
    id: string,
    data: UpdatePartnerData,
    user: User
  ): Promise<Partner | null> {
    const partner = await Partner.find(id)

    if (!partner || partner.isArchived) {
      return null
    }

    const oldData = partner.toJSON()

    // Mise à jour des données principales
    partner.merge(data)
    await partner.save()

    // Mise à jour des classifications si fournies
    if (data.classificationIds !== undefined) {
      await partner.related('classifications').sync(data.classificationIds)
    }

    // Recharger avec les relations
    await partner.load('classifications')

    // Audit de la modification
    await this.auditService.log(user.id, 'PARTNER_UPDATED', 'Partner', partner.id, {
      oldData,
      newData: partner.toJSON(),
      changes: this.getChangedFields(oldData, partner.toJSON()),
    })

    return partner
  }

  /**
   * Archiver un partenaire (soft delete)
   */
  public async archive(id: string, user: User): Promise<boolean> {
    const partner = await Partner.find(id)

    if (!partner || partner.isArchived) {
      return false
    }

    partner.isArchived = true
    partner.archivedAt = new Date()
    await partner.save()

    // Audit de l'archivage
    await this.auditService.log(user.id, 'PARTNER_ARCHIVED', 'Partner', partner.id, {
      partnerData: {
        name: `${partner.firstName} ${partner.lastName}`,
        company: partner.company,
      },
    })

    return true
  }

  /**
   * Utilitaire pour identifier les champs modifiés
   */
  private getChangedFields(oldData: any, newData: any): string[] {
    const changes: string[] = []
    const fieldsToCheck = ['firstName', 'lastName', 'email', 'phone', 'company', 'rating', 'isBlacklisted']

    fieldsToCheck.forEach((field) => {
      if (oldData[field] !== newData[field]) {
        changes.push(field)
      }
    })

    return changes
  }
}
```

---

## 5. Guide de développement

### 5.1. Conventions de code et bonnes pratiques

#### Conventions de nommage
| Élément | Convention | Exemple |
|---------|------------|---------|
| **Variables** | camelCase | `partnerList`, `userId` |
| **Fonctions** | camelCase | `getPartnerById()`, `fetchUsers()` |
| **Classes** | PascalCase | `PartnerController`, `UserService` |
| **Interfaces/Types** | PascalCase | `PartnerDTO`, `UserRole` |
| **Enums** | PascalCase | `PartnerStatus`, `UserType` |
| **Fichiers** | kebab-case | `partner-controller.ts` |
| **Dossiers** | kebab-case | `user-services/` |
| **Constantes** | UPPER_SNAKE_CASE | `API_URL`, `MAX_PARTNERS` |

#### Règles de développement

**TypeScript strict**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**ESLint configuration stricte**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@antfu', // Configuration stricte et moderne
    'plugin:@typescript-eslint/strict',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
}
```

### 5.2. Workflow Git et conventions de commits

#### Git Flow adapté
```mermaid
gitgraph
    commit id: "Initial commit"
    branch develop
    checkout develop
    commit id: "Setup project"
    
    branch feature/auth
    checkout feature/auth
    commit id: "Add OAuth2"
    commit id: "Add auth middleware"
    checkout develop
    merge feature/auth
    
    branch feature/partners
    checkout feature/partners
    commit id: "Add partner model"
    commit id: "Add partner API"
    checkout develop
    merge feature/partners
    
    checkout main
    merge develop
    commit id: "Release v1.0.0"
```

#### Conventions de commits (Gitmoji + Conventional)
```bash
# Nouvelle fonctionnalité
git commit -m "✨ feat: add partner archiving endpoint"

# Correction de bug
git commit -m "🐛 fix: correct partner list filter logic"

# Refactoring
git commit -m "♻️ refactor: extract user service"

# Documentation
git commit -m "📝 docs: update API documentation"

# Tests
git commit -m "✅ test: add e2e test for login"

# CI/CD
git commit -m "🚀 ci: add GitHub Actions workflow"
```

#### Hooks Git avec Husky
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-push": "npm run test:ci"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### 5.3. Standards de développement par feature

#### Structure type d'une feature
```typescript
// src/features/partners/types/index.ts
export interface Partner {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company: string
  jobTitle?: string
  notes?: string
  rating?: number
  isBlacklisted: boolean
  isArchived: boolean
  classifications: Classification[]
  createdAt: string
  updatedAt: string
}

export interface PartnerFilters {
  search?: string
  classification?: string
  rating?: number
  isBlacklisted?: boolean
  isArchived?: boolean
}

export interface CreatePartnerData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company: string
  jobTitle?: string
  notes?: string
  classificationIds?: string[]
}
```

#### Service API type
```typescript
// src/features/partners/services/partnerApi.ts
import { apiClient } from '@/shared/utils/api'
import type { Partner, PartnerFilters, CreatePartnerData } from '../types'

export const partnerApi = {
  async getAll(filters?: PartnerFilters): Promise<{ data: Partner[]; meta: any }> {
    const response = await apiClient.get('/partners', { params: filters })
    return response.data
  },

  async getById(id: string): Promise<Partner> {
    const response = await apiClient.get(`/partners/${id}`)
    return response.data.data
  },

  async create(data: CreatePartnerData): Promise<Partner> {
    const response = await apiClient.post('/partners', data)
    return response.data.data
  },

  async update(id: string, data: Partial<CreatePartnerData>): Promise<Partner> {
    const response = await apiClient.put(`/partners/${id}`, data)
    return response.data.data
  },

  async archive(id: string): Promise<void> {
    await apiClient.put(`/partners/${id}/archive`)
  },

  async search(query: string): Promise<Partner[]> {
    const response = await apiClient.get('/partners', {
      params: { search: query }
    })
    return response.data.data
  },
}
```

### 5.4. Gestion des erreurs et exceptions

#### Frontend - Gestion d'erreurs React
```typescript
// src/shared/components/ErrorBoundary.tsx
import React, { type ReactNode } from 'react'
import * as Sentry from '@sentry/react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  fallback 
}) => {
  return (
    <Sentry.ErrorBoundary 
      fallback={fallback || <ErrorFallback />}
      beforeCapture={(scope) => {
        scope.setTag('errorBoundary', true)
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}

const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Une erreur inattendue s'est produite
      </h2>
      <p className="text-gray-600 mb-4">
        Nos équipes ont été notifiées automatiquement.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Recharger la page
      </button>
    </div>
  </div>
)
```

#### Backend - Exceptions personnalisées
```typescript
// app/shared/exceptions/BusinessException.ts
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export class BusinessException extends Exception {
  static status = 400
  static code = 'E_BUSINESS_ERROR'

  constructor(message: string, public readonly errorCode?: string) {
    super(message, { status: 400, code: 'E_BUSINESS_ERROR' })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response.status(error.status).json({
      message: error.message,
      code: error.errorCode || 'BUSINESS_ERROR',
      status: error.status,
    })
  }
}

// Utilisation
export class PartnerService {
  async archive(id: string, user: User): Promise<boolean> {
    const partner = await Partner.find(id)

    if (!partner) {
      throw new BusinessException('Partenaire non trouvé', 'PARTNER_NOT_FOUND')
    }

    if (partner.isArchived) {
      throw new BusinessException('Partenaire déjà archivé', 'PARTNER_ALREADY_ARCHIVED')
    }

    // ... logique métier
  }
}
```

---

## 6. Documentation API

### 6.1. Vue d'ensemble de l'API

L'API RPM-CL est une **API REST privée** développée avec AdonisJS v6, suivant les standards OpenAPI 3.0 et respectant les principes REST.

#### Caractéristiques principales :
- **Base URL** : `https://api.rpm-cl.com/api` (production) / `http://localhost:3333/api` (développement)
- **Format** : JSON uniquement
- **Authentification** : OAuth2 + JWT Bearer Token
- **Versioning** : Via header `Accept: application/vnd.api+json;version=1`
- **Rate Limiting** : 1000 requêtes/heure par utilisateur
- **CORS** : Configuré pour les domaines autorisés uniquement

#### Standards respectés :
- **Codes HTTP** : Utilisation sémantique des codes de statut
- **Pagination** : Cursor-based pour performance optimale
- **Filtrage** : Query parameters standardisés
- **Tri** : Support multi-critères avec `sort=field1,-field2`
- **Champs partiels** : Support de `fields=field1,field2`

### 6.2. Authentification et autorisation

#### OAuth2 Flow avec LinkedIn
```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant Frontend as Frontend (Next.js)
    participant API as Backend API
    participant LinkedIn as LinkedIn OAuth2
    
    User->>Frontend: Clic "Se connecter"
    Frontend->>LinkedIn: Redirect vers LinkedIn OAuth2
    LinkedIn->>User: Demande autorisation
    User->>LinkedIn: Accepte autorisation
    LinkedIn->>Frontend: Redirect avec code
    Frontend->>API: POST /auth/linkedin (code)
    API->>LinkedIn: Échange code contre access_token
    LinkedIn->>API: Retourne user data + access_token
    API->>API: Crée/met à jour utilisateur
    API->>Frontend: Retourne JWT + user data
    Frontend->>User: Connexion réussie
```

#### Endpoints d'authentification

**POST /api/auth/linkedin**
```typescript
// Échange du code OAuth2 contre un JWT
POST /api/auth/linkedin
Content-Type: application/json

{
  "code": "linkedin_oauth_code",
  "redirectUri": "http://localhost:3000/auth/callback"
}

// Réponse 200
{
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@cabinet-laurent.com",
      "role": "ADMIN",
      "avatar": "https://linkedin.com/avatar.jpg"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresAt": "2025-07-01T12:00:00Z"
    }
  }
}
```

**POST /api/auth/refresh**
```typescript
// Renouvellement du token
POST /api/auth/refresh
Authorization: Bearer refresh_token_here

// Réponse 200
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2025-07-01T12:00:00Z"
  }
}
```

**POST /api/auth/logout**
```typescript
// Déconnexion et invalidation des tokens
POST /api/auth/logout
Authorization: Bearer access_token_here

// Réponse 200
{
  "message": "Déconnexion réussie"
}
```

#### Middleware d'authentification
```typescript
// Headers requis pour toutes les requêtes authentifiées
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
Accept: application/vnd.api+json;version=1
```

### 6.3. Endpoints partenaires

#### GET /api/partners
```typescript
// Liste paginée des partenaires avec filtres
GET /api/partners?page=1&limit=20&search=dupont&classification=avocat&rating=5&sort=lastName,-createdAt
Authorization: Bearer token

// Réponse 200
{
  "data": [
    {
      "id": "uuid",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@exemple.com",
      "phone": "+33123456789",
      "company": "Cabinet Dupont",
      "jobTitle": "Avocat d'affaires",
      "rating": 5,
      "isBlacklisted": false,
      "isArchived": false,
      "notes": "Excellent partenaire, très réactif",
      "classifications": [
        {
          "id": "uuid",
          "name": "Avocat d'affaires",
          "type": "METIER"
        }
      ],
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-06-30T14:20:00Z",
      "createdBy": {
        "id": "uuid",
        "firstName": "Admin",
        "lastName": "Cabinet"
      }
    }
  ],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "lastPage": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "links": {
    "first": "/api/partners?page=1&limit=20",
    "last": "/api/partners?page=8&limit=20",
    "next": "/api/partners?page=2&limit=20",
    "previous": null
  }
}
```

#### GET /api/partners/:id
```typescript
// Détail d'un partenaire
GET /api/partners/uuid-here
Authorization: Bearer token

// Réponse 200
{
  "data": {
    "id": "uuid",
    "firstName": "Jean",
    "lastName": "Dupont",
    // ... autres champs partenaire
    "recommendations": [
      {
        "id": "uuid",
        "clientName": "Société ABC",
        "date": "2025-06-15",
        "comment": "Recommandation pour fusion-acquisition",
        "createdBy": {
          "firstName": "Marie",
          "lastName": "Martin"
        }
      }
    ],
    "stats": {
      "totalRecommendations": 12,
      "lastRecommendation": "2025-06-15",
      "avgRating": 4.8
    }
  }
}

// Réponse 404
{
  "message": "Partenaire non trouvé",
  "error": "PARTNER_NOT_FOUND",
  "status": 404
}
```

#### POST /api/partners
```typescript
// Création d'un nouveau partenaire
POST /api/partners
Authorization: Bearer token
Content-Type: application/json

{
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie.martin@exemple.com",
  "phone": "+33987654321",
  "company": "Cabinet Martin & Associés",
  "jobTitle": "Notaire",
  "notes": "Spécialiste en droit immobilier",
  "classificationIds": ["uuid-notaire", "uuid-immobilier"]
}

// Réponse 201
{
  "message": "Partenaire créé avec succès",
  "data": {
    "id": "new-uuid",
    "firstName": "Marie",
    "lastName": "Martin",
    // ... données complètes du partenaire créé
  }
}

// Réponse 400 - Validation
{
  "message": "Données invalides",
  "errors": [
    {
      "field": "email",
      "message": "L'email est obligatoire"
    },
    {
      "field": "email",
      "message": "Le format de l'email est invalide"
    }
  ],
  "status": 400
}

// Réponse 409 - Conflit
{
  "message": "Un partenaire avec cet email existe déjà",
  "error": "EMAIL_ALREADY_EXISTS",
  "status": 409
}
```

#### PUT /api/partners/:id
```typescript
// Mise à jour d'un partenaire
PUT /api/partners/uuid-here
Authorization: Bearer token
Content-Type: application/json

{
  "rating": 4,
  "notes": "Notes mises à jour",
  "classificationIds": ["uuid-avocat", "uuid-fiscal"]
}

// Réponse 200
{
  "message": "Partenaire mis à jour avec succès",
  "data": {
    // ... données complètes du partenaire mis à jour
  }
}
```

#### PUT /api/partners/:id/archive
```typescript
// Archivage d'un partenaire (soft delete)
PUT /api/partners/uuid-here/archive
Authorization: Bearer token

// Réponse 200
{
  "message": "Partenaire archivé avec succès"
}

// Réponse 404
{
  "message": "Partenaire non trouvé",
  "error": "PARTNER_NOT_FOUND",
  "status": 404
}
```

### 6.4. Endpoints classifications

#### GET /api/classifications
```typescript
// Liste des classifications (métiers, sous-métiers, tags)
GET /api/classifications?type=METIER&parent=uuid-parent
Authorization: Bearer token

// Réponse 200
{
  "data": [
    {
      "id": "uuid",
      "name": "Avocat d'affaires",
      "type": "METIER",
      "parentId": null,
      "children": [
        {
          "id": "uuid-child",
          "name": "Droit des sociétés",
          "type": "SOUS_METIER",
          "parentId": "uuid"
        }
      ],
      "partnerCount": 15,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/classifications
```typescript
// Création d'une nouvelle classification (Admin uniquement)
POST /api/classifications
Authorization: Bearer token
Content-Type: application/json

{
  "name": "Expert-comptable",
  "type": "METIER",
  "parentId": null
}

// Réponse 201
{
  "message": "Classification créée avec succès",
  "data": {
    "id": "new-uuid",
    "name": "Expert-comptable",
    "type": "METIER",
    "parentId": null,
    "createdAt": "2025-06-30T15:00:00Z"
  }
}
```

### 6.5. Endpoints recherche et statistiques

#### GET /api/search
```typescript
// Recherche globale multi-entités
GET /api/search?q=dupont&entities=partners,classifications&limit=10
Authorization: Bearer token

// Réponse 200
{
  "data": {
    "partners": [
      {
        "id": "uuid",
        "firstName": "Jean",
        "lastName": "Dupont",
        "company": "Cabinet Dupont",
        "highlight": {
          "lastName": "<mark>Dupont</mark>"
        }
      }
    ],
    "classifications": [],
    "total": 1
  }
}
```

#### GET /api/stats
```typescript
// Statistiques du tableau de bord
GET /api/stats?period=last_30_days
Authorization: Bearer token

// Réponse 200
{
  "data": {
    "overview": {
      "totalPartners": 156,
      "activePartners": 142,
      "archivedPartners": 14,
      "blacklistedPartners": 3,
      "avgRating": 4.2
    },
    "recentActivity": [
      {
        "type": "PARTNER_CREATED",
        "date": "2025-06-30T10:00:00Z",
        "description": "Nouveau partenaire: Marie Martin"
      }
    ],
    "topClassifications": [
      {
        "name": "Avocat d'affaires",
        "count": 45,
        "percentage": 28.8
      }
    ],
    "monthlyTrends": {
      "partners": [
        { "month": "2025-06", "count": 12 },
        { "month": "2025-05", "count": 8 }
      ]
    }
  }
}
```

### 6.6. Gestion des erreurs standardisée

#### Codes de statut HTTP utilisés
| Code | Signification | Usage |
|------|---------------|-------|
| **200** | OK | Succès des opérations GET, PUT |
| **201** | Created | Succès des opérations POST |
| **204** | No Content | Succès sans contenu (DELETE) |
| **400** | Bad Request | Données invalides, validation échouée |
| **401** | Unauthorized | Token manquant ou invalide |
| **403** | Forbidden | Accès refusé (rôle insuffisant) |
| **404** | Not Found | Ressource non trouvée |
| **409** | Conflict | Conflit (doublon, état incompatible) |
| **422** | Unprocessable Entity | Entité non traitable |
| **429** | Too Many Requests | Rate limit dépassé |
| **500** | Internal Server Error | Erreur serveur |

#### Format standardisé des réponses d'erreur
```typescript
// Erreur de validation (400)
{
  "message": "Données invalides",
  "errors": [
    {
      "field": "email",
      "message": "L'email est obligatoire"
    },
    {
      "field": "email",
      "message": "Le format de l'email est invalide"
    }
  ],
  "status": 400,
  "timestamp": "2025-06-30T15:00:00Z",
  "path": "/api/partners"
}

// Erreur métier (409)
{
  "message": "Un partenaire avec cet email existe déjà",
  "error": "EMAIL_ALREADY_EXISTS",
  "status": 409,
  "timestamp": "2025-06-30T15:00:00Z",
  "path": "/api/partners"
}

// Erreur d'autorisation (403)
{
  "message": "Accès refusé",
  "error": "INSUFFICIENT_PERMISSIONS",
  "requiredRole": "ADMIN",
  "userRole": "CONSULTANT",
  "status": 403,
  "timestamp": "2025-06-30T15:00:00Z",
  "path": "/api/classifications"
}

// Erreur rate limit (429)
{
  "message": "Trop de requêtes",
  "error": "RATE_LIMIT_EXCEEDED",
  "limit": 1000,
  "remaining": 0,
  "resetAt": "2025-06-30T16:00:00Z",
  "status": 429
}
```

### 6.7. Rate Limiting et quotas

#### Configuration par rôle
```typescript
const rateLimits = {
  ADMIN: {
    requests: 2000,
    window: '1 hour',
    burst: 50
  },
  CONSULTANT: {
    requests: 1000,
    window: '1 hour',
    burst: 30
  },
  COLLABORATEUR: {
    requests: 500,
    window: '1 hour',
    burst: 20
  }
}
```

#### Headers de rate limiting
```typescript
// Headers inclus dans toutes les réponses
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1656604800
X-RateLimit-Window: 3600
```

### 6.8. Pagination et filtrage avancé

#### Pagination cursor-based
```typescript
// Requête avec curseur
GET /api/partners?cursor=eyJpZCI6InV1aWQiLCJjcmVhdGVkQXQi&limit=20
Authorization: Bearer token

// Réponse avec curseurs
{
  "data": [...],
  "meta": {
    "hasNextPage": true,
    "hasPreviousPage": false,
    "limit": 20
  },
  "cursors": {
    "before": null,
    "after": "eyJpZCI6InV1aWQyIiwiY3JlYXRlZEF0I"
  }
}
```

#### Filtres avancés supportés
```typescript
// Filtres complexes
GET /api/partners?filter[rating][gte]=4&filter[company][like]=cabinet&filter[createdAt][between]=2025-01-01,2025-06-30
Authorization: Bearer token

// Opérateurs supportés
{
  "eq": "égal à",
  "ne": "différent de", 
  "gt": "supérieur à",
  "gte": "supérieur ou égal à",
  "lt": "inférieur à",
  "lte": "inférieur ou égal à",
  "like": "contient (insensible à la casse)",
  "in": "dans la liste",
  "between": "entre deux valeurs"
}
```

### 6.9. Documentation Swagger/OpenAPI

#### Configuration automatique
```typescript
// config/swagger.ts
export default {
  path: '/docs',
  title: 'RPM-CL API Documentation',
  version: '1.0.0',
  description: 'API de gestion des relations partenaires - Cabinet Laurent',
  contact: {
    name: 'Équipe développement',
    email: 'dev@cabinet-laurent.com'
  },
  servers: [
    {
      url: 'https://api.rpm-cl.com',
      description: 'Production'
    },
    {
      url: 'http://localhost:3333',
      description: 'Développement'
    }
  ],
  security: [
    {
      bearerAuth: []
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}
```

#### Accès à la documentation
- **Développement** : http://localhost:3333/docs
- **Production** : https://api.rpm-cl.com/docs
- **Format JSON** : https://api.rpm-cl.com/docs/json
- **Format YAML** : https://api.rpm-cl.com/docs/yaml

#### Exemple d'annotation Swagger
```typescript
// app/features/partners/controllers/PartnerController.ts
export default class PartnerController {
  /**
   * @swagger
   * /api/partners:
   *   get:
   *     tags:
   *       - Partners
   *     summary: Liste des partenaires
   *     description: Récupère une liste paginée des partenaires avec filtres optionnels
   *     parameters:
   *       - name: page
   *         in: query
   *         description: Numéro de page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - name: limit
   *         in: query
   *         description: Nombre d'éléments par page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *     responses:
   *       200:
   *         description: Liste des partenaires récupérée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PartnerListResponse'
   *       401:
   *         description: Non authentifié
   *       403:
   *         description: Accès refusé
   */
  public async index({ request, response, auth }: HttpContext) {
    // ... implémentation
  }
}
```

---

## 7. Base de données

### 7.1. Vue d'ensemble du schéma

La base de données RPM-CL utilise **PostgreSQL 15** pour sa robustesse, ses capacités de recherche avancées et sa conformité ACID. Le schéma est optimisé pour la performance, la sécurité RGPD et l'évolutivité.

#### Principes de conception :
- **UUID** pour toutes les clés primaires (sécurité, distribution)
- **Soft delete** via `isArchived` (conformité RGPD)
- **Audit trail** complet pour traçabilité
- **Index optimisés** pour recherche et performance
- **Contraintes strictes** pour intégrité des données
- **Chiffrement** des données sensibles au niveau application

### 7.2. Diagramme ERD complet

```mermaid
erDiagram
    User {
        uuid id PK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar password_hash
        enum role
        boolean is_active
        boolean consent_gdpr
        timestamp created_at
        timestamp updated_at
    }
    
    Partner {
        uuid id PK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar phone
        varchar company
        varchar job_title
        text notes_encrypted
        int rating
        boolean is_blacklisted
        boolean is_archived
        timestamp archived_at
        uuid created_by_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    Classification {
        uuid id PK
        varchar name
        enum type
        uuid parent_id FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    PartnerClassification {
        uuid partner_id FK
        uuid classification_id FK
        timestamp created_at
    }
    
    Recommendation {
        uuid id PK
        uuid partner_id FK
        varchar client_name_encrypted
        date recommendation_date
        text comment_encrypted
        enum status
        uuid created_by_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    Notification {
        uuid id PK
        uuid user_id FK
        varchar type
        text content
        json metadata
        boolean is_read
        timestamp read_at
        timestamp expires_at
        timestamp created_at
    }
    
    AuditTrail {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        json old_data
        json new_data
        varchar ip_address
        varchar user_agent
        timestamp created_at
    }
    
    Session {
        uuid id PK
        uuid user_id FK
        varchar token_hash
        varchar refresh_token_hash
        json metadata
        timestamp expires_at
        timestamp created_at
        timestamp last_activity_at
    }

    User ||--o{ Partner : "creates"
    User ||--o{ Recommendation : "creates"
    User ||--o{ Notification : "receives"
    User ||--o{ AuditTrail : "generates"
    User ||--o{ Session : "has"
    
    Partner ||--o{ Recommendation : "receives"
    Partner }o--o{ Classification : "categorized_by"
    
    Classification ||--o{ Classification : "parent_of"
    
    PartnerClassification }o--|| Partner : "belongs_to"
    PartnerClassification }o--|| Classification : "uses"
```

### 7.3. Migrations AdonisJS détaillées

#### Migration 001 - Table Users
```typescript
// database/migrations/001_create_users_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Clé primaire UUID
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      
      // Informations personnelles
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password_hash', 255).nullable() // Nullable pour OAuth2 only
      
      // Authentification LinkedIn
      table.string('linkedin_id', 100).nullable().unique()
      table.string('linkedin_access_token', 500).nullable()
      table.string('avatar_url', 500).nullable()
      
      // Rôles et statut
      table.enum('role', ['ADMIN', 'CONSULTANT', 'COLLABORATEUR']).defaultTo('COLLABORATEUR')
      table.boolean('is_active').defaultTo(true)
      table.boolean('consent_gdpr').defaultTo(false)
      table.timestamp('consent_gdpr_at').nullable()
      
      // Préférences utilisateur
      table.json('preferences').defaultTo('{}')
      table.enum('theme', ['light', 'dark', 'system']).defaultTo('system')
      table.string('language', 5).defaultTo('fr')
      
      // Audit timestamps
      table.timestamp('last_login_at').nullable()
      table.string('last_login_ip', 45).nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      
      // Index pour performance
      table.index(['email'])
      table.index(['linkedin_id'])
      table.index(['role'])
      table.index(['is_active'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

#### Migration 002 - Table Partners
```typescript
// database/migrations/002_create_partners_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'partners'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Clé primaire UUID
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      
      // Informations personnelles (chiffrées côté application)
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 255).nullable().unique()
      table.string('phone', 30).nullable()
      
      // Informations professionnelles
      table.string('company', 255).notNullable()
      table.string('job_title', 150).nullable()
      table.text('notes_encrypted').nullable() // Chiffré côté application
      
      // LinkedIn integration
      table.string('linkedin_url', 500).nullable()
      table.string('linkedin_id', 100).nullable()
      table.timestamp('linkedin_last_sync').nullable()
      
      // Évaluation et statut
      table.integer('rating').nullable().checkBetween([1, 5])
      table.boolean('is_blacklisted').defaultTo(false)
      table.text('blacklist_reason_encrypted').nullable()
      table.timestamp('blacklisted_at').nullable()
      
      // Soft delete pour RGPD
      table.boolean('is_archived').defaultTo(false)
      table.timestamp('archived_at').nullable()
      table.text('archive_reason').nullable()
      
      // Relations et audit
      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      
      // Index pour performance et recherche
      table.index(['email'])
      table.index(['company'])
      table.index(['first_name', 'last_name'])
      table.index(['rating'])
      table.index(['is_blacklisted'])
      table.index(['is_archived'])
      table.index(['created_by_id'])
      table.index(['created_at'])
      
      // Index de recherche full-text (PostgreSQL)
      this.raw(`
        CREATE INDEX partners_search_idx ON partners 
        USING gin(to_tsvector('french', 
          unaccent(
            coalesce(first_name, '') || ' ' || 
            coalesce(last_name, '') || ' ' || 
            coalesce(company, '') || ' ' || 
            coalesce(job_title, '')
          )
        ))
      `)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

#### Migration 003 - Table Classifications
```typescript
// database/migrations/003_create_classifications_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Clé primaire UUID
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      
      // Informations de classification
      table.string('name', 150).notNullable()
      table.text('description').nullable()
      table.enum('type', ['METIER', 'SOUS_METIER', 'TAG']).notNullable()
      
      // Hiérarchie (pour sous-métiers)
      table.uuid('parent_id').references('id').inTable('classifications').onDelete('CASCADE')
      table.integer('sort_order').defaultTo(0)
      
      // Statut et configuration
      table.boolean('is_active').defaultTo(true)
      table.string('color', 7).nullable() // Code couleur hex
      table.string('icon', 50).nullable() // Nom de l'icône
      
      // Audit
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      
      // Contraintes et index
      table.unique(['name', 'type', 'parent_id'])
      table.index(['type'])
      table.index(['parent_id'])
      table.index(['is_active'])
      table.index(['sort_order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

#### Migration 004 - Table Partner Classifications (Many-to-Many)
```typescript
// database/migrations/004_create_partner_classifications_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'partner_classifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Clés étrangères composant la clé primaire
      table.uuid('partner_id').references('id').inTable('partners').onDelete('CASCADE')
      table.uuid('classification_id').references('id').inTable('classifications').onDelete('CASCADE')
      
      // Métadonnées de la relation
      table.boolean('is_primary').defaultTo(false) // Classification principale
      table.integer('confidence_level').defaultTo(100) // Niveau de confiance (1-100)
      table.text('notes').nullable()
      
      // Audit
      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      
      // Clé primaire composite
      table.primary(['partner_id', 'classification_id'])
      
      // Index pour performance
      table.index(['partner_id'])
      table.index(['classification_id'])
      table.index(['is_primary'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

#### Migration 005 - Table Recommendations
```typescript
// database/migrations/005_create_recommendations_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recommendations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Clé primaire UUID
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      
      // Relations
      table.uuid('partner_id').references('id').inTable('partners').onDelete('CASCADE')
      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      
      // Informations de la recommandation (chiffrées)
      table.string('client_name_encrypted', 500).notNullable()
      table.text('client_context_encrypted').nullable()
      table.date('recommendation_date').notNullable()
      table.text('comment_encrypted').nullable()
      
      // Suivi de la recommandation
      table.enum('status', ['PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED']).defaultTo('PENDING')
      table.enum('outcome', ['SUCCESS', 'PARTIAL', 'FAILURE', 'UNKNOWN']).nullable()
      table.integer('satisfaction_rating').nullable().checkBetween([1, 5])
      table.text('outcome_notes_encrypted').nullable()
      
      // Métadonnées
      table.decimal('estimated_value', 10, 2).nullable() // Valeur estimée en euros
      table.decimal('actual_value', 10, 2).nullable() // Valeur réelle
      table.enum('urgency', ['LOW', 'MEDIUM', 'HIGH']).defaultTo('MEDIUM')
      
      // Dates de suivi
      table.timestamp('followed_up_at').nullable()
      table.timestamp('completed_at').nullable()
      
      // Audit
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      
      // Index pour performance
      table.index(['partner_id'])
      table.index(['created_by_id'])
      table.index(['recommendation_date'])
      table.index(['status'])
      table.index(['outcome'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

#### Migration 006 - Table Audit Trail
```typescript
// database/migrations/006_create_audit_trails_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_trails'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Clé primaire UUID
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      
      // Utilisateur et session
      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL')
      table.string('session_id', 100).nullable()
      
      // Action effectuée
      table.string('action', 100).notNullable() // CREATE, UPDATE, DELETE, VIEW, etc.
      table.string('entity_type', 50).notNullable() // Partner, User, Classification, etc.
      table.uuid('entity_id').nullable()
      
      // Données de l'audit
      table.json('old_data').nullable() // État avant modification
      table.json('new_data').nullable() // État après modification
      table.json('metadata').nullable() // Métadonnées additionnelles
      
      // Context de la requête
      table.string('ip_address', 45).nullable()
      table.text('user_agent').nullable()
      table.string('endpoint', 200).nullable()
      table.string('method', 10).nullable()
      
      // Géolocalisation (optionnelle)
      table.string('country', 2).nullable()
      table.string('city', 100).nullable()
      
      // Timestamp
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      
      // Index pour performance et conformité RGPD
      table.index(['user_id'])
      table.index(['entity_type', 'entity_id'])
      table.index(['action'])
      table.index(['created_at'])
      table.index(['ip_address'])
      
      // Index composites pour requêtes fréquentes
      table.index(['user_id', 'created_at'])
      table.index(['entity_type', 'action', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### 7.4. Modèles Lucid ORM avec relations

#### Modèle User
```typescript
// app/features/users/models/User.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, computed } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Partner from '../../partners/models/Partner'
import AuditTrail from '../../shared/models/AuditTrail'
import hash from '@adonisjs/core/services/hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null }) // Ne pas exposer dans les réponses API
  declare passwordHash: string | null

  @column()
  declare linkedinId: string | null

  @column({ serializeAs: null })
  declare linkedinAccessToken: string | null

  @column()
  declare avatarUrl: string | null

  @column()
  declare role: 'ADMIN' | 'CONSULTANT' | 'COLLABORATEUR'

  @column()
  declare isActive: boolean

  @column()
  declare consentGdpr: boolean

  @column.dateTime()
  declare consentGdprAt: DateTime | null

  @column({ prepare: (value: any) => JSON.stringify(value) })
  declare preferences: Record<string, any>

  @column()
  declare theme: 'light' | 'dark' | 'system'

  @column()
  declare language: string

  @column.dateTime()
  declare lastLoginAt: DateTime | null

  @column()
  declare lastLoginIp: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @hasMany(() => Partner, {
    foreignKey: 'createdById',
  })
  declare createdPartners: HasMany<typeof Partner>

  @hasMany(() => AuditTrail)
  declare auditTrails: HasMany<typeof AuditTrail>

  // Computed properties
  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @computed()
  get isAdmin() {
    return this.role === 'ADMIN'
  }

  @computed()
  get canManagePartners() {
    return ['ADMIN', 'CONSULTANT'].includes(this.role)
  }

  // Méthodes utilitaires
  async verifyPassword(plainPassword: string) {
    if (!this.passwordHash) return false
    return hash.verify(this.passwordHash, plainPassword)
  }

  async updateLastLogin(ipAddress: string) {
    this.lastLoginAt = DateTime.now()
    this.lastLoginIp = ipAddress
    await this.save()
  }

  // Hooks
  static async hashPassword(user: User) {
    if (user.$dirty.passwordHash) {
      user.passwordHash = await hash.make(user.passwordHash)
    }
  }
}

// Hooks Lucid
User.before('save', User.hashPassword)
```

#### Modèle Partner avec chiffrement
```typescript
// app/features/partners/models/Partner.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from '../../users/models/User'
import Classification from '../../classifications/models/Classification'
import Recommendation from '../../recommendations/models/Recommendation'
import { encrypt, decrypt } from '../../../shared/helpers/encryption'

export default class Partner extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column()
  declare company: string

  @column()
  declare jobTitle: string | null

  // Champ chiffré
  @column({
    prepare: (value: string) => value ? encrypt(value) : null,
    consume: (value: string) => value ? decrypt(value) : null,
  })
  declare notes: string | null

  @column()
  declare linkedinUrl: string | null

  @column()
  declare linkedinId: string | null

  @column.dateTime()
  declare linkedinLastSync: DateTime | null

  @column()
  declare rating: number | null

  @column()
  declare isBlacklisted: boolean

  @column({
    prepare: (value: string) => value ? encrypt(value) : null,
    consume: (value: string) => value ? decrypt(value) : null,
  })
  declare blacklistReason: string | null

  @column.dateTime()
  declare blacklistedAt: DateTime | null

  @column()
  declare isArchived: boolean

  @column.dateTime()
  declare archivedAt: DateTime | null

  @column()
  declare archiveReason: string | null

  @column()
  declare createdById: string | null

  @column()
  declare updatedById: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'createdById',
  })
  declare createdBy: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'updatedById',
  })
  declare updatedBy: BelongsTo<typeof User>

  @manyToMany(() => Classification, {
    pivotTable: 'partner_classifications',
    pivotColumns: ['is_primary', 'confidence_level', 'notes', 'created_by_id'],
  })
  declare classifications: ManyToMany<typeof Classification>

  @hasMany(() => Recommendation)
  declare recommendations: HasMany<typeof Recommendation>

  // Computed properties
  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @computed()
  get displayName() {
    return `${this.fullName} - ${this.company}`
  }

  @computed()
  get status() {
    if (this.isArchived) return 'archived'
    if (this.isBlacklisted) return 'blacklisted'
    return 'active'
  }

  @computed()
  get ratingStars() {
    return this.rating ? '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating) : '☆☆☆☆☆'
  }

  // Scopes pour les requêtes fréquentes
  static activePartners = (query: any) => {
    return query.where('isArchived', false)
  }

  static byRating = (query: any, minRating: number) => {
    return query.where('rating', '>=', minRating)
  }

  static byClassification = (query: any, classificationId: string) => {
    return query.whereHas('classifications', (subQuery: any) => {
      subQuery.where('classifications.id', classificationId)
    })
  }

  // Méthodes métier
  async archive(reason?: string, userId?: string) {
    this.isArchived = true
    this.archivedAt = DateTime.now()
    this.archiveReason = reason || null
    this.updatedById = userId || null
    await this.save()
  }

  async blacklist(reason: string, userId?: string) {
    this.isBlacklisted = true
    this.blacklistReason = reason
    this.blacklistedAt = DateTime.now()
    this.updatedById = userId || null
    await this.save()
  }

  async updateRating(rating: number, userId?: string) {
    if (rating < 1 || rating > 5) {
      throw new Error('La note doit être comprise entre 1 et 5')
    }
    this.rating = rating
    this.updatedById = userId || null
    await this.save()
  }
}
```

---

## 8. Tests et qualité

### 8.1. Stratégie de tests globale

La stratégie de tests RPM-CL suit la **pyramide de tests** avec une approche **Test-Driven Development (TDD)** pour garantir la qualité, la fiabilité et la maintenabilité du code.

#### Pyramide de tests adoptée :
```mermaid
graph TB
    subgraph "E2E Tests (10%)"
        E1[Playwright Tests]
        E2[Parcours utilisateur complets]
        E3[Tests cross-browser]
    end
    
    subgraph "Integration Tests (20%)"
        I1[API Integration Tests]
        I2[Database Integration]
        I3[External Services]
    end
    
    subgraph "Unit Tests (70%)"
        U1[Services & Controllers]
        U2[Components React]
        U3[Utilities & Helpers]
        U4[Models & Validators]
    end
    
    E1 --> I1
    I1 --> U1
```

#### Objectifs de couverture :
- **Couverture globale** : ≥ 90%
- **Couverture critique** : 100% (authentification, RGPD, paiements)
- **Tests E2E** : Couvrent 100% des user stories MVP
- **Performance** : Tests de charge automatisés
- **Sécurité** : Tests de vulnérabilités intégrés

### 8.2. Tests unitaires

#### Configuration Jest pour le Backend (AdonisJS)
```typescript
// jest.config.js (backend)
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/tests/**/*.test.ts',
    '**/*.test.ts'
  ],
  collectCoverageFrom: [
    'app/**/*.ts',
    '!app/**/*.d.ts',
    '!app/**/index.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Seuils critiques plus élevés
    'app/features/auth/**/*.ts': {
      branches: 90,
      functions: 95,
      lines: 90,
      statements: 90,
    },
    'app/shared/services/AuditService.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  maxWorkers: '50%',
}
```

#### Exemple de test unitaire - PartnerService
```typescript
// app/features/partners/__tests__/services/PartnerService.test.ts
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { PartnerService } from '../../services/PartnerService'
import { AuditService } from '../../../../shared/services/AuditService'
import User from '../../../users/models/User'
import Partner from '../../models/Partner'
import { PartnerFactory, UserFactory, ClassificationFactory } from '../../../../../database/factories'

test.group('PartnerService', (group) => {
  let partnerService: PartnerService
  let auditService: AuditService
  let adminUser: User

  group.setup(async () => {
    auditService = new AuditService()
    partnerService = new PartnerService(auditService)
    adminUser = await UserFactory.merge({ role: 'ADMIN' }).create()
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('devrait créer un partenaire avec classifications', async ({ assert }) => {
    // Arrange
    const classification = await ClassificationFactory.create()
    const partnerData = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@test.com',
      company: 'Test Company',
      classificationIds: [classification.id],
    }

    // Act
    const partner = await partnerService.create(partnerData, adminUser)

    // Assert
    assert.equal(partner.firstName, 'Jean')
    assert.equal(partner.lastName, 'Dupont')
    assert.equal(partner.email, 'jean.dupont@test.com')
    assert.equal(partner.createdById, adminUser.id)
    
    await partner.load('classifications')
    assert.lengthOf(partner.classifications, 1)
    assert.equal(partner.classifications[0].id, classification.id)
  })

  test('devrait valider l\'unicité de l\'email', async ({ assert }) => {
    // Arrange
    const existingPartner = await PartnerFactory.create()
    const partnerData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: existingPartner.email, // Email déjà existant
      company: 'Another Company',
    }

    // Act & Assert
    await assert.rejects(
      () => partnerService.create(partnerData, adminUser),
      'Un partenaire avec cet email existe déjà'
    )
  })

  test('devrait archiver un partenaire et créer un audit trail', async ({ assert }) => {
    // Arrange
    const partner = await PartnerFactory.create()
    const reason = 'Partenaire inactif'

    // Act
    const result = await partnerService.archive(partner.id, adminUser, reason)

    // Assert
    assert.isTrue(result)
    
    await partner.refresh()
    assert.isTrue(partner.isArchived)
    assert.isNotNull(partner.archivedAt)
    assert.equal(partner.archiveReason, reason)

    // Vérifier l'audit trail
    const auditEntry = await Database.from('audit_trails')
      .where('entity_type', 'Partner')
      .where('entity_id', partner.id)
      .where('action', 'PARTNER_ARCHIVED')
      .first()

    assert.isNotNull(auditEntry)
    assert.equal(auditEntry.user_id, adminUser.id)
  })

  test('devrait filtrer les partenaires par classification', async ({ assert }) => {
    // Arrange
    const classification1 = await ClassificationFactory.create()
    const classification2 = await ClassificationFactory.create()
    
    const partner1 = await PartnerFactory.create()
    const partner2 = await PartnerFactory.create()
    
    await partner1.related('classifications').sync([classification1.id])
    await partner2.related('classifications').sync([classification2.id])

    // Act
    const result = await partnerService.paginate(
      { page: 1, limit: 10 },
      { classification: classification1.id },
      adminUser
    )

    // Assert
    assert.lengthOf(result.data, 1)
    assert.equal(result.data[0].id, partner1.id)
  })

  test('devrait chiffrer les notes sensibles', async ({ assert }) => {
    // Arrange
    const sensitiveNote = 'Information confidentielle sur le partenaire'
    const partnerData = {
      firstName: 'Test',
      lastName: 'Partner',
      email: 'test@example.com',
      company: 'Test Company',
      notes: sensitiveNote,
    }

    // Act
    const partner = await partnerService.create(partnerData, adminUser)

    // Assert
    assert.equal(partner.notes, sensitiveNote) // Décrypté par le modèle
    
    // Vérifier que c'est bien chiffré en base
    const rawPartner = await Database.from('partners')
      .where('id', partner.id)
      .first()
    
    assert.notEqual(rawPartner.notes_encrypted, sensitiveNote)
    assert.isTrue(rawPartner.notes_encrypted.startsWith('enc:')) // Préfixe de chiffrement
  })
})
```

#### Configuration Jest pour le Frontend (Next.js)
```typescript
// jest.config.js (frontend)
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '**/tests/**/*.test.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Composants critiques
    'src/features/auth/**/*.{ts,tsx}': {
      branches: 90,
      functions: 95,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(customJestConfig)
```

#### Exemple de test composant React
```typescript
// src/features/partners/__tests__/components/PartnerCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { PartnerCard } from '../../components/PartnerCard'
import type { Partner } from '../../types'

const mockPartner: Partner = {
  id: 'test-id',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@test.com',
  phone: '+33123456789',
  company: 'Test Company',
  jobTitle: 'CEO',
  rating: 4,
  isBlacklisted: false,
  isArchived: false,
  classifications: [
    { id: 'class-1', name: 'Avocat d\'affaires', type: 'METIER' }
  ],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('PartnerCard', () => {
  const mockHandlers = {
    onEdit: jest.fn(),
    onArchive: jest.fn(),
    onCall: jest.fn(),
    onEmail: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('affiche les informations du partenaire', () => {
    render(
      <PartnerCard partner={mockPartner} {...mockHandlers} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText('Avocat d\'affaires')).toBeInTheDocument()
  })

  it('affiche le bon nombre d\'étoiles pour la notation', () => {
    render(
      <PartnerCard partner={mockPartner} {...mockHandlers} />,
      { wrapper: createWrapper() }
    )

    const stars = screen.getAllByTestId('star')
    const filledStars = stars.filter(star => 
      star.classList.contains('text-yellow-400')
    )
    
    expect(filledStars).toHaveLength(4) // rating = 4
  })

  it('affiche le badge blacklisté si nécessaire', () => {
    const blacklistedPartner = { ...mockPartner, isBlacklisted: true }
    
    render(
      <PartnerCard partner={blacklistedPartner} {...mockHandlers} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Blacklisté')).toBeInTheDocument()
  })

  it('déclenche l\'action d\'appel au clic sur le bouton téléphone', async () => {
    const user = userEvent.setup()
    
    render(
      <PartnerCard partner={mockPartner} {...mockHandlers} />,
      { wrapper: createWrapper() }
    )

    const callButton = screen.getByText('Appeler')
    await user.click(callButton)

    expect(mockHandlers.onCall).toHaveBeenCalledWith('+33123456789')
  })

  it('déclenche l\'action d\'email au clic sur le bouton email', async () => {
    const user = userEvent.setup()
    
    render(
      <PartnerCard partner={mockPartner} {...mockHandlers} />,
      { wrapper: createWrapper() }
    )

    const emailButton = screen.getByText('Email')
    await user.click(emailButton)

    expect(mockHandlers.onEmail).toHaveBeenCalledWith('jean.dupont@test.com')
  })

  it('affiche les boutons d\'action uniquement si les données sont présentes', () => {
    const partnerWithoutContact = { 
      ...mockPartner, 
      phone: undefined, 
      email: undefined 
    }
    
    render(
      <PartnerCard partner={partnerWithoutContact} {...mockHandlers} />,
      { wrapper: createWrapper() }
    )

    expect(screen.queryByText('Appeler')).not.toBeInTheDocument()
    expect(screen.queryByText('Email')).not.toBeInTheDocument()
  })
})
```

### 8.3. Tests d'intégration

#### Tests d'intégration API avec Supertest
```typescript
// tests/integration/partners.test.ts
import { test } from '@japa/runner'
import supertest from 'supertest'
import { Application } from '@adonisjs/core/app'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory, PartnerFactory, ClassificationFactory } from '../../database/factories'

test.group('Partners API Integration', (group) => {
  let app: Application
  let request: supertest.SuperTest<supertest.Test>
  let authToken: string
  let adminUser: any

  group.setup(async () => {
    app = await import('../../app')
    request = supertest(app.handle.bind(app))
    
    // Créer un utilisateur admin et obtenir le token
    adminUser = await UserFactory.merge({ role: 'ADMIN' }).create()
    const authResponse = await request
      .post('/api/auth/test-login') // Endpoint de test
      .send({ userId: adminUser.id })
    
    authToken = authResponse.body.data.accessToken
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('GET /api/partners - devrait retourner une liste paginée', async ({ assert }) => {
    // Arrange
    await PartnerFactory.createMany(15)

    // Act
    const response = await request
      .get('/api/partners')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ page: 1, limit: 10 })

    // Assert
    assert.equal(response.status, 200)
    assert.lengthOf(response.body.data, 10)
    assert.equal(response.body.meta.total, 15)
    assert.equal(response.body.meta.page, 1)
    assert.equal(response.body.meta.lastPage, 2)
  })

  test('POST /api/partners - devrait créer un nouveau partenaire', async ({ assert }) => {
    // Arrange
    const classification = await ClassificationFactory.create()
    const partnerData = {
      firstName: 'Test',
      lastName: 'Partner',
      email: 'test.partner@example.com',
      company: 'Test Company',
      classificationIds: [classification.id],
    }

    // Act
    const response = await request
      .post('/api/partners')
      .set('Authorization', `Bearer ${authToken}`)
      .send(partnerData)

    // Assert
    assert.equal(response.status, 201)
    assert.equal(response.body.data.firstName, 'Test')
    assert.equal(response.body.data.email, 'test.partner@example.com')
    assert.equal(response.body.data.classifications.length, 1)
  })

  test('POST /api/partners - devrait échouer avec email invalide', async ({ assert }) => {
    // Arrange
    const partnerData = {
      firstName: 'Test',
      lastName: 'Partner',
      email: 'invalid-email', // Email invalide
      company: 'Test Company',
    }

    // Act
    const response = await request
      .post('/api/partners')
      .set('Authorization', `Bearer ${authToken}`)
      .send(partnerData)

    // Assert
    assert.equal(response.status, 400)
    assert.include(response.body.message, 'Données invalides')
    assert.isArray(response.body.errors)
    
    const emailError = response.body.errors.find((e: any) => e.field === 'email')
    assert.isNotNull(emailError)
  })

  test('PUT /api/partners/:id/archive - devrait archiver un partenaire', async ({ assert }) => {
    // Arrange
    const partner = await PartnerFactory.create()
    const reason = 'Partenaire inactif'

    // Act
    const response = await request
      .put(`/api/partners/${partner.id}/archive`)
      .set('Authorization', `Bearer ${authToken}`)

    // Assert
    assert.equal(response.status, 200)
    assert.include(response.body.message, 'archivé avec succès')

    // Vérifier en base
    await partner.refresh()
    assert.isTrue(partner.isArchived)
    assert.isNotNull(partner.archivedAt)
    assert.equal(partner.archiveReason, reason)

    // Vérifier l'audit trail
    const auditEntry = await Database.from('audit_trails')
      .where('entity_type', 'Partner')
      .where('entity_id', partner.id)
      .where('action', 'PARTNER_ARCHIVED')
      .first()

    assert.isNotNull(auditEntry)
    assert.equal(auditEntry.user_id, adminUser.id)
  })

  test('devrait filtrer les partenaires par classification', async ({ assert }) => {
    // Arrange
    const classification1 = await ClassificationFactory.create()
    const classification2 = await ClassificationFactory.create()
    
    const partner1 = await PartnerFactory.create()
    const partner2 = await PartnerFactory.create()
    
    await partner1.related('classifications').sync([classification1.id])
    await partner2.related('classifications').sync([classification2.id])

    // Act
    const response = await request
      .get('/api/partners')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ classification: classification1.id })

    // Assert
    assert.equal(response.status, 200)
    assert.lengthOf(response.body.data, 1)
    assert.equal(response.body.data[0].id, partner1.id)
  })

  test('GET /api/partners - devrait respecter le rate limiting', async ({ assert }) => {
    // Test de rate limiting (adapté selon la configuration)
    const requests = Array.from({ length: 51 }, (_, i) => 
      request
        .get('/api/partners')
        .set('Authorization', `Bearer ${authToken}`)
    )

    const responses = await Promise.all(requests)
    const rateLimitedResponses = responses.filter(r => r.status === 429)
    
    assert.isAbove(rateLimitedResponses.length, 0)
  })
})
```

### 8.4. Tests End-to-End avec Playwright

#### Configuration Playwright
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      cwd: './frontend',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      cwd: './backend',
      port: 3333,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
```

#### Tests E2E critiques
```typescript
// e2e/tests/partner-management.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsAdmin, createTestPartner, cleanupTestData } from '../helpers'

test.describe('Gestion des partenaires', () => {
  test.beforeEach(async ({ page }) => {
    await cleanupTestData()
    await loginAsAdmin(page)
  })

  test.afterEach(async () => {
    await cleanupTestData()
  })

  test('Parcours complet de création d\'un partenaire', async ({ page }) => {
    // Navigation vers la page de création
    await page.goto('/partners')
    await page.click('[data-testid="create-partner-button"]')

    // Vérifier l'URL
    await expect(page).toHaveURL('/partners/new')

    // Remplir le formulaire
    await page.fill('[data-testid="first-name-input"]', 'Jean')
    await page.fill('[data-testid="last-name-input"]', 'Dupont')
    await page.fill('[data-testid="email-input"]', 'jean.dupont@test.com')
    await page.fill('[data-testid="phone-input"]', '+33123456789')
    await page.fill('[data-testid="company-input"]', 'Cabinet Test')
    await page.fill('[data-testid="job-title-input"]', 'Avocat')

    // Sélectionner une classification
    await page.click('[data-testid="classification-select"]')
    await page.click('[data-testid="classification-option-avocat"]')

    // Ajouter une note
    await page.fill('[data-testid="notes-textarea"]', 'Excellent partenaire de test')

    // Soumettre le formulaire
    await page.click('[data-testid="submit-button"]')

    // Vérifier la redirection et le message de succès
    await expect(page).toHaveURL(/\/partners\/[a-f0-9-]+/)
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Partenaire créé avec succès')

    // Vérifier les données affichées
    await expect(page.locator('[data-testid="partner-name"]')).toContainText('Jean Dupont')
    await expect(page.locator('[data-testid="partner-company"]')).toContainText('Cabinet Test')
    await expect(page.locator('[data-testid="partner-email"]')).toContainText('jean.dupont@test.com')
  })

  test('Recherche et filtrage des partenaires', async ({ page }) => {
    // Créer des partenaires de test
    await createTestPartner({ firstName: 'Marie', lastName: 'Martin', company: 'Cabinet A' })
    await createTestPartner({ firstName: 'Pierre', lastName: 'Dupont', company: 'Cabinet B' })
    await createTestPartner({ firstName: 'Sophie', lastName: 'Bernard', company: 'Notaires C' })

    await page.goto('/partners')

    // Test de recherche par nom
    await page.fill('[data-testid="search-input"]', 'Dupont')
    await page.keyboard.press('Enter')
    
    await expect(page.locator('[data-testid="partner-card"]')).toHaveCount(1)
    await expect(page.locator('[data-testid="partner-card"]').first()).toContainText('Pierre Dupont')

    // Effacer la recherche
    await page.fill('[data-testid="search-input"]', '')
    await page.keyboard.press('Enter')

    // Test de filtrage par métier
    await page.click('[data-testid="classification-filter"]')
    await page.click('[data-testid="filter-notaire"]')
    
    await expect(page.locator('[data-testid="partner-card"]')).toHaveCount(1)
    await expect(page.locator('[data-testid="partner-card"]').first()).toContainText('Sophie Bernard')
  })

  test('Actions rapides (appel et email)', async ({ page }) => {
    const partner = await createTestPartner({
      firstName: 'Contact',
      lastName: 'Test',
      phone: '+33123456789',
      email: 'contact@test.com'
    })

    await page.goto(`/partners/${partner.id}`)

    // Test du bouton d'appel (vérifie le href)
    const callButton = page.locator('[data-testid="call-button"]')
    await expect(callButton).toHaveAttribute('href', 'tel:+33123456789')

    // Test du bouton email (vérifie le href)
    const emailButton = page.locator('[data-testid="email-button"]')
    await expect(emailButton).toHaveAttribute('href', 'mailto:contact@test.com')
  })

  test('Notation d\'un partenaire', async ({ page }) => {
    const partner = await createTestPartner({ firstName: 'Rating', lastName: 'Test' })

    await page.goto(`/partners/${partner.id}`)

    // Cliquer sur la 4ème étoile
    await page.click('[data-testid="star-4"]')

    // Vérifier la mise à jour visuelle
    await expect(page.locator('[data-testid="star-1"]')).toHaveClass(/text-yellow-400/)
    await expect(page.locator('[data-testid="star-4"]')).toHaveClass(/text-yellow-400/)
    await expect(page.locator('[data-testid="star-5"]')).toHaveClass(/text-gray-300/)

    // Vérifier le message de confirmation
    await expect(page.locator('[data-testid="rating-success"]')).toContainText('Note mise à jour')
  })

  test('Archivage d\'un partenaire', async ({ page }) => {
    const partner = await createTestPartner({ firstName: 'Archive', lastName: 'Test' })

    await page.goto(`/partners/${partner.id}`)

    // Cliquer sur le bouton d'archivage
    await page.click('[data-testid="archive-button"]')

    // Confirmer dans la modale
    await expect(page.locator('[data-testid="archive-modal"]')).toBeVisible()
    await page.click('[data-testid="confirm-archive-button"]')

    // Vérifier la redirection et le message
    await expect(page).toHaveURL('/partners')
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Partenaire archivé')

    // Vérifier que le partenaire n'apparaît plus dans la liste
    await expect(page.locator('[data-testid="partner-card"]')).not.toContainText('Archive Test')
  })
})
```

#### Tests E2E d'authentification
```typescript
// e2e/tests/authentication.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentification', () => {
  test('Connexion via LinkedIn OAuth2', async ({ page }) => {
    await page.goto('/login')

    // Vérifier la présence du bouton LinkedIn
    const linkedinButton = page.locator('[data-testid="linkedin-login-button"]')
    await expect(linkedinButton).toBeVisible()
    await expect(linkedinButton).toContainText('Se connecter avec LinkedIn')

    // Cliquer sur le bouton (en mode test, on mocke la réponse)
    await linkedinButton.click()

    // En mode test, on simule une réponse réussie
    // En production, cela redirigerait vers LinkedIn
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('Redirection si non authentifié', async ({ page }) => {
    await page.goto('/partners')

    // Vérifier la redirection vers login
    await expect(page).toHaveURL('/login')
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible()
  })

  test('Déconnexion', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/dashboard')

    // Ouvrir le menu utilisateur
    await page.click('[data-testid="user-menu-button"]')
    
    // Cliquer sur déconnexion
    await page.click('[data-testid="logout-button"]')

    // Vérifier la redirection
    await expect(page).toHaveURL('/login')
    
    // Vérifier qu'on ne peut plus accéder aux pages protégées
    await page.goto('/partners')
    await expect(page).toHaveURL('/login')
  })
})
```

### 8.5. Tests de performance et de charge

#### Configuration K6 pour tests de charge
```javascript
// performance/load-tests/api-load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

// Métriques personnalisées
const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Montée progressive
    { duration: '5m', target: 50 }, // Charge normale
    { duration: '2m', target: 100 }, // Pic de charge
    { duration: '5m', target: 100 }, // Maintien du pic
    { duration: '2m', target: 0 }, // Descente
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% des requêtes < 500ms
    http_req_failed: ['rate<0.02'], // Moins de 2% d'erreur
    errors: ['rate<0.05'], // Moins de 5% d'erreur métier
  },
}

// Token d'authentification (à générer via un setup)
const AUTH_TOKEN = __ENV.AUTH_TOKEN || 'test-token'
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3333'

export function setup() {
  // Connexion et récupération du token
  const loginResponse = http.post(`${BASE_URL}/api/auth/test-login`, {
    userId: 'test-user-id'
  })
  
  return {
    authToken: loginResponse.json('data.accessToken')
  }
}

export default function(data) {
  const params = {
    headers: {
      'Authorization': `Bearer ${data.authToken}`,
      'Content-Type': 'application/json',
    },
  }

  // Test de la liste des partenaires (lecture)
  const partnersResponse = http.get(`${BASE_URL}/api/partners`, params)
  check(partnersResponse, {
    'partners list status is 200': (r) => r.status === 200,
    'partners list response time < 300ms': (r) => r.timings.duration < 300,
    'partners list has data': (r) => JSON.parse(r.body).data.length >= 0,
  }) || errorRate.add(1)

  sleep(1)

  // Test de recherche (plus coûteux)
  const searchResponse = http.get(
    `${BASE_URL}/api/partners?search=test&limit=10`,
    params
  )
  check(searchResponse, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1)

  sleep(1)

  // Test de création (écriture)
  const createData = {
    firstName: `User${__VU}`,
    lastName: `Test${__ITER}`,
    email: `user${__VU}-${__ITER}@loadtest.com`,
    company: `Company ${__VU}`,
  }

  const createResponse = http.post(
    `${BASE_URL}/api/partners`,
    JSON.stringify(createData),
    params
  )
  check(createResponse, {
    'create status is 201': (r) => r.status === 201,
    'create response time < 800ms': (r) => r.timings.duration < 800,
  }) || errorRate.add(1)

  sleep(2)
}

export function teardown(data) {
  // Nettoyage si nécessaire
  console.log('Load test completed')
}
```

#### Tests de performance Frontend avec Lighthouse CI
```yaml
# .lighthouserc.yml
ci:
  collect:
    url:
      - http://localhost:3000
      - http://localhost:3000/login
      - http://localhost:3000/partners
      - http://localhost:3000/dashboard
    numberOfRuns: 3
    settings:
      chromeFlags: '--no-sandbox --headless'
  assert:
    preset: lighthouse:recommended
    assertions:
      categories:performance: ['error', {minScore: 0.9}]
      categories:accessibility: ['error', {minScore: 0.95}]
      categories:best-practices: ['error', {minScore: 0.9}]
      categories:seo: ['error', {minScore: 0.8}]
      # Métriques spécifiques
      first-contentful-paint: ['error', {maxNumericValue: 1500}]
      largest-contentful-paint: ['error', {maxNumericValue: 2500}]
      cumulative-layout-shift: ['error', {maxNumericValue: 0.1}]
      total-blocking-time: ['error', {maxNumericValue: 150}]
  upload:
    target: temporary-public-storage
  server:
    port: 9001
    storage: .lighthouseci
```

---

## 9. Sécurité et RGPD

### 9.1. Vue d'ensemble de la sécurité

La sécurité RPM-CL suit une approche **Security by Design** avec une conformité RGPD stricte. Toutes les données sensibles sont protégées selon les standards de l'industrie juridique française.

#### Principes de sécurité adoptés :
- **Chiffrement** : AES-256 pour les données au repos, TLS 1.3 en transit
- **Authentification forte** : OAuth2 + JWT avec rotation automatique
- **Autorisation granulaire** : RBAC (Role-Based Access Control)
- **Audit trail complet** : Traçabilité de toutes les actions sensibles
- **Isolation des données** : Séparation par environnement et utilisateur
- **Principe du moindre privilège** : Accès minimal nécessaire

#### Conformité réglementaire :
- ✅ **RGPD** (Règlement Général sur la Protection des Données)
- ✅ **Loi Informatique et Libertés**
- ✅ **Référentiel CNIL sécurité**
- ✅ **Standards ISO 27001** (recommandations)

### 9.2. Architecture de sécurité

```mermaid
graph TB
    subgraph "Frontend Security"
        A[Content Security Policy]
        B[XSS Protection]
        C[CSRF Tokens]
        D[Secure Storage]
    end
    
    subgraph "API Security"
        E[OAuth2 + JWT]
        F[Rate Limiting]
        G[Input Validation]
        H[CORS Policy]
    end
    
    subgraph "Data Security"
        I[AES-256 Encryption]
        J[Hashed Passwords]
        K[Secure DB Connection]
        L[Audit Trail]
    end
    
    subgraph "Infrastructure Security"
        M[HTTPS/TLS 1.3]
        N[Firewall Rules]
        O[VPN Access]
        P[Monitoring/Alerts]
    end
    
    A --> E
    E --> I
    I --> M
    
    subgraph "RGPD Compliance"
        Q[Consent Management]
        R[Right to Erasure]
        S[Data Portability]
        T[Privacy by Design]
    end
    
    L --> Q
```

### 9.3. Authentification et autorisation

#### Implémentation OAuth2 avec LinkedIn
```typescript
// app/features/auth/services/AuthService.ts
import { inject } from '@adonisjs/core'
import jwt from 'jsonwebtoken'
import { AuditService } from '../../../shared/services/AuditService'
import { EncryptionService } from '../../../shared/services/EncryptionService'
import User from '../../users/models/User'

@inject()
export class AuthService {
  constructor(
    private auditService: AuditService,
    private encryptionService: EncryptionService
  ) {}

  /**
   * Authentification OAuth2 LinkedIn
   */
  async authenticateWithLinkedIn(
    code: string,
    redirectUri: string,
    ipAddress: string,
    userAgent: string
  ) {
    try {
      // 1. Échanger le code contre un access token
      const tokenResponse = await this.exchangeLinkedInCode(code, redirectUri)
      
      // 2. Récupérer les données utilisateur LinkedIn
      const linkedinUser = await this.getLinkedInUserProfile(tokenResponse.access_token)
      
      // 3. Trouver ou créer l'utilisateur
      let user = await User.findBy('linkedinId', linkedinUser.id)
      
      if (!user) {
        // Vérifier si l'email existe déjà
        const existingUser = await User.findBy('email', linkedinUser.email)
        if (existingUser) {
          throw new Error('Un compte existe déjà avec cette adresse email')
        }
        
        // Créer nouvel utilisateur
        user = await User.create({
          firstName: linkedinUser.localizedFirstName,
          lastName: linkedinUser.localizedLastName,
          email: linkedinUser.emailAddress,
          linkedinId: linkedinUser.id,
          avatarUrl: linkedinUser.profilePicture?.displayImage,
          role: 'COLLABORATEUR', // Rôle par défaut
          consentGdpr: false, // À confirmer explicitement
        })

        // Audit de création de compte
        await this.auditService.log(
          user.id,
          'USER_CREATED',
          'User',
          user.id,
          {
            method: 'linkedin_oauth',
            ipAddress,
            userAgent,
          }
        )
      }

      // 4. Mettre à jour les informations LinkedIn
      await this.updateLinkedInData(user, tokenResponse, linkedinUser)

      // 5. Générer les tokens JWT
      const tokens = await this.generateTokens(user)

      // 6. Créer la session sécurisée
      await this.createSecureSession(user, tokens, ipAddress, userAgent)

      // 7. Audit de connexion
      await this.auditService.log(
        user.id,
        'USER_LOGIN',
        'User',
        user.id,
        {
          method: 'linkedin_oauth',
          ipAddress,
          userAgent,
          success: true,
        }
      )

      return {
        user: this.sanitizeUserData(user),
        tokens,
      }
    } catch (error) {
      // Audit de tentative de connexion échouée
      await this.auditService.log(
        null,
        'USER_LOGIN_FAILED',
        'User',
        null,
        {
          method: 'linkedin_oauth',
          error: error.message,
          ipAddress,
          userAgent,
        }
      )
      
      throw error
    }
  }

  /**
   * Génération sécurisée des tokens JWT
   */
  private async generateTokens(user: User) {
    const now = Math.floor(Date.now() / 1000)
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + (15 * 60), // 15 minutes
      iss: 'rpm-cl-api',
      aud: 'rpm-cl-frontend',
    }

    const refreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
      iat: now,
      exp: now + (30 * 24 * 60 * 60), // 30 jours
      iss: 'rpm-cl-api',
    }

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.JWT_SECRET!,
      { algorithm: 'HS256' }
    )

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.JWT_REFRESH_SECRET!,
      { algorithm: 'HS256' }
    )

    return {
      accessToken,
      refreshToken,
      expiresAt: new Date((now + 15 * 60) * 1000),
    }
  }

  /**
   * Création de session sécurisée avec stockage chiffré
   */
  private async createSecureSession(
    user: User,
    tokens: any,
    ipAddress: string,
    userAgent: string
  ) {
    const session = await Session.create({
      userId: user.id,
      tokenHash: await this.encryptionService.hashToken(tokens.accessToken),
      refreshTokenHash: await this.encryptionService.hashToken(tokens.refreshToken),
      metadata: this.encryptionService.encrypt(JSON.stringify({
        ipAddress,
        userAgent,
        browser: this.parseBrowser(userAgent),
        os: this.parseOS(userAgent),
      })),
      expiresAt: tokens.expiresAt,
      lastActivityAt: new Date(),
    })

    // Nettoyer les anciennes sessions expirées
    await this.cleanupExpiredSessions(user.id)

    return session
  }

  /**
   * Validation et renouvellement de token
   */
  async refreshToken(refreshToken: string, ipAddress: string) {
    try {
      // Vérifier le refresh token
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)
      
      if (payload.type !== 'refresh') {
        throw new Error('Token invalide')
      }

      // Trouver la session
      const tokenHash = await this.encryptionService.hashToken(refreshToken)
      const session = await Session.query()
        .where('refreshTokenHash', tokenHash)
        .where('expiresAt', '>', new Date())
        .preload('user')
        .first()

      if (!session) {
        throw new Error('Session invalide ou expirée')
      }

      // Générer nouveaux tokens
      const newTokens = await this.generateTokens(session.user)

      // Mettre à jour la session
      session.tokenHash = await this.encryptionService.hashToken(newTokens.accessToken)
      session.refreshTokenHash = await this.encryptionService.hashToken(newTokens.refreshToken)
      session.expiresAt = newTokens.expiresAt
      session.lastActivityAt = new Date()
      await session.save()

      // Audit du renouvellement
      await this.auditService.log(
        session.user.id,
        'TOKEN_REFRESHED',
        'Session',
        session.id,
        { ipAddress }
      )

      return newTokens
    } catch (error) {
      // Audit de tentative de renouvellement échouée
      await this.auditService.log(
        null,
        'TOKEN_REFRESH_FAILED',
        'Session',
        null,
        { error: error.message, ipAddress }
      )
      
      throw new Error('Impossible de renouveler le token')
    }
  }

  /**
   * Déconnexion sécurisée
   */
  async logout(accessToken: string, ipAddress: string) {
    try {
      const tokenHash = await this.encryptionService.hashToken(accessToken)
      const session = await Session.query()
        .where('tokenHash', tokenHash)
        .preload('user')
        .first()

      if (session) {
        // Audit de déconnexion
        await this.auditService.log(
          session.user.id,
          'USER_LOGOUT',
          'User',
          session.user.id,
          { ipAddress }
        )

        // Supprimer la session
        await session.delete()
      }

      return true
    } catch (error) {
      throw new Error('Erreur lors de la déconnexion')
    }
  }
}
```

#### Middleware d'autorisation RBAC
```typescript
// app/shared/middleware/RoleMiddleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  /**
   * Vérification des rôles requis
   */
  async handle(
    { auth, response, request }: HttpContext,
    next: NextFn,
    requiredRoles: string[]
  ) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Authentification requise',
        error: 'AUTHENTICATION_REQUIRED',
      })
    }

    if (!user.isActive) {
      return response.forbidden({
        message: 'Compte désactivé',
        error: 'ACCOUNT_DISABLED',
      })
    }

    if (!user.consentGdpr) {
      return response.forbidden({
        message: 'Consentement RGPD requis',
        error: 'GDPR_CONSENT_REQUIRED',
      })
    }

    // Vérifier les rôles requis
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      // Audit de tentative d'accès non autorisé
      await AuditService.log(
        user.id,
        'UNAUTHORIZED_ACCESS_ATTEMPT',
        'Endpoint',
        null,
        {
          endpoint: request.url(),
          method: request.method(),
          requiredRoles,
          userRole: user.role,
          ipAddress: request.ip(),
        }
      )

      return response.forbidden({
        message: 'Accès refusé',
        error: 'INSUFFICIENT_PERMISSIONS',
        requiredRole: requiredRoles,
        userRole: user.role,
      })
    }

    await next()
  }
}

// Utilisation dans les routes
// Route.get('/admin/users', 'UserController.adminIndex').middleware(['auth', 'role:ADMIN'])
// Route.get('/partners', 'PartnerController.index').middleware(['auth', 'role:ADMIN,CONSULTANT'])
```

### 9.4. Chiffrement des données sensibles

#### Service de chiffrement AES-256
```typescript
// app/shared/services/EncryptionService.ts
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly keyLength = 32
  private readonly ivLength = 16
  private readonly tagLength = 16

  /**
   * Chiffrement AES-256-GCM des données sensibles
   */
  encrypt(plaintext: string): string {
    try {
      const key = this.getEncryptionKey()
      const iv = crypto.randomBytes(this.ivLength)
      
      const cipher = crypto.createCipher(this.algorithm, key)
      cipher.setAAD(Buffer.from('rpm-cl-data'))
      
      let encrypted = cipher.update(plaintext, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const tag = cipher.getAuthTag()
      
      // Format: iv:tag:encrypted
      return `enc:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`
    } catch (error) {
      throw new Error('Erreur de chiffrement des données')
    }
  }

  /**
   * Déchiffrement AES-256-GCM
   */
  decrypt(encryptedData: string): string {
    try {
      if (!encryptedData.startsWith('enc:')) {
        throw new Error('Format de données chiffrées invalide')
      }

      const parts = encryptedData.replace('enc:', '').split(':')
      if (parts.length !== 3) {
        throw new Error('Format de données chiffrées invalide')
      }

      const [ivHex, tagHex, encrypted] = parts
      const key = this.getEncryptionKey()
      const iv = Buffer.from(ivHex, 'hex')
      const tag = Buffer.from(tagHex, 'hex')

      const decipher = crypto.createDecipher(this.algorithm, key)
      decipher.setAAD(Buffer.from('rpm-cl-data'))
      decipher.setAuthTag(tag)

      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      throw new Error('Erreur de déchiffrement des données')
    }
  }

  /**
   * Hachage sécurisé des mots de passe
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  /**
   * Vérification de mot de passe
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Hachage de token pour stockage session
   */
  async hashToken(token: string): Promise<string> {
    return crypto
      .createHash('sha256')
      .update(token + process.env.TOKEN_SALT!)
      .digest('hex')
  }

  /**
   * Génération de clé de chiffrement dérivée
   */
  private getEncryptionKey(): Buffer {
    const masterKey = process.env.ENCRYPTION_KEY!
    if (!masterKey) {
      throw new Error('Clé de chiffrement non configurée')
    }

    // Dérivation de clé avec PBKDF2
    return crypto.pbkdf2Sync(
      masterKey,
      'rpm-cl-salt',
      100000, // 100k itérations
      this.keyLength,
      'sha512'
    )
  }

  /**
   * Génération de token sécurisé
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Hachage pour anonymisation RGPD
   */
  anonymizeData(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data + process.env.ANONYMIZATION_SALT!)
      .digest('hex')
      .substring(0, 16) // Troncature pour anonymisation
  }
}
```

#### Implémentation dans les modèles
```typescript
// app/features/partners/models/Partner.ts (extrait sécurisé)
import { EncryptionService } from '../../../shared/services/EncryptionService'

export default class Partner extends BaseModel {
  // Champs chiffrés automatiquement
  @column({
    prepare: (value: string) => value ? EncryptionService.encrypt(value) : null,
    consume: (value: string) => value ? EncryptionService.decrypt(value) : null,
  })
  declare notes: string | null

  @column({
    prepare: (value: string) => value ? EncryptionService.encrypt(value) : null,
    consume: (value: string) => value ? EncryptionService.decrypt(value) : null,
  })
  declare blacklistReason: string | null

  // Méthode d'anonymisation pour RGPD
  async anonymize(): Promise<void> {
    const encryptionService = new EncryptionService()
    
    this.firstName = encryptionService.anonymizeData(this.firstName)
    this.lastName = encryptionService.anonymizeData(this.lastName)
    this.email = `deleted_${Date.now()}@anonymized.local`
    this.phone = null
    this.notes = null
    this.blacklistReason = null
    this.isArchived = true
    this.archivedAt = DateTime.now()
    this.archiveReason = 'Anonymisation RGPD'
    
    await this.save()
  }
}
```

---

## 9. Sécurité et RGPD

### 9.1. Vue d'ensemble de la sécurité

La sécurité RPM-CL suit une approche **Security by Design** avec une conformité RGPD stricte. Toutes les données sensibles sont protégées selon les standards de l'industrie juridique française.

#### Principes de sécurité adoptés :
- **Chiffrement** : AES-256 pour les données au repos, TLS 1.3 en transit
- **Authentification forte** : OAuth2 + JWT avec rotation automatique
- **Autorisation granulaire** : RBAC (Role-Based Access Control)
- **Audit trail complet** : Traçabilité de toutes les actions sensibles
- **Isolation des données** : Séparation par environnement et utilisateur
- **Principe du moindre privilège** : Accès minimal nécessaire

#### Conformité réglementaire :
- ✅ **RGPD** (Règlement Général sur la Protection des Données)
- ✅ **Loi Informatique et Libertés**
- ✅ **Référentiel CNIL sécurité**
- ✅ **Standards ISO 27001** (recommandations)

### 9.2. Architecture de sécurité

```mermaid
graph TB
    subgraph "Frontend Security"
        A[Content Security Policy]
        B[XSS Protection]
        C[CSRF Tokens]
        D[Secure Storage]
    end
    
    subgraph "API Security"
        E[OAuth2 + JWT]
        F[Rate Limiting]
        G[Input Validation]
        H[CORS Policy]
    end
    
    subgraph "Data Security"
        I[AES-256 Encryption]
        J[Hashed Passwords]
        K[Secure DB Connection]
        L[Audit Trail]
    end
    
    subgraph "Infrastructure Security"
        M[HTTPS/TLS 1.3]
        N[Firewall Rules]
        O[VPN Access]
        P[Monitoring/Alerts]
    end
    
    A --> E
    E --> I
    I --> M
    
    subgraph "RGPD Compliance"
        Q[Consent Management]
        R[Right to Erasure]
        S[Data Portability]
        T[Privacy by Design]
    end
    
    L --> Q
```

### 9.3. Authentification et autorisation

#### Implémentation OAuth2 avec LinkedIn
```typescript
// app/features/auth/services/AuthService.ts
import { inject } from '@adonisjs/core'
import jwt from 'jsonwebtoken'
import { AuditService } from '../../../shared/services/AuditService'
import { EncryptionService } from '../../../shared/services/EncryptionService'
import User from '../../users/models/User'

@inject()
export class AuthService {
  constructor(
    private auditService: AuditService,
    private encryptionService: EncryptionService
  ) {}

  /**
   * Authentification OAuth2 LinkedIn
   */
  async authenticateWithLinkedIn(
    code: string,
    redirectUri: string,
    ipAddress: string,
    userAgent: string
  ) {
    try {
      // 1. Échanger le code contre un access token
      const tokenResponse = await this.exchangeLinkedInCode(code, redirectUri)
      
      // 2. Récupérer les données utilisateur LinkedIn
      const linkedinUser = await this.getLinkedInUserProfile(tokenResponse.access_token)
      
      // 3. Trouver ou créer l'utilisateur
      let user = await User.findBy('linkedinId', linkedinUser.id)
      
      if (!user) {
        // Vérifier si l'email existe déjà
        const existingUser = await User.findBy('email', linkedinUser.email)
        if (existingUser) {
          throw new Error('Un compte existe déjà avec cette adresse email')
        }
        
        // Créer nouvel utilisateur
        user = await User.create({
          firstName: linkedinUser.localizedFirstName,
          lastName: linkedinUser.localizedLastName,
          email: linkedinUser.emailAddress,
          linkedinId: linkedinUser.id,
          avatarUrl: linkedinUser.profilePicture?.displayImage,
          role: 'COLLABORATEUR', // Rôle par défaut
          consentGdpr: false, // À confirmer explicitement
        })

        // Audit de création de compte
        await this.auditService.log(
          user.id,
          'USER_CREATED',
          'User',
          user.id,
          {
            method: 'linkedin_oauth',
            ipAddress,
            userAgent,
          }
        )
      }

      // 4. Mettre à jour les informations LinkedIn
      await this.updateLinkedInData(user, tokenResponse, linkedinUser)

      // 5. Générer les tokens JWT
      const tokens = await this.generateTokens(user)

      // 6. Créer la session sécurisée
      await this.createSecureSession(user, tokens, ipAddress, userAgent)

      // 7. Audit de connexion
      await this.auditService.log(
        user.id,
        'USER_LOGIN',
        'User',
        user.id,
        {
          method: 'linkedin_oauth',
          ipAddress,
          userAgent,
          success: true,
        }
      )

      return {
        user: this.sanitizeUserData(user),
        tokens,
      }
    } catch (error) {
      // Audit de tentative de connexion échouée
      await this.auditService.log(
        null,
        'USER_LOGIN_FAILED',
        'User',
        null,
        {
          method: 'linkedin_oauth',
          error: error.message,
          ipAddress,
          userAgent,
        }
      )
      
      throw error
    }
  }

  /**
   * Génération sécurisée des tokens JWT
   */
  private async generateTokens(user: User) {
    const now = Math.floor(Date.now() / 1000)
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + (15 * 60), // 15 minutes
      iss: 'rpm-cl-api',
      aud: 'rpm-cl-frontend',
    }

    const refreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
      iat: now,
      exp: now + (30 * 24 * 60 * 60), // 30 jours
      iss: 'rpm-cl-api',
    }

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.JWT_SECRET!,
      { algorithm: 'HS256' }
    )

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.JWT_REFRESH_SECRET!,
      { algorithm: 'HS256' }
    )

    return {
      accessToken,
      refreshToken,
      expiresAt: new Date((now + 15 * 60) * 1000),
    }
  }

  /**
   * Création de session sécurisée avec stockage chiffré
   */
  private async createSecureSession(
    user: User,
    tokens: any,
    ipAddress: string,
    userAgent: string
  ) {
    const session = await Session.create({
      userId: user.id,
      tokenHash: await this.encryptionService.hashToken(tokens.accessToken),
      refreshTokenHash: await this.encryptionService.hashToken(tokens.refreshToken),
      metadata: this.encryptionService.encrypt(JSON.stringify({
        ipAddress,
        userAgent,
        browser: this.parseBrowser(userAgent),
        os: this.parseOS(userAgent),
      })),
      expiresAt: tokens.expiresAt,
      lastActivityAt: new Date(),
    })

    // Nettoyer les anciennes sessions expirées
    await this.cleanupExpiredSessions(user.id)

    return session
  }

  /**
   * Validation et renouvellement de token
   */
  async refreshToken(refreshToken: string, ipAddress: string) {
    try {
      // Vérifier le refresh token
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)
      
      if (payload.type !== 'refresh') {
        throw new Error('Token invalide')
      }

      // Trouver la session
      const tokenHash = await this.encryptionService.hashToken(refreshToken)
      const session = await Session.query()
        .where('refreshTokenHash', tokenHash)
        .where('expiresAt', '>', new Date())
        .preload('user')
        .first()

      if (!session) {
        throw new Error('Session invalide ou expirée')
      }

      // Générer nouveaux tokens
      const newTokens = await this.generateTokens(session.user)

      // Mettre à jour la session
      session.tokenHash = await this.encryptionService.hashToken(newTokens.accessToken)
      session.refreshTokenHash = await this.encryptionService.hashToken(newTokens.refreshToken)
      session.expiresAt = newTokens.expiresAt
      session.lastActivityAt = new Date()
      await session.save()

      // Audit du renouvellement
      await this.auditService.log(
        session.user.id,
        'TOKEN_REFRESHED',
        'Session',
        session.id,
        { ipAddress }
      )

      return newTokens
    } catch (error) {
      // Audit de tentative de renouvellement échouée
      await this.auditService.log(
        null,
        'TOKEN_REFRESH_FAILED',
        'Session',
        null,
        { error: error.message, ipAddress }
      )
      
      throw new Error('Impossible de renouveler le token')
    }
  }

  /**
   * Déconnexion sécurisée
   */
  async logout(accessToken: string, ipAddress: string) {
    try {
      const tokenHash = await this.encryptionService.hashToken(accessToken)
      const session = await Session.query()
        .where('tokenHash', tokenHash)
        .preload('user')
        .first()

      if (session) {
        // Audit de déconnexion
        await this.auditService.log(
          session.user.id,
          'USER_LOGOUT',
          'User',
          session.user.id,
          { ipAddress }
        )

        // Supprimer la session
        await session.delete()
      }

      return true
    } catch (error) {
      throw new Error('Erreur lors de la déconnexion')
    }
  }
}
```

#### Middleware d'autorisation RBAC
```typescript
// app/shared/middleware/RoleMiddleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  /**
   * Vérification des rôles requis
   */
  async handle(
    { auth, response, request }: HttpContext,
    next: NextFn,
    requiredRoles: string[]
  ) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Authentification requise',
        error: 'AUTHENTICATION_REQUIRED',
      })
    }

    if (!user.isActive) {
      return response.forbidden({
        message: 'Compte désactivé',
        error: 'ACCOUNT_DISABLED',
      })
    }

    if (!user.consentGdpr) {
      return response.forbidden({
        message: 'Consentement RGPD requis',
        error: 'GDPR_CONSENT_REQUIRED',
      })
    }

    // Vérifier les rôles requis
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      // Audit de tentative d'accès non autorisé
      await AuditService.log(
        user.id,
        'UNAUTHORIZED_ACCESS_ATTEMPT',
        'Endpoint',
        null,
        {
          endpoint: request.url(),
          method: request.method(),
          requiredRoles,
          userRole: user.role,
          ipAddress: request.ip(),
        }
      )

      return response.forbidden({
        message: 'Accès refusé',
        error: 'INSUFFICIENT_PERMISSIONS',
        requiredRole: requiredRoles,
        userRole: user.role,
      })
    }

    await next()
  }
}

// Utilisation dans les routes
// Route.get('/admin/users', 'UserController.adminIndex').middleware(['auth', 'role:ADMIN'])
// Route.get('/partners', 'PartnerController.index').middleware(['auth', 'role:ADMIN,CONSULTANT'])
```

### 9.4. Chiffrement des données sensibles

#### Service de chiffrement AES-256
```typescript
// app/shared/services/EncryptionService.ts
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly keyLength = 32
  private readonly ivLength = 16
  private readonly tagLength = 16

  /**
   * Chiffrement AES-256-GCM des données sensibles
   */
  encrypt(plaintext: string): string {
    try {
      const key = this.getEncryptionKey()
      const iv = crypto.randomBytes(this.ivLength)
      
      const cipher = crypto.createCipher(this.algorithm, key)
      cipher.setAAD(Buffer.from('rpm-cl-data'))
      
      let encrypted = cipher.update(plaintext, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const tag = cipher.getAuthTag()
      
      // Format: iv:tag:encrypted
      return `enc:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`
    } catch (error) {
      throw new Error('Erreur de chiffrement des données')
    }
  }

  /**
   * Déchiffrement AES-256-GCM
   */
  decrypt(encryptedData: string): string {
    try {
      if (!encryptedData.startsWith('enc:')) {
        throw new Error('Format de données chiffrées invalide')
      }

      const parts = encryptedData.replace('enc:', '').split(':')
      if (parts.length !== 3) {
        throw new Error('Format de données chiffrées invalide')
      }

      const [ivHex, tagHex, encrypted] = parts
      const key = this.getEncryptionKey()
      const iv = Buffer.from(ivHex, 'hex')
      const tag = Buffer.from(tagHex, 'hex')

      const decipher = crypto.createDecipher(this.algorithm, key)
      decipher.setAAD(Buffer.from('rpm-cl-data'))
      decipher.setAuthTag(tag)

      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      throw new Error('Erreur de déchiffrement des données')
    }
  }

  /**
   * Hachage sécurisé des mots de passe
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  /**
   * Vérification de mot de passe
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Hachage de token pour stockage session
   */
  async hashToken(token: string): Promise<string> {
    return crypto
      .createHash('sha256')
      .update(token + process.env.TOKEN_SALT!)
      .digest('hex')
  }

  /**
   * Génération de clé de chiffrement dérivée
   */
  private getEncryptionKey(): Buffer {
    const masterKey = process.env.ENCRYPTION_KEY!
    if (!masterKey) {
      throw new Error('Clé de chiffrement non configurée')
    }

    // Dérivation de clé avec PBKDF2
    return crypto.pbkdf2Sync(
      masterKey,
      'rpm-cl-salt',
      100000, // 100k itérations
      this.keyLength,
      'sha512'
    )
  }

  /**
   * Génération de token sécurisé
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Hachage pour anonymisation RGPD
   */
  anonymizeData(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data + process.env.ANONYMIZATION_SALT!)
      .digest('hex')
      .substring(0, 16) // Troncature pour anonymisation
  }
}
```

#### Implémentation dans les modèles
```typescript
// app/features/partners/models/Partner.ts (extrait sécurisé)
import { EncryptionService } from '../../../shared/services/EncryptionService'

export default class Partner extends BaseModel {
  // Champs chiffrés automatiquement
  @column({
    prepare: (value: string) => value ? EncryptionService.encrypt(value) : null,
    consume: (value: string) => value ? EncryptionService.decrypt(value) : null,
  })
  declare notes: string | null

  @column({
    prepare: (value: string) => value ? EncryptionService.encrypt(value) : null,
    consume: (value: string) => value ? EncryptionService.decrypt(value) : null,
  })
  declare blacklistReason: string | null

  // Méthode d'anonymisation pour RGPD
  async anonymize(): Promise<void> {
    const encryptionService = new EncryptionService()
    
    this.firstName = encryptionService.anonymizeData(this.firstName)
    this.lastName = encryptionService.anonymizeData(this.lastName)
    this.email = `deleted_${Date.now()}@anonymized.local`
    this.phone = null
    this.notes = null
    this.blacklistReason = null
    this.isArchived = true
    this.archivedAt = DateTime.now()
    this.archiveReason = 'Anonymisation RGPD'
    
    await this.save()
  }
}
```

---
