/**
 * Utilitaires API et données simulées pour RPM-CL
 * Fournit des fonctions pour simuler les appels API et gérer les données
 */

import type {
  ApiResponse,
  FilterOptions,
  PaginatedResponse,
  PaginationParams,
  Partner,
} from '../types'
import { PARTNER_STATUS, PROFESSIONS } from './constants'

// Données simulées pour les partenaires
const MOCK_PARTNERS: readonly Partner[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    profession: PROFESSIONS.AVOCAT_AFFAIRES,
    email: 'marie.dubois@example.com',
    phone: '01 23 45 67 89',
    company: 'Cabinet Dubois & Associés',
    rating: 5,
    status: PARTNER_STATUS.ACTIVE,
    notes: 'Excellente collaboration, très professionnelle',
    classifications: ['healthcare', 'specialist'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
  },
  {
    id: '2',
    firstName: 'Jean',
    lastName: 'Dupont',
    profession: PROFESSIONS.FISCALISTE,
    email: 'jean.dupont@cabinet-dupont.fr',
    phone: '01 42 96 78 45',
    company: 'Cabinet Dupont',
    rating: 4,
    status: PARTNER_STATUS.ACTIVE,
    notes: 'Très réactif, expertise solide en droit commercial',
    classifications: ['legal', 'business'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-12-10T14:15:00Z',
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Martin',
    profession: PROFESSIONS.HUISSIER,
    email: 'sophie.martin@consult-tech.com',
    phone: '01 56 78 90 12',
    company: 'Martin & Associés',
    rating: 4,
    status: PARTNER_STATUS.ACTIVE,
    notes: 'Expertise technique excellente, accompagnement de qualité',
    classifications: ['technology', 'consulting'],
    createdAt: '2024-03-10T11:30:00Z',
    updatedAt: '2024-12-08T16:45:00Z',
  },
  {
    id: '4',
    firstName: 'Thomas',
    lastName: 'Bernard',
    profession: PROFESSIONS.EXPERT_PAIE,
    email: 'thomas.bernard@compta-expert.fr',
    phone: '01 34 56 78 90',
    company: 'Expertise Bernard',
    rating: 5,
    status: PARTNER_STATUS.ACTIVE,
    notes: 'Excellent partenaire comptable, très précis',
    classifications: ['finance', 'accounting'],
    createdAt: '2024-11-20T14:00:00Z',
    updatedAt: '2024-11-28T09:20:00Z',
  },
  {
    id: '5',
    firstName: 'Claire',
    lastName: 'Rousseau',
    profession: PROFESSIONS.NOTAIRE,
    email: 'claire.rousseau@archi-green.com',
    phone: '01 67 89 01 23',
    company: 'Étude Rousseau',
    rating: 4,
    status: PARTNER_STATUS.ARCHIVED,
    notes: 'Partenariat archivé, à relancer si besoin',
    classifications: ['legal', 'notary'],
    createdAt: '2024-04-05T08:45:00Z',
    updatedAt: '2024-10-15T11:00:00Z',
  },
] as const

// Fonction utilitaire pour simuler un délai d'API
const simulateApiDelay = async (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Fonction pour filtrer les partenaires
const filterPartners = (
  partners: readonly Partner[],
  filters: FilterOptions
): readonly Partner[] => {
  return partners.filter(partner => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const fullName = `${partner.firstName} ${partner.lastName}`.toLowerCase()
      const matchesSearch =
        fullName.includes(searchLower) ||
        partner.profession.toLowerCase().includes(searchLower) ||
        partner.company.toLowerCase().includes(searchLower) ||
        partner.email.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false
    }

    if (filters.status && partner.status !== filters.status) {
      return false
    }

    if (
      filters.category &&
      !partner.classifications.includes(filters.category)
    ) {
      return false
    }

    if (filters.dateRange) {
      const updatedAt = new Date(partner.updatedAt)
      if (
        updatedAt < filters.dateRange.from ||
        updatedAt > filters.dateRange.to
      ) {
        return false
      }
    }

    return true
  })
}

