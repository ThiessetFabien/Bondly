import clsx from 'clsx'
import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  color?: 'info' | 'accent' | 'success' | 'secondary' | 'soft' | 'default'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  px?: string // padding horizontal, ex: 'px-2'
  title?: string
}

const colorMap: Record<string, string> = {
  info: 'badge-info',
  accent: 'badge-accent',
  success: 'badge-success',
  secondary: 'badge-secondary',
  soft: 'badge-soft',
  default: '',
}

const sizeMap: Record<string, string> = {
  xs: 'badge-xs',
  sm: 'badge-sm',
  md: 'badge-md',
  lg: 'badge-lg',
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'default',
  size = 'sm',
  className = '',
  px = 'px-2',
  title,
}) => (
  <span
    className={clsx(
      'badge',
      colorMap[color],
      sizeMap[size],
      px,
      'whitespace-nowrap',
      className
    )}
    title={title}
  >
    {children}
  </span>
)

export default Badge
