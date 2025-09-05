/**
 * Tests unitaires pour les utilitaires API
 */

import { describe, expect, it } from 'vitest'
import {
  isValidUUID,
  normalizeSearchTerm,
  validateFilters,
  validatePagination,
  validatePartnerData,
  validatePartnerUpdateData,
  validateSort,
} from '../api-utils'

describe('API Utils - Tests unitaires', () => {
  describe('validatePartnerData', () => {
    it('devrait valider des données correctes', () => {
      const validData = {
        firstname: 'Jean',
        lastname: 'Martin',
        job: 'Développeur',
        company: 'Tech Corp',
        email: 'jean.martin@tech.com',
        phone: '01 23 45 67 89',
        rating: 4,
        classifications: ['tech', 'dev'],
      }

      const result = validatePartnerData(validData)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.validatedData).toBeDefined()
      expect(result.validatedData!.firstname).toBe('Jean')
    })

    it('devrait rejeter des données manquantes', () => {
      const invalidData = {
        firstname: '',
        lastname: 'Martin',
        // job et company manquants
      }

      const result = validatePartnerData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors).toContain('Le prénom est obligatoire')
    })

    it('devrait valider le format email', () => {
      const dataWithInvalidEmail = {
        firstname: 'Jean',
        lastname: 'Martin',
        job: 'Dev',
        company: 'Tech',
        email: 'email-invalide',
      }

      const result = validatePartnerData(dataWithInvalidEmail)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Format d'email invalide")
    })

    it('devrait valider la note entre 1 et 5', () => {
      const dataWithInvalidRating = {
        firstname: 'Jean',
        lastname: 'Martin',
        job: 'Dev',
        company: 'Tech',
        rating: 10,
      }

      const result = validatePartnerData(dataWithInvalidRating)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La note doit être entre 1 et 5')
    })
  })

  describe('validatePartnerUpdateData', () => {
    it('devrait valider des mises à jour partielles', () => {
      const updateData = {
        rating: 5,
        comment: 'Excellent partenaire',
      }

      const result = validatePartnerUpdateData(updateData)

      expect(result.isValid).toBe(true)
      expect(result.validatedData!.rating).toBe(5)
    })

    it('devrait permettre de vider des champs optionnels', () => {
      const updateData = {
        email: null,
        phone: '',
        comment: null,
      }

      const result = validatePartnerUpdateData(updateData)

      expect(result.isValid).toBe(true)
      expect(result.validatedData!.email).toBeUndefined()
      expect(result.validatedData!.phone).toBeUndefined()
    })
  })

  describe('Validation des paramètres URL', () => {
    it('validatePagination devrait normaliser les valeurs', () => {
      const params = new URLSearchParams('page=0&limit=200')
      const result = validatePagination(params)

      expect(result.page).toBe(1) // Min 1
      expect(result.limit).toBe(100) // Max 100
    })

    it('validateSort devrait gérer les valeurs par défaut', () => {
      const params = new URLSearchParams('sortOrder=invalid')
      const result = validateSort(params)

      expect(result.sortBy).toBe('lastname')
      expect(result.sortOrder).toBe('asc')
    })

    it('validateFilters devrait valider le statut', () => {
      const params = new URLSearchParams('status=invalid&search=test')
      const result = validateFilters(params)

      expect(result.status).toBeUndefined()
      expect(result.search).toBe('test')
    })
  })

  describe('Utilitaires', () => {
    it('isValidUUID devrait identifier les UUIDs valides', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      const invalidUUID = 'not-a-uuid'

      expect(isValidUUID(validUUID)).toBe(true)
      expect(isValidUUID(invalidUUID)).toBe(false)
    })

    it('normalizeSearchTerm devrait nettoyer les termes', () => {
      expect(normalizeSearchTerm('  JEAN Martin  ')).toBe('jean martin')
      expect(normalizeSearchTerm('')).toBe('')
    })
  })
})
