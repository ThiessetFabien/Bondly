# Configuration Sqitch

## Configuration initiale

1. Copiez le fichier template :

```bash
cp sqitch.conf.example sqitch.conf
```

2. Modifiez `sqitch.conf` avec vos paramètres :
   - Remplacez `YOUR_USERNAME` par votre nom d'utilisateur PostgreSQL local
   - Remplacez `YOUR_PASSWORD` par votre mot de passe de base de données

## Exemple de configuration

```ini
[core]
	engine = pg
	top_dir = migrations
	plan_file = migrations/sqitch.plan

[engine "pg"]
	target = dev
	registry = sqitch
	client = psql

[target "dev"]
	uri = db:pg://votre_utilisateur@localhost/bondly

[target "docker"]
	uri = db:pg://bondly_user:votre_mot_de_passe@localhost:5432/bondly

[target "production"]
	uri = db:pg://bondly_user:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/bondly
```

## Commandes Sqitch courantes

```bash
# Déployer les migrations
sqitch deploy

# Vérifier l'état
sqitch status

# Rollback
sqitch revert

# Vérifier les migrations
sqitch verify
```

⚠️ **Important** : Ne commitez jamais le fichier `sqitch.conf` car il contient des informations sensibles de base de données.
