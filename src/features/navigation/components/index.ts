// Aliases pour compatibilité avec les anciens imports
export { SidebarDesktop as NavigationDesktop } from './desktop/SidebarDesktop.js'
export { SidebarMobile as NavigationMobile } from './mobile/SidebarMobile.js'
/**
 * Export principal des composants sidebar
 * Point d'entrée centralisé pour tous les composants
 */

// Composants desktop
export * from './desktop/index.js'

// Composants mobile
export * from './mobile/index.js'

// Composants partagés supprimés (plus de './shared')

// Export d'un composant principal unifié depuis la nouvelle structure
export { Sidebar as SidebarMain } from '../Sidebar.js'
