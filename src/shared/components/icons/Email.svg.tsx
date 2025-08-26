export const Email: React.FC<
  React.SVGProps<SVGSVGElement> & { className?: string }
> = ({ className }) => {
  return (
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
        d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.876 1.8l-7.5 5.625a2.25 2.25 0 01-2.748 0L3.626 8.793a2.25 2.25 0 01-.876-1.8V6.75'
      />
    </svg>
  )
}
