'use client'

import { cn } from '@/services/lib/utils'
import { ScrollContainer } from '@/shared/components/ScrollContainer'
import { motion, useMotionValue } from 'framer-motion'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSidebarAnimations, useSidebarState } from '../../hooks'
import { SearchEnhanced as SidebarSearch } from '../shared'
import { SidebarActions } from '../shared/Actions'
import { SidebarNavigation } from '../shared/Navigation'
import { SidebarDesktopHeader } from './Header'

interface SidebarDesktopProps {
  className?: string
}

/**
 * Composant Sidebar Desktop optimisé avec auto-expansion intelligente
 */
export const SidebarDesktop = memo<SidebarDesktopProps>(
  ({ className = '' }) => {
    const { isExpanded, sidebarClasses, setHovered } = useSidebarState()
    const { DELAYS } = useSidebarAnimations()

    // État pour l'auto-expansion au hover
    const [hoverIntention, setHoverIntention] = useState(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Animation fluide de la largeur avec spring
    const width = useMotionValue(isExpanded ? 280 : 72)

    // Gestion intelligente du hover avec délai d'intention
    const handleMouseEnter = useCallback(() => {
      // Délai d'intention pour éviter les expansions accidentelles
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isExpanded) {
          setHoverIntention(true)
          setHovered(true)
        }
      }, 200) // 200ms de délai d'intention
    }, [setHovered, isExpanded])

    const handleMouseLeave = useCallback(() => {
      setHoverIntention(false)

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }

      // Délai avant fermeture pour permettre la navigation
      setTimeout(() => {
        if (!isExpanded) {
          setHovered(false)
        }
      }, 100)
    }, [setHovered, isExpanded])

    // Mise à jour de la largeur selon l'état
    useEffect(() => {
      const targetWidth = isExpanded || hoverIntention ? 280 : 72
      width.set(targetWidth)
    }, [isExpanded, hoverIntention, width])

    // Nettoyage du timeout
    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }, [])

    return (
      <motion.aside
        className={cn(
          'fixed left-0 top-0 h-full z-40 hidden lg:flex lg:flex-col',
          'bg-base-200/90 backdrop-blur border-r border-base-300', // DaisyUI et custom
          'shadow-lg', // DaisyUI
          'transition-all duration-300 ease-out',
          hoverIntention && 'ring ring-primary/20', // DaisyUI
          sidebarClasses,
          className
        )}
        initial={false}
        animate={{
          width: isExpanded || hoverIntention ? 280 : 72,
          boxShadow: hoverIntention
            ? '0 0 0 2px var(--fallback-bc,theme(colors.primary/20))'
            : '0 4px 32px -8px rgba(0,0,0,0.5)',
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
          type: 'tween',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role='navigation'
        aria-label='Navigation principale'
        style={{ willChange: 'width, box-shadow' }}
      >
        {/* Indicateur de hover intention */}
        {hoverIntention && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            className='absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-primary/60 to-secondary/60 rounded-full shadow-lg shadow-primary/30'
          />
        )}

        {/* Wrapper pour harmoniser les espacements internes */}
        <div className='flex flex-col gap-2  h-full'>
          <SidebarDesktopHeader
            isExpanded={isExpanded || hoverIntention}
            animationDelay={DELAYS.header}
          />

          <SidebarSearch
            _isExpanded={isExpanded || hoverIntention}
            animationDelay={DELAYS.search}
          />

          <div className='flex-1 min-h-0 flex flex-col'>
            <ScrollContainer>
              <SidebarNavigation
                isExpanded={isExpanded || hoverIntention}
                animationDelays={DELAYS}
              />
            </ScrollContainer>
          </div>

          <SidebarActions
            isCompact={!(isExpanded || hoverIntention)}
            animationDelay={DELAYS.actions}
          />
        </div>
      </motion.aside>
    )
  }
)

SidebarDesktop.displayName = 'SidebarDesktop'
