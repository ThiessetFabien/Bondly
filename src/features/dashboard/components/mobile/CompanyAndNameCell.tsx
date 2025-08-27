import { Badge } from '@/shared/components/badges/Badge'
import {
  allFirstLetterToUpperCase,
  oneFirstLetterToUpperCase,
} from '@/shared/utils/formatStrings'
import { Users } from 'lucide-react'
import type { Partner } from '../../../../shared/types/Partner'

export const CompanyAndNameCell: React.FC<{
  partner: Pick<
    Partner,
    'lastname' | 'firstname' | 'company' | 'rating' | 'relations'
  >
}> = ({ partner }) => {
  return (
    <>
      <p className='font-bold text-base text-secondary-content text-nowrap truncate'>
        {oneFirstLetterToUpperCase(partner.lastname)}{' '}
        {oneFirstLetterToUpperCase(partner.firstname)}
      </p>
      <p className='text-sm text-base-content text-nowrap truncate'>
        {allFirstLetterToUpperCase(partner.company)}
      </p>
      <div className='flex items-center gap-x-1 flex-nowrap'>
        <Badge color='info' size='xs' px='px-1' className='w-fit'>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`mask mask-star-2 w-3 h-3 ${i < Math.round(partner.rating) ? 'bg-white/80' : 'bg-base-300'}`}
              aria-label={`${i + 1} étoile${i > 0 ? 's' : ''}`}
            />
          ))}
        </Badge>
        <Badge color='success' size='xs' px='px-2'>
          <Users className='w-3.5 h-3.5 inline-block' />
          <span className='font-bold'>{partner.relations?.length ?? 0}</span>
        </Badge>
      </div>
    </>
  )
}
CompanyAndNameCell.displayName = 'CompanyAndNameCell'
