/**
 * Utilitaires API pour RPM-CL
 * Fonctions de base pour la construction d'URLs et requêtes API
 */

/**
 * Construit une URL d'API complète
 * @param endpoint - Le endpoint à ajouter à l'URL de base
 * @param baseUrl - URL de base (optionnel)
 * @returns URL complète de l'API
 */
export const buildApiUrl = (
  endpoint: string,
  baseUrl: string = process.env['NEXT_PUBLIC_API_URL'] || '/api'
): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

  return `${cleanBaseUrl}/${cleanEndpoint}`
}

/**
 * Headers de base pour les requêtes API
 */
export const getApiHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
})

/**
 * Configuration de base pour fetch
 */
export const getApiConfig = (): RequestInit => ({
  headers: getApiHeaders(),
  credentials: 'same-origin',
})

/**
 * Gestionnaire d'erreur API standardisé
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return "Une erreur inconnue s'est produite"
}
