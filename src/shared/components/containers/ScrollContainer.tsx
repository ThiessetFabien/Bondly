'use client'

import { cn } from '@/services/lib/utils'
import { forwardRef } from 'react'

interface ScrollContainerProps {
  children: React.ReactNode
  className?: string
  isMobile?: boolean
  withPadding?: boolean
}

/**
 * Container de scroll optimisé pour la sidebar avec scrollbar personnalisée
 */
export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
  ({ children, className, isMobile = false, withPadding = false }, ref) => {
    return (
      <section ref={ref} className={cn('overflow-hidden', className)}>
        <div
          className={cn(
            'h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent',
            isMobile ? 'pb-24' : 'pb-4',
            withPadding && 'px-2'
          )}
        >
          {children}
        </div>
      </section>
    )
  }
)

ScrollContainer.displayName = 'ScrollContainer'
