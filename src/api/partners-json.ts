/**
 * API des partenaires pour RPM-CL
 * Utilise des fichiers JSON pour les données de test
 */

import type { Partner } from '../shared/types'
import metadataData from './data/metadata.json'
import partnersData from './data/partners.json'
import type { ApiRequest, ApiResponse } from './types'

// Chargement des données JSON
const { partners: PARTNERS_JSON, meta: PARTNERS_META } = partnersData
const {
  professions: PROFESSIONS_JSON,
  statuses: STATUSES_JSON,
  classifications: CLASSIFICATIONS_JSON,
} = metadataData

// Conversion des données JSON en types Partner
export const PARTNER_CARDS_DATA: readonly Partner[] = PARTNERS_JSON.map(
  partner => ({
    ...partner,
    // Assurer la cohérence des types
    rating: partner.rating as 1 | 2 | 3 | 4 | 5,
    status: partner.status as 'active' | 'archived' | 'blacklisted',
    classifications: partner.classifications as readonly string[],
  })
)

// Export des métadonnées
export const API_METADATA = {
  professions: PROFESSIONS_JSON,
  statuses: STATUSES_JSON,
  classifications: CLASSIFICATIONS_JSON,
  meta: PARTNERS_META,
} as const

// Utilitaires pour les données
export const getPartnerById = (id: string): Partner | undefined => {
  return PARTNER_CARDS_DATA.find(partner => partner.id === id)
}

export const getPartnersByStatus = (status: string): Partner[] => {
  return PARTNER_CARDS_DATA.filter(partner => partner.status === status)
}

export const getPartnersByProfession = (profession: string): Partner[] => {
  return PARTNER_CARDS_DATA.filter(partner => partner.profession === profession)
}

export const getPartnersByClassification = (
  classification: string
): Partner[] => {
  return PARTNER_CARDS_DATA.filter(partner =>
    partner.classifications.includes(classification)
  )
}

// Simulation d'une base de données en mémoire pour les tests
let partnersDatabase = [...PARTNER_CARDS_DATA]

