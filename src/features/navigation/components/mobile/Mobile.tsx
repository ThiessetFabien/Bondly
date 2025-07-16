'use client'

import { cn } from '@/services/lib/utils'
import { Logo } from '@/shared/components/Logo'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectSidebarMobileOpen,
  setSidebarMobileOpen,
} from '@/store/slices/uiSlice'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import { X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigationInteractions } from '../../hooks'
import {
  ScrollContainer,
  Actions as SidebarActions,
  Navigation as SidebarNavigation,
  Search as SidebarSearch,
} from '../shared'

export function SidebarMobile() {
  const dispatch = useAppDispatch()
  const isMobileOpen = useAppSelector(selectSidebarMobileOpen)
  const [dragX, setDragX] = useState(0)
  const { handleMenuToggle } = useNavigationInteractions()

  const closeMobile = useCallback(() => {
    handleMenuToggle()
    dispatch(setSidebarMobileOpen(false))
  }, [dispatch, handleMenuToggle])

  // Gestion du swipe pour fermer
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = -150 // Seuil de déplacement pour fermer
      const velocity = info.velocity.x

      if (info.offset.x < threshold || velocity < -500) {
        closeMobile()
      }
      setDragX(0)
    },
    [closeMobile]
  )

  const handleDrag = useCallback((_: unknown, info: PanInfo) => {
    // Seul permettre le drag vers la gauche
    const newX = Math.min(0, info.offset.x)
    setDragX(newX)
  }, [])

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
            onClick={closeMobile}
            role='button'
            aria-label='Fermer le menu'
          />

          {/* Sidebar mobile */}
          <motion.div
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
              'fixed left-0 top-0 h-full w-80 max-w-[80vw] z-50 lg:hidden',
              // Glassmorphisme mobile
              'bg-black/80 backdrop-blur-xl border-r border-white/20 shadow-[8px_0_32px_-8px] shadow-black/50',
              'touch-pan-y' // Autorise uniquement le scroll vertical du contenu
            )}
            role='navigation'
            aria-label='Navigation mobile'
            id='mobile-sidebar'
          >
            <div className='flex flex-col h-full'>
              {/* Header mobile */}
              <header className='flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 shadow-[0_1px_0_0] shadow-white/10'>
                <div className='flex items-center space-x-3'>
                  <div className='relative'>
                    <Logo />
                  </div>
                  <motion.div
                    className='hidden sm:block'
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    <h2 className='text-lg font-semibold text-white/90 drop-shadow-sm'>
                      Relations Manager
                    </h2>
                  </motion.div>
                </div>
                <motion.button
                  className={cn(
                    'group w-10 h-10 rounded-xl border border-white/20 transition-all duration-300 ease-out overflow-hidden',
                    'bg-white/10 backdrop-blur-xl hover:bg-white/20 hover:border-red-300/50',
                    'shadow-[0_4px_16px_-4px] shadow-black/20 hover:shadow-[0_6px_20px_-4px] hover:shadow-red-500/20',
                    'focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:ring-offset-0',
                    'hover:translate-y-[-1px] active:translate-y-0'
                  )}
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeMobile}
                  aria-label='Fermer la navigation mobile'
                >
                  <div className='flex items-center justify-center h-full relative z-10'>
                    <X className='h-4 w-4 text-white/80 group-hover:text-red-300 transition-colors duration-300' />
                  </div>

                  {/* Effet de brillance */}
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-red-300/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
                  </div>
                </motion.button>
              </header>

              {/* Contenu mobile */}
              <div className='flex-1 flex flex-col min-h-0'>
                <div className='px-4 py-2 border-b border-white/10'>
                  <SidebarSearch
                    isExpanded={true}
                    isCompact={false}
                    animationDelay={0.2}
                    isMobile={true}
                  />
                </div>

                <div className='flex-1 overflow-hidden'>
                  {' '}
                  <ScrollContainer isMobile withPadding>
                    <SidebarNavigation
                      isExpanded={true}
                      animationDelays={{
                        navBase: 0.3,
                        navIncrement: 0.05,
                        search: 0.2,
                      }}
                      isMobile={true}
                    />
                  </ScrollContainer>
                </div>
              </div>

              <SidebarActions
                isCompact={false}
                animationDelay={0.5}
                isMobile={true}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

SidebarMobile.displayName = 'SidebarMobile'
