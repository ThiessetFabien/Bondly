import { NextResponse } from 'next/server'
import type {
  ApiResponse,
  CreatePartnerRequest,
  UpdatePartnerRequest,
} from './types'
import type {
  UnvalidatedPartnerData,
  UnvalidatedPartnerUpdateData,
} from './validation-types'

/**
 * Crée une réponse de succès standardisée
 */
export function successResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

/**
 * Crée une réponse d'erreur standardisée
 */
export function errorResponse(
  error: string,
  status = 400
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error,
      data: null,
    },
    { status }
  )
}

/**
 * Gère les erreurs de manière centralisée
 */
export function handleError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error('API Error:', error)

  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }

  return errorResponse("Une erreur interne s'est produite", 500)
}

/**
 * Valide les paramètres de pagination
 */
export function validatePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '20'))
  )

  return { page, limit }
}

/**
 * Valide les paramètres de tri
 */
export function validateSort(searchParams: URLSearchParams) {
  const sortBy = searchParams.get('sortBy') || 'lastname'
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc'

  return { sortBy, sortOrder }
}

/**
 * Valide les paramètres de filtre
 */
export function validateFilters(searchParams: URLSearchParams) {
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || undefined
  const classification = searchParams.get('classification') || undefined
  const job = searchParams.get('job') || undefined

  // Validation du status
  const validStatuses = ['active', 'archived', 'blacklisted']
  const validatedStatus =
    status && validStatuses.includes(status) ? status : undefined

  return {
    search,
    status: validatedStatus,
    classification,
    job,
  }
}

/**
 * Valide les données de création d'un partenaire
 */
export function validatePartnerData(data: unknown): {
  isValid: boolean
  errors: string[]
  validatedData?: CreatePartnerRequest
} {
  const errors: string[] = []

  // Type guard pour vérifier que data est un objet
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Les données doivent être un objet valide'],
    }
  }

  const obj = data as UnvalidatedPartnerData

  // Champs obligatoires
  if (!obj.firstname || typeof obj.firstname !== 'string') {
    errors.push('Le prénom est obligatoire')
  }

  if (!obj.lastname || typeof obj.lastname !== 'string') {
    errors.push('Le nom est obligatoire')
  }

  if (!obj.company || typeof obj.company !== 'string') {
    errors.push("L'entreprise est obligatoire")
  }

  if (!obj.job || typeof obj.job !== 'string') {
    errors.push('Le métier est obligatoire')
  }

  // Validation email si présent
  if (obj.email && typeof obj.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(obj.email)) {
      errors.push("Format d'email invalide")
    }
  }

  // Validation rating si présent
  if (obj.rating !== undefined) {
    const rating = parseInt(obj.rating as string)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push('La note doit être entre 1 et 5')
    }
  }

  // Validation classifications si présent
  if (obj.classifications && !Array.isArray(obj.classifications)) {
    errors.push('Les classifications doivent être un tableau')
  }

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    validatedData: {
      firstname: (obj.firstname as string).trim(),
      lastname: (obj.lastname as string).trim(),
      job: (obj.job as string).trim(),
      company: (obj.company as string).trim(),
      email: obj.email ? (obj.email as string).trim() : undefined,
      phone: obj.phone ? (obj.phone as string).trim() : undefined,
      rating: (obj.rating as number) || undefined,
      comment: obj.comment ? (obj.comment as string).trim() : undefined,
      classifications: (obj.classifications as string[]) || [],
    },
  }
}

/**
 * Valide les données de mise à jour d'un partenaire
 */
export function validatePartnerUpdateData(data: unknown): {
  isValid: boolean
  errors: string[]
  validatedData?: UpdatePartnerRequest
} {
  const errors: string[] = []
  const validatedData: Partial<UpdatePartnerRequest> = {}

  // Type guard pour vérifier que data est un objet
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Les données doivent être un objet valide'],
    }
  }

  const obj = data as UnvalidatedPartnerUpdateData

  // Tous les champs sont optionnels pour une mise à jour
  if (obj.firstname !== undefined) {
    if (typeof obj.firstname !== 'string' || !obj.firstname.trim()) {
      errors.push('Le prénom ne peut pas être vide')
    } else {
      validatedData.firstname = obj.firstname.trim()
    }
  }

  if (obj.lastname !== undefined) {
    if (typeof obj.lastname !== 'string' || !obj.lastname.trim()) {
      errors.push('Le nom ne peut pas être vide')
    } else {
      validatedData.lastname = obj.lastname.trim()
    }
  }

  if (obj.company !== undefined) {
    if (typeof obj.company !== 'string' || !obj.company.trim()) {
      errors.push("L'entreprise ne peut pas être vide")
    } else {
      validatedData.company = obj.company.trim()
    }
  }

  if (obj.job !== undefined) {
    if (typeof obj.job !== 'string' || !obj.job.trim()) {
      errors.push('Le métier ne peut pas être vide')
    } else {
      validatedData.job = obj.job.trim()
    }
  }

  // Validation email si présent
  if (obj.email !== undefined) {
    if (obj.email === '' || obj.email === null) {
      validatedData.email = undefined
    } else if (typeof obj.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(obj.email)) {
        errors.push("Format d'email invalide")
      } else {
        validatedData.email = obj.email.trim()
      }
    } else {
      errors.push("L'email doit être une chaîne de caractères")
    }
  }

  // Validation phone si présent
  if (obj.phone !== undefined) {
    if (obj.phone === '' || obj.phone === null) {
      validatedData.phone = undefined
    } else if (typeof obj.phone === 'string') {
      validatedData.phone = obj.phone.trim()
    } else {
      errors.push('Le téléphone doit être une chaîne de caractères')
    }
  }

  // Validation rating si présent
  if (obj.rating !== undefined) {
    const rating = parseInt(obj.rating as string)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push('La note doit être entre 1 et 5')
    } else {
      validatedData.rating = rating
    }
  }

  // Validation comment si présent
  if (obj.comment !== undefined) {
    if (obj.comment === '' || obj.comment === null) {
      validatedData.comment = undefined
    } else if (typeof obj.comment === 'string') {
      validatedData.comment = obj.comment.trim()
    } else {
      errors.push('Le commentaire doit être une chaîne de caractères')
    }
  }

  // Validation classifications si présent
  if (obj.classifications !== undefined) {
    if (!Array.isArray(obj.classifications)) {
      errors.push('Les classifications doivent être un tableau')
    } else {
      validatedData.classifications = obj.classifications as string[]
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    validatedData: validatedData as UpdatePartnerRequest,
  }
}

/**
 * Nettoie et normalise une chaîne pour la recherche
 */
export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase()
}

/**
 * Vérifie si une chaîne est un UUID valide
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}
