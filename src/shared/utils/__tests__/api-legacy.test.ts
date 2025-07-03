/**
 * Tests pour les utilitaires API (LEGACY - utilise maintenant l'API JSON)
 * @deprecated Utilisez les tests dans partners-api-unified.test.ts pour l'API JSON complète
 */

import { PARTNER_CARDS_DATA, partnersApi } from '../../../api/partners-json'
import { buildApiUrl } from '../api'

describe('API Utils (Legacy - redirected to JSON API)', () => {
  beforeEach(async () => {
    // Réinitialiser la base de données avant chaque test
    await partnersApi.resetDatabase()
  })

  describe('PARTNER_CARDS_DATA (from JSON)', () => {
    it('devrait avoir des données valides depuis JSON', () => {
      expect(PARTNER_CARDS_DATA).toHaveLength(10) // Maintenant 10 au lieu de 5

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
      })
    })

    it('devrait utiliser les bonnes constantes de statut', () => {
      const statuses = [...new Set(PARTNER_CARDS_DATA.map(p => p.status))]
      statuses.forEach(status => {
        expect(['active', 'archived', 'blacklisted']).toContain(status)
      })
    })

    it('devrait avoir des professions variées', () => {
      const professions = [
        ...new Set(PARTNER_CARDS_DATA.map(p => p.profession)),
      ]
      expect(professions.length).toBeGreaterThan(3) // Au moins 4 professions différentes
    })
  })

  // Tests API migrés vers la nouvelle API JSON
  describe('fetchPartners (migrated to JSON API)', () => {
    it('devrait récupérer les partenaires via la nouvelle API', async () => {
      const response = await partnersApi.getAllPartners()

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.partners).toHaveLength(10)
        expect(response.data.total).toBe(10)
      }
    })

    it('devrait supporter la pagination', async () => {
      const response = await partnersApi.getAllPartners({ page: 1, limit: 5 })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.partners).toHaveLength(5)
        expect(response.data.page).toBe(1)
        expect(response.data.limit).toBe(5)
      }
    })
  })

  describe('fetchPartnerById (migrated to JSON API)', () => {
    it('devrait récupérer un partenaire par ID', async () => {
      const response = await partnersApi.getPartnerById('1')

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data?.id).toBe('1')
      }
    })

    it('devrait échouer pour un ID inexistant', async () => {
      const response = await partnersApi.getPartnerById('999')

      expect(response.success).toBe(false)
    })
  })

  describe('createPartner (migrated to JSON API)', () => {
    it('devrait créer un nouveau partenaire', async () => {
      const newPartner = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '01 23 45 67 89',
        company: 'Test Co',
        profession: "Avocat d'affaires",
        rating: 4 as const,
        status: 'active' as const,
        notes: 'Test partner',
        classifications: ['legal'] as const,
        relationHistory: [] as const,
      }

      const response = await partnersApi.createPartner({ data: newPartner })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.firstName).toBe('Test')
        expect(response.data.id).toBeDefined()
      }
    })
  })

  describe('updatePartner (migrated to JSON API)', () => {
    it('devrait mettre à jour un partenaire', async () => {
      const response = await partnersApi.updatePartner('1', {
        data: { firstName: 'Updated Name' },
      })

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.firstName).toBe('Updated Name')
      }
    })

    it('devrait échouer pour un ID inexistant', async () => {
      const response = await partnersApi.updatePartner('999', {
        data: { firstName: 'Test' },
      })

      expect(response.success).toBe(false)
    })
  })

  describe('deletePartner (migrated to JSON API)', () => {
    it('devrait supprimer un partenaire', async () => {
      const response = await partnersApi.deletePartner('1')

      expect(response.success).toBe(true)
      if (response.success) {
        expect(response.data.id).toBe('1')
      }
    })

    it('devrait échouer pour un ID inexistant', async () => {
      const response = await partnersApi.deletePartner('999')

      expect(response.success).toBe(false)
    })
  })

  describe('buildApiUrl', () => {
    it('devrait construire une URL simple', () => {
      const url = buildApiUrl('/partners')
      expect(url).toBe('http://localhost:3000/api/partners')
    })

    it('devrait construire une URL avec paramètres', () => {
      const url = buildApiUrl('/partners', { page: 1, limit: 10 })
      expect(url).toContain('page=1')
      expect(url).toContain('limit=10')
    })

    it("devrait utiliser la variable d'environnement si définie", () => {
      const originalEnv = process.env['NEXT_PUBLIC_API_BASE_URL']
      process.env['NEXT_PUBLIC_API_BASE_URL'] = 'https://api.example.com'

      const url = buildApiUrl('/partners')
      expect(url).toBe('https://api.example.com/partners')

      // Restaurer l'environnement
      process.env['NEXT_PUBLIC_API_BASE_URL'] = originalEnv
    })
  })
})
