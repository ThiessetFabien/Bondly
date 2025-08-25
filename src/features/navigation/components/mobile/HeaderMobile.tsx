'use client'

import { ActionButton } from '@/shared/components/buttons/ActionButton'
import { Croix } from '@/shared/components/icons/Croix.svg'
import { LogoWithText } from '@/shared/components/logos/LogoWithText'
import { cnIconLg } from '@/shared/styles/icons.styles'
import { useDashboard } from '@/store/context/DashboardContext'
import { Menu } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigationInteractions } from '../../hooks/interactions'

export function SidebarMobileHeader() {
  const { state, dispatch } = useDashboard()
  const { isMobileOpen } = state.sidebar
  const { handleMenuToggle } = useNavigationInteractions()

  const toggleMobileOpen = useCallback(() => {
    handleMenuToggle() // Ajoute le feedback tactile et sonore
    dispatch({ type: 'SET_SIDEBAR_MOBILE_OPEN', payload: !isMobileOpen })
  }, [dispatch, isMobileOpen, handleMenuToggle])

  return (
    <header
      className='navbar bg-base-200/80 backdrop-blur border-b border-base-300 shadow-md h-16 min-h-16 fixed top-0 left-0 right-0 z-50 lg:hidden'
      role='banner'
    >
      <div className='flex items-center justify-between w-full h-full'>
        <LogoWithText />
        <ActionButton
          title=''
          onClick={toggleMobileOpen}
          ariaLabel={
            isMobileOpen
              ? 'Fermer le menu de navigation'
              : 'Ouvrir le menu de navigation'
          }
          tabIndex={0}
          icon={
            <>
              <Menu
                className={
                  isMobileOpen
                    ? 'hidden'
                    : `${cnIconLg} transition-all duration-300 opacity-100 rotate-0 scale-100`
                }
              />
              <Croix
                className={
                  isMobileOpen
                    ? `${cnIconLg} transition-all duration-300 opacity-100 rotate-0 scale-100`
                    : 'hidden'
                }
              />
            </>
          }
        />
      </div>
    </header>
  )
}

SidebarMobileHeader.displayName = 'SidebarMobileHeader'
