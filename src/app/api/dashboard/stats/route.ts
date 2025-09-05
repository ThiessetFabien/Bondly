import { handleError, successResponse } from '@/lib/api-utils'
import { dashboardService } from '@/services/api'

/**
 * GET /api/dashboard/stats
 * Récupère les statistiques pour le dashboard
 */
export async function GET() {
  try {
    const stats = await dashboardService.getDashboardStats()
    return successResponse(stats)
  } catch (error) {
    return handleError(error)
  }
}
