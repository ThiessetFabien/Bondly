import { normalizeKey } from '@/shared/utils/formatStrings'
import partnersData from '../../../data/partners.json' with { type: 'json' }
import type { Partner } from '../../../shared/types/Partner'
import { useDashboard } from '../../../store/context/DashboardContext'

export function useSortedPartners() {
  const partners: Partner[] = partnersData.partners
  const { state } = useDashboard()
  const { statusFilter, sortOrder, sortBy, searchTerm, activeClassification } =
    state

  const matchesStatus = (
    partner: Pick<Partner, 'status'>,
    statusFilter: string
  ) => !statusFilter || partner.status === statusFilter

  const matchesSearch = (
    partner: Pick<
      Partner,
      'firstName' | 'lastName' | 'profession' | 'company' | 'email' | 'phone'
    >,
    searchTerm: string
  ) => {
    const normalizedSearch = normalizeKey(searchTerm)

    interface MatchSearchFn {
      (partnerField: string, searchTerm: string): boolean
    }

    const matchSearch: MatchSearchFn = (partnerField, searchTerm) => {
      return normalizeKey(partnerField).includes(normalizeKey(searchTerm))
    }

    if (!normalizedSearch) return true
    return (
      matchSearch(partner.firstName, normalizedSearch) ||
      matchSearch(partner.lastName, normalizedSearch) ||
      matchSearch(partner.profession, normalizedSearch) ||
      matchSearch(partner.company, normalizedSearch) ||
      matchSearch(partner.email, normalizedSearch) ||
      matchSearch(partner.phone, normalizedSearch)
    )
  }

  const matchesClassification = (
    partner: Pick<Partner, 'classifications'>,
    activeClassification: string
  ) => {
    if (!activeClassification) return true
    const normalizedClassifications = (partner.classifications ?? []).map(c =>
      normalizeKey(c.trim())
    )
    return normalizedClassifications.includes(activeClassification)
  }

  // Filtrage amélioré
  const filteredPartners = partners.filter(
    (partner: Partner) =>
      matchesStatus(partner, statusFilter) &&
      matchesSearch(partner, searchTerm) &&
      matchesClassification(partner, activeClassification)
  )

  const sortedPartners = [...filteredPartners].sort((a, b) => {
    switch (sortBy) {
      case 'company': {
        const aValue = a.company.toLowerCase()
        const bValue = b.company.toLowerCase()
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      case 'rating':
        return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
      case 'relations': {
        const aCount = a.relations?.length ?? 0
        const bCount = b.relations?.length ?? 0
        return sortOrder === 'asc' ? aCount - bCount : bCount - aCount
      }
      default:
        return 0
    }
  })

  return { sortedPartners, filteredPartners }
}
