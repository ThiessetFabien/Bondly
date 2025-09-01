#!/bin/bash

# =============================================================================
# SCRIPT DE SAUVEGARDE POSTGRESQL POUR BONDLY
# =============================================================================
# Effectue une sauvegarde complète de la base de données
# Usage: ./scripts/backup.sh [destination]
# =============================================================================

set -e

# Configuration
DB_NAME="bondly"
DB_USER="bondly_user"
DB_HOST="localhost"
DB_PORT="5432"
BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/bondly_backup_$TIMESTAMP.sql"

# Couleurs pour les logs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Création du répertoire de sauvegarde
mkdir -p "$BACKUP_DIR"

log_info "Début de la sauvegarde de la base $DB_NAME..."

# Sauvegarde complète
if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --verbose \
    --no-password \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_FILE.custom"; then
    
    log_success "Sauvegarde custom créée: $BACKUP_FILE.custom"
else
    log_error "Échec de la sauvegarde custom"
    exit 1
fi

# Sauvegarde SQL pour lisibilité
if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --verbose \
    --no-password \
    --format=plain \
    --file="$BACKUP_FILE"; then
    
    log_success "Sauvegarde SQL créée: $BACKUP_FILE"
else
    log_error "Échec de la sauvegarde SQL"
    exit 1
fi

# Compression de la sauvegarde SQL
gzip "$BACKUP_FILE"
log_success "Sauvegarde compressée: $BACKUP_FILE.gz"

# Calcul de la taille
BACKUP_SIZE=$(du -h "$BACKUP_FILE.custom" | cut -f1)
log_info "Taille de la sauvegarde: $BACKUP_SIZE"

# Nettoyage des anciennes sauvegardes (> 30 jours)
DELETED_COUNT=$(find "$BACKUP_DIR" -name "bondly_backup_*.sql.gz" -mtime +30 -delete -print | wc -l)
if [ "$DELETED_COUNT" -gt 0 ]; then
    log_info "Suppression de $DELETED_COUNT anciennes sauvegardes"
fi

log_success "Sauvegarde terminée avec succès!"
echo ""
echo "Fichiers créés:"
echo "  • $BACKUP_FILE.custom (format PostgreSQL)"
echo "  • $BACKUP_FILE.gz (format SQL compressé)"
echo ""
echo "Pour restaurer:"
echo "  pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME $BACKUP_FILE.custom"
echo "  # ou"
echo "  gunzip -c $BACKUP_FILE.gz | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
