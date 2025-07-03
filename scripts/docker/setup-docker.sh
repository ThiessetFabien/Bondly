#!/bin/bash

# Script d'installation et de configuration Docker pour le projet
# Usage: ./scripts/setup-docker.sh

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Configuration Docker pour Relational Partner Manager Frontend${NC}"
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé. Veuillez installer Docker d'abord.${NC}"
    echo "https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✅ Docker est installé ($(docker --version))${NC}"

# Vérifier si Docker Compose est disponible
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose n'est pas disponible. Installation recommandée.${NC}"
else
    echo -e "${GREEN}✅ Docker Compose est disponible${NC}"
fi

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker est en cours d'exécution${NC}"

# Construire les images Docker
echo ""
echo -e "${BLUE}📦 Construction des images Docker...${NC}"

echo -e "${YELLOW}Construction de l'image de développement...${NC}"
if docker build -f Dockerfile.dev -t relational-partner-manager-frontend:dev .; then
    echo -e "${GREEN}✅ Image de développement construite avec succès${NC}"
else
    echo -e "${RED}❌ Échec de la construction de l'image de développement${NC}"
    exit 1
fi

echo -e "${YELLOW}Construction de l'image de production...${NC}"
if DOCKER_BUILDKIT=0 docker build -t relational-partner-manager-frontend:latest .; then
    echo -e "${GREEN}✅ Image de production construite avec succès${NC}"
else
    echo -e "${RED}❌ Échec de la construction de l'image de production${NC}"
    exit 1
fi

# Rendre les scripts exécutables
chmod +x scripts/docker-help.sh

echo ""
echo -e "${GREEN}🎉 Configuration Docker terminée avec succès !${NC}"
echo ""
echo -e "${BLUE}Commandes de démarrage rapide :${NC}"
echo -e "${YELLOW}  Mode développement :${NC} pnpm run docker:dev"
echo -e "${YELLOW}  Mode production :${NC}   pnpm run docker:run"
echo -e "${YELLOW}  Aide complète :${NC}     pnpm run docker:help"
echo ""
echo -e "${BLUE}Applications disponibles sur :${NC}"
echo -e "${YELLOW}  Développement :${NC}  http://localhost:3001"
echo -e "${YELLOW}  Production :${NC}     http://localhost:3000"
echo ""
