/**
 * Index des types partagés pour RPM-CL - VERSION FONCTIONNELLE
 * Export minimal pour éviter le code mort
 */

// Types de base toujours disponibles
export interface ApiResponse<T = unknown> {
  readonly data: T
  readonly success: boolean
  readonly message?: string
  readonly errors?: readonly string[]
}

// Type Partner de base
export interface Partner {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly website?: string
  readonly email?: string
  readonly phone?: string
  readonly address?: string
  readonly classifications: readonly string[]
  readonly isActive: boolean
  readonly createdAt: string
  readonly updatedAt: string
}

// Export par défaut pour éviter le fichier vide
export const SHARED_TYPES_INFO = {
  name: 'shared-types',
  version: '1.0.0',
  description: 'Types partagés RPM-CL - Version fonctionnelle',
} as const
