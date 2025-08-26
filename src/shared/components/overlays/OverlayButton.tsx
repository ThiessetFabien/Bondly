import React, { useState } from 'react'

interface OverlayButtonProps {
  icon: React.ReactNode
  ariaLabel: string
  title: string
  overlayContent: React.ReactNode
  className?: string
  badgeContent?: React.ReactNode
}

const OverlayButton: React.FC<OverlayButtonProps> = ({
  icon,
  ariaLabel,
  title,
  overlayContent,
  className = '',
  badgeContent,
}) => {
  const [show, setShow] = useState(false)
  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      data-testid='overlay-btn-container'
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        type='button'
        className='btn btn-circle btn-sm text-accent border-none bg-base-200/80 hover:bg-accent/20 shadow-md flex items-center justify-center transition-colors duration-150 focus:ring-2 focus:ring-accent/60 focus:outline-none relative'
        aria-label={ariaLabel}
        title={title}
        style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }}
      >
        <span className='flex items-center justify-center'>{icon}</span>
        {badgeContent !== undefined && (
          <span className='absolute -top-1.5 -right-1.5 bg-primary text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center border-2 border-base-100 shadow-md drop-shadow-sm'>
            {badgeContent}
          </span>
        )}
      </button>
      {show && overlayContent}
    </div>
  )
}

export default OverlayButton
