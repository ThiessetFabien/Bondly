# Alias TypeScript - Guide d'utilisation

## 📋 Alias configurés

Ce projet utilise des alias TypeScript pour simplifier les imports et améliorer la maintenabilité du code.

### Alias principaux

| Alias            | Chemin                      | Description                  |
| ---------------- | --------------------------- | ---------------------------- |
| `@/*`            | `./src/*`                   | Alias racine (général)       |
| `@/components/*` | `./src/components/*`        | Tous les composants          |
| `@/ui/*`         | `./src/components/ui/*`     | Composants UI réutilisables  |
| `@/layout/*`     | `./src/components/layout/*` | Composants de layout         |
| `@/features/*`   | `./src/features/*`          | Fonctionnalités métier       |
| `@/shared/*`     | `./src/shared/*`            | Composants et utils partagés |
| `@/hooks/*`      | `./src/hooks/*`             | Hooks personnalisés          |
| `@/lib/*`        | `./src/lib/*`               | Librairies et utilitaires    |
| `@/store/*`      | `./src/store/*`             | État global Redux            |
| `@/services/*`   | `./src/services/*`          | Services API                 |
| `@/types/*`      | `./src/types/*`             | Types TypeScript             |
| `@/utils/*`      | `./src/shared/utils/*`      | Utilitaires partagés         |
| `@/assets/*`     | `./public/*`                | Assets statiques             |

## 🚀 Exemples d'utilisation

### Avant (avec chemins relatifs)

```typescript
import { Button } from '../../../components/ui/button'
import { useSidebarLayout } from '../../hooks/useSidebarLayout'
import { formatPhoneNumber } from '../../../shared/utils/formatting'
import { useAppSelector } from '../../store/hooks'
```

### Après (avec alias)

```typescript
import { Button } from '@/ui/button'
import { useSidebarLayout } from '@/hooks/useSidebarLayout'
import { formatPhoneNumber } from '@/utils/formatting'
import { useAppSelector } from '@/store/hooks'
```

## 📁 Structure recommandée

```
src/
├── components/
│   ├── ui/           # @/ui/* - Composants UI réutilisables
│   └── layout/       # @/layout/* - Composants de layout
├── features/         # @/features/* - Fonctionnalités métier
├── hooks/           # @/hooks/* - Hooks personnalisés
├── lib/             # @/lib/* - Librairies et utilitaires
├── services/        # @/services/* - Services API
├── shared/          # @/shared/* - Composants et utils partagés
│   ├── components/
│   ├── utils/       # @/utils/* - Utilitaires partagés
│   └── types/
├── store/           # @/store/* - État global Redux
└── types/           # @/types/* - Types TypeScript
```

## 🎯 Avantages

### 1. **Lisibilité améliorée**

- Plus de confusion avec les chemins relatifs
- Import plus courts et clairs

### 2. **Maintenabilité**

- Pas de mise à jour des imports lors de déplacements
- Refactoring plus facile

### 3. **Développement plus rapide**

- Autocomplétion améliorée
- Moins d'erreurs de typage

### 4. **Cohérence**

- Standardisation des imports dans toute l'équipe
- Conventions claires

## 🔧 Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/ui/*": ["./src/components/ui/*"],
      "@/layout/*": ["./src/components/layout/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/store/*": ["./src/store/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/shared/utils/*"],
      "@/assets/*": ["./public/*"]
    }
  }
}
```

### next.config.ts

```typescript
const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@': './src',
      '@/components': './src/components',
      '@/ui': './src/components/ui',
      '@/layout': './src/components/layout',
      '@/features': './src/features',
      '@/shared': './src/shared',
      '@/hooks': './src/hooks',
      '@/lib': './src/lib',
      '@/store': './src/store',
      '@/services': './src/services',
      '@/types': './src/types',
      '@/utils': './src/shared/utils',
      '@/assets': './public',
    },
  },
}
```

## 📖 Bonnes pratiques

### 1. **Privilégier les alias spécifiques**

```typescript
// ✅ Recommandé
import { Button } from '@/ui/button'
import { useSidebarLayout } from '@/hooks/useSidebarLayout'

// ❌ À éviter (trop générique)
import { Button } from '@/components/ui/button'
import { useSidebarLayout } from '@/hooks/useSidebarLayout'
```

### 2. **Grouper les imports par source**

```typescript
// ✅ Recommandé
import { Button } from '@/ui/button'
import { Sidebar } from '@/ui/sidebar'
import { useSidebarLayout } from '@/hooks/useSidebarLayout'
import { useAppSelector } from '@/store/hooks'
import { motion } from 'framer-motion'
```

### 3. **Utiliser l'alias le plus court disponible**

```typescript
// ✅ Recommandé
import { formatPhoneNumber } from '@/utils/formatting'

// ❌ À éviter (plus long)
import { formatPhoneNumber } from '@/shared/utils/formatting'
```

## 🔍 Support IDE

### VS Code

Les alias sont automatiquement reconnus grâce à `tsconfig.json`.

### IntelliSense

Autocomplétion complète disponible pour tous les alias.

### Go to Definition

Fonctionne parfaitement avec les alias.

---

_Mise à jour : 10 juillet 2025_
