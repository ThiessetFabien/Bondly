import { motion } from 'framer-motion'
import React from 'react'

interface ActionButtonProps {
  variant?: 'square' | 'circle'
  icon: React.ReactNode
  ariaLabel: string
  title: string
  rôle?: string
  tabIndex?: number
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  disabled?: boolean
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'square',
  icon,
  ariaLabel,
  title,
  rôle = 'button',
  tabIndex,
  onClick,
  children,
  className = '',
  disabled = false,
}) => {
  const base = 'btn btn-md relative overflow-hidden'
  const shape = variant === 'circle' ? 'btn-circle' : 'btn-square'
  return (
    <motion.button
      type='button'
      className={`${base} ${shape} ${className} group hover:border-primary/40 hover:border`}
      aria-label={ariaLabel}
      title={title}
      role={rôle}
      tabIndex={tabIndex}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
    >
      {/* Effet de brillance au hover */}
      <div className='pointer-events-none absolute inset-0 z-10 hidden group-hover:block  transition-opacity duration-300'>
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
      </div>
      {/* Indicateur de pulse subtil */}
      <div className='pointer-events-none absolute inset-0 z-0 rounded-xl bg-accent/10 hidden group-hover:block group-hover:animate-pulse transition-opacity duration-300' />
      <span
        className={`flex items-center w-full h-full gap-2 relative z-20 opacity-80 ${!title && 'justify-center'}`}
      >
        {icon}
        {title}
        {children}
      </span>
    </motion.button>
  )
}
