import { handleError, successResponse } from '@/lib/api-utils'
import { dashboardService } from '@/services/api'

/**
 * GET /api/dashboard/growth
 * Récupère les statistiques d'évolution mensuelle
 */
export async function GET() {
  try {
    const growth = await dashboardService.getMonthlyGrowthStats()
    return successResponse(growth)
  } catch (error) {
    return handleError(error)
  }
}
