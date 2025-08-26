export const Phone: React.FC<
  React.SVGProps<SVGSVGElement> & { className?: string }
> = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='2.2'
    stroke='currentColor'
    className={`w-4 h-4 text-primary flex items-center justify-center ${className}`}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.086c.51 0 .994.18 1.37.51l2.07 1.8a2.25 2.25 0 01.53 2.7l-.7 1.4a.75.75 0 00.17.92l3.54 3.54a.75.75 0 00.92.17l1.4-.7a2.25 2.25 0 012.7.53l1.8 2.07c.33.376.51.86.51 1.37v2.086c0 1.243-1.007 2.25-2.25 2.25h-.75C6.678 21 3 17.322 3 12.75v-.75z'
    />
  </svg>
)
