// Test-first approach: définir le comportement attendu
import { formatName, formatPhoneNumber } from '../formatting'

describe('Formatting utilities', () => {
  describe('formatPhoneNumber', () => {
    it('should format French phone numbers correctly', () => {
      expect(formatPhoneNumber('0123456789')).toBe('01 23 45 67 89')
      expect(formatPhoneNumber('01.23.45.67.89')).toBe('01 23 45 67 89')
      expect(formatPhoneNumber('01-23-45-67-89')).toBe('01 23 45 67 89')
    })

    it('should return original string for invalid formats', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('invalid')).toBe('invalid')
    })
  })

  describe('formatName', () => {
    it('should format names with proper capitalization', () => {
      expect(formatName('jean dupont')).toBe('Jean Dupont')
      expect(formatName('MARIE-CLAIRE DE LA FONTAINE')).toBe(
        'Marie-Claire De La Fontaine'
      )
      expect(formatName('  pierre  martin  ')).toBe('Pierre Martin')
    })

    it('should handle empty strings', () => {
      expect(formatName('')).toBe('')
      expect(formatName('   ')).toBe('')
    })
  })
})
