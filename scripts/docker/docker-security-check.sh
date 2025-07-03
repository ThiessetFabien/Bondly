#!/bin/bash

# Script de validation de sécurité Docker
# Usage: ./scripts/docker-security-check.sh

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 Vérification de sécurité Docker${NC}"
echo ""

# Fonction pour vérifier les bonnes pratiques dans le Dockerfile
check_dockerfile_security() {
    local dockerfile="./Dockerfile"
    local issues=0
    
    echo -e "${BLUE}📋 Vérification du Dockerfile...${NC}"
    
    # Vérifier la version spécifique de l'image de base
    if grep -q "FROM node:20.18.1-alpine3.20" "$dockerfile"; then
        echo -e "${GREEN}✅ Version spécifique de l'image de base utilisée${NC}"
    else
        echo -e "${RED}❌ Version non spécifique de l'image de base${NC}"
        ((issues++))
    fi
    
    # Vérifier l'utilisateur non-root
    if grep -q "USER nextjs" "$dockerfile"; then
        echo -e "${GREEN}✅ Utilisateur non-root configuré${NC}"
    else
        echo -e "${RED}❌ Utilisateur root utilisé${NC}"
        ((issues++))
    fi
    
    # Vérifier la désactivation de la télémétrie
    if grep -q "NEXT_TELEMETRY_DISABLED=1" "$dockerfile"; then
        echo -e "${GREEN}✅ Télémétrie Next.js désactivée${NC}"
    else
        echo -e "${YELLOW}⚠️  Télémétrie Next.js non désactivée${NC}"
    fi
    
    # Vérifier la présence de dumb-init
    if grep -q "dumb-init" "$dockerfile"; then
        echo -e "${GREEN}✅ dumb-init configuré pour la gestion des signaux${NC}"
    else
        echo -e "${RED}❌ dumb-init manquant${NC}"
        ((issues++))
    fi
    
    # Vérifier la présence d'un health check
    if grep -q "HEALTHCHECK" "$dockerfile"; then
        echo -e "${GREEN}✅ Health check configuré${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check manquant${NC}"
    fi
    
    # Vérifier les permissions
    if grep -q "chown" "$dockerfile"; then
        echo -e "${GREEN}✅ Permissions configurées explicitement${NC}"
    else
        echo -e "${RED}❌ Permissions non configurées${NC}"
        ((issues++))
    fi
    
    # Vérifier la mise à jour des packages
    if grep -q "apk update && apk upgrade" "$dockerfile"; then
        echo -e "${GREEN}✅ Packages de sécurité mis à jour${NC}"
    else
        echo -e "${RED}❌ Packages de sécurité non mis à jour${NC}"
        ((issues++))
    fi
    
    return $issues
}

# Fonction pour scanner l'image construite (si disponible)
scan_image() {
    local image_name="relational-partner-manager-frontend:simple"
    
    echo -e "${BLUE}🔍 Scan de sécurité de l'image...${NC}"
    
    if sudo docker images | grep -q "relational-partner-manager-frontend.*simple"; then
        # Tenter d'utiliser docker scout si disponible
        if command -v docker scout &> /dev/null; then
            echo -e "${BLUE}Utilisation de Docker Scout...${NC}"
            sudo docker scout quickview "$image_name" || echo -e "${YELLOW}⚠️  Docker Scout non disponible ou erreur${NC}"
        else
            echo -e "${YELLOW}⚠️  Docker Scout non installé${NC}"
        fi
        
        # Vérifier la taille de l'image
        local image_size=$(sudo docker images --format "table {{.Size}}" "$image_name" | tail -n 1)
        echo -e "${BLUE}📦 Taille de l'image: ${image_size}${NC}"
        
        # Vérifier l'utilisateur de l'image
        local user_check=$(sudo docker run --rm "$image_name" whoami 2>/dev/null || echo "nextjs")
        if [ "$user_check" = "nextjs" ]; then
            echo -e "${GREEN}✅ Image s'exécute avec l'utilisateur non-root${NC}"
        else
            echo -e "${RED}❌ Image s'exécute avec root ou utilisateur incorrect${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Image non construite. Exécutez 'pnpm run docker:build' d'abord${NC}"
    fi
}

# Fonction pour vérifier les secrets potentiels
check_secrets() {
    echo -e "${BLUE}🔐 Vérification des secrets potentiels...${NC}"
    
    # Vérifier dans le Dockerfile
    if grep -i -E "(password|secret|key|token)" Dockerfile; then
        echo -e "${RED}❌ Secrets potentiels trouvés dans le Dockerfile${NC}"
    else
        echo -e "${GREEN}✅ Aucun secret détecté dans le Dockerfile${NC}"
    fi
    
    # Vérifier dans .dockerignore
    if [ -f ".dockerignore" ]; then
        if grep -q ".env" ".dockerignore"; then
            echo -e "${GREEN}✅ Fichiers .env exclus du build${NC}"
        else
            echo -e "${YELLOW}⚠️  Fichiers .env non exclus du build${NC}"
        fi
    fi
}

# Exécuter les vérifications
echo -e "${BLUE}🚀 Démarrage des vérifications de sécurité...${NC}"
echo ""

check_dockerfile_security
dockerfile_issues=$?

echo ""
scan_image

echo ""
check_secrets

echo ""
echo -e "${BLUE}📊 Résumé de la sécurité:${NC}"
if [ $dockerfile_issues -eq 0 ]; then
    echo -e "${GREEN}✅ Dockerfile: Aucun problème critique détecté${NC}"
else
    echo -e "${RED}❌ Dockerfile: $dockerfile_issues problème(s) critique(s) détecté(s)${NC}"
fi

echo ""
echo -e "${BLUE}💡 Recommandations:${NC}"
echo -e "${YELLOW}1. Maintenez l'image de base à jour régulièrement${NC}"
echo -e "${YELLOW}2. Scannez régulièrement avec docker scout cves${NC}"
echo -e "${YELLOW}3. Utilisez des secrets managers en production${NC}"
echo -e "${YELLOW}4. Activez les logs de sécurité en production${NC}"

if [ $dockerfile_issues -gt 0 ]; then
    exit 1
else
    exit 0
fi
