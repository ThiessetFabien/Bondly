import type {
  CreatePartnerRequest,
  GetPartnersParams,
  PaginatedResponse,
  UpdatePartnerRequest,
} from '@/lib/types'
import type { Partner } from '@/shared/types/Partner'
import type { IPartnerRepository, IPartnerService } from './interfaces'

/**
 * Service pour la gestion des partenaires
 * Respecte les principes SOLID avec injection de dépendance
 */
export class PartnerService implements IPartnerService {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  /**
   * Récupère tous les partenaires avec filtres et pagination
   */
  async getPartners(
    params: GetPartnersParams = {}
  ): Promise<PaginatedResponse<Partner>> {
    this.validatePaginationParams(params)
    return this.partnerRepository.findWithFilters(params)
  }

  /**
   * Récupère un partenaire par son ID
   */
  async getPartnerById(id: string): Promise<Partner | null> {
    this.validateId(id)
    return this.partnerRepository.findById(id)
  }

  /**
   * Crée un nouveau partenaire
   */
  async createPartner(data: CreatePartnerRequest): Promise<Partner> {
    this.validateCreatePartnerData(data)
    return this.partnerRepository.create(data)
  }

  /**
   * Met à jour un partenaire existant
   */
  async updatePartner(
    id: string,
    data: UpdatePartnerRequest
  ): Promise<Partner | null> {
    this.validateId(id)
    this.validateUpdatePartnerData(data)
    return this.partnerRepository.update(id, data)
  }

  /**
   * Supprime un partenaire
   */
  async deletePartner(id: string): Promise<boolean> {
    this.validateId(id)
    return this.partnerRepository.delete(id)
  }

  // Méthodes de validation privées

  private validateId(id: string): void {
    if (!id || typeof id !== 'string') {
      throw new Error('ID partenaire invalide')
    }
  }

  private validatePaginationParams(params: GetPartnersParams): void {
    const { page, limit } = params

    if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
      throw new Error('Le numéro de page doit être un entier positif')
    }

    if (
      limit !== undefined &&
      (limit < 1 || limit > 100 || !Number.isInteger(limit))
    ) {
      throw new Error('La limite doit être un entier entre 1 et 100')
    }
  }

  private validateCreatePartnerData(data: CreatePartnerRequest): void {
    const requiredFields = ['firstname', 'lastname', 'company']

    for (const field of requiredFields) {
      if (!data[field as keyof CreatePartnerRequest]) {
        throw new Error(`Le champ '${field}' est requis`)
      }
    }

    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Format email invalide')
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error('La note doit être comprise entre 1 et 5')
    }
  }

  private validateUpdatePartnerData(data: UpdatePartnerRequest): void {
    if (Object.keys(data).length === 0) {
      throw new Error('Aucune donnée à mettre à jour')
    }

    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Format email invalide')
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error('La note doit être comprise entre 1 et 5')
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
