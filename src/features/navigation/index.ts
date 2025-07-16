// Navigation feature exports - Architecture unifiée (sidebar + navigation)
export * from './components'
export * from './hooks'

// Export sélectif pour éviter les conflits
export type {
  SidebarState,
  SidebarBreakpoint,
  SidebarSection,
  SidebarVariant,
  SidebarDisplayMode,
  SidebarAnimationState,
  SidebarBaseProps,
  SidebarDesktopProps,
  SidebarMobileProps,
  SidebarHeaderProps,
  SidebarNavigationProps,
  SidebarSearchProps,
} from './types'

// Export du composant Sidebar principal
export { Sidebar } from './Sidebar'
