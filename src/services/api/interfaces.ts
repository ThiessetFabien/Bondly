import type {
  CreatePartnerRequest,
  GetPartnersParams,
  PaginatedResponse,
  UpdatePartnerRequest,
} from '@/lib/types'
import type { Partner } from '@/shared/types/Partner'

/**
 * Interface définissant le contrat pour les opérations sur les partenaires
 * Respecte le Dependency Inversion Principle
 */
export interface IPartnerService {
  /**
   * Récupère tous les partenaires avec filtres et pagination
   */
  getPartners(params?: GetPartnersParams): Promise<PaginatedResponse<Partner>>

  /**
   * Récupère un partenaire par son ID
   */
  getPartnerById(id: string): Promise<Partner | null>

  /**
   * Crée un nouveau partenaire
   */
  createPartner(data: CreatePartnerRequest): Promise<Partner>

  /**
   * Met à jour un partenaire existant
   */
  updatePartner(id: string, data: UpdatePartnerRequest): Promise<Partner | null>

  /**
   * Supprime un partenaire
   */
  deletePartner(id: string): Promise<boolean>
}

/**
 * Interface pour le repository des partenaires
 * Sépare la logique métier de l'accès aux données
 */
export interface IPartnerRepository {
  findById(id: string): Promise<Partner | null>
  findWithFilters(
    params: GetPartnersParams
  ): Promise<PaginatedResponse<Partner>>
  create(data: CreatePartnerRequest): Promise<Partner>
  update(id: string, data: UpdatePartnerRequest): Promise<Partner | null>
  delete(id: string): Promise<boolean>
}

/**
 * Interface pour les classifications
 */
export interface IClassificationService {
  /**
   * Récupère toutes les classifications
   */
  getClassifications(): Promise<Classification[]>

  /**
   * Récupère une classification par ID
   */
  getClassificationById(id: string): Promise<Classification | null>

  /**
   * Crée une nouvelle classification
   */
  createClassification(
    data: CreateClassificationRequest
  ): Promise<Classification>
}

export interface Classification {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface CreateClassificationRequest {
  name: string
  description?: string
}
