# Configuration Husky pour l'équipe RPM-CL

## Installation pour nouveaux développeurs

```bash
# Installer les dépendances avec PNPM
pnpm install

# Husky se configure automatiquement avec `pnpm install`
# ou manuellement :
pnpm run prepare
```

## Hooks configurés

### commit-msg

- ✅ Valide le format des messages de commit avec commitlint
- ✅ Applique les conventions Conventional Commits
- ✅ Affiche de l'aide détaillée en cas d'erreur
- ✅ Supporte les emojis Gitmoji

### pre-commit

- ✅ Formate automatiquement le code avec Prettier
- ✅ Corrige les erreurs de linting avec Oxlint
- ✅ Vérifie la compilation TypeScript
- ✅ Trie automatiquement le package.json

### pre-push

- ✅ Exécute tous les tests (frontend + backend)
- ✅ Vérifie que le build fonctionne
- ✅ Valide l'historique des commits

### prepare-commit-msg

- ✅ Ajoute un template d'aide pour les commits
- ✅ Guide les développeurs sur les conventions

## Scripts utiles

```bash
# Interface Gitmoji pour créer des commits
pnpm run commit

# Valider un message manuellement
echo "feat(auth): add OAuth2" | pnpm run commitlint

# Valider l'historique des commits
pnpm run validate-commits

# Formater tout le code
pnpm run format

# Vérification TypeScript
pnpm run type-check
```

## Désactiver temporairement (déconseillé)

```bash
# Commit sans validation
git commit --no-verify -m "message"

# Push sans validation
git push --no-verify
```

## Variables d'environnement

```bash
# Désactiver Husky complètement
HUSKY=0

# Désactiver en CI (déjà configuré)
CI=true
```

## Types de commits supportés

| Type       | Description                | Exemple                               |
| ---------- | -------------------------- | ------------------------------------- |
| `feat`     | ✨ Nouvelle fonctionnalité | `feat(auth): add OAuth2 LinkedIn`     |
| `fix`      | 🐛 Correction de bug       | `fix(partners): resolve filter issue` |
| `docs`     | 📝 Documentation           | `docs(api): update endpoints`         |
| `style`    | 🎨 Formatage, style        | `style(ui): improve button design`    |
| `refactor` | ♻️ Refactoring             | `refactor(api): extract validation`   |
| `perf`     | ⚡ Performance             | `perf(db): optimize queries`          |
| `test`     | ✅ Tests                   | `test(auth): add integration tests`   |
| `chore`    | 🔧 Maintenance             | `chore: update dependencies`          |
| `ci`       | 🚀 CI/CD                   | `ci: add deployment workflow`         |
| `build`    | 📦 Build                   | `build: configure webpack`            |
| `security` | 🔒 Sécurité                | `security: fix JWT validation`        |
| `config`   | ⚙️ Configuration           | `config: update database settings`    |

## Scopes suggérés pour RPM-CL

- `auth` - Authentification, sécurité
- `partners` - Gestion des partenaires
- `users` - Gestion des utilisateurs
- `classifications` - Métiers, catégories
- `notifications` - Système de notifications
- `stats` - Statistiques, analytics
- `api` - Backend, endpoints
- `ui` - Interface utilisateur
- `config` - Configuration
- `database` - Base de données
- `security` - Sécurité, RGPD
- `tests` - Tests
- `docs` - Documentation

## Dépannage

### Erreur "husky command not found"

```bash
pnpm install
pnpm run prepare
```

### Erreur de permissions

```bash
chmod +x .husky/*
```

### Désactiver temporairement

```bash
export HUSKY=0
```
