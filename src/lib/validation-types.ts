/**
 * Types spécifiques pour la validation
 * Remplace les Record<string, unknown> par des types plus précis
 */

// Types pour les données entrantes non validées
export interface UnvalidatedPartnerData {
  readonly firstname?: unknown
  readonly lastname?: unknown
  readonly job?: unknown
  readonly email?: unknown
  readonly phone?: unknown
  readonly company?: unknown
  readonly rating?: unknown
  readonly comment?: unknown
  readonly classifications?: unknown
}

export interface UnvalidatedPartnerUpdateData {
  readonly firstname?: unknown
  readonly lastname?: unknown
  readonly job?: unknown
  readonly email?: unknown
  readonly phone?: unknown
  readonly company?: unknown
  readonly rating?: unknown
  readonly comment?: unknown
  readonly classifications?: unknown
  readonly status?: unknown
}

// Types pour les critères de recherche
export interface SearchCriteria {
  readonly search?: string
  readonly status?: string
  readonly classification?: string
  readonly job?: string
  readonly page?: number
  readonly limit?: number
  readonly sortBy?: string
  readonly sortOrder?: string
}

// Types pour les logs et données debug
export interface LogData {
  readonly [key: string]: string | number | boolean | null | undefined
}

// Types pour les détails d'erreur
export interface ErrorDetails {
  readonly field?: string
  readonly code?: string
  readonly expected?: string
  readonly received?: string
}
