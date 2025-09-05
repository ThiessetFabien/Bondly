#!/bin/bash

# Configuration automatique de Sqitch pour Bondly
# Ce script configure sqitch.conf avec vos paramètres

set -e

echo "🔧 Configuration de Sqitch pour Bondly"
echo "======================================"

# Vérifier si le fichier existe déjà
if [[ -f "sqitch.conf" ]]; then
    echo "⚠️  Le fichier sqitch.conf existe déjà."
    read -p "Voulez-vous le remplacer ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Configuration annulée."
        exit 0
    fi
fi

# Vérifier que le template existe
if [[ ! -f "sqitch.conf.example" ]]; then
    echo "❌ Fichier template sqitch.conf.example introuvable!"
    exit 1
fi

# Demander les paramètres à l'utilisateur
echo
echo "Veuillez entrer vos paramètres de base de données :"
echo

read -p "👤 Nom d'utilisateur PostgreSQL local (défaut: $USER): " db_user
db_user=${db_user:-$USER}

read -p "🏠 Host de base de données (défaut: localhost): " db_host
db_host=${db_host:-localhost}

read -p "🚪 Port PostgreSQL (défaut: 5432): " db_port
db_port=${db_port:-5432}

echo
read -s -p "🔐 Mot de passe pour l'environnement Docker (sera masqué): " docker_password
echo

# Créer le fichier de configuration
echo
echo "📝 Création du fichier sqitch.conf..."

cat > sqitch.conf << EOF
[core]
	engine = pg
	top_dir = migrations
	plan_file = migrations/sqitch.plan

[engine "pg"]
	target = dev
	registry = sqitch
	client = psql

[target "dev"]
	uri = db:pg://${db_user}@${db_host}/bondly

[target "docker"]
	uri = db:pg://bondly_user:${docker_password}@${db_host}:${db_port}/bondly

[target "production"]
	uri = db:pg://bondly_user:\${DB_PASSWORD}@\${DB_HOST}:\${DB_PORT}/bondly
EOF

echo "✅ Configuration Sqitch créée avec succès!"
echo
echo "🔍 Vérification de la configuration :"
echo "   - Environnement dev: ${db_user}@${db_host}/bondly"
echo "   - Environnement docker: bondly_user@${db_host}:${db_port}/bondly"
echo "   - Environnement production: utilise les variables d'environnement"
echo
echo "🚀 Vous pouvez maintenant utiliser les commandes Sqitch :"
echo "   sqitch deploy     # Déployer les migrations"
echo "   sqitch status     # Vérifier l'état"
echo "   sqitch revert     # Rollback"
echo
echo "⚠️  IMPORTANT: Ne commitez jamais le fichier sqitch.conf (il est dans .gitignore)"
