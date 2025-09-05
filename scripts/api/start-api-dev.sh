#!/usr/bin/env fish

# Script de démarrage pour l'API Bondly
# Usage: ./scripts/start-api-dev.sh

set -g script_dir (dirname (status --current-filename))
set -g project_root (dirname $script_dir)

echo "🚀 Démarrage de l'environnement de développement Bondly API"
echo

# Vérifier que les dépendances sont installées
if not test -d "$project_root/node_modules"
    echo "📦 Installation des dépendances..."
    cd $project_root
    pnpm install
    echo
end

# Vérifier que PostgreSQL est en cours d'exécution
echo "🔍 Vérification de PostgreSQL..."
if not pgrep -x "postgres" > /dev/null
    echo "❌ PostgreSQL n'est pas en cours d'exécution"
    echo "💡 Démarrez PostgreSQL avec:"
    echo "   sudo systemctl start postgresql"
    echo "   ou"
    echo "   brew services start postgresql (sur macOS)"
    exit 1
else
    echo "✅ PostgreSQL est en cours d'exécution"
end

# Vérifier la configuration de la base de données
echo "🔍 Vérification de la configuration de la base de données..."
if not test -f "$project_root/.env"
    echo "⚠️  Le fichier .env n'existe pas"
    echo "💡 Copiez .env.example vers .env et configurez vos variables"
    cp "$project_root/.env.example" "$project_root/.env"
    echo "✅ Fichier .env créé, veuillez le configurer"
end

# Vérifier que les tables existent
echo "🔍 Vérification du schéma de base de données..."
cd $project_root

# Vérifier que Sqitch est installé
if not command -v sqitch > /dev/null
    echo "❌ Sqitch n'est pas installé"
    echo "💡 Installez Sqitch:"
    echo "   sudo apt-get install sqitch (Ubuntu/Debian)"
    echo "   brew install sqitch (macOS)"
    exit 1
end

# Vérifier le statut de Sqitch
set -l sqitch_status (sqitch status 2>/dev/null || echo "non-deploye")
if string match -q "*nothing to deploy*" $sqitch_status
    echo "✅ Migrations Sqitch à jour"
else if string match -q "*Undeployed change*" $sqitch_status
    echo "⚠️  Des migrations Sqitch ne sont pas déployées"
    echo "💡 Déployez les migrations:"
    echo "   sqitch deploy"
    
    read -P "Voulez-vous déployer les migrations maintenant ? (y/N): " choice
    if test "$choice" = "y" -o "$choice" = "Y"
        echo "� Déploiement des migrations Sqitch..."
        sqitch deploy
        if test $status -ne 0
            echo "❌ Erreur lors du déploiement Sqitch"
            exit 1
        end
        echo "✅ Migrations Sqitch déployées"
    else
        exit 1
    end
else if string match -q "*non-deploye*" $sqitch_status
    echo "❌ Base de données non initialisée"
    echo "💡 Déployez d'abord les migrations Sqitch:"
    echo "   sqitch deploy"
    exit 1
end

echo "🔍 Vérification des données..."
set -l partner_count (node -e "
import { db } from './src/lib/db.js';
const result = await db.query('SELECT COUNT(*) as count FROM partners');
console.log(result[0].count);
await db.close();
" 2>/dev/null)

if test "$partner_count" = "0"
    echo "⚠️  Aucun partenaire en base de données"
    echo "💡 Migrez les données JSON:"
    echo "   node scripts/migrate-json-to-postgres-api.mjs"
    
    read -P "Voulez-vous migrer les données maintenant ? (y/N): " choice
    if test "$choice" = "y" -o "$choice" = "Y"
        echo "📊 Migration des données..."
        node scripts/migrate-json-to-postgres-api.mjs
        if test $status -eq 0
            echo "✅ Migration terminée"
        else
            echo "❌ Erreur lors de la migration"
            exit 1
        end
    end
else
    echo "✅ $partner_count partenaires trouvés en base"
end

echo
echo "🎯 Lancement du serveur de développement..."
echo "   • API disponible sur: http://localhost:3000/api"
echo "   • Dashboard: http://localhost:3000"
echo
echo "🧪 Pour tester l'API:"
echo "   node scripts/test-api.mjs"
echo

# Démarrer le serveur Next.js
pnpm run dev
