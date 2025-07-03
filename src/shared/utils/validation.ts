// Utilitaires de validation avec types strictes
import type { RatingValue } from '@/types/global'

/**
 * Valide un email selon le format RFC 5322 simplifié
 * @param email - L'email à valider
 * @returns true si l'email est valide
 */
export const validateEmail = (email: string): email is string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valide un numéro de téléphone français
 * @param phone - Le numéro à valider
 * @returns true si le numéro est valide
 */
export const validatePhone = (phone: string): phone is string => {
  const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Valide qu'un champ n'est pas vide
 * @param value - La valeur à valider
 * @returns true si la valeur n'est pas vide
 */
export const validateRequired = <T extends string>(
  value: T
): value is NonNullable<T> => {
  return value.trim().length > 0
}

/**
 * Valide une note de 1 à 5
 * @param rating - La note à valider
 * @returns true si la note est valide
 */
export const validateRating = (rating: number): rating is RatingValue => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
}
