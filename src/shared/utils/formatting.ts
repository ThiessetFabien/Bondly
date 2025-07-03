// Utilitaires de formatage avec types strictes et documentation
import type { RatingValue } from '@/types/global'

/**
 * Formate un numéro de téléphone français au format "01 23 45 67 89"
 * @param phone - Le numéro à formater
 * @returns Le numéro formaté ou le numéro original si invalide
 */
export const formatPhoneNumber = (phone: string): string => {
  if (typeof phone !== 'string') {
    throw new Error('Phone must be a string')
  }

  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)

  if (match) {
    const [, p1, p2, p3, p4, p5] = match
    return `${p1} ${p2} ${p3} ${p4} ${p5}`
  }
  return phone
}

/**
 * Formate un nom avec la capitalisation appropriée
 * Gère les noms composés avec tirets et espaces multiples
 * @param name - Le nom à formater
 * @returns Le nom formaté avec capitalisation correcte
 */
export const formatName = (name: string): string => {
  if (typeof name !== 'string') {
    throw new Error('Name must be a string')
  }

  const trimmed = name.trim()
  if (!trimmed) return ''

  return trimmed
    .split(' ')
    .filter((word): word is string => word.length > 0)
    .map(word => {
      // Gérer les noms composés avec des tirets
      if (word.includes('-')) {
        return word
          .split('-')
          .map(part => {
            if (part.length === 0) return part
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          })
          .join('-')
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

/**
 * Formate une note en étoiles pour l'affichage
 * @param rating - La note de 1 à 5
 * @returns Une chaîne d'étoiles représentant la note
 */
export const formatRating = (rating: RatingValue): string => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating must be an integer between 1 and 5')
  }

  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

/**
 * Formate une date ISO en format français
 * @param isoDate - Date au format ISO
 * @returns Date formatée "DD/MM/YYYY"
 */
export const formatDate = (isoDate: string): string => {
  if (typeof isoDate !== 'string') {
    throw new Error('Date must be a string')
  }

  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date')
    }

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return isoDate // Retourne la date originale si le formatage échoue
  }
}
