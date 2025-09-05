#!/usr/bin/env node

/**
 * Test rapide de validation Playwright
 * Vérifie que les tests de base fonctionnent correctement
 */

const { execSync } = require('child_process')
const path = require('path')

// Répertoire racine du projet
const rootDir = path.resolve(__dirname, '../../')

console.log('🎭 Test rapide Playwright...\n')

try {
  // Exécute les tests de base
  console.log('🧪 Exécution des tests de base...')
  execSync('npm run test:e2e:basic', {
    stdio: 'inherit',
    cwd: rootDir,
  })

  console.log('\n✅ Tests de base réussis!')
  console.log('💡 Playwright est configuré et fonctionnel')
} catch (error) {
  console.log('\n❌ Échec des tests de base')
  console.log('💡 Vérifiez la configuration avec: npm run playwright:validate')
  console.log('Erreur:', error.message)
  process.exit(1)
}

console.log('\n🎉 Validation rapide terminée avec succès!')
console.log('🔧 Pour une validation complète: npm run playwright:validate')
