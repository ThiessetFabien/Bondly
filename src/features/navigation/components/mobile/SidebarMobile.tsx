'use client'

import { cn } from '@/services/lib/utils'
import { ScrollContainer } from '@/shared/components/containers/ScrollContainer'
import { useDashboard } from '@/store/context/DashboardContext'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useNavigationInteractions } from '../../hooks/interactions'
import {
  Actions as SidebarActions,
  Navigation as SidebarNavigation,
  Search as SidebarSearch,
} from '../shared/index'
import { SidebarMobileHeader } from './HeaderMobile'

export function SidebarMobile() {
  // Gestion du drag pour le swipe
  const handleDrag = useCallback((_: unknown, info: PanInfo) => {
    // Seul permettre le drag vers la gauche
    const newX = Math.min(0, info.offset.x)
    setDragX(newX)
  }, [])
  const { state, dispatch } = useDashboard()
  const isMobileOpen = state.sidebar.isMobileOpen
  const [dragX, setDragX] = useState(0)
  const { handleMenuToggle } = useNavigationInteractions()

  const closeMobile = useCallback(() => {
    handleMenuToggle()
    dispatch({ type: 'SET_SIDEBAR_MOBILE_OPEN', payload: false })
  }, [dispatch, handleMenuToggle])

  // Gestion du swipe pour fermer
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = -150 // Seuil de déplacement pour fermer
      const velocity = info.velocity.x

      if (info.offset.x < threshold || velocity < -500) {
        closeMobile()
      } else {
        setDragX(0)
      }
    },
    [closeMobile]
  )

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <button
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
            onClick={closeMobile}
            role='button'
            aria-label='Fermer le menu'
          />
          {/* Sidebar mobile sémantique */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            drag='x'
            dragConstraints={{ left: -320, right: 0 }}
            dragElastic={0.2}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            className={cn(
              'fixed left-0 top-0 h-full w-full z-50 lg:hidden',
              'bg-base-200/90 backdrop-blur border-r border-base-300', // thème DaisyUI
              'shadow-lg',
              'touch-pan-y'
            )}
            role='complementary'
            aria-label='Menu latéral mobile'
            id='mobile-sidebar'
          >
            <SidebarMobileHeader />
            {/* Navigation principale */}
            <nav
              className='flex flex-col h-full pt-16'
              aria-label='Navigation principale'
            >
              <section
                className={cn('border-y border-base-300 px-6')}
                aria-label='Recherche'
              >
                <SidebarSearch
                  isExpanded={true}
                  isCompact={false}
                  isMobile={true}
                />
              </section>
              <ScrollContainer isMobile withPadding>
                <SidebarNavigation
                  isExpanded={true}
                  animationDelays={{
                    navBase: 0.3,
                    navIncrement: 0.05,
                    search: 0.2,
                  }}
                />
              </ScrollContainer>
              <section aria-label='Actions utilisateur'>
                <SidebarActions
                  isCompact={false}
                  animationDelay={0.5}
                  isMobile={true}
                />
              </section>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

SidebarMobile.displayName = 'SidebarMobile'
