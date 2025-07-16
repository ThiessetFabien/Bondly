'use client'

import { useEffect, useState } from 'react'

/**
 * Hook pour détecter et respecter les préférences d'accessibilité de l'utilisateur
 */
export function useAccessibilityPreferences() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [touchDevice, setTouchDevice] = useState(false)

  useEffect(() => {
    // Détection de la préférence de mouvement réduit
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // Détection de la préférence de contraste élevé
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(contrastQuery.matches)

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches)
    }
    contrastQuery.addEventListener('change', handleContrastChange)

    // Détection d'un appareil tactile
    setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [])

  return {
    reducedMotion,
    highContrast,
    touchDevice,
    // Classes conditionnelles pour l'accessibilité
    getAnimationClasses: (baseClasses: string) =>
      reducedMotion
        ? baseClasses
            .replace(/transition-\w+/g, '')
            .replace(/duration-\w+/g, '')
        : baseClasses,
    // Variants d'animation adaptées
    getMotionVariants: <T extends Record<string, unknown>>(
      normalVariants: T
    ): T =>
      reducedMotion
        ? {
            ...normalVariants,
            transition: { duration: 0 },
          }
        : normalVariants,
  }
}

/**
 * Hook pour la gestion des focus et navigation clavier
 */
export function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return {
    isKeyboardUser,
    focusClasses: isKeyboardUser
      ? 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      : 'focus:outline-none',
  }
}
