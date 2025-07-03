#!/bin/bash

# Script de test pour l'image Docker
# Usage: ./scripts/docker-test.sh

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

IMAGE_NAME="relational-partner-manager-frontend:simple"
CONTAINER_NAME="test-rpm-frontend"
TEST_PORT=3005

echo -e "${BLUE}🧪 Test de l'image Docker${NC}"
echo ""

# Fonction pour nettoyer les containers de test
cleanup() {
    echo -e "${YELLOW}🧹 Nettoyage des containers de test...${NC}"
    if sudo docker ps -a --format "table {{.Names}}" | grep -q "$CONTAINER_NAME"; then
        sudo docker rm -f "$CONTAINER_NAME" > /dev/null 2>&1
        echo -e "${GREEN}✅ Container de test supprimé${NC}"
    fi
}

# Fonction pour tester l'image
test_image() {
    echo -e "${BLUE}📦 Vérification de l'image...${NC}"
    
    # Vérifier si l'image existe
    if ! sudo docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "$IMAGE_NAME"; then
        echo -e "${RED}❌ Image $IMAGE_NAME non trouvée${NC}"
        echo -e "${YELLOW}💡 Exécutez d'abord: pnpm run docker:build${NC}"
        exit 1
    fi
    
    # Afficher les informations de l'image
    local image_info=$(sudo docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep "relational-partner-manager-frontend")
    echo -e "${GREEN}✅ Image trouvée:${NC}"
    echo "$image_info"
    
    # Vérifier la taille de l'image
    local image_size=$(sudo docker images --format "{{.Size}}" "$IMAGE_NAME")
    echo -e "${BLUE}📊 Taille de l'image: $image_size${NC}"
    
    # Analyser les couches de l'image
    echo -e "${BLUE}🔍 Analyse des couches...${NC}"
    sudo docker history "$IMAGE_NAME" --format "table {{.CreatedBy}}\t{{.Size}}" | head -10
}

# Fonction pour tester le démarrage du container
test_container_start() {
    echo -e "${BLUE}🚀 Test du démarrage du container...${NC}"
    
    # Démarrer le container
    if sudo docker run -d --name "$CONTAINER_NAME" -p "$TEST_PORT:3000" "$IMAGE_NAME"; then
        echo -e "${GREEN}✅ Container démarré avec succès${NC}"
        echo -e "${BLUE}📡 Application accessible sur http://localhost:$TEST_PORT${NC}"
        
        # Attendre quelques secondes pour que l'application démarre
        echo -e "${YELLOW}⏳ Attente du démarrage de l'application...${NC}"
        sleep 5
        
        # Vérifier que le container fonctionne
        if sudo docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$CONTAINER_NAME.*Up"; then
            echo -e "${GREEN}✅ Container en cours d'exécution${NC}"
            
            # Tester la connectivité
            test_connectivity
            
            # Afficher les logs
            echo -e "${BLUE}📋 Logs du container (dernières 10 lignes):${NC}"
            sudo docker logs --tail 10 "$CONTAINER_NAME"
            
        else
            echo -e "${RED}❌ Container arrêté inattendu${NC}"
            sudo docker logs "$CONTAINER_NAME"
            return 1
        fi
    else
        echo -e "${RED}❌ Échec du démarrage du container${NC}"
        return 1
    fi
}

# Fonction pour tester la connectivité
test_connectivity() {
    echo -e "${BLUE}🌐 Test de connectivité...${NC}"
    
    # Tester avec curl si disponible
    if command -v curl &> /dev/null; then
        if curl -f -s "http://localhost:$TEST_PORT" > /dev/null; then
            echo -e "${GREEN}✅ Application répond sur le port $TEST_PORT${NC}"
        else
            echo -e "${YELLOW}⚠️  Application ne répond pas encore (peut être normal au démarrage)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  curl non disponible pour tester la connectivité${NC}"
    fi
}

# Fonction pour tester la sécurité
test_security() {
    echo -e "${BLUE}🔒 Test de sécurité...${NC}"
    
    # Vérifier l'utilisateur
    local user=$(sudo docker exec "$CONTAINER_NAME" whoami 2>/dev/null || echo "unknown")
    if [ "$user" = "nextjs" ]; then
        echo -e "${GREEN}✅ Application s'exécute avec l'utilisateur non-root 'nextjs'${NC}"
    else
        echo -e "${RED}❌ Application s'exécute avec l'utilisateur: $user${NC}"
    fi
    
    # Vérifier les processus
    echo -e "${BLUE}⚙️  Processus en cours d'exécution:${NC}"
    sudo docker exec "$CONTAINER_NAME" ps aux 2>/dev/null || echo "Impossible de lister les processus"
}

# Fonction pour tester les performances
test_performance() {
    echo -e "${BLUE}⚡ Test de performance...${NC}"
    
    # Vérifier l'utilisation mémoire
    local memory_usage=$(sudo docker stats --no-stream --format "table {{.MemUsage}}" "$CONTAINER_NAME" 2>/dev/null || echo "N/A")
    echo -e "${BLUE}💾 Utilisation mémoire: $memory_usage${NC}"
    
    # Vérifier l'utilisation CPU
    local cpu_usage=$(sudo docker stats --no-stream --format "table {{.CPUPerc}}" "$CONTAINER_NAME" 2>/dev/null || echo "N/A")
    echo -e "${BLUE}🖥️  Utilisation CPU: $cpu_usage${NC}"
}

# Nettoyage au début et à la fin
trap cleanup EXIT

# Exécuter les tests
echo -e "${BLUE}🚀 Début des tests...${NC}"
echo ""

cleanup

test_image
echo ""

test_container_start
echo ""

test_security
echo ""

test_performance
echo ""

echo -e "${GREEN}🎉 Tests terminés !${NC}"
echo -e "${BLUE}💡 Pour arrêter le container de test: sudo docker rm -f $CONTAINER_NAME${NC}"
echo -e "${BLUE}🌐 Application de test: http://localhost:$TEST_PORT${NC}"
