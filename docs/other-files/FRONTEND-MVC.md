# RPM-CL Frontend - Architecture MVC Distribuée

> **Frontend Next.js 15 configuré pour fonctionner en tant que couche Vue dans un pattern MVC distribué**

## 🏗️ Architecture MVC Distribuée

```
┌─────────────────────────┐    HTTP/REST API    ┌─────────────────────────┐
│      FRONTEND           │ ←─────────────────→ │       BACKEND           │
│   (Couche Vue)          │                     │  (Model + Controller)   │
│                         │                     │                         │
│  ┌─────────────────┐    │                     │  ┌─────────────────┐    │
│  │ VIEW            │    │                     │  │ CONTROLLER      │    │
│  │ - Composants    │    │   GET /api/partners │  │ - Routes API    │    │
│  │ - Templates JSX │    │   POST /api/auth    │  │ - Validation    │    │
│  │ - Styles        │    │   PUT /api/users    │  │ - Business Logic│    │
│  └─────────────────┘    │                     │  └─────────────────┘    │
│                         │                     │                         │
│  ┌─────────────────┐    │                     │  ┌─────────────────┐    │
│  │ CONTROLLER      │    │                     │  │ MODEL           │    │
│  │ - Hooks React   │    │                     │  │ - Base données  │    │
│  │ - État local    │    │                     │  │ - ORM Lucid     │    │
│  │ - API calls     │    │                     │  │ - Relations     │    │
│  └─────────────────┘    │                     │  └─────────────────┘    │
│                         │                     │                         │
│  ┌─────────────────┐    │                     │                         │
│  │ MODEL (local)   │    │                     │                         │
│  │ - Types TS      │    │                     │                         │
│  │ - Cache local   │    │                     │                         │
│  │ - Validation    │    │                     │                         │
│  └─────────────────┘    │                     │                         │
└─────────────────────────┘                     └─────────────────────────┘
      Port 3000                                        Port 3333
```

## ✅ Frontend MVC configuré

### **VIEW (Couche présentation)**

- **Pages** : `src/app/page.tsx` (Hello World avec test connexion)
- **Composants** : `src/components/ui/Button.tsx` + structure préparée
- **Styles** : Tailwind CSS configuré

### **CONTROLLER (Logique frontend)**

- **Hooks** : `src/hooks/useApi.ts` (Controllers React)
- **Services** : `src/lib/api-client.ts` (Communication backend)
- **Features** : Structure préparée par domaine métier

### **MODEL (État frontend)**

- **Types** : TypeScript strict pour données
- **Cache** : Préparé pour React Query (futur)
- **Validation** : Côté client uniquement

## 🔌 Communication Backend

### Configuration API

```typescript
// Variable d'environnement
NEXT_PUBLIC_API_URL=http://localhost:3333/api

// Usage dans le code
const result = await apiClient.get('/partners')
```

### Endpoints attendus (Backend AdonisJS)

- `GET /api/health` - Test de connexion
- `GET /api/partners` - Liste des partenaires
- `POST /api/partners` - Créer un partenaire
- `PUT /api/partners/:id` - Modifier un partenaire
- `DELETE /api/partners/:id` - Supprimer un partenaire

## 🚀 Fonctionnement Hello World

### Démarrage frontend seul

```bash
cd frontend
npm run dev
# → http://localhost:3000
# Affiche le Hello World + test de connexion backend
```

### Test de communication MVC

1. **Frontend** affiche "Connexion en cours..."
2. **Frontend** envoie `GET /api/health` vers backend
3. **Backend** (si disponible) répond avec statut
4. **Frontend** affiche le résultat ✅ ou ❌

## 📁 Structure simplifiée pour Hello World

```
frontend/src/
├── app/
│   ├── page.tsx             # Hello World + test connexion ✅
│   ├── layout.tsx           # Layout principal
│   └── globals.css          # Styles Tailwind
├── hooks/
│   └── useApi.ts            # Controller pour API ✅
├── lib/
│   └── api-client.ts        # Service communication ✅
├── components/ui/
│   └── Button.tsx           # Composant de base ✅
└── features/                # Structure préparée MVP
    ├── partners/            # Feature partenaires
    ├── auth/                # Feature auth
    └── [autres]/            # Autres features
```

## 🎯 Prochaines étapes MVP

1. **Développer Backend** : AdonisJS avec endpoints API
2. **Tester communication** : Frontend ↔ Backend
3. **Développer Features** : Partners, Auth, etc.
4. **Intégrer React Query** : Cache et état serveur
5. **Compléter UI** : Design system et composants

Le frontend est maintenant **prêt à fonctionner en mode Hello World** et **préparé pour l'intégration MVC distribuée** avec le backend AdonisJS.
