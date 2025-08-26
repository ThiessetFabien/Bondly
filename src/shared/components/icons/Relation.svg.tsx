export const Relation: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='2.2'
      stroke='currentColor'
      className='size-[1.2em] text-primary'
    >
      <rect x='3' y='4' width='18' height='4' rx='2' />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8'
      />
      <path strokeLinecap='round' strokeLinejoin='round' d='M10 12h4' />
    </svg>
  )
}
Relation.displayName = 'RelationIcon'
