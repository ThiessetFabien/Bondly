/**
 * Index des types partagés pour RPM-CL
 * Centralise l'export de tous les types utilisés dans l'application
 */

// Types globaux
export * from '../../types/global'

// Types spécifiques aux features
export * from '../../features/partners/types'

// Utilitaires (fonctions et types)
export * from '../utils'

// Types pour l'API
export interface ApiResponse<T = unknown> {
  readonly data: T
  readonly success: boolean
  readonly message?: string
  readonly errors?: readonly string[]
}

export interface ApiError {
  readonly code: string
  readonly message: string
  readonly details?: Record<string, unknown>
}

// Types pour la pagination
export interface PaginationParams {
  readonly page: number
  readonly limit: number
  readonly sortBy?: string
  readonly sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  readonly data: readonly T[]
  readonly pagination: {
    readonly currentPage: number
    readonly totalPages: number
    readonly totalItems: number
    readonly itemsPerPage: number
  }
}

// Types pour les filtres
export interface FilterOptions {
  readonly search?: string
  readonly category?: string
  readonly status?: string
  readonly dateRange?: {
    readonly from: Date
    readonly to: Date
  }
}
