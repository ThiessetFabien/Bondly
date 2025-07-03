# 🐳 Démarrage rapide avec Docker

Ce guide vous permet de démarrer rapidement le projet avec Docker.

## Prérequis

- Docker installé sur votre système
- Git pour cloner le projet

## Démarrage rapide

### 1. Cloner le projet (si ce n'est pas déjà fait)

```bash
git clone <url-du-repo>
cd relational-partner-manager-frontend
```

### 2. Lancer en mode développement

```bash
# Avec pnpm
pnpm run docker:dev

# Ou avec le script direct
./scripts/docker-help.sh dev

# Ou avec docker-compose
docker-compose --profile dev up -d dev
```

L'application sera disponible sur [http://localhost:3001](http://localhost:3001)

### 3. Lancer en mode production

```bash
# Construire l'image
pnpm run docker:build

# Lancer le container
pnpm run docker:run
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Commandes utiles

```bash
# Voir les logs
pnpm run docker:logs

# Arrêter les containers
pnpm run docker:stop

# Ouvrir un shell dans le container
pnpm run docker:shell

# Nettoyer (supprimer images et containers)
pnpm run docker:clean

# Aide complète
pnpm run docker:help
```

## Résolution de problèmes

### Le container ne démarre pas

1. Vérifiez les logs : `pnpm run docker:logs`
2. Vérifiez que Docker est en cours d'exécution : `docker ps`
3. Reconstruisez l'image : `pnpm run docker:build`

### Les changements ne sont pas reflétés

En mode développement, les changements devraient être automatiquement reflétés grâce au hot reload. Si ce n'est pas le cas :

1. Vérifiez que vous utilisez le mode dev : `pnpm run docker:dev`
2. Redémarrez le container : `pnpm run docker:stop && pnpm run docker:dev`

### Problèmes de permissions

```bash
# Nettoyer et reconstruire
pnpm run docker:clean
pnpm run docker:build
```

## Documentation complète

Pour plus de détails, consultez [docs/docker.md](./docs/docker.md)
