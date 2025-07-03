#!/bin/bash

echo "🔧 Configuration de Husky pour RPM-CL avec PNPM..."

# Vérifier que pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "❌ PNPM n'est pas installé. Installez-le d'abord:"
    echo "npm install -g pnpm"
    exit 1
fi

# Installer husky si nécessaire
if [ ! -d "node_modules/husky" ]; then
    echo "📦 Installation de Husky..."
    pnpm install --save-dev husky
fi

# Initialiser husky
echo "🎣 Initialisation de Husky..."
pnpx husky install

# Rendre tous les hooks exécutables
echo "🔧 Configuration des permissions..."
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/prepare-commit-msg

echo ""
echo "✅ Husky configuré avec succès pour PNPM!"
echo ""
echo "Hooks installés:"
echo "  - commit-msg: Valide les messages de commit avec commitlint"
echo "  - pre-commit: Formate le code et vérifie TypeScript"
echo "  - pre-push: Exécute les tests et build avant push"
echo "  - prepare-commit-msg: Ajoute un template d'aide"
echo ""
echo "Scripts disponibles:"
echo "  - pnpm run commit: Interface Gitmoji pour commits"
echo "  - pnpm run commitlint: Valider un message manuellement"
echo "  - pnpm run validate-commits: Valider l'historique"
echo ""
echo "Testez avec: git add . && git commit -m 'test: verify husky setup'"
