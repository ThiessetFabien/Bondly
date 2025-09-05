import { errorResponse, handleError, successResponse } from '@/lib/api-utils'
import { classificationService } from '@/services/api'
import { NextRequest } from 'next/server'

/**
 * GET /api/classifications
 * Récupère toutes les classifications
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const withUsageCount = searchParams.get('withUsageCount') === 'true'

    let classifications

    if (withUsageCount) {
      // Récupère les classifications avec leur nombre d'utilisation
      classifications = await classificationService.getClassifications()
    } else if (search) {
      // Recherche dans les classifications - pour l'instant on utilise getClassifications
      // et on filtre côté serveur
      const allClassifications =
        await classificationService.getClassifications()
      classifications = allClassifications.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      // Récupère toutes les classifications
      classifications = await classificationService.getClassifications()
    }

    return successResponse(classifications)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * POST /api/classifications
 * Crée une nouvelle classification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return errorResponse('Le nom de la classification est obligatoire')
    }

    const name = body.name.trim()

    // Vérifier que la classification n'existe pas déjà
    const existing = await classificationService.getClassificationByName(name)
    if (existing) {
      return errorResponse('Cette classification existe déjà')
    }

    // Création de la classification
    const classification =
      await classificationService.createClassification(name)

    return successResponse(classification, 'Classification créée avec succès')
  } catch (error) {
    return handleError(error)
  }
}