// Fonction pour paginer les résultats
const paginateResults = <T>(
  items: readonly T[],
  params: PaginationParams
): PaginatedResponse<T> => {
  const startIndex = (params.page - 1) * params.limit
  const endIndex = startIndex + params.limit
  const paginatedItems = items.slice(startIndex, endIndex)

  return {
    data: paginatedItems,
    pagination: {
      currentPage: params.page,
      totalPages: Math.ceil(items.length / params.limit),
      totalItems: items.length,
      itemsPerPage: params.limit,
    },
  }
}

// API simulée pour récupérer les partenaires
export const fetchPartners = async (
  params: PaginationParams = { page: 1, limit: 10 },
  filters: FilterOptions = {}
): Promise<ApiResponse<PaginatedResponse<Partner>>> => {
  await simulateApiDelay()

  try {
    const filteredPartners = filterPartners(MOCK_PARTNERS, filters)
    const paginatedResult = paginateResults(filteredPartners, params)

    return {
      data: paginatedResult,
      success: true,
      message: 'Partenaires récupérés avec succès',
    }
  } catch (error) {
    return {
      data: {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: params.limit,
        },
      },
      success: false,
      message: 'Erreur lors de la récupération des partenaires',
      errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
    }
  }
}

// API simulée pour récupérer un partenaire par ID
export const fetchPartnerById = async (
  id: string
): Promise<ApiResponse<Partner | null>> => {
  await simulateApiDelay()

  try {
    const partner = MOCK_PARTNERS.find(p => p.id === id) || null

    return {
      data: partner,
      success: !!partner,
      message: partner ? 'Partenaire trouvé' : 'Partenaire non trouvé',
    }
  } catch (error) {
    return {
      data: null,
      success: false,
      message: 'Erreur lors de la récupération du partenaire',
      errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
    }
  }
}

// API simulée pour créer un nouveau partenaire
export const createPartner = async (
  partnerData: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Partner>> => {
  await simulateApiDelay(1000)

  try {
    const newPartner: Partner = {
      ...partnerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      data: newPartner,
      success: true,
      message: 'Partenaire créé avec succès',
    }
  } catch (error) {
    return {
      data: {} as Partner,
      success: false,
      message: 'Erreur lors de la création du partenaire',
      errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
    }
  }
}

// API simulée pour mettre à jour un partenaire
export const updatePartner = async (
  id: string,
  updates: Partial<Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Partner | null>> => {
  await simulateApiDelay(800)

  try {
    const existingPartner = MOCK_PARTNERS.find(p => p.id === id)

    if (!existingPartner) {
      return {
        data: null,
        success: false,
        message: 'Partenaire non trouvé',
      }
    }

    const updatedPartner: Partner = {
      ...existingPartner,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return {
      data: updatedPartner,
      success: true,
      message: 'Partenaire mis à jour avec succès',
    }
  } catch (error) {
    return {
      data: null,
      success: false,
      message: 'Erreur lors de la mise à jour du partenaire',
      errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
    }
  }
}

// API simulée pour supprimer un partenaire
export const deletePartner = async (
  id: string
): Promise<ApiResponse<boolean>> => {
  await simulateApiDelay(600)

  try {
    const partnerExists = MOCK_PARTNERS.some(p => p.id === id)

    if (!partnerExists) {
      return {
        data: false,
        success: false,
        message: 'Partenaire non trouvé',
      }
    }

    return {
      data: true,
      success: true,
      message: 'Partenaire supprimé avec succès',
    }
  } catch (error) {
    return {
      data: false,
      success: false,
      message: 'Erreur lors de la suppression du partenaire',
      errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
    }
  }
}

// Utilitaire pour construire les URLs d'API
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string | number>
): string => {
  const baseUrl =
    process.env['NEXT_PUBLIC_API_BASE_URL'] || 'http://localhost:3000/api'
  let url = `${baseUrl}${endpoint}`

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString())
    })
    url += `?${searchParams.toString()}`
  }

  return url
}

// Export des données simulées pour les tests
export { MOCK_PARTNERS }
