/**
 * API centralisée pour RPM-CL - VERSION ALLÉGÉE
 * Export minimal pour éviter le code mort
 */

// Export par défaut pour éviter le fichier vide
export const SERVICES_INFO = {
  name: 'services',
  version: '1.0.0',
  description:
    'Services API RPM-CL - Exports désactivés pour éviter le code mort',
} as const

// Exports commentés - décommentez si nécessaire :
// export * from './partners-json'
// export * from './types'
// export { default as partnersApi } from './partners-json'
