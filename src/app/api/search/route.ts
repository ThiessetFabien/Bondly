import { errorResponse, handleError, successResponse } from '@/lib/api-utils'
import { classificationService, partnerService } from '@/services/api'
import { NextRequest } from 'next/server'

/**
 * GET /api/search
 * Recherche globale dans les partenaires et classifications
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'partners', 'classifications', 'all'

    if (!query || query.trim().length < 2) {
      return errorResponse(
        'Le terme de recherche doit contenir au moins 2 caractères'
      )
    }

    const searchTerm = query.trim()
    const searchType = type || 'all'

    const results: {
      partners?: unknown
      classifications?: unknown
    } = {}

    if (searchType === 'partners' || searchType === 'all') {
      // Recherche dans les partenaires
      const partnersResult = await partnerService.getPartners({
        search: searchTerm,
        limit: 20,
        page: 1,
      })
      results.partners = partnersResult
    }

    if (searchType === 'classifications' || searchType === 'all') {
      // Recherche dans les classifications - filtrage côté serveur pour l'instant
      const allClassifications =
        await classificationService.getClassifications()
      const classifications = allClassifications.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      results.classifications = classifications
    }

    return successResponse(results)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * POST /api/search/advanced
 * Recherche avancée avec filtres multiples
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      search = '',
      statuses = [],
      classifications = [],
      jobs = [],
      ratingMin,
      ratingMax,
      page = 1,
      limit = 20,
      sortBy = 'lastname',
      sortOrder = 'asc',
    } = body

    // Construction des filtres pour la recherche avancée
    // Note: Cette fonctionnalité nécessiterait une extension du service pour supporter les filtres multiples

    // Pour le MVP, on utilise la recherche basique avec le premier filtre disponible
    const status = statuses.length > 0 ? statuses[0] : undefined
    const classification =
      classifications.length > 0 ? classifications[0] : undefined
    const job = jobs.length > 0 ? jobs[0] : undefined

    const result = await partnerService.getPartners({
      search,
      status,
      classification,
      job,
      page,
      limit,
      sortBy,
      sortOrder,
    })

    // Filtrage côté application pour les critères non supportés par la base (MVP)
    if (ratingMin !== undefined || ratingMax !== undefined) {
      result.data = result.data.filter(partner => {
        if (!partner.rating) return false
        if (ratingMin !== undefined && partner.rating < ratingMin) return false
        if (ratingMax !== undefined && partner.rating > ratingMax) return false
        return true
      })
    }

    return successResponse(result)
  } catch (error) {
    return handleError(error)
  }
}
