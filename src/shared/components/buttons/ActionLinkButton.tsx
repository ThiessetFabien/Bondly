import React from 'react'
import { ActionButton } from './ActionButton'

interface ActionLinkButtonProps {
  href: string
  variant?: 'square' | 'circle'
  icon: React.ReactNode
  ariaLabel: string
  title?: string
  rôle?: string
  tabIndex?: number
  className?: string
  disabled?: boolean
}

export const ActionLinkButton: React.FC<ActionLinkButtonProps> = ({
  href,
  variant = 'square',
  icon,
  ariaLabel,
  title = '',
  rôle = 'button',
  tabIndex,
  className = '',
  disabled = false,
}) => {
  if (disabled) {
    return (
      <ActionButton
        variant={variant}
        icon={icon}
        ariaLabel={ariaLabel}
        title={title}
        rôle={rôle}
        tabIndex={tabIndex}
        className={className}
        disabled
      />
    )
  }
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      className='inline-block min-w-fit'
    >
      <ActionButton
        variant={variant}
        icon={icon}
        ariaLabel={ariaLabel}
        title={title}
        className={className}
      />
    </a>
  )
}
