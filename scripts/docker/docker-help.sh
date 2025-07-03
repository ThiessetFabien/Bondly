#!/bin/bash

# Script d'aide pour Docker
# Usage: ./scripts/docker-help.sh [commande]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo -e "${BLUE}🐳 Docker Helper for Relational Partner Manager Frontend${NC}"
    echo ""
    echo "Commandes disponibles :"
    echo ""
    echo -e "${GREEN}build${NC}          - Construire l'image Docker de production"
    echo -e "${GREEN}build-dev${NC}      - Construire l'image Docker de développement"
    echo -e "${GREEN}run${NC}            - Lancer le container en mode production"
    echo -e "${GREEN}dev${NC}            - Lancer le container en mode développement"
    echo -e "${GREEN}stop${NC}           - Arrêter tous les containers"
    echo -e "${GREEN}clean${NC}          - Nettoyer les images et containers"
    echo -e "${GREEN}logs${NC}           - Afficher les logs du container"
    echo -e "${GREEN}shell${NC}          - Ouvrir un shell dans le container"
    echo -e "${GREEN}install${NC}        - Installer/mettre à jour les dépendances"
    echo ""
    echo "Exemples :"
    echo "  ./scripts/docker-help.sh build"
    echo "  ./scripts/docker-help.sh dev"
    echo "  ./scripts/docker-help.sh logs"
}

# Fonction pour construire l'image de production
build_prod() {
    echo -e "${BLUE}📦 Construction de l'image Docker de production...${NC}"
    docker build -t relational-partner-manager-frontend:latest .
    echo -e "${GREEN}✅ Image de production construite avec succès !${NC}"
}

# Fonction pour construire l'image de développement
build_dev() {
    echo -e "${BLUE}📦 Construction de l'image Docker de développement...${NC}"
    docker build -f Dockerfile.dev -t relational-partner-manager-frontend:dev .
    echo -e "${GREEN}✅ Image de développement construite avec succès !${NC}"
}

# Fonction pour lancer en production
run_prod() {
    echo -e "${BLUE}🚀 Lancement du container en mode production...${NC}"
    docker-compose up -d app
    echo -e "${GREEN}✅ Application démarrée sur http://localhost:3000${NC}"
}

# Fonction pour lancer en développement
run_dev() {
    echo -e "${BLUE}🚀 Lancement du container en mode développement...${NC}"
    docker-compose --profile dev up -d dev
    echo -e "${GREEN}✅ Application de développement démarrée sur http://localhost:3001${NC}"
}

# Fonction pour arrêter les containers
stop_containers() {
    echo -e "${YELLOW}⏹️  Arrêt des containers...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Containers arrêtés${NC}"
}

# Fonction pour nettoyer
clean_docker() {
    echo -e "${YELLOW}🧹 Nettoyage des images et containers...${NC}"
    docker-compose down --rmi all --volumes --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Nettoyage terminé${NC}"
}

# Fonction pour afficher les logs
show_logs() {
    echo -e "${BLUE}📋 Logs du container...${NC}"
    if docker ps --format "table {{.Names}}" | grep -q "relational-partner-manager-frontend"; then
        docker logs -f relational-partner-manager-frontend
    elif docker ps --format "table {{.Names}}" | grep -q "relational-partner-manager-dev"; then
        docker logs -f relational-partner-manager-dev
    else
        echo -e "${RED}❌ Aucun container en cours d'exécution${NC}"
    fi
}

# Fonction pour ouvrir un shell
open_shell() {
    echo -e "${BLUE}🖥️  Ouverture d'un shell dans le container...${NC}"
    if docker ps --format "table {{.Names}}" | grep -q "relational-partner-manager-frontend"; then
        docker exec -it relational-partner-manager-frontend sh
    elif docker ps --format "table {{.Names}}" | grep -q "relational-partner-manager-dev"; then
        docker exec -it relational-partner-manager-dev sh
    else
        echo -e "${RED}❌ Aucun container en cours d'exécution${NC}"
    fi
}

# Fonction pour installer les dépendances
install_deps() {
    echo -e "${BLUE}📥 Installation/mise à jour des dépendances...${NC}"
    docker-compose run --rm app pnpm install
    echo -e "${GREEN}✅ Dépendances installées${NC}"
}

# Main
case "${1:-help}" in
    "build")
        build_prod
        ;;
    "build-dev")
        build_dev
        ;;
    "run")
        run_prod
        ;;
    "dev")
        run_dev
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_docker
        ;;
    "logs")
        show_logs
        ;;
    "shell")
        open_shell
        ;;
    "install")
        install_deps
        ;;
    "help"|*)
        show_help
        ;;
esac
