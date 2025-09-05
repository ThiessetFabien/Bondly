import { handleError, successResponse } from '@/lib/api-utils'
import { dashboardService } from '@/services/api'

/**
 * GET /api/dashboard/top-partners
 * Récupère les partenaires les mieux notés
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const partners = await dashboardService.getTopRatedPartners(limit)
    return successResponse(partners)
  } catch (error) {
    return handleError(error)
  }
}
