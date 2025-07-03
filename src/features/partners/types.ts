// Types strictes pour les partenaires selon les specs RPM-CL
import type { PartnerStatus, RatingValue } from '@/types/global'

export interface Partner {
  readonly id: string
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly company: string
  readonly profession: string
  readonly rating: RatingValue
  readonly status: PartnerStatus
  readonly notes?: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly classifications: readonly string[]
  readonly relationHistory?: readonly PartnerRelation[]
}

export interface PartnerRelation {
  readonly id: string
  readonly clientName: string
  readonly type: 'sent' | 'received'
  readonly date: string
  readonly notes?: string
}

export interface PartnerFormData {
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly company: string
  readonly profession: string
  readonly rating: RatingValue
  readonly notes?: string
  readonly classifications: readonly string[]
}

export interface PartnerFilters {
  readonly search?: string
  readonly profession?: string
  readonly rating?: RatingValue
  readonly status?: PartnerStatus
  readonly classifications?: readonly string[]
}

export interface PartnerCardProps {
  readonly partner: Partner
  readonly onEdit: (id: string) => void
  readonly onArchive: (id: string) => void
  readonly onCall: (phone: string) => void
  readonly onEmail: (email: string) => void
}

// Types pour les hooks avec gestion d'état stricte
export interface UsePartnersState {
  readonly partners: readonly Partner[]
  readonly isLoading: boolean
  readonly error: string | null
  readonly filters: PartnerFilters
  readonly pagination: {
    readonly page: number
    readonly limit: number
    readonly total: number
    readonly totalPages: number
  }
}

export interface UsePartnerFormState {
  readonly formData: PartnerFormData
  readonly errors: Partial<Record<keyof PartnerFormData, string>>
  readonly touched: Partial<Record<keyof PartnerFormData, boolean>>
  readonly isSubmitting: boolean
  readonly isValid: boolean
}
