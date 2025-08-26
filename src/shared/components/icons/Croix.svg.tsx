export const Croix: React.FC<
  React.SVGProps<SVGSVGElement> & { className?: string }
> = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='2.2'
    stroke='currentColor'
    className={`w-4 h-4 ${className}`}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
)
