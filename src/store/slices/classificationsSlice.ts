/**
 * Classifications Slice pour la gestion des classifications des partenaires
 * Gère les catégories et filtres de classification
 */

import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { UiState } from './uiSlice'

export interface Classification {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly color?: string
  readonly icon?: string
}

export interface ClassificationsState {
  classifications: Classification[]
  activeClassification: string | null
  loading: boolean
  error: string | null
}

const initialState: ClassificationsState = {
  classifications: [],
  activeClassification: null,
  loading: false,
  error: null,
}

export const classificationsSlice = createSlice({
  name: 'classifications',
  initialState,
  reducers: {
    setClassifications: (state, action: PayloadAction<Classification[]>) => {
      state.classifications = action.payload
      state.loading = false
      state.error = null
    },
    setActiveClassification: (state, action: PayloadAction<string | null>) => {
      state.activeClassification = action.payload
    },
    addClassification: (state, action: PayloadAction<Classification>) => {
      state.classifications.push(action.payload)
    },
    removeClassification: (state, action: PayloadAction<string>) => {
      const index = state.classifications.findIndex(
        c => c.id === action.payload
      )
      if (index !== -1) {
        state.classifications.splice(index, 1)
      }
      if (state.activeClassification === action.payload) {
        state.activeClassification = null
      }
    },
    updateClassification: (state, action: PayloadAction<Classification>) => {
      const index = state.classifications.findIndex(
        c => c.id === action.payload.id
      )
      if (index !== -1) {
        state.classifications[index] = action.payload
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
    clearError: state => {
      state.error = null
    },
  },
})

export const {
  setClassifications,
  setActiveClassification,
  addClassification,
  removeClassification,
  updateClassification,
  setLoading,
  setError,
  clearError,
} = classificationsSlice.actions

// Sélecteurs
export const selectClassifications = (state: {
  classifications: ClassificationsState
}) => state.classifications.classifications

export const selectActiveClassification = (state: {
  classifications: ClassificationsState
}) => state.classifications.activeClassification

export const selectClassificationsLoading = (state: {
  classifications: ClassificationsState
}) => state.classifications.loading

export const selectClassificationsError = (state: {
  classifications: ClassificationsState
}) => state.classifications.error

// Sélecteur pour les classifications filtrées
export const selectFilteredClassifications = (state: {
  classifications: ClassificationsState
  ui: UiState
}) => {
  const classifications = state.classifications.classifications
  const searchTerm = state.ui.searchTerm

  if (!searchTerm.trim()) return classifications

  const searchLower = searchTerm.toLowerCase()
  return classifications.filter(
    classification =>
      classification.name.toLowerCase().includes(searchLower) ||
      (classification.description &&
        classification.description.toLowerCase().includes(searchLower))
  )
}

// Actions pour compatibilité avec les anciens noms
export const selectSelectedClassification = selectActiveClassification
export const setSelectedClassification = setActiveClassification

// Action pour fetch - à implémenter avec RTK Query ou thunk si nécessaire
export const fetchClassifications =
  () =>
  async (dispatch: (action: { type: string; payload?: unknown }) => void) => {
    dispatch(setLoading(true))
    try {
      // Pour l'instant, on charge des classifications par défaut
      const defaultClassifications: Classification[] = [
        {
          id: 'legal',
          name: 'Juridique',
          description: 'Notaires, avocats, juristes',
          color: '#3B82F6',
          icon: 'gavel',
        },
        {
          id: 'finance',
          name: 'Finance',
          description: 'Banquiers, comptables',
          color: '#10B981',
          icon: 'calculator',
        },
        {
          id: 'real-estate',
          name: 'Immobilier',
          description: 'Agents immobiliers, promoteurs',
          color: '#F59E0B',
          icon: 'home',
        },
        {
          id: 'business',
          name: 'Affaires',
          description: 'Entrepreneurs, consultants',
          color: '#8B5CF6',
          icon: 'briefcase',
        },
      ]
      dispatch(setClassifications(defaultClassifications))
      return { unwrap: () => defaultClassifications }
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : 'Erreur inconnue')
      )
      throw error
    }
  }

export default classificationsSlice.reducer
