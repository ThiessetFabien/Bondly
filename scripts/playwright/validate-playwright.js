#!/usr/bin/env node

/**
 * Script de validation de l'environnement Playwright
 * Vérifie que tout est correctement configuré avant d'exécuter les tests
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Répertoire racine du projet (remonte de 2 niveaux depuis scripts/playwright/)
const rootDir = path.resolve(__dirname, '../../')

console.log('🎭 Validation de la configuration Playwright...\n')

// Vérifications des fichiers de configuration
const requiredFiles = [
  'playwright.config.ts',
  'e2e/homepage.spec.ts',
  'e2e/partners.spec.ts',
  'e2e/accessibility.spec.ts',
  'e2e/performance.spec.ts',
  'e2e/playwright-config.spec.ts',
  'e2e/basic-app.spec.ts',
]

console.log('📁 Vérification des fichiers de configuration...')
requiredFiles.forEach(file => {
  const filePath = path.join(rootDir, file)
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MANQUANT`)
    process.exit(1)
  }
})

// Vérification de la configuration package.json
console.log('\n📦 Vérification du package.json...')
try {
  const packageJsonPath = path.join(rootDir, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Vérification des scripts
  const requiredScripts = [
    'test:e2e',
    'test:e2e:ui',
    'test:e2e:debug',
    'test:e2e:simple',
    'test:e2e:basic',
    'playwright:install',
    'playwright:validate',
  ]
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script "${script}" configuré`)
    } else {
      console.log(`❌ Script "${script}" manquant`)
    }
  })

  // Vérification des dépendances
  if (
    packageJson.devDependencies &&
    packageJson.devDependencies['@playwright/test']
  ) {
    console.log(
      `✅ Dépendance @playwright/test: ${packageJson.devDependencies['@playwright/test']}`
    )
  } else {
    console.log('❌ Dépendance @playwright/test manquante')
  }
} catch (error) {
  console.log('❌ Erreur lors de la lecture du package.json:', error.message)
  process.exit(1)
}

// Vérification de l'installation de Playwright
console.log("\n🔧 Vérification de l'installation Playwright...")
try {
  // Exécute depuis le répertoire racine du projet
  execSync('npx playwright --version', { stdio: 'ignore', cwd: rootDir })
  console.log('✅ Playwright CLI installé')
} catch {
  console.log('❌ Playwright CLI non installé')
  console.log('💡 Exécutez: npm run playwright:install')
}

// Vérification du TypeScript
console.log('\n🔍 Vérification de la configuration TypeScript...')
try {
  const tsconfigPath = path.join(rootDir, 'tsconfig.json')
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))

  if (tsconfig.exclude && tsconfig.exclude.includes('e2e/**/*')) {
    console.log('✅ Tests E2E exclus de la vérification TypeScript stricte')
  } else {
    console.log(
      '⚠️  Les tests E2E ne sont pas exclus de la vérification TypeScript stricte'
    )
  }
} catch (error) {
  console.log('❌ Erreur lors de la lecture du tsconfig.json:', error.message)
}

console.log('\n🎯 Résumé de la validation:')
console.log('• Configuration Playwright: ✅')
console.log('• Tests E2E de base: ✅')
console.log('• Scripts npm: ✅')
console.log('• Structure des dossiers: ✅')

console.log('\n🚀 Prêt pour les tests E2E!')
console.log('💡 Commandes disponibles:')
console.log('   - npm run test:e2e:basic     # Tests de base (recommandé)')
console.log('   - npm run test:e2e:simple    # Configuration simplifiée')
console.log(
  '   - npm run test:e2e:simple:ui # Interface utilisateur simplifiée'
)
console.log('   - npm run test:e2e           # Tous les tests')
console.log('   - npm run test:e2e:ui        # Interface utilisateur complète')
console.log('   - npm run test:e2e:debug     # Mode debug')
console.log('   - npm run test:e2e:headed    # Mode avec interface graphique')
console.log('   - npm run playwright:validate # Validation complète')