// Fonctions API simulées
export const partnersApi = {
  /**
   * Récupère tous les partenaires avec pagination et filtres
   */
  async getAllPartners(params?: {
    page?: number
    limit?: number
    status?: string
    profession?: string
    classification?: string
    search?: string
  }): Promise<
    ApiResponse<{
      partners: Partner[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>
  > {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    let filteredPartners = [...partnersDatabase]

    // Filtrage par statut
    if (params?.status) {
      filteredPartners = filteredPartners.filter(
        p => p.status === params.status
      )
    }

    // Filtrage par profession
    if (params?.profession) {
      filteredPartners = filteredPartners.filter(
        p => p.profession === params.profession
      )
    }

    // Filtrage par classification
    if (params?.classification) {
      filteredPartners = filteredPartners.filter(p =>
        p.classifications.includes(params.classification!)
      )
    }

    // Recherche textuelle
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filteredPartners = filteredPartners.filter(
        p =>
          p.firstName.toLowerCase().includes(searchLower) ||
          p.lastName.toLowerCase().includes(searchLower) ||
          p.company.toLowerCase().includes(searchLower) ||
          p.profession.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPartners = filteredPartners.slice(startIndex, endIndex)

    return {
      data: {
        partners: paginatedPartners,
        total: filteredPartners.length,
        page,
        limit,
        totalPages: Math.ceil(filteredPartners.length / limit),
      },
      success: true,
      message: 'Partenaires récupérés avec succès',
    }
  },

  /**
   * Récupère un partenaire par son ID
   */
  async getPartnerById(id: string): Promise<ApiResponse<Partner | null>> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300))

    const partner = partnersDatabase.find(p => p.id === id)

    if (!partner) {
      return {
        error: {
          code: 'PARTNER_NOT_FOUND',
          message: `Partenaire avec l'ID ${id} non trouvé`,
        },
        success: false,
      }
    }

    return {
      data: partner,
      success: true,
      message: 'Partenaire récupéré avec succès',
    }
  },

  /**
   * Crée un nouveau partenaire
   */
  async createPartner(
    request: ApiRequest<Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<Partner>> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800))

    const newPartner: Partner = {
      ...request.data,
      id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Ajouter à la base de données simulée
    partnersDatabase = [...partnersDatabase, newPartner]

    return {
      data: newPartner,
      success: true,
      message: 'Partenaire créé avec succès',
    }
  },

  /**
   * Met à jour un partenaire existant
   */
  async updatePartner(
    id: string,
    request: ApiRequest<Partial<Partner>>
  ): Promise<ApiResponse<Partner>> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 600))

    const existingPartnerIndex = partnersDatabase.findIndex(p => p.id === id)

    if (existingPartnerIndex === -1) {
      return {
        error: {
          code: 'PARTNER_NOT_FOUND',
          message: `Partenaire avec l'ID ${id} non trouvé`,
        },
        success: false,
      }
    }

    const existingPartner = partnersDatabase[existingPartnerIndex]
    if (!existingPartner) {
      return {
        error: {
          code: 'PARTNER_NOT_FOUND',
          message: `Partenaire avec l'ID ${id} non trouvé`,
        },
        success: false,
      }
    }

    // Créer une copie modifiée du partenaire existant
    const updatedPartner = {
      ...existingPartner,
      updatedAt: new Date().toISOString(),
    }

    // Appliquer les modifications une par une
    if (request.data.firstName !== undefined)
      updatedPartner.firstName = request.data.firstName
    if (request.data.lastName !== undefined)
      updatedPartner.lastName = request.data.lastName
    if (request.data.email !== undefined)
      updatedPartner.email = request.data.email
    if (request.data.phone !== undefined)
      updatedPartner.phone = request.data.phone
    if (request.data.company !== undefined)
      updatedPartner.company = request.data.company
    if (request.data.profession !== undefined)
      updatedPartner.profession = request.data.profession
    if (request.data.rating !== undefined)
      updatedPartner.rating = request.data.rating
    if (request.data.status !== undefined)
      updatedPartner.status = request.data.status
    if (request.data.notes !== undefined)
      updatedPartner.notes = request.data.notes
    if (request.data.classifications !== undefined)
      updatedPartner.classifications = request.data.classifications
    if (request.data.relationHistory !== undefined)
      updatedPartner.relationHistory = request.data.relationHistory

    // Mettre à jour dans la base de données simulée
    partnersDatabase[existingPartnerIndex] = updatedPartner

    return {
      data: updatedPartner,
      success: true,
      message: 'Partenaire mis à jour avec succès',
    }
  },

  /**
   * Supprime un partenaire
   */
  async deletePartner(id: string): Promise<ApiResponse<{ id: string }>> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 400))

    const partnerIndex = partnersDatabase.findIndex(p => p.id === id)

    if (partnerIndex === -1) {
      return {
        error: {
          code: 'PARTNER_NOT_FOUND',
          message: `Partenaire avec l'ID ${id} non trouvé`,
        },
        success: false,
      }
    }

    // Supprimer de la base de données simulée
    partnersDatabase = partnersDatabase.filter(p => p.id !== id)

    return {
      data: { id },
      success: true,
      message: 'Partenaire supprimé avec succès',
    }
  },

  /**
   * Récupère les métadonnées de l'API
   */
  async getMetadata(): Promise<ApiResponse<typeof API_METADATA>> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 200))

    return {
      data: API_METADATA,
      success: true,
      message: 'Métadonnées récupérées avec succès',
    }
  },

  /**
   * Récupère les statistiques des partenaires
   */
  async getStats(): Promise<
    ApiResponse<{
      total: number
      byStatus: Record<string, number>
      byProfession: Record<string, number>
      byClassification: Record<string, number>
      averageRating: number
    }>
  > {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 400))

    const stats = {
      total: partnersDatabase.length,
      byStatus: partnersDatabase.reduce(
        (acc, partner) => {
          acc[partner.status] = (acc[partner.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      ),
      byProfession: partnersDatabase.reduce(
        (acc, partner) => {
          acc[partner.profession] = (acc[partner.profession] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      ),
      byClassification: partnersDatabase.reduce(
        (acc, partner) => {
          partner.classifications.forEach(classification => {
            acc[classification] = (acc[classification] || 0) + 1
          })
          return acc
        },
        {} as Record<string, number>
      ),
      averageRating:
        partnersDatabase.reduce((acc, partner) => acc + partner.rating, 0) /
        partnersDatabase.length,
    }

    return {
      data: stats,
      success: true,
      message: 'Statistiques récupérées avec succès',
    }
  },

  /**
   * Réinitialise la base de données avec les données initiales
   */
  async resetDatabase(): Promise<ApiResponse<{ message: string }>> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300))

    partnersDatabase = [...PARTNER_CARDS_DATA]

    return {
      data: { message: 'Base de données réinitialisée' },
      success: true,
      message: 'Base de données réinitialisée avec succès',
    }
  },
}

// Export par défaut
export default partnersApi
