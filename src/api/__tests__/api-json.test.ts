/**
 * Tests Jest pour l'API JSON des partenaires
 */

import { API_METADATA, PARTNER_CARDS_DATA, partnersApi } from '../partners-json'

describe('API JSON des partenaires', () => {
  beforeEach(async () => {
    // Réinitialiser la base de données avant chaque test
    await partnersApi.resetDatabase()
  })

  describe('Données statiques', () => {
    test('devrait charger les données des partenaires depuis JSON', () => {
      expect(PARTNER_CARDS_DATA).toBeDefined()
      expect(PARTNER_CARDS_DATA.length).toBeGreaterThan(0)
      expect(PARTNER_CARDS_DATA[0]).toHaveProperty('id')
      expect(PARTNER_CARDS_DATA[0]).toHaveProperty('firstName')
      expect(PARTNER_CARDS_DATA[0]).toHaveProperty('lastName')
    })

    test('devrait charger les métadonnées depuis JSON', () => {
      expect(API_METADATA).toBeDefined()
      expect(API_METADATA.professions).toBeDefined()
      expect(API_METADATA.statuses).toBeDefined()
      expect(API_METADATA.classifications).toBeDefined()
      expect(API_METADATA.professions.length).toBeGreaterThan(0)
      expect(API_METADATA.statuses.length).toBeGreaterThan(0)
      expect(API_METADATA.classifications.length).toBeGreaterThan(0)
    })
  })

  describe('getAllPartners', () => {
    test('devrait récupérer tous les partenaires', async () => {
      const response = await partnersApi.getAllPartners()

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data).toBeDefined()
        expect(response.data.partners).toBeDefined()
        expect(response.data.total).toBeGreaterThan(0)
        expect(response.data.page).toBe(1)
        expect(response.data.limit).toBe(10)
      }
    })

    test('devrait supporter la pagination', async () => {
      const response = await partnersApi.getAllPartners({ page: 1, limit: 3 })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.partners.length).toBeLessThanOrEqual(3)
        expect(response.data.page).toBe(1)
        expect(response.data.limit).toBe(3)
        expect(response.data.totalPages).toBeGreaterThan(0)
      }
    })

    test('devrait filtrer par statut', async () => {
      const response = await partnersApi.getAllPartners({ status: 'active' })

      expect(response.success).toBe(true)
      if (response.success) {
        response.data.partners.forEach(partner => {
          expect(partner.status).toBe('active')
        })
      }
    })
  })

  describe('getPartnerById', () => {
    test('devrait récupérer un partenaire existant', async () => {
      const response = await partnersApi.getPartnerById('1')

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data).toBeDefined()
        expect(response.data?.id).toBe('1')
      }
    })

    test('devrait retourner une erreur pour un ID inexistant', async () => {
      const response = await partnersApi.getPartnerById('inexistant')

      expect(response.success).toBe(false)
      if (!response.success) {
        expect(response.error).toBeDefined()
        expect(response.error.code).toBe('PARTNER_NOT_FOUND')
      }
    })
  })

  describe('createPartner', () => {
    test('devrait créer un nouveau partenaire', async () => {
      const newPartnerData = {
        firstName: 'Test',
        lastName: 'Utilisateur',
        email: 'test@example.com',
        phone: '01 23 45 67 89',
        company: 'Test Company',
        profession: "Avocat d'affaires",
        rating: 4 as const,
        status: 'active' as const,
        notes: 'Partenaire de test',
        classifications: ['legal', 'test'] as const,
        relationHistory: [] as const,
      }

      const response = await partnersApi.createPartner({ data: newPartnerData })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data).toBeDefined()
        expect(response.data.id).toBeDefined()
        expect(response.data.firstName).toBe('Test')
        expect(response.data.lastName).toBe('Utilisateur')
        expect(response.data.createdAt).toBeDefined()
        expect(response.data.updatedAt).toBeDefined()
      }
    })
  })

  describe('getMetadata', () => {
    test('devrait récupérer les métadonnées', async () => {
      const response = await partnersApi.getMetadata()

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data).toBeDefined()
        expect(response.data.professions).toBeDefined()
        expect(response.data.statuses).toBeDefined()
        expect(response.data.classifications).toBeDefined()
      }
    })
  })

  describe('getStats', () => {
    test('devrait récupérer les statistiques', async () => {
      const response = await partnersApi.getStats()

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data).toBeDefined()
        expect(response.data.total).toBeGreaterThan(0)
        expect(response.data.byStatus).toBeDefined()
        expect(response.data.byProfession).toBeDefined()
        expect(response.data.byClassification).toBeDefined()
        expect(response.data.averageRating).toBeGreaterThan(0)
        expect(response.data.averageRating).toBeLessThanOrEqual(5)
      }
    })
  })
})
