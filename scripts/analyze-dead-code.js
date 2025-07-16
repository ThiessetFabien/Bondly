#!/usr/bin/env node

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { join } from 'path'

console.log('🔍 Analyse complète du code mort - Démarrage...\n')

const results = {
  timestamp: new Date().toISOString(),
  oxlint: null,
  depcheck: null,
  unusedExports: null,
  summary: {
    totalIssues: 0,
    categories: {
      unusedVariables: 0,
      unusedImports: 0,
      unusedExports: 0,
      unusedDependencies: 0,
      deadCode: 0,
    },
  },
}

try {
  // 1. Analyse avec oxlint
  console.log('📋 1. Analyse avec oxlint...')
  try {
    const oxlintOutput = execSync('pnpm run lint:dead-code', {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    results.oxlint = { status: 'success', output: oxlintOutput }
    console.log('✅ oxlint terminé')
  } catch (error) {
    results.oxlint = { status: 'error', output: error.stdout || error.message }
    console.log('⚠️  oxlint a détecté des problèmes')
  }

  // 2. Analyse des dépendances avec depcheck
  console.log('\n📦 2. Analyse des dépendances inutilisées...')
  try {
    const depcheckOutput = execSync('pnpm run analyze:deps', {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    results.depcheck = { status: 'success', output: depcheckOutput }
    console.log('✅ depcheck terminé')
  } catch (error) {
    results.depcheck = {
      status: 'error',
      output: error.stdout || error.message,
    }
    console.log('⚠️  depcheck a détecté des dépendances inutilisées')
  }

  // 3. Analyse des exports inutilisés
  console.log('\n📤 3. Analyse des exports inutilisés...')
  try {
    const unusedExportsOutput = execSync('pnpm run analyze:unused-exports', {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    results.unusedExports = { status: 'success', output: unusedExportsOutput }
    console.log('✅ ts-unused-exports terminé')
  } catch (error) {
    results.unusedExports = {
      status: 'error',
      output: error.stdout || error.message,
    }
    console.log('⚠️  ts-unused-exports a détecté des exports inutilisés')
  }

  // 4. Génération du rapport
  console.log('\n📊 4. Génération du rapport...')

  // Compter les problèmes
  if (results.oxlint?.status === 'error') {
    const oxlintIssues = (results.oxlint.output.match(/error|warning/g) || [])
      .length
    results.summary.totalIssues += oxlintIssues
    results.summary.categories.deadCode += oxlintIssues
  }

  if (results.depcheck?.status === 'error') {
    const depIssues = (results.depcheck.output.match(/Unused|Missing/g) || [])
      .length
    results.summary.totalIssues += depIssues
    results.summary.categories.unusedDependencies += depIssues
  }

  if (results.unusedExports?.status === 'error') {
    const exportIssues = (
      results.unusedExports.output.match(/unused export/g) || []
    ).length
    results.summary.totalIssues += exportIssues
    results.summary.categories.unusedExports += exportIssues
  }

  // Sauvegarder le rapport
  const reportPath = join(process.cwd(), 'dead-code-analysis.json')
  writeFileSync(reportPath, JSON.stringify(results, null, 2))

  console.log('✅ Rapport généré:', reportPath)

  // Afficher le résumé
  console.log('\n📈 RÉSUMÉ:')
  console.log(`Total des problèmes détectés: ${results.summary.totalIssues}`)
  console.log(`├─ Code mort: ${results.summary.categories.deadCode}`)
  console.log(
    `├─ Dépendances inutilisées: ${results.summary.categories.unusedDependencies}`
  )
  console.log(
    `└─ Exports inutilisés: ${results.summary.categories.unusedExports}`
  )

  if (results.summary.totalIssues === 0) {
    console.log('\n🎉 Aucun code mort détecté ! Votre code est propre.')
  } else {
    console.log(
      '\n⚠️  Code mort détecté. Consultez le rapport pour plus de détails.'
    )
  }
} catch (error) {
  console.error("❌ Erreur lors de l'analyse:", error.message)
  process.exit(1)
}
