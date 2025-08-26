// === CONFIGURATION DE LA SIDEBAR ===
export interface SidebarConfig {
  sections: SidebarSection[]
  defaultState: SidebarState
  breakpoints?: SidebarBreakpoint[]
  variant?: SidebarVariant
  dimensions?: {
    compactWidth: number
    expandedWidth: number
  }
  animations?: Record<string, unknown>
}
/**
 * Types TypeScript pour la feature navigation (fusionné avec sidebar)
 * Centralisation de tous les types pour une meilleure maintenance
 */

// === ÉTATS DE LA SIDEBAR/NAVIGATION ===
export type SidebarState = 'collapsed' | 'expanded' | 'hovered'
export type SidebarBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type SidebarSection = 'header' | 'search' | 'navBase' | 'actions'
export type SidebarVariant = 'desktop' | 'mobile'

// === MODES D'AFFICHAGE ===
export type SidebarDisplayMode = 'compact' | 'expanded'
export type SidebarAnimationState = 'enter' | 'exit' | 'idle'

// === PROPS DES COMPOSANTS ===
export interface SidebarBaseProps {
  className?: string
  isExpanded?: boolean
  isCompact?: boolean
  animationDelay?: number
}

export interface SidebarDesktopProps extends SidebarBaseProps {
  variant?: 'default' | 'compact'
}

export interface SidebarMobileProps extends SidebarBaseProps {
  isOpen?: boolean
  onClose?: () => void
}

export interface SidebarHeaderProps extends SidebarBaseProps {
  variant?: SidebarVariant
}

export interface SidebarNavigationProps extends SidebarBaseProps {
  animationDelays?: {
    navBase: number
    navIncrement: number
    search: number
  }
  isMobile?: boolean
}

export interface SidebarSearchProps extends SidebarBaseProps {
  isMobile?: boolean
  placeholder?: string
}
