/**
 * UI Slice pour la gestion de l'état de l'interface utilisateur
 * Gère la navigation mobile/desktop (fusion sidebar + navigation)
 */

import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface UiState {
  readonly navigation: {
    readonly isMobileOpen: boolean
    readonly isDesktopExpanded: boolean
    readonly isHovered: boolean
  }
  readonly searchTerm: string
}

const initialState: UiState = {
  navigation: {
    isMobileOpen: false,
    isDesktopExpanded: false, // Par défaut fermée pour éco-conception
    isHovered: false,
  },
  searchTerm: '',
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Actions navigation mobile
    toggleNavigationMobile: state => {
      state.navigation.isMobileOpen = !state.navigation.isMobileOpen
    },
    setNavigationMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.navigation.isMobileOpen = action.payload
    },

    // Actions navigation desktop
    toggleNavigationDesktop: state => {
      state.navigation.isDesktopExpanded = !state.navigation.isDesktopExpanded
    },
    setNavigationDesktopExpanded: (state, action: PayloadAction<boolean>) => {
      state.navigation.isDesktopExpanded = action.payload
    },

    // Actions hover (pour auto-expansion)
    setNavigationHovered: (state, action: PayloadAction<boolean>) => {
      state.navigation.isHovered = action.payload
    },

    // Actions recherche
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    clearSearch: state => {
      state.searchTerm = ''
    },

    // Actions de compatibilité (transition depuis ancienne API)
    toggleMobile: state => {
      state.navigation.isMobileOpen = !state.navigation.isMobileOpen
    },
    toggleExpanded: state => {
      state.navigation.isDesktopExpanded = !state.navigation.isDesktopExpanded
    },
  },
})

export const {
  // Actions principales navigation
  toggleNavigationMobile,
  setNavigationMobileOpen,
  toggleNavigationDesktop,
  setNavigationDesktopExpanded,
  setNavigationHovered,

  // Actions recherche
  setSearchTerm,
  clearSearch,

  // Actions compatibilité
  toggleMobile,
  toggleExpanded,
} = uiSlice.actions

// Sélecteurs navigation centralisés
export const selectNavigationMobileOpen = (state: { ui: UiState }) =>
  state.ui.navigation.isMobileOpen

export const selectNavigationDesktopExpanded = (state: { ui: UiState }) =>
  state.ui.navigation.isDesktopExpanded

export const selectNavigationHovered = (state: { ui: UiState }) =>
  state.ui.navigation.isHovered

export const selectSearchTerm = (state: { ui: UiState }) => state.ui.searchTerm

// Sélecteurs de compatibilité (pour migration en douceur)
export const selectSidebarMobileOpen = selectNavigationMobileOpen
export const selectSidebarExpanded = selectNavigationDesktopExpanded
export const selectSidebarHovered = selectNavigationHovered

// Sélecteurs composés
export const selectNavigationDesktopVisible = (state: { ui: UiState }) =>
  state.ui.navigation.isDesktopExpanded || state.ui.navigation.isHovered

// Actions de compatibilité pour migration
export const setSidebarMobileOpen = setNavigationMobileOpen
export const setSidebarExpanded = setNavigationDesktopExpanded

export default uiSlice.reducer
