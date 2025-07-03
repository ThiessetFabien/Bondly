/**
 * Types spécifiques à l'API RPM-CL
 */

// Types pour les requêtes API
export interface ApiRequest<T = unknown> {
  readonly data: T
  readonly headers?: Record<string, string>
}

// Types pour les réponses d'erreur API
export interface ApiErrorResponse {
  readonly error: {
    readonly code: string
    readonly message: string
    readonly details?: Record<string, unknown>
  }
  readonly success: false
}

// Types pour les réponses de succès API
export interface ApiSuccessResponse<T = unknown> {
  readonly data: T
  readonly success: true
  readonly message?: string
}

// Union des types de réponse
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

// Types pour les endpoints API
export interface ApiEndpoint {
  readonly url: string
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  readonly headers?: Record<string, string>
}
