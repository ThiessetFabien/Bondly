/**
 * Client API pour tester les endpoints
 * Usage: node scripts/test-api.mjs
 */

const API_BASE = 'http://localhost:3000/api'

/**
 * Utilitaire pour faire des requêtes HTTP
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log(`🔄 ${config.method || 'GET'} ${url}`)
    const response = await fetch(url, config)
    const data = await response.json()

    if (response.ok) {
      console.log(`✅ Succès (${response.status})`)
      return { success: true, data, status: response.status }
    } else {
      console.log(
        `❌ Erreur (${response.status}): ${data.error || data.message}`
      )
      return { success: false, error: data, status: response.status }
    }
  } catch (error) {
    console.log(`❌ Erreur réseau: ${error.message}`)
    return { success: false, error: error.message, status: 0 }
  }
}

/**
 * Tests des endpoints
 */
async function testAPI() {
  console.log("🧪 Test de l'API Bondly\n")

  // Test 1: Récupérer les statistiques du dashboard
  console.log('📊 Test des statistiques dashboard')
  await apiRequest('/dashboard/stats')
  console.log()

  // Test 2: Récupérer les partenaires
  console.log('👥 Test de récupération des partenaires')
  const partnersResult = await apiRequest('/partners?page=1&limit=5')
  console.log()

  // Test 3: Recherche de partenaires
  console.log('🔍 Test de recherche de partenaires')
  await apiRequest('/partners?search=marie')
  console.log()

  // Test 4: Récupérer les classifications
  console.log('📋 Test des classifications')
  const classificationsResult = await apiRequest('/classifications')
  console.log()

  // Test 5: Recherche globale
  console.log('🔍 Test de recherche globale')
  await apiRequest('/search?q=avocat')
  console.log()

  // Test 6: Récupérer les professions
  console.log('💼 Test des professions')
  await apiRequest('/professions')
  console.log()

  // Test 7: Créer un nouveau partenaire
  console.log("➕ Test de création d'un partenaire")
  const newPartner = {
    firstname: 'Test',
    lastname: 'API',
    job: 'Développeur',
    company: 'Test Company',
    email: 'test@example.com',
    phone: '01 23 45 67 89',
    rating: 4,
    comment: 'Partenaire créé via API test',
    classifications: ['test', 'api'],
  }

  const createResult = await apiRequest('/partners', {
    method: 'POST',
    body: JSON.stringify(newPartner),
  })
  console.log()

  let createdPartnerId = null
  if (createResult.success && createResult.data) {
    createdPartnerId = createResult.data.id

    // Test 8: Récupérer le partenaire créé
    console.log('📄 Test de récupération du partenaire créé')
    await apiRequest(`/partners/${createdPartnerId}`)
    console.log()

    // Test 9: Mettre à jour le partenaire
    console.log('✏️  Test de mise à jour du partenaire')
    const updateData = {
      rating: 5,
      comment: 'Partenaire mis à jour via API test',
    }
    await apiRequest(`/partners/${createdPartnerId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
    console.log()

    // Test 10: Archiver le partenaire
    console.log("🗂️  Test d'archivage du partenaire")
    await apiRequest(`/partners/${createdPartnerId}`, {
      method: 'DELETE',
    })
    console.log()
  }

  // Test 11: Filtres avancés
  console.log('🔧 Test des filtres avancés')
  await apiRequest(
    '/partners?status=active&sortBy=rating&sortOrder=desc&limit=3'
  )
  console.log()

  // Test 12: Classifications avec comptage
  console.log("📊 Test des classifications avec comptage d'usage")
  await apiRequest('/classifications?withUsageCount=true')
  console.log()

  console.log('🎉 Tests terminés!')
}

/**
 * Test de l'état de l'API
 */
async function healthCheck() {
  console.log("🏥 Vérification de l'état de l'API")

  try {
    const response = await fetch(`${API_BASE}/dashboard/stats`)
    if (response.ok) {
      console.log('✅ API accessible')
      return true
    } else {
      console.log(`❌ API retourne une erreur: ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ API inaccessible: ${error.message}`)
    console.log('\n💡 Assurez-vous que:')
    console.log('   • Le serveur Next.js est démarré (npm run dev)')
    console.log("   • PostgreSQL est en cours d'exécution")
    console.log('   • Les données ont été migrées')
    return false
  }
}

// Exécution principale
if (import.meta.url === `file://${process.argv[1]}`) {
  const isHealthy = await healthCheck()
  console.log()

  if (isHealthy) {
    await testAPI()
  } else {
    process.exit(1)
  }
}
