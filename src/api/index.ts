/**
 * API centralisée pour RPM-CL
 * Point d'entrée pour toutes les APIs du projet
 */

export * from './partners-json'
export * from './types'

// Export par défaut de l'API des partenaires
export { default as partnersApi } from './partners-json'
