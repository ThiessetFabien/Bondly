/**
 * Hook pour l'API des professions
 */
import type { ApiResponse, Profession } from '@/lib/types'
import { useEffect, useState } from 'react'

export function useProfessions() {
  const [professions, setProfessions] = useState<Profession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessions = async (category?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (category) params.append('category', category)

      const url = `/api/professions${params.toString() ? `?${params}` : ''}`
      const response = await fetch(url)
      const data: ApiResponse<Profession[]> = await response.json()

      if (data.success && data.data) {
        setProfessions(data.data)
      } else {
        setError(data.error || 'Erreur lors de la récupération des professions')
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfessions()
  }, [])

  const refresh = () => fetchProfessions()
  const filterByCategory = (category: string) => fetchProfessions(category)

  return {
    professions,
    loading,
    error,
    refresh,
    filterByCategory,
  }
}

export function useProfessionSearch() {
  const [results, setResults] = useState<Profession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/professions?search=${encodeURIComponent(query)}`
      )
      const data: ApiResponse<Profession[]> = await response.json()

      if (data.success && data.data) {
        setResults(data.data)
      } else {
        setError(data.error || 'Erreur lors de la recherche')
        setResults([])
      }
    } catch {
      setError('Erreur réseau')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return {
    results,
    loading,
    error,
    search,
  }
}
