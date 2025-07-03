// Tests pour les nouvelles fonctionnalités strictes TypeScript
import type { RatingValue } from '@/types/global'
import { formatDate, formatRating } from '../formatting'
import { validateRating } from '../validation'

describe('Strict TypeScript features', () => {
  describe('formatRating', () => {
    it('should format valid ratings correctly', () => {
      expect(formatRating(1)).toBe('★☆☆☆☆')
      expect(formatRating(3)).toBe('★★★☆☆')
      expect(formatRating(5)).toBe('★★★★★')
    })

    it('should throw error for invalid ratings', () => {
      expect(() => formatRating(0 as RatingValue)).toThrow(
        'Rating must be an integer between 1 and 5'
      )
      expect(() => formatRating(6 as RatingValue)).toThrow(
        'Rating must be an integer between 1 and 5'
      )
      expect(() => formatRating(3.5 as RatingValue)).toThrow(
        'Rating must be an integer between 1 and 5'
      )
    })
  })

  describe('validateRating', () => {
    it('should validate correct rating values', () => {
      expect(validateRating(1)).toBe(true)
      expect(validateRating(3)).toBe(true)
      expect(validateRating(5)).toBe(true)
    })

    it('should reject invalid rating values', () => {
      expect(validateRating(0)).toBe(false)
      expect(validateRating(6)).toBe(false)
      expect(validateRating(3.5)).toBe(false)
      expect(validateRating(-1)).toBe(false)
    })
  })

  describe('formatDate', () => {
    it('should format ISO dates to French format', () => {
      expect(formatDate('2025-01-15T10:30:00Z')).toBe('15/01/2025')
      expect(formatDate('2025-12-31T12:00:00Z')).toBe('31/12/2025')
    })

    it('should handle invalid dates gracefully', () => {
      expect(formatDate('invalid-date')).toBe('invalid-date')
      expect(formatDate('')).toBe('')
    })

    it('should throw error for non-string input', () => {
      expect(() => formatDate(null as unknown as string)).toThrow(
        'Date must be a string'
      )
      expect(() => formatDate(123 as unknown as string)).toThrow(
        'Date must be a string'
      )
    })
  })
})
