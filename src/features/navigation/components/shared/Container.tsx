'use client'

import { cn } from '@/services/lib/utils'
import { memo, type ReactNode } from 'react'
import { useSidebarState } from '../../hooks'

interface SidebarContainerProps {
  children: ReactNode
  className?: string
  isCompact?: boolean
}

/**
 * Container réutilisable pour les sections de la sidebar
 * Optimisé avec memo et gestion automatique des styles
 */
export const SidebarContainer = memo<SidebarContainerProps>(
  ({ children, className = '', isCompact }) => {
    const { isExpanded } = useSidebarState()
    const shouldBeCompact = isCompact ?? !isExpanded

    return (
      <div
        className={cn(
          'transition-all duration-200 ease-out',
          shouldBeCompact ? 'px-2' : 'px-3',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

SidebarContainer.displayName = 'SidebarContainer'
