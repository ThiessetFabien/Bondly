'use client'

import { DesktopSidebar } from './components/desktop/index'
import { MobileHeader, MobileSidebar } from './components/mobile/index'

export const Sidebar = ({ className = '' }: { className?: string }) => {
  return (
    <>
      {/* Header mobile - affiché uniquement sur mobile */}
      <MobileHeader />

      {/* Sidebar mobile - affichée uniquement quand ouverte sur mobile */}
      <MobileSidebar />

      {/* Sidebar desktop - cachée sur mobile */}
      <DesktopSidebar className={className} />
    </>
  )
}

Sidebar.displayName = 'Sidebar'
