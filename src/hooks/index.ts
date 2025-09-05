/**
 * Hook principal pour l'API Bondly
 * Combine toutes les fonctionnalités API
 */
export {
  useClassificationMutations,
  useClassificationSearch,
  useClassifications,
} from './useClassifications'
export {
  useAdvancedSearch,
  useDashboardStats,
  useGlobalSearch,
  useRecentPartners,
  useTopRatedPartners,
} from './useDashboard'
export { usePartner, usePartnerMutations, usePartners } from './usePartners'
export { useProfessionSearch, useProfessions } from './useProfessions'

// Types réexportés pour faciliter l'utilisation
export type {
  ApiResponse,
  CreatePartnerRequest,
  DashboardStats,
  GetPartnersParams,
  PaginatedResponse,
  Partner,
  Profession,
  UpdatePartnerRequest,
} from '@/lib/types'

export type { Classification } from '@/services/api/classifications'
