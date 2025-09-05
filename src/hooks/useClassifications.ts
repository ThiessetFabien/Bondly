/**
 * Hook pour l'API des classifications
 */
import type { ApiResponse } from '@/lib/types'
import type { Classification } from '@/services/api/classifications'
import { useEffect, useState } from 'react'

export function useClassifications() {
  const [classifications, setClassifications] = useState<Classification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClassifications = async (withUsageCount = false) => {
    try {
      setLoading(true)
      setError(null)

      const url = withUsageCount
        ? '/api/classifications?withUsageCount=true'
        : '/api/classifications'

      const response = await fetch(url)
      const data: ApiResponse<Classification[]> = await response.json()

      if (data.success && data.data) {
        setClassifications(data.data)
      } else {
        setError(
          data.error || 'Erreur lors de la récupération des classifications'
        )
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClassifications()
  }, [])

  const refresh = () => fetchClassifications()
  const refreshWithCount = () => fetchClassifications(true)

  return {
    classifications,
    loading,
    error,
    refresh,
    refreshWithCount,
  }
}

export function useClassificationSearch() {
  const [results, setResults] = useState<Classification[]>([])
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
        `/api/classifications?search=${encodeURIComponent(query)}`
      )
      const data: ApiResponse<Classification[]> = await response.json()

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

export function useClassificationMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createClassification = async (
    name: string
  ): Promise<Classification | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/classifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const result: ApiResponse<Classification> = await response.json()

      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Erreur lors de la création')
        return null
      }
    } catch {
      setError('Erreur réseau')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createClassification,
    loading,
    error,
  }
}
