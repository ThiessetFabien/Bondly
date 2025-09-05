/**
 * Hook pour les statistiques du dashboard
 */
import type { ApiResponse, DashboardStats, Partner } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/stats')
      const data: ApiResponse<DashboardStats> = await response.json()

      if (data.success && data.data) {
        setStats(data.data)
      } else {
        setError(
          data.error || 'Erreur lors de la récupération des statistiques'
        )
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refresh = () => fetchStats()

  return {
    stats,
    loading,
    error,
    refresh,
  }
}

/**
 * Hook pour les partenaires les mieux notés
 */
export function useTopRatedPartners(limit: number = 10) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/dashboard/top-partners?limit=${limit}`)
      const data: ApiResponse<Partner[]> = await response.json()

      if (data.success && data.data) {
        setPartners(data.data)
      } else {
        setError(data.error || 'Erreur lors de la récupération des partenaires')
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  return {
    partners,
    loading,
    error,
    refresh: fetchPartners,
  }
}

/**
 * Hook pour les partenaires récents
 */
export function useRecentPartners(limit: number = 10) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/dashboard/recent-partners?limit=${limit}`
      )
      const data: ApiResponse<Partner[]> = await response.json()

      if (data.success && data.data) {
        setPartners(data.data)
      } else {
        setError(data.error || 'Erreur lors de la récupération des partenaires')
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  return {
    partners,
    loading,
    error,
    refresh: fetchPartners,
  }
}

/**
 * Hook pour la recherche globale
 */
export function useGlobalSearch() {
  const [results, setResults] = useState<{
    partners?: unknown
    classifications?: unknown
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (
    query: string,
    type: 'all' | 'partners' | 'classifications' = 'all'
  ) => {
    if (!query.trim() || query.length < 2) {
      setResults(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        q: query.trim(),
        type,
      })

      const response = await fetch(`/api/search?${params}`)
      const data: ApiResponse<{
        partners?: unknown
        classifications?: unknown
      }> = await response.json()

      if (data.success && data.data) {
        setResults(data.data)
      } else {
        setError(data.error || 'Erreur lors de la recherche')
        setResults(null)
      }
    } catch {
      setError('Erreur réseau')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setResults(null)
    setError(null)
  }

  return {
    results,
    loading,
    error,
    search,
    clear,
  }
}

/**
 * Hook pour la recherche avancée
 */
export function useAdvancedSearch() {
  const [results, setResults] = useState<{
    data?: unknown
    pagination?: unknown
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (filters: {
    search?: string
    statuses?: string[]
    classifications?: string[]
    jobs?: string[]
    ratingMin?: number
    ratingMax?: number
    dateFrom?: string
    dateTo?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/search/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      })

      const data: ApiResponse<{
        data?: unknown
        pagination?: unknown
      }> = await response.json()

      if (data.success && data.data) {
        setResults(data.data)
      } else {
        setError(data.error || 'Erreur lors de la recherche avancée')
        setResults(null)
      }
    } catch {
      setError('Erreur réseau')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setResults(null)
    setError(null)
  }

  return {
    results,
    loading,
    error,
    search,
    clear,
  }
}
