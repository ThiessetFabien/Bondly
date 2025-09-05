import type {
  CreatePartnerRequest,
  GetPartnersParams,
  PaginatedResponse,
  UpdatePartnerRequest,
} from '@/lib/types'
import type { Partner } from '@/shared/types/Partner'
import { PartnerService } from './partners'

/**
 * Repository simple pour les partenaires
 * Version MVP - utilise le service existant pour éviter la duplication
 */
export class PartnerRepository {
  private partnerService = new PartnerService()

  async findAll(params?: GetPartnersParams): Promise<Partner[]> {
    const result = await this.partnerService.getPartners(params)
    return result.data
  }

  async findById(id: string): Promise<Partner | null> {
    return this.partnerService.getPartnerById(id)
  }

  async findWithFilters(
    params: GetPartnersParams
  ): Promise<PaginatedResponse<Partner>> {
    return this.partnerService.getPartners(params)
  }

  async create(data: CreatePartnerRequest): Promise<Partner> {
    return this.partnerService.createPartner(data)
  }

  async update(
    id: string,
    data: UpdatePartnerRequest
  ): Promise<Partner | null> {
    return this.partnerService.updatePartner(id, data)
  }

  async delete(id: string): Promise<boolean> {
    return this.partnerService.deletePartner(id)
  }

  async findWithPagination(
    page: number,
    limit: number,
    criteria?: Record<string, unknown>
  ): Promise<{ data: Partner[]; total: number }> {
    const result = await this.partnerService.getPartners({
      page,
      limit,
      ...criteria,
    })
    return {
      data: result.data,
      total: result.pagination.total,
    }
  }
}

// Instance singleton
export const partnerRepository = new PartnerRepository()
