'use client'

import { cn } from '@/services/lib/utils'
import { Logo } from '@/shared/components/Logo'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectSidebarMobileOpen,
  setSidebarMobileOpen,
} from '@/store/slices/uiSlice'
import { Menu, X } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigationInteractions } from '../../hooks'

export function SidebarMobileHeader() {
  const dispatch = useAppDispatch()
  const isMobileOpen = useAppSelector(selectSidebarMobileOpen)
  const { handleMenuToggle } = useNavigationInteractions()

  const toggleMobileOpen = useCallback(() => {
    handleMenuToggle() // Ajoute le feedback tactile et sonore
    dispatch(setSidebarMobileOpen(!isMobileOpen))
  }, [dispatch, isMobileOpen, handleMenuToggle])

  return (
    <header
      className='fixed top-0 left-0 right-0 h-16 lg:hidden z-50 bg-black/80 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_32px_-8px] shadow-black/20'
      role='banner'
    >
      <div className='flex items-center justify-between px-4 h-full'>
        <div className='flex items-center space-x-3'>
          <div className='relative'>
            <Logo />
          </div>
          <div className='hidden sm:block'>
            <h1 className='text-lg font-semibold text-white/90 drop-shadow-sm'>
              Relations Manager
            </h1>
          </div>
        </div>
        <div>
          <button
            className={cn(
              'group relative w-12 h-12 rounded-xl border border-white/20 transition-all duration-300 ease-out overflow-hidden',
              'bg-white/10 backdrop-blur-xl hover:bg-white/20 hover:border-white/30',
              'shadow-[0_4px_16px_-4px] shadow-black/20 hover:shadow-[0_6px_20px_-4px] hover:shadow-black/30',
              'focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-0',
              // Effet 3D au hover avec micro-animation
              'hover:translate-y-[-1px] active:translate-y-0',
              // Animation du burger vers X
              isMobileOpen && 'bg-white/20 border-white/30'
            )}
            onClick={toggleMobileOpen}
            aria-expanded={isMobileOpen}
            aria-controls='mobile-sidebar'
            aria-label={
              isMobileOpen
                ? 'Fermer le menu de navigation'
                : 'Ouvrir le menu de navigation'
            }
          >
            <div className='flex items-center justify-center h-full'>
              {/* Animation hamburger vers X */}
              <div className='relative w-5 h-5'>
                {/* Icône Menu (hamburger) */}
                <Menu
                  className={cn(
                    'absolute inset-0 w-full h-full text-white/80 group-hover:text-white transition-all duration-300',
                    'transform-gpu',
                    isMobileOpen
                      ? 'opacity-0 rotate-180 scale-50'
                      : 'opacity-100 rotate-0 scale-100'
                  )}
                />
                {/* Icône X (fermeture) */}
                <X
                  className={cn(
                    'absolute inset-0 w-full h-full text-white/80 group-hover:text-white transition-all duration-300',
                    'transform-gpu',
                    isMobileOpen
                      ? 'opacity-100 rotate-0 scale-100'
                      : 'opacity-0 rotate-180 scale-50'
                  )}
                />
              </div>
            </div>

            {/* Effet de brillance au hover */}
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

SidebarMobileHeader.displayName = 'SidebarMobileHeader'
