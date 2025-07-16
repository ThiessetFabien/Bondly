/**
 * SIDEBAR PRINCIPAL - Version optimisée avec nouvelle structure
 *
 * Point d'entrée principal pour l'utilisation de la sidebar
 * Utilise la nouvelle architecture modulaire
 */

'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchClassifications,
  selectFilteredClassifications,
} from '@/store/slices/classificationsSlice'
import { memo, useEffect } from 'react'

// Import depuis la structure locale
import { DesktopSidebar, MobileHeader, MobileSidebar } from './components'

interface SidebarProps {
  className?: string
}

/**
 * Composant Sidebar principal optimisé
 * Utilise la nouvelle architecture modulaire pour une meilleure maintenance
 */
export const Sidebar = memo<SidebarProps>(({ className = '' }) => {
  const dispatch = useAppDispatch()
  const classifications = useAppSelector(selectFilteredClassifications)

  // Charger les classifications au montage (optimisé avec memo)
  useEffect(() => {
    const loadClassifications = async () => {
      if (classifications.length === 0) {
        try {
          const result = await dispatch(fetchClassifications())
          if (result && typeof result === 'object' && 'unwrap' in result) {
            result.unwrap()
          }
        } catch {
          // Les erreurs sont déjà gérées par Redux
          console.debug('Classifications loading handled by Redux')
        }
      }
    }

    loadClassifications()
  }, [dispatch, classifications.length])

  return (
    <>
      {/* Header mobile - affiché uniquement sur mobile */}
      <MobileHeader />

      {/* Sidebar desktop - cachée sur mobile */}
      <DesktopSidebar className={className} />

      {/* Sidebar mobile - affichée uniquement quand ouverte sur mobile */}
      <MobileSidebar />
    </>
  )
})

Sidebar.displayName = 'Sidebar'
