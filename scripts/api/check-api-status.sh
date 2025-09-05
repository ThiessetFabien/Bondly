#!/usr/bin/env fish

# Script de vérification de l'état de l'API Bondly
# Usage: ./scripts/check-api-status.sh

set -g script_dir (dirname (status --current-filename))
set -g project_root (dirname $script_dir)

echo "🔍 Vérification de l'état de l'API Bondly"
echo "========================================="
echo

cd $project_root

# Charger les variables d'environnement
source .env 2>/dev/null || true

# 1. Vérifier PostgreSQL
echo "🗄️  PostgreSQL:"
if env PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
    echo "   ✅ Connexion réussie"
    
    # Statistiques de la base
    set -l stats (env PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SELECT 
            (SELECT COUNT(*) FROM partners) as partners,
            (SELECT COUNT(*) FROM classifications) as classifications,
            (SELECT COUNT(*) FROM partner_classifications) as associations;
    " 2>/dev/null)
    
    if test -n "$stats"
        echo "   📊 Données: $stats"
    end
else
    echo "   ❌ Connexion échouée"
end

# 2. Vérifier Sqitch
echo "🚀 Sqitch:"
if command -v sqitch > /dev/null
    set -l sqitch_status (sqitch status 2>/dev/null || echo "erreur")
    if string match -q "*nothing to deploy*" $sqitch_status
        echo "   ✅ Migrations à jour"
    else if string match -q "*Undeployed change*" $sqitch_status
        echo "   ⚠️  Migrations en attente"
    else if string match -q "*erreur*" $sqitch_status
        echo "   ❌ Erreur de statut"
    else
        echo "   🔄 Statut: $sqitch_status"
    end
else
    echo "   ❌ Sqitch non installé"
end

# 3. Vérifier le serveur Next.js
echo "🌐 Serveur Next.js:"
if curl -s http://localhost:3000/api/dashboard/stats > /dev/null 2>&1
    echo "   ✅ API accessible sur http://localhost:3000/api"
    
    # Test rapide de l'API
    set -l api_test (curl -s http://localhost:3000/api/dashboard/stats | jq -r '.success' 2>/dev/null || echo "erreur")
    if test "$api_test" = "true"
        echo "   ✅ API fonctionnelle"
    else
        echo "   ⚠️  API répond mais erreur dans les données"
    end
else
    echo "   ❌ API non accessible"
    echo "   💡 Démarrez avec: pnpm run dev"
end

# 4. Vérifier les fichiers de données
echo "📁 Fichiers de données:"
if test -f src/data/partners.json
    set -l partner_count (jq '.partners | length' src/data/partners.json 2>/dev/null || echo "erreur")
    echo "   ✅ partners.json ($partner_count partenaires)"
else
    echo "   ❌ partners.json manquant"
end

if test -f src/data/metadata.json
    set -l prof_count (jq '.professions | length' src/data/metadata.json 2>/dev/null || echo "erreur")
    echo "   ✅ metadata.json ($prof_count professions)"
else
    echo "   ❌ metadata.json manquant"
end

# 5. Vérifier les dépendances
echo "📦 Dépendances:"
if test -d node_modules
    echo "   ✅ node_modules présent"
else
    echo "   ❌ node_modules manquant (exécutez: pnpm install)"
end

# 6. Résumé et recommandations
echo
echo "📋 Résumé:"

set -l issues 0

# Compter les problèmes
if not env PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
    set issues (math $issues + 1)
end

if not curl -s http://localhost:3000/api/dashboard/stats > /dev/null 2>&1
    set issues (math $issues + 1)
end

if not test -d node_modules
    set issues (math $issues + 1)
end

if test $issues -eq 0
    echo "   🎉 Tout fonctionne correctement !"
    echo
    echo "🔗 Liens utiles:"
    echo "   • API: http://localhost:3000/api"
    echo "   • Dashboard: http://localhost:3000"
    echo "   • Documentation: docs/api.md"
else
    echo "   ⚠️  $issues problème(s) détecté(s)"
    echo
    echo "💡 Actions recommandées:"
    
    if not test -d node_modules
        echo "   1. Installer les dépendances: pnpm install"
    end
    
    if not env PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
        echo "   2. Configurer PostgreSQL et .env"
        echo "   3. Déployer les migrations: sqitch deploy"
    end
    
    if not curl -s http://localhost:3000/api/dashboard/stats > /dev/null 2>&1
        echo "   4. Démarrer le serveur: pnpm run dev"
    end
    
    echo
    echo "   Ou utilisez le script automatique: ./scripts/setup-and-start.sh"
end

echo
