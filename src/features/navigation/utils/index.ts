/**
 * Utilitaires pour la feature sidebar
 * Fonctions helper réutilisables
 */

import {
  SIDEBAR_ANIMATIONS,
  SIDEBAR_BREAKPOINTS,
  SIDEBAR_DIMENSIONS,
} from '../constants'
import type { SidebarBreakpoint, SidebarConfig, SidebarSection } from '../types'

// === CALCULS DE DIMENSIONS ===

/**
 * Obtient la largeur de la sidebar selon son état
 */
export const getSidebarWidth = (isExpanded: boolean): number =>
  isExpanded
    ? SIDEBAR_DIMENSIONS.EXPANDED_WIDTH
    : SIDEBAR_DIMENSIONS.COMPACT_WIDTH

/**
 * Obtient les classes CSS de marge pour le contenu principal
 */
export const getSidebarMarginClasses = (isExpanded: boolean): string =>
  isExpanded
    ? 'lg:ml-80' // 320px = w-80
    : 'lg:ml-16' // 64px = w-16

/**
 * Calcule la largeur disponible pour le contenu
 */
export const getContentWidth = (
  viewportWidth: number,
  isExpanded: boolean
): number => {
  const sidebarWidth = getSidebarWidth(isExpanded)
  return Math.max(0, viewportWidth - sidebarWidth)
}

// === GESTION DES BREAKPOINTS ===

/**
 * Détermine le breakpoint actuel selon la largeur
 */
export const getCurrentBreakpoint = (width: number): SidebarBreakpoint => {
  if (width >= SIDEBAR_BREAKPOINTS['2xl']) return '2xl'
  if (width >= SIDEBAR_BREAKPOINTS.xl) return 'xl'
  if (width >= SIDEBAR_BREAKPOINTS.lg) return 'lg'
  if (width >= SIDEBAR_BREAKPOINTS.md) return 'md'
  return 'sm'
}

/**
 * Vérifie si un breakpoint est actif
 */
export const isBreakpointActive = (
  currentWidth: number,
  targetBreakpoint: SidebarBreakpoint
): boolean => {
  return currentWidth >= SIDEBAR_BREAKPOINTS[targetBreakpoint]
}

/**
 * Vérifie si on est en mode mobile
 */
export const isMobileBreakpoint = (width: number): boolean =>
  width < SIDEBAR_BREAKPOINTS.lg

/**
 * Vérifie si on est en mode desktop
 */
export const isDesktopBreakpoint = (width: number): boolean =>
  width >= SIDEBAR_BREAKPOINTS.lg

// === GESTION DES ANIMATIONS ===

/**
 * Calcule le délai d'animation pour une section
 */
export const getAnimationDelay = (
  section: SidebarSection,
  index?: number
): number => {
  const baseDelay = SIDEBAR_ANIMATIONS.DELAYS[section] || 0
  const increment =
    index !== undefined ? index * SIDEBAR_ANIMATIONS.DELAYS.navIncrement : 0
  return baseDelay + increment
}

/**
 * Génère les variants Framer Motion pour la sidebar
 */
export const getSidebarVariants = () => ({
  expanded: {
    width: SIDEBAR_DIMENSIONS.EXPANDED_WIDTH,
    transition: {
      duration: SIDEBAR_ANIMATIONS.DURATIONS.sidebar,
      ease: 'easeInOut',
    },
  },
  compact: {
    width: SIDEBAR_DIMENSIONS.COMPACT_WIDTH,
    transition: {
      duration: SIDEBAR_ANIMATIONS.DURATIONS.sidebar,
      ease: 'easeInOut',
    },
  },
})

/**
 * Génère les variants pour le contenu
 */
export const getContentVariants = () => ({
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: SIDEBAR_ANIMATIONS.DURATIONS.component,
      ease: 'easeOut',
    },
  },
  hidden: {
    opacity: 0,
    x: -10,
    transition: {
      duration: SIDEBAR_ANIMATIONS.DURATIONS.component,
      ease: 'easeOut',
    },
  },
})

// === GESTION DES CLASSES CSS ===

/**
 * Génère les classes pour le container de la sidebar
 */
export const getSidebarContainerClasses = (
  isExpanded: boolean,
  isCompact: boolean,
  variant: 'desktop' | 'mobile' = 'desktop'
): string => {
  const baseClasses = ['sidebar-core', 'sidebar-gpu-accelerated']

  if (variant === 'desktop') {
    baseClasses.push('sidebar-desktop')
  } else {
    baseClasses.push('sidebar-mobile')
  }

  if (isExpanded) {
    baseClasses.push('sidebar-expanded')
  } else if (isCompact) {
    baseClasses.push('sidebar-compact')
  }

  return baseClasses.join(' ')
}

/**
 * Génère les classes pour les éléments de navigation
 */
export const getNavItemClasses = (
  isActive: boolean,
  isCompact: boolean
): string => {
  const baseClasses = ['nav-item-base']

  if (isActive) {
    baseClasses.push('nav-item-active')
  }

  if (isCompact) {
    baseClasses.push('nav-item-compact')
  } else {
    baseClasses.push('nav-item-expanded')
  }

  return baseClasses.join(' ')
}

// === UTILITAIRES DE PERFORMANCE ===

/**
 * Debounce une fonction (utile pour resize events)
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle une fonction (utile pour scroll events)
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// === VALIDATION ET HELPERS ===

/**
 * Valide la configuration de la sidebar
 */
export const validateSidebarConfig = (
  config: Partial<SidebarConfig>
): boolean => {
  // Validation basique
  if (!config.dimensions || !config.animations) {
    return false
  }

  // Validation des dimensions
  const { compactWidth, expandedWidth } = config.dimensions
  if (compactWidth >= expandedWidth) {
    console.warn('Sidebar: compactWidth should be less than expandedWidth')
    return false
  }

  return true
}

/**
 * Formate les pixels en rem
 */
export const pxToRem = (px: number, baseFontSize: number = 16): string =>
  `${px / baseFontSize}rem`

/**
 * Convertit les classes Tailwind en valeurs CSS
 */
export const tailwindToCSS = {
  'w-16': '64px',
  'w-80': '320px',
  'ml-16': '64px',
  'ml-80': '320px',
} as const

// === EXPORT GROUPÉ ===
export const sidebarUtils = {
  // Dimensions
  getSidebarWidth,
  getSidebarMarginClasses,
  getContentWidth,

  // Breakpoints
  getCurrentBreakpoint,
  isBreakpointActive,
  isMobileBreakpoint,
  isDesktopBreakpoint,

  // Animations
  getAnimationDelay,
  getSidebarVariants,
  getContentVariants,

  // Classes CSS
  getSidebarContainerClasses,
  getNavItemClasses,

  // Performance
  debounce,
  throttle,

  // Validation
  validateSidebarConfig,
  pxToRem,
}
