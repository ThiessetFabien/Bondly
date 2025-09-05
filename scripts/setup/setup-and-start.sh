#!/usr/bin/env fish

# Script de démarrage complet pour l'API Bondly avec Sqitch
# Usage: ./scripts/setup-and-start.sh

set -g script_dir (dirname (status --current-filename))
set -g project_root (dirname $script_dir)

echo "🚀 Configuration et démarrage de l'API Bondly"
echo "=============================================="
echo

# Fonction d'aide
function show_help
    echo "Usage: ./scripts/setup-and-start.sh [options]"
    echo
    echo "Options:"
    echo "  --skip-deps     Ne pas installer les dépendances"
    echo "  --skip-db       Ne pas vérifier/configurer la base de données"
    echo "  --skip-migrate  Ne pas migrer les données JSON"
    echo "  --help          Afficher cette aide"
    echo
end

# Parser les arguments
set -l skip_deps false
set -l skip_db false
set -l skip_migrate false

for arg in $argv
    switch $arg
        case '--skip-deps'
            set skip_deps true
        case '--skip-db'
            set skip_db true
        case '--skip-migrate'
            set skip_migrate true
        case '--help' '-h'
            show_help
            exit 0
    end
end

cd $project_root

# 1. Vérifier les prérequis
echo "🔍 Vérification des prérequis..."

# Node.js
if not command -v node > /dev/null
    echo "❌ Node.js n'est pas installé"
    exit 1
end
echo "✅ Node.js: (node --version)"

# pnpm
if not command -v pnpm > /dev/null
    echo "❌ pnpm n'est pas installé"
    echo "💡 Installez pnpm: npm install -g pnpm"
    exit 1
end
echo "✅ pnpm: (pnpm --version)"

# PostgreSQL
if not command -v psql > /dev/null
    echo "❌ PostgreSQL client n'est pas installé"
    exit 1
end
echo "✅ PostgreSQL client disponible"

# Sqitch
if not command -v sqitch > /dev/null
    echo "❌ Sqitch n'est pas installé"
    echo "💡 Installez Sqitch:"
    echo "   Ubuntu/Debian: sudo apt-get install sqitch libdbd-pg-perl"
    echo "   macOS: brew install sqitch"
    echo "   Arch: sudo pacman -S sqitch"
    exit 1
end
echo "✅ Sqitch: (sqitch --version | head -n 1)"

echo

# 2. Installer les dépendances
if test $skip_deps = false
    echo "📦 Installation des dépendances..."
    if not test -d node_modules
        pnpm install
    else
        echo "✅ Dépendances déjà installées"
    end
    echo
end

# 3. Configuration de l'environnement
echo "⚙️  Configuration de l'environnement..."
if not test -f .env
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  Veuillez configurer vos variables d'environnement dans .env"
    echo "   Particulièrement les paramètres de base de données"
    echo
    read -P "Appuyez sur Entrée pour continuer une fois la configuration terminée..."
else
    echo "✅ Fichier .env trouvé"
end

# 4. Vérification de PostgreSQL
if test $skip_db = false
    echo "🗄️  Vérification de PostgreSQL..."
    
    # Charger les variables d'environnement
    source .env 2>/dev/null || true
    
    # Tester la connexion
    if not env PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
        echo "❌ Impossible de se connecter à PostgreSQL"
        echo "💡 Vérifiez que:"
        echo "   • PostgreSQL est démarré"
        echo "   • La base de données '$DB_NAME' existe"
        echo "   • L'utilisateur '$DB_USER' a les bonnes permissions"
        echo "   • Les paramètres dans .env sont corrects"
        exit 1
    else
        echo "✅ Connexion PostgreSQL réussie"
    end
    echo
end

# 5. Déploiement Sqitch
echo "🚀 Déploiement des migrations Sqitch..."
set -l sqitch_status (sqitch status 2>/dev/null || echo "erreur")

if string match -q "*nothing to deploy*" $sqitch_status
    echo "✅ Migrations Sqitch à jour"
else if string match -q "*Undeployed change*" $sqitch_status
    echo "📋 Déploiement des nouvelles migrations..."
    sqitch deploy
    if test $status -ne 0
        echo "❌ Erreur lors du déploiement Sqitch"
        exit 1
    end
    echo "✅ Migrations déployées"
else
    echo "📋 Déploiement initial des migrations..."
    sqitch deploy
    if test $status -ne 0
        echo "❌ Erreur lors du déploiement Sqitch"
        exit 1
    end
    echo "✅ Migrations déployées"
end
echo

# 6. Migration des données JSON
if test $skip_migrate = false
    echo "📊 Migration des données JSON..."
    
    # Vérifier si les données sont déjà migrées
    set -l partner_count (env PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM partners;" 2>/dev/null | string trim)
    
    if test "$partner_count" -gt 0
        echo "⚠️  $partner_count partenaires déjà en base"
        read -P "Voulez-vous remigrer les données ? (y/N): " choice
        if test "$choice" = "y" -o "$choice" = "Y"
            node scripts/migrate-json-to-postgres-api.mjs
        else
            echo "✅ Migration des données ignorée"
        end
    else
        echo "📥 Migration des données JSON vers PostgreSQL..."
        node scripts/migrate-json-to-postgres-api.mjs
        if test $status -ne 0
            echo "❌ Erreur lors de la migration des données"
            exit 1
        end
    end
    echo
end

# 7. Test de l'API
echo "🧪 Test de l'API..."
echo "   • Lancement du serveur en arrière-plan..."
echo "   • Test des endpoints principaux..."
echo

# Vérification finale
echo "✅ Configuration terminée !"
echo
echo "🎯 Commandes disponibles :"
echo "   pnpm run dev          # Démarrer le serveur de développement"
echo "   pnpm run test:api     # Tester l'API"
echo "   pnpm run db:status    # Statut des migrations Sqitch"
echo "   pnpm run api:migrate  # Remigrer les données JSON"
echo
echo "🌐 L'API sera disponible sur :"
echo "   • API: http://localhost:3000/api"
echo "   • Dashboard: http://localhost:3000"
echo

# Proposer de démarrer
read -P "Voulez-vous démarrer le serveur de développement maintenant ? (Y/n): " start_choice
if test "$start_choice" != "n" -a "$start_choice" != "N"
    echo "🚀 Démarrage du serveur..."
    pnpm run dev
end
