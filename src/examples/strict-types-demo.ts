// Exemple d'utilisation des types strictes RPM-CL
import type {
  Partner,
  PartnerFormData,
  UsePartnersState,
} from '@/features/partners/types'
import { ERROR_MESSAGES, PROFESSIONS } from '@/shared/utils/constants'
import { formatName, formatRating } from '@/shared/utils/formatting'
import {
  validateEmail,
  validatePhone,
  validateRating,
} from '@/shared/utils/validation'
import type { ApiResponse, RatingValue } from '@/types/global'

/**
 * Exemple de fonction avec types strictes pour créer un partenaire
 * Démontre l'utilisation des types readonly et des validations
 */
export const createPartnerExample = async (
  formData: PartnerFormData
): Promise<ApiResponse<Partner>> => {
  // Validation stricte avec type guards
  if (!validateEmail(formData.email)) {
    throw new Error(ERROR_MESSAGES.INVALID_EMAIL)
  }

  if (!validatePhone(formData.phone)) {
    throw new Error(ERROR_MESSAGES.INVALID_PHONE)
  }

  if (!validateRating(formData.rating)) {
    throw new Error(ERROR_MESSAGES.INVALID_RATING)
  }

  // Formatage avec types stricts
  const formattedPartner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'> = {
    firstName: formatName(formData.firstName),
    lastName: formatName(formData.lastName),
    email: formData.email.toLowerCase(),
    phone: formData.phone,
    company: formatName(formData.company),
    profession: formData.profession,
    rating: formData.rating,
    status: 'active', // Type strict PartnerStatus
    ...(formData.notes && { notes: formData.notes }), // Gestion stricte des optionnels
    classifications: formData.classifications,
    relationHistory: [], // Readonly array
  }

  // Simulation d'appel API avec type de retour strict
  return {
    data: {
      ...formattedPartner,
      id: 'generated-uuid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    success: true,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Exemple de hook avec état typé strictement
 * Démontre l'utilisation des types readonly pour l'immutabilité
 */
export const usePartnersExample = (): UsePartnersState => {
  // État avec types readonly pour empêcher les mutations accidentelles
  const state: UsePartnersState = {
    partners: [], // readonly Partner[]
    isLoading: false,
    error: null,
    filters: {
      search: '',
      profession: PROFESSIONS.AVOCAT_AFFAIRES, // Type strict Profession
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
  }

  return state
}

/**
 * Exemple de fonction utilitaire avec types stricts
 * Démontre l'utilisation des type guards et de la validation
 */
export const displayPartnerRating = (rating: number): string => {
  // Type guard avec validation stricte
  if (!validateRating(rating)) {
    throw new Error(`Rating invalide: ${rating}. Doit être entre 1 et 5.`)
  }

  // TypeScript sait maintenant que rating est de type RatingValue
  return formatRating(rating)
}

/**
 * Exemple de fonction avec destructuring typé strictement
 */
export const getPartnerDisplayName = ({
  firstName,
  lastName,
}: Pick<Partner, 'firstName' | 'lastName'>): string => {
  return `${formatName(firstName)} ${formatName(lastName)}`
}

/**
 * Exemple d'utilisation des constantes typées
 */
export const getAvailableProfessions = (): readonly string[] => {
  return Object.values(PROFESSIONS) // Type: readonly Profession[]
}

/**
 * Fonction qui démontre l'utilisation de Record avec types stricts
 */
export const createRatingStats = (
  partners: readonly Partner[]
): Record<RatingValue, number> => {
  const stats: Record<RatingValue, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }

  for (const partner of partners) {
    // TypeScript garantit que partner.rating est de type RatingValue
    stats[partner.rating]++
  }

  return stats
}
