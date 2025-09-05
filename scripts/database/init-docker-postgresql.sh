#!/bin/bash
# =============================================================================
# SCRIPT D'INITIALISATION DOCKER POSTGRESQL 17.5 - BONDLY
# =============================================================================
# Usage: ./scripts/database/init-docker-postgresql.sh [production|development]
# =============================================================================

set -e  # Arrête en cas d'erreur

# Variables d'environnement
DB_NAME=${DB_NAME:-"bondly_prod"}
DB_USER=${DB_USER:-"bondly_user"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction d'affichage
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# =============================================================================
# VÉRIFICATIONS PRÉLIMINAIRES
# =============================================================================

log "🚀 Initialisation de PostgreSQL 17.5 pour Bondly..."

# Vérifier si PostgreSQL 17.5 est installé
if ! psql --version | grep -q "17\."; then
    error "PostgreSQL 17.x n'est pas installé ou accessible"
fi

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé"
fi

# Vérifier Docker Compose
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose n'est pas installé"
fi

success "✅ Prérequis validés"

# =============================================================================
# CONFIGURATION ENVIRONNEMENT
# =============================================================================

ENVIRONMENT=${1:-"development"}
log "📦 Mode: $ENVIRONMENT"

if [ "$ENVIRONMENT" = "production" ]; then
    log "🔒 Configuration production activée"
    COMPOSE_FILE="docker-compose.postgresql-17.yml"
    POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-$(openssl rand -base64 32)}
else
    log "🔧 Configuration développement activée"
    COMPOSE_FILE="docker-compose.postgresql-17.yml"
    POSTGRES_PASSWORD="bondly_dev_2025"
fi

# =============================================================================
# CRÉATION DES RÉPERTOIRES
# =============================================================================

log "📁 Création de la structure des répertoires..."

mkdir -p data/postgres
mkdir -p data/backups
mkdir -p database/ssl
mkdir -p logs

success "✅ Répertoires créés"

# =============================================================================
# GÉNÉRATION DES CERTIFICATS SSL (PRODUCTION)
# =============================================================================

if [ "$ENVIRONMENT" = "production" ]; then
    log "🔐 Génération des certificats SSL..."
    
    if [ ! -f database/ssl/server.crt ]; then
        # Génération de la clé privée
        openssl genrsa -out database/ssl/server.key 2048
        
        # Génération du certificat auto-signé
        openssl req -new -x509 -key database/ssl/server.key \
            -out database/ssl/server.crt -days 365 \
            -subj "/C=FR/ST=France/L=Paris/O=Bondly/CN=localhost"
        
        # Copie pour CA
        cp database/ssl/server.crt database/ssl/ca.crt
        
        # Permissions sécurisées
        chmod 600 database/ssl/server.key
        chmod 644 database/ssl/server.crt database/ssl/ca.crt
        
        success "✅ Certificats SSL générés"
    else
        warning "⚠️  Certificats SSL existants utilisés"
    fi
fi

# =============================================================================
# CRÉATION DU FICHIER .ENV
# =============================================================================

log "⚙️  Création du fichier .env..."

cat > .env.postgresql << EOF
# =============================================================================
# CONFIGURATION POSTGRESQL 17.5 - BONDLY
# =============================================================================

# Base de données
POSTGRES_DB=$DB_NAME
POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_HOST=$DB_HOST
POSTGRES_PORT=$DB_PORT

# PgAdmin
PGADMIN_PASSWORD=admin_bondly_2025

# Environnement
NODE_ENV=$ENVIRONMENT
DATABASE_URL=postgresql://$DB_USER:$POSTGRES_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# Chiffrement (généré automatiquement)
ENCRYPTION_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

# Date de création
CREATED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

success "✅ Fichier .env créé"

# =============================================================================
# DÉMARRAGE DES SERVICES
# =============================================================================

log "🐳 Démarrage de PostgreSQL 17.5..."

# Arrêt des conteneurs existants
docker-compose -f $COMPOSE_FILE down 2>/dev/null || true

# Démarrage
POSTGRES_PASSWORD=$POSTGRES_PASSWORD docker-compose -f $COMPOSE_FILE up -d postgres

# Attente que PostgreSQL soit prêt
log "⏳ Attente de la disponibilité de PostgreSQL..."
sleep 10

# Vérification de la santé
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U $DB_USER -d $DB_NAME >/dev/null 2>&1; then
        success "✅ PostgreSQL 17.5 est prêt!"
        break
    fi
    
    log "Tentative $attempt/$max_attempts..."
    sleep 2
    ((attempt++))
done

if [ $attempt -gt $max_attempts ]; then
    error "❌ PostgreSQL n'a pas démarré dans les temps"
fi

# =============================================================================
# VÉRIFICATION DE LA CONFIGURATION
# =============================================================================

log "🔍 Vérification de la configuration PostgreSQL 17.5..."

# Test de connexion
if docker-compose -f $COMPOSE_FILE exec -T postgres psql -U $DB_USER -d $DB_NAME -c "SELECT version();" >/dev/null 2>&1; then
    success "✅ Connexion à la base de données réussie"
else
    error "❌ Impossible de se connecter à la base"
fi

# Vérification des extensions
log "🔌 Vérification des extensions..."
docker-compose -f $COMPOSE_FILE exec -T postgres psql -U $DB_USER -d $DB_NAME -c "
    SELECT extname, extversion 
    FROM pg_extension 
    WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_stat_statements');
" 2>/dev/null && success "✅ Extensions chargées"

# =============================================================================
# AFFICHAGE DES INFORMATIONS
# =============================================================================

echo ""
echo "🎉 PostgreSQL 17.5 configuré avec succès!"
echo ""
echo "📋 Informations de connexion:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: [voir .env.postgresql]"
echo ""
echo "🌐 Accès PgAdmin (optionnel):"
echo "   URL: http://localhost:8080"
echo "   Email: admin@bondly.fr"
echo "   Commande: docker-compose -f $COMPOSE_FILE --profile admin up -d"
echo ""
echo "📊 Monitoring:"
echo "   Logs: docker-compose -f $COMPOSE_FILE logs -f postgres"
echo "   Stats: docker-compose -f $COMPOSE_FILE exec postgres psql -U $DB_USER -d $DB_NAME -c 'SELECT * FROM pg_stat_statements LIMIT 5;'"
echo ""
echo "🔧 Commandes utiles:"
echo "   Arrêt: docker-compose -f $COMPOSE_FILE down"
echo "   Sauvegarde: ./scripts/backup-postgresql.sh"
echo "   Migration: ./scripts/migrate-json-to-postgresql.sh"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    warning "⚠️  PRODUCTION: Sauvegardez le fichier .env.postgresql et les certificats SSL!"
fi

success "🚀 PostgreSQL 17.5 prêt pour Bondly!"
