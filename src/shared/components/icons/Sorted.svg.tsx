export const SortedASC: React.FC<
  React.SVGProps<SVGSVGElement> & { className?: string }
> = ({ className }) => {
  return (
    <svg
      className={`sm:mr-1 ${className}`}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
    >
      <path d='M8 6v12' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8 18l-4-4' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8 18l4-4' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16 6h4' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16 12h2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16 18h.01' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

export const SortedDESC: React.FC<
  React.SVGProps<SVGSVGElement> & { className?: string }
> = ({ className }) => {
  return (
    <svg
      className={`sm:mr-1 ${className}`}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
    >
      <path d='M8 18V6' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8 6l-4 4' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8 6l4 4' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16 18h4' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16 12h2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16 6h.01' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}
