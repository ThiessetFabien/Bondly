/**
 * Tests unifiés pour l'API des partenaires (nouvelle version JSON)
 */

import {
  API_METADATA,
  PARTNER_CARDS_DATA,
  partnersApi,
} from '../../../api/partners-json'
import { buildApiUrl } from '../api'

describe('Partners API (JSON)', () => {
  beforeEach(async () => {
    // Réinitialiser la base de données avant chaque test
    await partnersApi.resetDatabase()
  })

  describe('Données statiques', () => {
    test('devrait charger les données des partenaires depuis JSON', () => {
      expect(PARTNER_CARDS_DATA).toBeDefined()
      expect(PARTNER_CARDS_DATA.length).toBe(10) // 10 partenaires dans le JSON
      expect(PARTNER_CARDS_DATA[0]).toHaveProperty('id')
      expect(PARTNER_CARDS_DATA[0]).toHaveProperty('firstName')
      expect(PARTNER_CARDS_DATA[0]).toHaveProperty('lastName')
      expect(PARTNER_CARDS_DATA[0]).toHaveProperty('email')
      expect(PARTNER_CARDS_DATA[0]).toHaveProperty('profession')
    })

    test('devrait charger les métadonnées depuis JSON', () => {
      expect(API_METADATA).toBeDefined()
      expect(API_METADATA.professions).toBeDefined()
      expect(API_METADATA.statuses).toBeDefined()
      expect(API_METADATA.classifications).toBeDefined()
      expect(API_METADATA.professions.length).toBeGreaterThan(0)
      expect(API_METADATA.statuses.length).toBe(3) // active, archived, blacklisted
      expect(API_METADATA.classifications.length).toBeGreaterThan(0)
    })

    test('devrait avoir des données valides pour tous les partenaires', () => {
      PARTNER_CARDS_DATA.forEach(partner => {
        expect(partner.id).toBeTruthy()
        expect(partner.firstName).toBeTruthy()
        expect(partner.lastName).toBeTruthy()
        expect(partner.email).toMatch(/\S+@\S+\.\S+/)
        expect(partner.phone).toBeTruthy()
        expect(partner.company).toBeTruthy()
        expect(partner.profession).toBeTruthy()
        expect(partner.rating).toBeGreaterThanOrEqual(1)
        expect(partner.rating).toBeLessThanOrEqual(5)
        expect(['active', 'archived', 'blacklisted']).toContain(partner.status)
        expect(Array.isArray(partner.classifications)).toBe(true)
        expect(partner.createdAt).toBeTruthy()
        expect(partner.updatedAt).toBeTruthy()
      })
    })
  })

  describe('getAllPartners', () => {
    test('devrait récupérer tous les partenaires avec pagination par défaut', async () => {
      const response = await partnersApi.getAllPartners()

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.partners).toBeDefined()
        expect(response.data.total).toBe(10)
        expect(response.data.page).toBe(1)
        expect(response.data.limit).toBe(10)
        expect(response.data.totalPages).toBe(1)
        expect(response.data.partners.length).toBe(10)
      }
    })

    test('devrait supporter la pagination personnalisée', async () => {
      const response = await partnersApi.getAllPartners({ page: 1, limit: 3 })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.partners.length).toBe(3)
        expect(response.data.page).toBe(1)
        expect(response.data.limit).toBe(3)
        expect(response.data.totalPages).toBe(4) // 10 partenaires / 3 par page = 4 pages
      }
    })

    test('devrait filtrer par statut', async () => {
      const response = await partnersApi.getAllPartners({ status: 'active' })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.partners.length).toBeGreaterThan(0)
        response.data.partners.forEach(partner => {
          expect(partner.status).toBe('active')
        })
      }
    })

    test('devrait filtrer par profession', async () => {
      const response = await partnersApi.getAllPartners({
        profession: 'Notaire',
      })

      expect(response.success).toBe(true)
      if (response.success) {
        response.data.partners.forEach(partner => {
          expect(partner.profession).toBe('Notaire')
        })
      }
    })

    test('devrait filtrer par classification', async () => {
      const response = await partnersApi.getAllPartners({
        classification: 'legal',
      })

      expect(response.success).toBe(true)
      if (response.success) {
        response.data.partners.forEach(partner => {
          expect(partner.classifications).toContain('legal')
        })
      }
    })

    test('devrait supporter la recherche textuelle', async () => {
      const response = await partnersApi.getAllPartners({ search: 'Marie' })

      expect(response.success).toBe(true)
      if (response.success && response.data.partners.length > 0) {
        const hasMarieInResults = response.data.partners.some(
          partner =>
            partner.firstName.toLowerCase().includes('marie') ||
            partner.lastName.toLowerCase().includes('marie') ||
            partner.company.toLowerCase().includes('marie') ||
            partner.email.toLowerCase().includes('marie')
        )
        expect(hasMarieInResults).toBe(true)
      }
    })

    test('devrait retourner un tableau vide pour une recherche sans résultats', async () => {
      const response = await partnersApi.getAllPartners({
        search: 'inexistant123456',
      })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.partners.length).toBe(0)
        expect(response.data.total).toBe(0)
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
        expect(response.data?.firstName).toBeTruthy()
        expect(response.data?.lastName).toBeTruthy()
      }
    })

    test('devrait retourner une erreur pour un ID inexistant', async () => {
      const response = await partnersApi.getPartnerById('inexistant999')

      expect(response.success).toBe(false)
      if (!response.success) {
        expect(response.error).toBeDefined()
        expect(response.error.code).toBe('PARTNER_NOT_FOUND')
        expect(response.error.message).toContain('inexistant999')
      }
    })
  })

  describe('createPartner', () => {
    test('devrait créer un nouveau partenaire avec toutes les données', async () => {
      const newPartnerData = {
        firstName: 'Nouveau',
        lastName: 'Partenaire',
        email: 'nouveau@example.com',
        phone: '01 99 88 77 66',
        company: 'Nouvelle Société',
        profession: "Avocat d'affaires",
        rating: 4 as const,
        status: 'active' as const,
        notes: 'Nouveau partenaire créé pour test',
        classifications: ['legal', 'business'] as const,
        relationHistory: [] as const,
      }

      const response = await partnersApi.createPartner({ data: newPartnerData })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.id).toBeDefined()
        expect(response.data.id).toContain('partner_')
        expect(response.data.firstName).toBe('Nouveau')
        expect(response.data.lastName).toBe('Partenaire')
        expect(response.data.email).toBe('nouveau@example.com')
        expect(response.data.createdAt).toBeDefined()
        expect(response.data.updatedAt).toBeDefined()

        // Vérifier que le partenaire est bien ajouté à la base
        const allPartnersResponse = await partnersApi.getAllPartners()
        if (allPartnersResponse.success) {
          expect(allPartnersResponse.data.total).toBe(11) // 10 + 1 nouveau
        }
      }
    })
  })

  describe('updatePartner', () => {
    test('devrait mettre à jour un partenaire existant', async () => {
      const updateData = {
        firstName: 'Marie Modifiée',
        notes: 'Notes mises à jour via test',
      }

      const response = await partnersApi.updatePartner('1', {
        data: updateData,
      })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.firstName).toBe('Marie Modifiée')
        expect(response.data.notes).toBe('Notes mises à jour via test')
        expect(response.data.updatedAt).toBeDefined()

        // Vérifier que les autres champs sont préservés
        expect(response.data.lastName).toBe('Dubois') // Valeur originale
        expect(response.data.id).toBe('1')
      }
    })

    test('devrait retourner une erreur pour un ID inexistant', async () => {
      const response = await partnersApi.updatePartner('inexistant999', {
        data: { notes: 'Test' },
      })

      expect(response.success).toBe(false)
      if (!response.success) {
        expect(response.error.code).toBe('PARTNER_NOT_FOUND')
      }
    })
  })

  describe('deletePartner', () => {
    test('devrait supprimer un partenaire existant', async () => {
      // Vérifier d'abord qu'il y a 10 partenaires
      const beforeResponse = await partnersApi.getAllPartners()
      if (beforeResponse.success) {
        expect(beforeResponse.data.total).toBe(10)
      }

      const response = await partnersApi.deletePartner('1')

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.id).toBe('1')

        // Vérifier qu'il y a maintenant 9 partenaires
        const afterResponse = await partnersApi.getAllPartners()
        if (afterResponse.success) {
          expect(afterResponse.data.total).toBe(9)
        }

        // Vérifier que le partenaire n'existe plus
        const getResponse = await partnersApi.getPartnerById('1')
        expect(getResponse.success).toBe(false)
      }
    })

    test('devrait retourner une erreur pour un ID inexistant', async () => {
      const response = await partnersApi.deletePartner('inexistant999')

      expect(response.success).toBe(false)
      if (!response.success) {
        expect(response.error.code).toBe('PARTNER_NOT_FOUND')
      }
    })
  })

  describe('getMetadata', () => {
    test('devrait récupérer les métadonnées complètes', async () => {
      const response = await partnersApi.getMetadata()

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.professions).toBeDefined()
        expect(response.data.statuses).toBeDefined()
        expect(response.data.classifications).toBeDefined()
        expect(response.data.meta).toBeDefined()

        // Vérifier la structure des professions
        expect(response.data.professions[0]).toHaveProperty('id')
        expect(response.data.professions[0]).toHaveProperty('label')
        expect(response.data.professions[0]).toHaveProperty('category')

        // Vérifier la structure des statuts
        expect(response.data.statuses[0]).toHaveProperty('id')
        expect(response.data.statuses[0]).toHaveProperty('label')
        expect(response.data.statuses[0]).toHaveProperty('color')
      }
    })
  })

  describe('getStats', () => {
    test('devrait récupérer les statistiques complètes', async () => {
      const response = await partnersApi.getStats()

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.total).toBe(10)
        expect(response.data.byStatus).toBeDefined()
        expect(response.data.byProfession).toBeDefined()
        expect(response.data.byClassification).toBeDefined()
        expect(response.data.averageRating).toBeGreaterThan(0)
        expect(response.data.averageRating).toBeLessThanOrEqual(5)

        // Vérifier que les statistiques sont cohérentes
        const totalFromStatus = Object.values(response.data.byStatus).reduce(
          (a, b) => a + b,
          0
        )
        expect(totalFromStatus).toBe(response.data.total)
      }
    })
  })

  describe('resetDatabase', () => {
    test('devrait réinitialiser la base de données', async () => {
      // Créer un partenaire pour modifier la base
      await partnersApi.createPartner({
        data: {
          firstName: 'Temporaire',
          lastName: 'Test',
          email: 'temp@test.com',
          phone: '01 00 00 00 00',
          company: 'Test Company',
          profession: 'Notaire',
          rating: 3,
          status: 'active',
          notes: 'Temporaire',
          classifications: ['legal'],
          relationHistory: [],
        },
      })

      // Vérifier qu'il y a maintenant 11 partenaires
      const beforeReset = await partnersApi.getAllPartners()
      if (beforeReset.success) {
        expect(beforeReset.data.total).toBe(11)
      }

      // Réinitialiser
      const resetResponse = await partnersApi.resetDatabase()
      expect(resetResponse.success).toBe(true)

      // Vérifier que la base est revenue à 10 partenaires
      const afterReset = await partnersApi.getAllPartners()
      if (afterReset.success) {
        expect(afterReset.data.total).toBe(10)
      }
    })
  })
})

// Tests pour les utilitaires API (gardés pour la compatibilité)
describe('API Utils', () => {
  describe('buildApiUrl', () => {
    test('devrait construire une URL simple', () => {
      const url = buildApiUrl('/partners')
      expect(url).toBe('http://localhost:3000/api/partners')
    })

    test('devrait construire une URL avec paramètres', () => {
      const url = buildApiUrl('/partners', { page: 1, limit: 10 })
      expect(url).toContain('page=1')
      expect(url).toContain('limit=10')
    })

    test("devrait utiliser la variable d'environnement si définie", () => {
      const originalEnv = process.env['NEXT_PUBLIC_API_BASE_URL']
      process.env['NEXT_PUBLIC_API_BASE_URL'] = 'https://api.example.com'

      const url = buildApiUrl('/partners')
      expect(url).toBe('https://api.example.com/partners')

      // Restaurer l'environnement
      process.env['NEXT_PUBLIC_API_BASE_URL'] = originalEnv
    })
  })
})
