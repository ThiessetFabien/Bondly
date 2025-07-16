// Aliases pour compatibilité avec les anciens imports
export { SidebarDesktop as NavigationDesktop } from './desktop/Desktop'
export { SidebarMobile as NavigationMobile } from './mobile/Mobile'
/**
 * Export principal des composants sidebar
 * Point d'entrée centralisé pour tous les composants
 */

// Composants desktop
export * from './desktop'

// Composants mobile
export * from './mobile'

// Composants partagés
export * from './shared'

// Export d'un composant principal unifié depuis la nouvelle structure
export { Sidebar as SidebarMain } from '../Sidebar'
