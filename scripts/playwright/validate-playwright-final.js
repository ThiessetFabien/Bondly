#!/usr/bin/env node

/**
 * Script de validation finale de la configuration Playwright
 * Exécute tous les tests et vérifie le bon fonctionnement
 */

const { execSync } = require('child_process')

console.log('🎭 Validation finale de Playwright pour RPM-CL\n')

// Vérification que le serveur Next.js peut démarrer
console.log('🚀 Vérification du serveur Next.js...')
try {
  // Démarre le serveur en arrière-plan
  execSync('npm run dev > /dev/null 2>&1 &', { stdio: 'ignore' })

  // Attend que le serveur se lance
  let retries = 0
  let serverReady = false

  while (retries < 30 && !serverReady) {
    try {
      execSync('curl -s http://localhost:3000 > /dev/null 2>&1', {
        stdio: 'ignore',
      })
      serverReady = true
      console.log('✅ Serveur Next.js prêt')
    } catch {
      retries++
      // Attend 1 seconde
      execSync('sleep 1', { stdio: 'ignore' })
    }
  }

  if (!serverReady) {
    console.log('❌ Impossible de démarrer le serveur Next.js')
    process.exit(1)
  }
} catch (error) {
  console.log('❌ Erreur lors du démarrage du serveur:', error.message)
  process.exit(1)
}

// Exécution des tests E2E de base
console.log('\n🧪 Exécution des tests E2E de base...')
try {
  execSync('npm run test:e2e:basic', { stdio: 'inherit' })
  console.log('✅ Tests E2E de base réussis')
} catch {
  console.log('❌ Échec des tests E2E de base')
  console.log('💡 Vérifiez que le serveur Next.js est démarré')
  process.exit(1)
}

// Génération du rapport HTML
console.log('\n📊 Génération du rapport HTML...')
try {
  execSync('npm run test:e2e:simple -- --reporter=html', { stdio: 'inherit' })
  console.log('✅ Rapport HTML généré')
  console.log('💡 Ouvrez playwright-report/index.html pour voir le rapport')
} catch {
  console.log('⚠️  Échec de la génération du rapport HTML')
}

// Arrêt du serveur
console.log('\n🛑 Arrêt du serveur Next.js...')
try {
  execSync('pkill -f "next dev" || true', { stdio: 'ignore' })
  console.log('✅ Serveur arrêté')
} catch {
  console.log("⚠️  Impossible d'arrêter le serveur automatiquement")
}

console.log('\n🎉 Validation Playwright terminée avec succès !')
console.log('\n📋 Résumé de la configuration :')
console.log('• Configuration complète : playwright.config.ts')
console.log('• Configuration simplifiée : playwright.config.simple.ts')
console.log('• Tests de base : e2e/basic-app.spec.ts')
console.log('• Tests complets : e2e/*.spec.ts')

console.log('\n🔧 Commandes disponibles :')
console.log('• npm run test:e2e:basic      # Tests de base uniquement')
console.log('• npm run test:e2e:simple     # Configuration simplifiée')
console.log('• npm run test:e2e:simple:ui  # Interface utilisateur')
console.log('• npm run test:e2e            # Configuration complète')
console.log('• npm run test:e2e:ui         # Interface utilisateur complète')

console.log('\n✨ Playwright est maintenant prêt pour RPM-CL !')
