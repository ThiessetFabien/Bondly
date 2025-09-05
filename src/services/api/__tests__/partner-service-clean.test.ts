/**
 * Tests unitaires pour le PartnerService refactorisé
 * Démontre l'utilisation des mocks et de l'injection de dépendance
 */
import type { CreatePartnerRequest, PaginatedResponse } from '@/lib/types'
import type { IPartnerRepository } from '@/services/api/interfaces'
import { PartnerService } from '@/services/api/partner-service-clean'
import type { Partner } from '@/shared/types/Partner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock du repository
const mockPartnerRepository: IPartnerRepository = {
  findById: vi.fn(),
  findWithFilters: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

describe('PartnerService - Clean Code Tests', () => {
  let partnerService: PartnerService

  beforeEach(() => {
    // Injection de dépendance avec mock
    partnerService = new PartnerService(mockPartnerRepository)
    vi.clearAllMocks()
  })

  describe('getPartners', () => {
    it('devrait valider les paramètres de pagination', async () => {
      // Arrange
      const invalidParams = { page: -1, limit: 101 }

      // Act & Assert
      await expect(partnerService.getPartners(invalidParams)).rejects.toThrow(
        'Le numéro de page doit être un entier positif'
      )
    })

    it('devrait appeler le repository avec les bons paramètres', async () => {
      // Arrange
      const params = { page: 1, limit: 10 }
      const mockResponse: PaginatedResponse<Partner> = {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      }

      vi.mocked(mockPartnerRepository.findWithFilters).mockResolvedValue(
        mockResponse
      )

      // Act
      const result = await partnerService.getPartners(params)

      // Assert
      expect(mockPartnerRepository.findWithFilters).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createPartner', () => {
    it('devrait valider les données requises', async () => {
      // Arrange
      const invalidData = {
        firstname: '',
        lastname: 'Test',
        company: 'Test',
      } as CreatePartnerRequest

      // Act & Assert
      await expect(partnerService.createPartner(invalidData)).rejects.toThrow(
        "Le champ 'firstname' est requis"
      )
    })

    it('devrait valider le format email', async () => {
      // Arrange
      const invalidData: CreatePartnerRequest = {
        firstname: 'John',
        lastname: 'Doe',
        company: 'Test Company',
        email: 'invalid-email',
        job: 'Developer',
        phone: '123456789',
        rating: 4,
        comment: 'Test',
        classifications: [],
      }

      // Act & Assert
      await expect(partnerService.createPartner(invalidData)).rejects.toThrow(
        'Format email invalide'
      )
    })

    it('devrait créer un partenaire avec des données valides', async () => {
      // Arrange
      const validData: CreatePartnerRequest = {
        firstname: 'John',
        lastname: 'Doe',
        company: 'Test Company',
        email: 'john@test.com',
        job: 'Developer',
        phone: '123456789',
        rating: 4,
        comment: 'Test',
        classifications: ['dev'],
      }

      const mockPartner: Partner = {
        id: '123',
        firstname: 'John',
        lastname: 'Doe',
        company: 'Test Company',
        email: 'john@test.com',
        job: 'Developer',
        phone: '123456789',
        rating: 4,
        status: 'active',
        comment: 'Test',
        classifications: ['dev'],
        createdAt: '2025-09-02',
        updatedAt: '2025-09-02',
      }

      vi.mocked(mockPartnerRepository.create).mockResolvedValue(mockPartner)

      // Act
      const result = await partnerService.createPartner(validData)

      // Assert
      expect(mockPartnerRepository.create).toHaveBeenCalledWith(validData)
      expect(result).toEqual(mockPartner)
    })
  })

  describe('updatePartner', () => {
    it('devrait valider que des données sont fournies', async () => {
      // Arrange
      const emptyData = {}

      // Act & Assert
      await expect(
        partnerService.updatePartner('123', emptyData)
      ).rejects.toThrow('Aucune donnée à mettre à jour')
    })

    it('devrait valider la note', async () => {
      // Arrange
      const invalidData = { rating: 6 }

      // Act & Assert
      await expect(
        partnerService.updatePartner('123', invalidData)
      ).rejects.toThrow('La note doit être comprise entre 1 et 5')
    })
  })

  describe('getPartnerById', () => {
    it("devrait valider l'ID", async () => {
      // Act & Assert
      await expect(partnerService.getPartnerById('')).rejects.toThrow(
        'ID partenaire invalide'
      )
    })

    it('devrait retourner le partenaire si trouvé', async () => {
      // Arrange
      const mockPartner: Partner = {
        id: '123',
        firstname: 'John',
        lastname: 'Doe',
        company: 'Test',
        email: 'john@test.com',
        job: 'Dev',
        phone: '123',
        rating: 4,
        status: 'active',
        comment: 'Test',
        classifications: [],
        createdAt: '2025-09-02',
        updatedAt: '2025-09-02',
      }

      vi.mocked(mockPartnerRepository.findById).mockResolvedValue(mockPartner)

      // Act
      const result = await partnerService.getPartnerById('123')

      // Assert
      expect(mockPartnerRepository.findById).toHaveBeenCalledWith('123')
      expect(result).toEqual(mockPartner)
    })
  })
})
