'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectNavigationDesktopExpanded,
  selectNavigationHovered,
  selectNavigationMobileOpen,
  setNavigationDesktopExpanded,
  setNavigationHovered,
  setNavigationMobileOpen,
  toggleNavigationDesktop,
  toggleNavigationMobile,
} from '@/store/slices/uiSlice'
import { useCallback } from 'react'

/**
 * Hook unifié pour la gestion de l'état navigation
 * Utilise le store Redux centralisé (fusion sidebar + navigation)
 */
export function useNavigationState() {
  const dispatch = useAppDispatch()

  // ✅ États centralisés dans Redux store
  const isDesktopExpanded = useAppSelector(selectNavigationDesktopExpanded)
  const isMobileOpen = useAppSelector(selectNavigationMobileOpen)
  const isHovered = useAppSelector(selectNavigationHovered)

  // Actions desktop
  const toggleExpanded = useCallback(() => {
    dispatch(toggleNavigationDesktop())
  }, [dispatch])

  const setExpanded = useCallback(
    (expanded: boolean) => {
      dispatch(setNavigationDesktopExpanded(expanded))
    },
    [dispatch]
  )

  // Actions mobile
  const toggleMobileOpen = useCallback(() => {
    dispatch(toggleNavigationMobile())
  }, [dispatch])

  const setMobileOpen = useCallback(
    (open: boolean) => {
      dispatch(setNavigationMobileOpen(open))
    },
    [dispatch]
  )

  // Actions hover (pour auto-expansion)
  const setHovered = useCallback(
    (hovered: boolean) => {
      dispatch(setNavigationHovered(hovered))
    },
    [dispatch]
  )

  return {
    // États depuis Redux store (100% centralisé)
    isDesktopExpanded,
    isMobileOpen,
    isHovered,

    // Actions qui modifient le store Redux
    toggleExpanded,
    setExpanded,
    toggleMobileOpen,
    setMobileOpen,
    setHovered,

    // États calculés
    isDesktopVisible: isDesktopExpanded || isHovered,
  }
}
