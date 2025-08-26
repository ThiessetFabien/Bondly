'use client'

import { useDashboard } from '@/store/context/DashboardContext'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'

export function SidebarOverlay() {
  const { state, dispatch } = useDashboard()
  const isMobileOpen = state.sidebar.isMobileOpen
  const [isDragging, setIsDragging] = useState(false)
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null)

  const closeMobile = useCallback(() => {
    dispatch({ type: 'SET_SIDEBAR_MOBILE_OPEN', payload: false })
  }, [dispatch])

  // Gestion des swipes pour fermer
  const handlePanStart = useCallback((_: unknown, info: PanInfo) => {
    setIsDragging(true)
    lastTouchRef.current = { x: info.point.x, y: info.point.y }
  }, [])

  const handlePanEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setIsDragging(false)

      // Détecter un swipe vers la gauche (fermeture)
      if (lastTouchRef.current) {
        const deltaX = info.point.x - lastTouchRef.current.x
        const deltaY = Math.abs(info.point.y - lastTouchRef.current.y)

        // Swipe horizontal vers la gauche avec une vitesse suffisante
        if (deltaX < -50 && deltaY < 100 && Math.abs(info.velocity.x) > 200) {
          closeMobile()
        }
      }

      lastTouchRef.current = null
    },
    [closeMobile]
  )

  if (!isMobileOpen) return null

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-navigation-overlay lg:hidden'
          onClick={closeMobile}
          onPanStart={handlePanStart}
          onPanEnd={handlePanEnd}
          role='button'
          aria-label='Fermer le menu de navigation'
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
              closeMobile()
            }
          }}
          style={{
            cursor: isDragging ? 'grabbing' : 'pointer',
          }}
        />
      )}
    </AnimatePresence>
  )
}

SidebarOverlay.displayName = 'SidebarOverlay'
