/**
 * Hook pour l'API des partenaires
 */
import type {
  ApiResponse,
  CreatePartnerRequest,
  GetPartnersParams,
  PaginatedResponse,
  UpdatePartnerRequest,
} from '@/lib/types'
import type { Partner } from '@/shared/types/Partner'
import { useCallback, useEffect, useState } from 'react'

export function usePartners(params: GetPartnersParams = {}) {
  const [partners, setPartners] = useState<PaginatedResponse<Partner> | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartners = async (newParams?: GetPartnersParams) => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      const finalParams = { ...params, ...newParams }

      Object.entries(finalParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/partners?${searchParams}`)
      const data: ApiResponse<PaginatedResponse<Partner>> =
        await response.json()

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
  }

  useEffect(() => {
    fetchPartners()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => fetchPartners()
  const updateParams = (newParams: GetPartnersParams) =>
    fetchPartners(newParams)

  return {
    partners,
    loading,
    error,
    refresh,
    updateParams,
  }
}

export function usePartner(id: string | null) {
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPartner = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/partners/${id}`)
      const data: ApiResponse<Partner> = await response.json()

      if (data.success && data.data) {
        setPartner(data.data)
      } else {
        setError(data.error || 'Partenaire non trouvé')
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPartner()
  }, [id, fetchPartner])

  return {
    partner,
    loading,
    error,
    refresh: fetchPartner,
  }
}

export function usePartnerMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPartner = async (
    data: CreatePartnerRequest
  ): Promise<Partner | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result: ApiResponse<Partner> = await response.json()

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

  const updatePartner = async (
    id: string,
    data: UpdatePartnerRequest
  ): Promise<Partner | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result: ApiResponse<Partner> = await response.json()

      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Erreur lors de la mise à jour')
        return null
      }
    } catch {
      setError('Erreur réseau')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deletePartner = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/partners/${id}`, {
        method: 'DELETE',
      })

      const result: ApiResponse<null> = await response.json()

      if (result.success) {
        return true
      } else {
        setError(result.error || 'Erreur lors de la suppression')
        return false
      }
    } catch {
      setError('Erreur réseau')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    createPartner,
    updatePartner,
    deletePartner,
    loading,
    error,
  }
}
