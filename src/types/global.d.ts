// Types globaux strictes pour l'application RPM-CL
export interface ApiResponse<T = unknown> {
  readonly data: T
  readonly message?: string
  readonly success: boolean
  readonly timestamp: string
}

export interface PaginatedResponse<T = unknown> {
  readonly data: readonly T[]
  readonly meta: {
    readonly page: number
    readonly limit: number
    readonly total: number
    readonly totalPages: number
  }
}

export interface ErrorDetails {
  readonly field?: string
  readonly code?: string
  readonly expected?: string
  readonly received?: string
}

export interface ErrorResponse {
  readonly error: {
    readonly message: string
    readonly code: string
    readonly details?: ErrorDetails
  }
  readonly success: false
  readonly timestamp: string
}

// Types utilisateur avec roles stricts
export interface User {
  readonly id: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly role: UserRole
  readonly createdAt: string
  readonly updatedAt: string
}

export type UserRole = 'admin' | 'consultant' | 'collaborator'

export type RatingValue = 1 | 2 | 3 | 4 | 5

// Utilitaires de types stricts
export type NonEmptyArray<T> = [T, ...T[]]

export type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K
}[keyof T]

export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never
}[keyof T]

// Types pour les formulaires avec validation stricte
export interface FormState<T> {
  readonly values: T
  readonly errors: Partial<Record<keyof T, string>>
  readonly touched: Partial<Record<keyof T, boolean>>
  readonly isSubmitting: boolean
  readonly isValid: boolean
}

// Events handlers avec types stricts
export type EventHandler<T = Event> = (event: T) => void
export type ChangeHandler<T = HTMLInputElement> = (
  event: React.ChangeEvent<T>
) => void
export type SubmitHandler<T = HTMLFormElement> = (
  event: React.FormEvent<T>
) => void
