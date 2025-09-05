import metadataJson from '@/data/metadata.json'
import { handleError, successResponse } from '@/lib/api-utils'
import { NextRequest } from 'next/server'

/**
 * GET /api/professions
 * Récupère la liste des professions depuis les métadonnées
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let professions = metadataJson.professions || []

    // Filtrage par catégorie
    if (category) {
      professions = professions.filter(
        prof => prof.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filtrage par recherche
    if (search) {
      const searchTerm = search.toLowerCase()
      professions = professions.filter(
        prof =>
          prof.label.toLowerCase().includes(searchTerm) ||
          prof.description.toLowerCase().includes(searchTerm)
      )
    }

    return successResponse(professions)
  } catch (error) {
    return handleError(error)
  }
}
