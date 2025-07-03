# Configuration Docker

Ce document explique la configuration Docker pour le projet Relational Partner Manager Frontend.

## Structure des fichiers Docker

- `Dockerfile` : Configuration pour l'image de production (multi-stage build optimisé)
- `Dockerfile.dev` : Configuration pour l'image de développement avec hot reload
- `docker-compose.yml` : Orchestration des services
- `.dockerignore` : Fichiers à exclure lors du build Docker
- `scripts/docker-help.sh` : Script d'aide pour les commandes Docker

## Commandes rapides

### Via npm/pnpm scripts

```bash
# Afficher l'aide Docker
pnpm run docker:help

# Construire l'image de production
pnpm run docker:build

# Construire l'image de développement
pnpm run docker:build-dev

# Lancer en mode production
pnpm run docker:run

# Lancer en mode développement
pnpm run docker:dev

# Arrêter les containers
pnpm run docker:stop

# Nettoyer les images et containers
pnpm run docker:clean

# Voir les logs
pnpm run docker:logs

# Ouvrir un shell dans le container
pnpm run docker:shell
```

### Via Docker Compose

```bash
# Mode production
docker-compose up -d app

# Mode développement
docker-compose --profile dev up -d dev

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs -f
```

### Via Docker directement

```bash
# Construire l'image de production
docker build -t relational-partner-manager-frontend:latest .

# Construire l'image de développement
docker build -f Dockerfile.dev -t relational-partner-manager-frontend:dev .

# Lancer un container
docker run -p 3000:3000 relational-partner-manager-frontend:latest
```

## Modes d'utilisation

### Mode Production

- **Port** : 3000
- **Image optimisée** : Multi-stage build avec Next.js standalone
- **Taille réduite** : Utilise Alpine Linux et output standalone
- **Sécurisé** : Utilisateur non-root (nextjs)

### Mode Développement

- **Port** : 3001
- **Hot reload** : Activé avec Turbopack
- **Volume monté** : Code source synchronisé en temps réel
- **Debugging** : Facilité par le montage de volumes

## Optimisations appliquées

### Dockerfile de production

1. **Multi-stage build** : Sépare les dépendances, le build et l'exécution
2. **Alpine Linux** : Image de base légère
3. **Next.js standalone** : Sortie optimisée pour Docker
4. **Utilisateur non-root** : Sécurité renforcée
5. **Cache des layers** : Optimisation du processus de build

### Configuration Next.js

- `output: 'standalone'` : Génère un serveur autonome
- `optimizePackageImports` : Réduit la taille du bundle
- Configuration des images optimisée pour Docker

## Variables d'environnement

Les variables suivantes sont configurées automatiquement :

- `NODE_ENV=production` (mode production)
- `NODE_ENV=development` (mode développement)
- `NEXT_TELEMETRY_DISABLED=1` : Désactive la télémétrie Next.js
- `PORT=3000` : Port d'écoute du serveur
- `HOSTNAME=0.0.0.0` : Écoute sur toutes les interfaces

## Volumes et réseaux

### Volumes (mode développement)

- Code source monté en temps réel
- `node_modules` persistant
- Cache `.next` persistant

### Réseau

- Réseau personnalisé `app-network`
- Communication entre containers possible

## Dépannage

### Container ne démarre pas

```bash
# Vérifier les logs
pnpm run docker:logs

# Vérifier l'état des containers
docker ps -a

# Reconstruire l'image
pnpm run docker:build
```

### Problèmes de permissions

```bash
# Nettoyer et reconstruire
pnpm run docker:clean
pnpm run docker:build
```

### Hot reload ne fonctionne pas

Assurez-vous d'utiliser le mode développement :

```bash
pnpm run docker:dev
```

## Prochaines étapes

- [ ] Ajouter support pour les tests en Docker
- [ ] Configuration pour les environnements de staging
- [ ] Intégration CI/CD avec Docker
- [ ] Monitoring et health checks
