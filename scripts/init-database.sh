#!/bin/bash

# =============================================================================
# SCRIPT D'INITIALISATION POSTGRESQL 17.5 POUR BONDLY
# =============================================================================
# Ce script initialise PostgreSQL 17.5 avec le schéma optimisé et les données
# Usage: ./scripts/init-database.sh [environment]
# =============================================================================

set -e

# Configuration PostgreSQL 17.5
DB_NAME="bondly"
DB_USER="bondly_user"
DB_PASSWORD="bondly_password"
DB_HOST="localhost"
DB_PORT="5432"
POSTGRES_VERSION="17.5"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  [PostgreSQL $POSTGRES_VERSION] $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction de vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier PostgreSQL
    if ! command -v psql &> /dev/null; then
        log_error "PostgreSQL (psql) n'est pas installé"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis OK"
}

# Fonction de création de la base de données
create_database() {
    log_info "Création de la base de données..."
    
    # Création de l'utilisateur et de la base (si nécessaire)
    PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "${POSTGRES_USER:-postgres}" -c "
        DO \$\$
        BEGIN
            -- Création de l'utilisateur s'il n'existe pas
            IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
                CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
            END IF;
            
            -- Création de la base s'il n'existe pas
            IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN
                CREATE DATABASE $DB_NAME OWNER $DB_USER;
            END IF;
        END
        \$\$;
    " 2>/dev/null || {
        log_warning "Impossible de créer la base automatiquement"
        log_info "Veuillez créer manuellement:"
        echo "  CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
        echo "  CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    }
    
    log_success "Base de données configurée"
}

# Fonction d'application du schéma
apply_schema() {
    log_info "Application du schéma PostgreSQL..."
    
    if [ ! -f "database/schema.sql" ]; then
        log_error "Le fichier database/schema.sql n'existe pas"
        exit 1
    fi
    
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "database/schema.sql"
    
    if [ $? -eq 0 ]; then
        log_success "Schéma appliqué avec succès"
    else
        log_error "Erreur lors de l'application du schéma"
        exit 1
    fi
}

# Fonction d'installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances pour la migration..."
    
    # Vérifier si pg est installé
    if ! npm list pg &> /dev/null; then
        log_info "Installation du driver PostgreSQL..."
        npm install pg
    fi
    
    # Vérifier si dotenv est installé
    if ! npm list dotenv &> /dev/null; then
        log_info "Installation de dotenv..."
        npm install dotenv
    fi
    
    log_success "Dépendances installées"
}

# Fonction de migration des données
migrate_data() {
    log_info "Migration des données JSON vers PostgreSQL..."
    
    if [ ! -f "scripts/migrate-json-to-postgres.js" ]; then
        log_error "Le script de migration n'existe pas"
        exit 1
    fi
    
    # Configuration des variables d'environnement pour la migration
    export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    
    node scripts/migrate-json-to-postgres.js
    
    if [ $? -eq 0 ]; then
        log_success "Migration des données terminée"
    else
        log_error "Erreur lors de la migration des données"
        exit 1
    fi
}

# Fonction de vérification post-installation
verify_installation() {
    log_info "Vérification de l'installation..."
    
    export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    
    # Test de connexion et comptage des données
    RESULT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
        SELECT 
            'Partners: ' || COUNT(*) || ', Active: ' || COUNT(*) FILTER (WHERE status = 'active')
        FROM partners;
    " 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        log_success "Vérification OK - $RESULT"
    else
        log_warning "Impossible de vérifier les données"
    fi
}

# Fonction de configuration Docker
setup_docker() {
    log_info "Configuration Docker pour PostgreSQL..."
    
    # Création du docker-compose.yml pour PostgreSQL si inexistant
    if [ ! -f "docker-compose.postgres.yml" ]; then
        cat > docker-compose.postgres.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_DB: $DB_NAME
      POSTGRES_USER: $DB_USER
      POSTGRES_PASSWORD: $DB_PASSWORD
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $DB_USER -d $DB_NAME"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
EOF
        log_success "Fichier docker-compose.postgres.yml créé"
    fi
}

# Fonction principale
main() {
    echo "============================================"
    echo "🗄️  INITIALISATION BASE POSTGRESQL BONDLY"
    echo "============================================"
    
    # Gestion des arguments
    ENVIRONMENT=${1:-development}
    log_info "Environnement: $ENVIRONMENT"
    
    # Configuration selon l'environnement
    case $ENVIRONMENT in
        "production")
            DB_PASSWORD=${DB_PASSWORD:-$(openssl rand -base64 32)}
            log_warning "Environnement PRODUCTION - utilisez des mots de passe sécurisés"
            ;;
        "docker")
            setup_docker
            log_info "Utilisez: docker-compose -f docker-compose.postgres.yml up -d"
            exit 0
            ;;
    esac
    
    # Exécution des étapes
    check_prerequisites
    create_database
    apply_schema
    install_dependencies
    migrate_data
    verify_installation
    
    echo ""
    echo "============================================"
    log_success "🎉 INSTALLATION TERMINÉE AVEC SUCCÈS"
    echo "============================================"
    echo ""
    echo "Configuration:"
    echo "  • Base de données: $DB_NAME"
    echo "  • Utilisateur: $DB_USER"
    echo "  • Host: $DB_HOST:$DB_PORT"
    echo ""
    echo "Variables d'environnement à configurer:"
    echo "  export DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME\""
    echo ""
    echo "Prochaines étapes:"
    echo "  1. Configurer les variables d'environnement"
    echo "  2. Adapter l'application pour utiliser PostgreSQL"
    echo "  3. Tester la connexion depuis l'application"
    echo ""
}

# Gestion des signaux pour cleanup
cleanup() {
    log_info "Nettoyage en cours..."
    exit 1
}

trap cleanup SIGINT SIGTERM

# Point d'entrée
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
