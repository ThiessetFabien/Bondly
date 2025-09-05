/**
 * Types pour l'API Bondly
 * Réexport des types métier existants + types API spécifiques
 */

// === IMPORTS DES TYPES MÉTIER EXISTANTS ===
import type {
  Partner,
  PartnerClassification,
  PartnerStatus,
} from '@/shared/types/Partner'

// === RÉEXPORT POUR COMPATIBILITÉ ===
export type { Partner, PartnerClassification, PartnerStatus }

// === TYPES COMPLÉMENTAIRES ===

export interface PartnerRelation {
  id: string
  name: string
  company: string
  type: 'collaboration' | 'recommandation' | 'client_envoye' | 'client_recu'
}

// === TYPES API SPÉCIFIQUES ===

export interface Profession {
  id: string
  label: string
  category: string
  description: string
}

// Types pour les requêtes API
export interface GetPartnersParams {
  page?: number
  limit?: number
  search?: string
  status?: PartnerStatus
  classification?: string
  sortBy?: 'firstname' | 'lastname' | 'company' | 'job' | 'rating' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  job?: string
}

export interface CreatePartnerRequest {
  firstname: string
  lastname: string
  job: string
  email?: string
  phone?: string
  company: string
  rating?: number
  comment?: string
  classifications?: string[]
}

export interface UpdatePartnerRequest extends Partial<CreatePartnerRequest> {
  status?: 'active' | 'archived' | 'blacklisted'
}

export interface GetClassificationsParams {
  search?: string
  category?: string
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface DashboardStats {
  // Statistiques générales
  totalPartners: number
  activePartners: number
  averageRating: number
  recentPartners: number

  // Distributions détaillées
  topClassifications: Array<{
    name: string
    count: number
  }>
  statusDistribution: Array<{
    status: string
    count: number
  }>
  ratingDistribution: Array<{
    rating: number
    count: number
  }>
}

// Types pour la recherche et les filtres
export interface SearchFilters {
  term?: string
  status?: string[]
  classifications?: string[]
  jobs?: string[]
  rating?: number
  dateRange?: {
    from: string
    to: string
  }
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}
