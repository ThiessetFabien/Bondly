#!/usr/bin/env node
/**
 * Script rapide pour tester l'API JSON des partenaires
 */

const {
  testPartnersAPI,
} = require('../src/api/__tests__/partners-json.test.ts')

console.log('🚀 Lancement des tests API JSON...\n')

testPartnersAPI()
  .then(() => {
    console.log('\n🎉 Tests terminés avec succès!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Erreur lors des tests:', error)
    process.exit(1)
  })
