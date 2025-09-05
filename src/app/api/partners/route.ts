import {
  errorResponse,
  handleError,
  successResponse,
  validateFilters,
  validatePagination,
  validatePartnerData,
  validateSort,
} from '@/lib/api-utils'
import { partnerService } from '@/services/api'
import type { PartnerStatus } from '@/shared/types/Partner'
import { NextRequest } from 'next/server'

/**
 * GET /api/partners
 * Récupère la liste des partenaires avec filtres et pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Validation et extraction des paramètres
    const { page, limit } = validatePagination(searchParams)
    const { sortBy, sortOrder } = validateSort(searchParams)
    const { search, status, classification, job } =
      validateFilters(searchParams)

    // Appel du service
    const result = await partnerService.getPartners({
      page,
      limit,
      search,
      status: status as PartnerStatus,
      classification,
      sortBy: sortBy as
        | 'firstname'
        | 'lastname'
        | 'company'
        | 'job'
        | 'rating'
        | 'createdAt',
      sortOrder: sortOrder as 'asc' | 'desc',
      job,
    })

    return successResponse(result)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * POST /api/partners
 * Crée un nouveau partenaire
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const validation = validatePartnerData(body)
    if (!validation.isValid) {
      return errorResponse(`Données invalides: ${validation.errors.join(', ')}`)
    }

    // Création du partenaire
    const partner = await partnerService.createPartner(
      validation.validatedData!
    )

    return successResponse(partner, 'Partenaire créé avec succès')
  } catch (error) {
    return handleError(error)
  }
}
