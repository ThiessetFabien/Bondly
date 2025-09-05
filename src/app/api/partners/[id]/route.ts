import {
  errorResponse,
  handleError,
  isValidUUID,
  successResponse,
  validatePartnerUpdateData,
} from '@/lib/api-utils'
import { partnerService } from '@/services/api'
import { NextRequest } from 'next/server'

/**
 * GET /api/partners/[id]
 * Récupère un partenaire par son ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validation de l'ID
    if (!isValidUUID(id)) {
      return errorResponse('ID partenaire invalide')
    }

    // Récupération du partenaire
    const partner = await partnerService.getPartnerById(id)

    if (!partner) {
      return errorResponse('Partenaire non trouvé', 404)
    }

    return successResponse(partner)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * PUT /api/partners/[id]
 * Met à jour un partenaire
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validation de l'ID
    if (!isValidUUID(id)) {
      return errorResponse('ID partenaire invalide')
    }

    const body = await request.json()

    // Validation des données
    const validation = validatePartnerUpdateData(body)
    if (!validation.isValid) {
      return errorResponse(`Données invalides: ${validation.errors.join(', ')}`)
    }

    // Mise à jour du partenaire
    const partner = await partnerService.updatePartner(
      id,
      validation.validatedData!
    )

    if (!partner) {
      return errorResponse('Partenaire non trouvé', 404)
    }

    return successResponse(partner, 'Partenaire mis à jour avec succès')
  } catch (error) {
    return handleError(error)
  }
}

/**
 * DELETE /api/partners/[id]
 * Archive un partenaire (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validation de l'ID
    if (!isValidUUID(id)) {
      return errorResponse('ID partenaire invalide')
    }

    // Archivage du partenaire
    const success = await partnerService.deletePartner(id)

    if (!success) {
      return errorResponse('Partenaire non trouvé', 404)
    }

    return successResponse(null, 'Partenaire archivé avec succès')
  } catch (error) {
    return handleError(error)
  }
}
