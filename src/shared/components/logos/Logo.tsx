import { cn } from '@/services/lib/utils'

export const Logo = () => {
  return (
    <div
      className={cn(
        'logo-eco',
        'w-10 h-10 bg-primary rounded-xl flex items-center justify-center ring-1 ring-ring/20 flex-shrink-0'
      )}
    >
      <span className='text-primary-foreground font-bold text-sm select-none'>
        BLY
      </span>
    </div>
  )
}
