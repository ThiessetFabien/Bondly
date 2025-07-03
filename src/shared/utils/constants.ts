// Constants de l'application avec types strictes
import type { PartnerStatus, RatingValue } from '@/types/global'

/**
 * Routes API avec types stricts
 */
export const API_ROUTES = {
  PARTNERS: '/api/partners',
  CLASSIFICATIONS: '/api/classifications',
  AUTH: '/api/auth',
  USERS: '/api/users',
  STATS: '/api/stats',
} as const

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES]

/**
 * Statuts des partenaires
 */
export const PARTNER_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  BLACKLISTED: 'blacklisted',
} as const satisfies Record<string, PartnerStatus>

/**
 * Échelle de notation
 */
export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
} as const satisfies Record<'MIN' | 'MAX', RatingValue>

/**
 * Professions/métiers supportés selon les specs
 */
export const PROFESSIONS = {
  AVOCAT_AFFAIRES: "Avocat d'affaires",
  FISCALISTE: 'Fiscaliste',
  DROIT_TRAVAIL: 'Spécialiste en droit du travail',
  HUISSIER: 'Huissier de justice',
  BANQUE: 'Banque',
  AFFACTURAGE: "Compagnie d'affacturage",
  ASSUREUR: 'Assureur',
  GESTION_PATRIMOINE: 'Cabinet de gestion de patrimoine',
  EXPERT_PAIE: 'Expert en gestion de paie & RH',
  RECRUTEMENT: 'Cabinet de recrutement',
  NOTAIRE: 'Notaire',
} as const

export type Profession = (typeof PROFESSIONS)[keyof typeof PROFESSIONS]

/**
 * Limites de pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const

/**
 * Messages d'erreur standardisés
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est obligatoire',
  INVALID_EMAIL: "Format d'email invalide",
  INVALID_PHONE: 'Format de téléphone invalide',
  INVALID_RATING: 'La note doit être comprise entre 1 et 5',
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  UNKNOWN_ERROR: "Une erreur inattendue s'est produite",
} as const

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES]
