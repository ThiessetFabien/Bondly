import { handleError, successResponse } from '@/lib/api-utils'
import { dashboardService } from '@/services/api'

/**
 * GET /api/dashboard/recent-partners
 * Récupère les partenaires récemment ajoutés
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const partners = await dashboardService.getRecentPartners(limit)
    return successResponse(partners)
  } catch (error) {
    return handleError(error)
  }
}
