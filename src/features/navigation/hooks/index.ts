'use client'

import { useDashboard } from '@/store/context/DashboardContext'
import { useCallback, useMemo } from 'react'

/**
 * Hook optimisé pour la gestion du layout de la sidebar
 * Utilise la nouvelle API de navigation (sans compact)
 */
export function useSidebarState() {
  const { state, dispatch } = useDashboard()
  const isExpanded = state.sidebar.isExpanded
  const isHovered = state.sidebar.isHovered

  // Actions pour contrôler la sidebar
  const toggleExpanded = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR_EXPANDED' })
  }, [dispatch])

  const setHovered = useCallback(
    (hovered: boolean) => {
      dispatch({ type: 'SET_SIDEBAR_HOVERED', payload: hovered })
    },
    [dispatch]
  )

  return {
    isExpanded,
    isHovered,
    toggleExpanded,
    setHovered,
    sidebarClasses: isExpanded ? 'sidebar-expanded' : 'sidebar-compact',
    contentMarginClasses: isExpanded
      ? 'sidebar-responsive-margin-expanded'
      : 'sidebar-responsive-margin',
    sidebarWidth: isExpanded ? 320 : 64,
  }
  // ...existing code...
}

/**
 * Hook pour les constantes d'animation optimisées
 * Évite la recréation des objets à chaque render
 */
export function useSidebarAnimations() {
  return useMemo(
    () => ({
      DELAYS: {
        header: 0.05,
        search: 0.1,
        navBase: 0.15,
        navIncrement: 0.04,
        actions: 0.2,
      },
      DURATIONS: {
        sidebar: 0.3,
        component: 0.2,
        hover: 0.15,
      },
      EASINGS: {
        sidebar: 'easeInOut',
        component: 'easeOut',
        hover: 'easeOut',
      },
      VARIANTS: {
        sidebar: {
          expanded: { width: '320px' },
          compact: { width: '64px' },
        },
        content: {
          visible: { opacity: 1, x: 0 },
          hidden: { opacity: 0, x: -10 },
        },
        icon: {
          active: { scale: 1.1, rotate: 0 },
          inactive: { scale: 1, rotate: 0 },
        },
      },
    }),
    []
  )
}

/**
 * Hook pour la gestion des classes CSS responsive
 * Optimisé pour éviter les problèmes d'hydratation
 */
export function useSidebarResponsive() {
  const { isExpanded } = useSidebarState()

  return useMemo(
    () => ({
      // Classes pour le contenu principal
      mainContentClasses: [
        'flex',
        'flex-col',
        'min-h-screen',
        'pt-16', // Marge top pour mobile header
        'lg:pt-0', // Pas de marge sur desktop
        isExpanded ? 'lg:ml-80' : 'lg:ml-16', // Marge adaptive (80 = 320px, 16 = 64px)
        'transition-all',
        'duration-300',
        'ease-in-out',
        'z-content-base',
      ].join(' '),

      // Classes pour les overlays
      overlayClasses: [
        'fixed',
        'inset-0',
        'bg-black/50',
        'backdrop-blur-sm',
        'z-overlay',
        'lg:hidden',
      ].join(' '),

      // Classes pour les animations d'entrée
      enterClasses: ['animate-in', 'slide-in-from-left', 'duration-300'].join(
        ' '
      ),

      // Classes pour les animations de sortie
      exitClasses: ['animate-out', 'slide-out-to-left', 'duration-300'].join(
        ' '
      ),
    }),
    [isExpanded]
  )
}

// Export du nouveau hook pour les interactions
export * from './interactions'
