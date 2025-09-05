/**
 * Améliorations SIMPLES et RAPIDES pour MVP
 * Focus: Robustesse sans complexité
 */

import type { CreatePartnerRequest } from './types'
import type { LogData } from './validation-types'

// 1. VALIDATION D'ENTRÉE SIMPLE
export function validatePartnerInput(data: CreatePartnerRequest): string[] {
  const errors: string[] = []

  if (
    !data.firstname ||
    typeof data.firstname !== 'string' ||
    !data.firstname.trim()
  ) {
    errors.push('Prénom requis')
  }
  if (
    !data.lastname ||
    typeof data.lastname !== 'string' ||
    !data.lastname.trim()
  ) {
    errors.push('Nom requis')
  }
  if (
    !data.company ||
    typeof data.company !== 'string' ||
    !data.company.trim()
  ) {
    errors.push('Société requise')
  }

  if (
    data.email &&
    typeof data.email === 'string' &&
    !isValidEmail(data.email)
  ) {
    errors.push('Email invalide')
  }

  if (
    data.rating &&
    typeof data.rating === 'number' &&
    (data.rating < 1 || data.rating > 5)
  ) {
    errors.push('Note entre 1 et 5')
  }

  return errors
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 2. GESTION D'ERREUR ROBUSTE SIMPLE
export function handleDatabaseError(error: unknown): {
  success: false
  error: string
} {
  console.error('❌ Erreur base de données:', error)

  let message = 'Erreur interne'

  if (error instanceof Error) {
    if (error.message.includes('unique constraint')) {
      message = 'Ce partenaire existe déjà'
    } else if (error.message.includes('foreign key')) {
      message = 'Classification invalide'
    } else if (error.message.includes('not null')) {
      message = 'Champs obligatoires manquants'
    }
  }

  return { success: false, error: message }
}

// 3. LOGS SIMPLES POUR DEBUG
export function logOperation(operation: string, data?: LogData) {
  const timestamp = new Date().toISOString()
  console.log(
    `[${timestamp}] ${operation}`,
    data ? JSON.stringify(data, null, 2) : ''
  )
}

// 4. CONSTANTES CENTRALISÉES
export const BUSINESS_RULES = {
  PARTNER: {
    MIN_RATING: 1,
    MAX_RATING: 5,
    MAX_NAME_LENGTH: 100,
    MAX_COMPANY_LENGTH: 200,
  },
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
} as const

// 5. HELPER POUR REQUÊTES SÉCURISÉES
export function sanitizeSearchTerm(term: string): string {
  return term?.trim().toLowerCase().replace(/[%_]/g, '\\$&') || ''
}
