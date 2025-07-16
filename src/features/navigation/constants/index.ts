/**
 * Constantes optimisées pour la sidebar
 * Centralisation pour éviter la duplication et améliorer la maintenabilité
 */

// === DIMENSIONS ===
export const SIDEBAR_DIMENSIONS = {
  COMPACT_WIDTH: 64,
  EXPANDED_WIDTH: 320,
  HEADER_HEIGHT: 64,
  MOBILE_HEADER_HEIGHT: 64,
  TOUCH_TARGET_MIN: 44,
  TOUCH_TARGET_COMFORTABLE: 48,
} as const

// === BREAKPOINTS ===
export const SIDEBAR_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// === Z-INDEX ===
export const SIDEBAR_Z_INDEX = {
  MOBILE_HEADER: 1000,
  OVERLAY: 1001,
  DESKTOP: 1002,
  TOOLTIP: 1003,
  DROPDOWN: 1004,
  MODAL: 1005,
} as const

// === ANIMATIONS ===
export const SIDEBAR_ANIMATIONS = {
  // Délais d'animation (en secondes)
  DELAYS: {
    header: 0.05,
    search: 0.1,
    navBase: 0.15,
    navIncrement: 0.04,
    actions: 0.2,
  },

  // Durées d'animation (en secondes)
  DURATIONS: {
    sidebar: 0.3,
    component: 0.2,
    hover: 0.15,
    mobile: 0.3,
  },

  // Easings optimisés
  EASINGS: {
    sidebar: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-out
    component: 'cubic-bezier(0.0, 0, 0.2, 1)', // ease-out
    hover: 'cubic-bezier(0.4, 0, 1, 1)', // ease-in
  },
} as const

// === VARIANTS FRAMER MOTION ===
export const SIDEBAR_MOTION_VARIANTS = {
  sidebar: {
    expanded: {
      width: SIDEBAR_DIMENSIONS.EXPANDED_WIDTH,
      transition: {
        duration: SIDEBAR_ANIMATIONS.DURATIONS.sidebar,
        ease: SIDEBAR_ANIMATIONS.EASINGS.sidebar,
      },
    },
    collapsed: {
      width: SIDEBAR_DIMENSIONS.COMPACT_WIDTH,
      transition: {
        duration: SIDEBAR_ANIMATIONS.DURATIONS.sidebar,
        ease: SIDEBAR_ANIMATIONS.EASINGS.sidebar,
      },
    },
  },

  content: {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: SIDEBAR_ANIMATIONS.DURATIONS.component,
        ease: SIDEBAR_ANIMATIONS.EASINGS.component,
      },
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        duration: SIDEBAR_ANIMATIONS.DURATIONS.component,
        ease: SIDEBAR_ANIMATIONS.EASINGS.component,
      },
    },
  },

  mobile: {
    enter: {
      x: 0,
      opacity: 1,
      transition: {
        duration: SIDEBAR_ANIMATIONS.DURATIONS.mobile,
        ease: SIDEBAR_ANIMATIONS.EASINGS.sidebar,
      },
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: {
        duration: SIDEBAR_ANIMATIONS.DURATIONS.mobile,
        ease: SIDEBAR_ANIMATIONS.EASINGS.sidebar,
      },
    },
  },

  overlay: {
    enter: {
      opacity: 1,
      transition: {
        duration: SIDEBAR_ANIMATIONS.DURATIONS.component,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: SIDEBAR_ANIMATIONS.DURATIONS.component,
      },
    },
  },
} as const

// === CLASSES CSS OPTIMISÉES ===
export const SIDEBAR_CLASSES = {
  // Classes de base
  BASE: 'sidebar-core sidebar-gpu-accelerated',
  DESKTOP: 'sidebar-desktop',
  MOBILE: 'sidebar-mobile',

  // États
  COLLAPSED: 'sidebar-collapsed',
  EXPANDED: 'sidebar-expanded',

  // Sections
  HEADER: 'sidebar-header',
  CONTENT: 'sidebar-content',
  FOOTER: 'sidebar-footer',

  // Navigation
  NAV: 'sidebar-nav',
  NAV_ITEM: 'nav-item-base',
  NAV_ITEM_ACTIVE: 'nav-item-active',

  // Responsive
  RESPONSIVE_MARGIN: 'sidebar-responsive-margin',
  RESPONSIVE_MARGIN_EXPANDED: 'sidebar-responsive-margin-expanded',
} as const

// === ARIA LABELS ===
export const SIDEBAR_ARIA = {
  MAIN_NAV: 'Navigation principale',
  MOBILE_NAV: 'Navigation mobile',
  CLOSE_MOBILE: 'Fermer la navigation mobile',
  OPEN_MOBILE: 'Ouvrir la navigation mobile',
  TOGGLE_SIDEBAR: 'Basculer la sidebar',
  SEARCH: 'Rechercher dans les classifications',
  SETTINGS: 'Ouvrir les paramètres',
  LOGOUT: 'Se déconnecter',
} as const

// === TYPES POUR TYPESCRIPT ===
export type SidebarState = 'collapsed' | 'expanded' | 'hovered'
export type SidebarBreakpoint = keyof typeof SIDEBAR_BREAKPOINTS
export type SidebarSection = 'header' | 'search' | 'navBase' | 'actions'

// === UTILITAIRES ===
export const getSidebarWidth = (isExpanded: boolean): number =>
  isExpanded
    ? SIDEBAR_DIMENSIONS.EXPANDED_WIDTH
    : SIDEBAR_DIMENSIONS.COMPACT_WIDTH

export const getSidebarMarginClasses = (isExpanded: boolean): string =>
  isExpanded
    ? SIDEBAR_CLASSES.RESPONSIVE_MARGIN_EXPANDED
    : SIDEBAR_CLASSES.RESPONSIVE_MARGIN

export const getAnimationDelay = (
  section: SidebarSection,
  index?: number
): number => {
  const baseDelay = SIDEBAR_ANIMATIONS.DELAYS[section] || 0
  const increment =
    index !== undefined ? index * SIDEBAR_ANIMATIONS.DELAYS.navIncrement : 0
  return baseDelay + increment
}
