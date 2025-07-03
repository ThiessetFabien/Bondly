// Test-first approach: définir le comportement attendu
import { validateEmail, validatePhone, validateRequired } from '../validation'

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('contact@cabinet-laurent.fr')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should return true for valid French phone numbers', () => {
      expect(validatePhone('0123456789')).toBe(true)
      expect(validatePhone('+33123456789')).toBe(true)
      expect(validatePhone('01 23 45 67 89')).toBe(true)
    })

    it('should return false for invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('0023456789')).toBe(false)
      expect(validatePhone('')).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('should return true for non-empty strings', () => {
      expect(validateRequired('text')).toBe(true)
      expect(validateRequired('  text  ')).toBe(true)
    })

    it('should return false for empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false)
      expect(validateRequired('   ')).toBe(false)
      expect(validateRequired('\n\t')).toBe(false)
    })
  })
})
