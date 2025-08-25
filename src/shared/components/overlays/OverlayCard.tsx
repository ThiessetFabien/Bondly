import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface OverlayCardProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  usePortal?: boolean
}

const OverlayCard: React.FC<OverlayCardProps> = ({
  title,
  icon,
  children,
  className = '',
  style = {},
  usePortal = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Focus automatique à l'ouverture
  useEffect(() => {
    if (overlayRef.current) {
      // Focus sur le premier élément focusable
      const focusable = overlayRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable) focusable.focus()
      else overlayRef.current.focus()
    }
  }, [])

  const baseClass =
    'card bg-base-100 shadow-2xl border border-base-200 rounded-xl p-0 animate-fade-in z-[100]'
  const portalClass =
    'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] w-[340px] sm:w-[480px] sm:max-w-2xl overflow-y-auto outline-none'
  const absoluteClass =
    'absolute top-8 right-0 sm:w-[480px] sm:max-w-2xl sm:overflow-y-auto sm:max-h-[60vh] outline-none'

  const content = (
    <div
      ref={overlayRef}
      tabIndex={-1}
      className={
        usePortal
          ? `${baseClass} ${portalClass} ${className}`
          : `${baseClass} ${absoluteClass} ${className}`
      }
      style={style}
      role='dialog'
      aria-modal='true'
      aria-label={title}
    >
      <div className='p-5 sm:p-4 flex flex-col gap-2'>
        <div className='flex items-center gap-2 mb-1'>
          {icon && <span className='text-accent'>{icon}</span>}
          <span className='text-base font-semibold text-secondary-content'>
            {title}
          </span>
        </div>
        <div className='divider my-1 h-px bg-base-200/80' />
        <div className='w-full'>{children}</div>
      </div>
    </div>
  )
  if (usePortal && typeof window !== 'undefined') {
    return createPortal(content, document.body)
  }
  return content
}

export default OverlayCard
