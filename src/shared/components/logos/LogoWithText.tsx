import { useSidebarState } from '@/features/navigation/hooks/index'
import { Logo } from './Logo'

export const LogoWithText = () => {
  const { isExpanded, isHovered } = useSidebarState()

  return (
    <div className='flex items-center relative gap-3'>
      <Logo />
      {(isExpanded || isHovered) && (
        <h1 className='text-lg font-semibold drop-shadow-sm'>Bondly</h1>
      )}
    </div>
  )
}

LogoWithText.displayName = 'LogoWithText'
