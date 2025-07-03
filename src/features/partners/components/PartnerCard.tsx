// Implementation minimale pour faire passer les tests
import { formatPhoneNumber } from '@/shared/utils/formatting'
import { Partner } from '../types'

interface PartnerCardProps {
  partner: Partner
  onEdit: (id: string) => void
  onArchive: (id: string) => void
  onCall: (phone: string) => void
  onEmail: (email: string) => void
}

export const PartnerCard = ({
  partner,
  onEdit,
  onCall,
  onEmail,
}: PartnerCardProps) => {
  const handleCall = () => {
    onCall(partner.phone)
  }

  const handleEmail = () => {
    onEmail(partner.email)
  }

  const handleEdit = () => {
    onEdit(partner.id)
  }

  const renderStars = () => {
    const stars = []
    for (let i = 0; i < partner.rating; i++) {
      stars.push(
        <span key={i} data-testid='star-filled'>
          ★
        </span>
      )
    }
    return stars
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border p-6'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            {partner.firstName} {partner.lastName}
          </h3>
          <p className='text-sm text-gray-600'>{partner.company}</p>
          <p className='text-sm text-gray-500'>{partner.profession}</p>
        </div>
        <div className='flex items-center'>{renderStars()}</div>
      </div>

      <div className='space-y-2'>
        <div>
          <button
            onClick={handleEmail}
            className='text-blue-600 hover:text-blue-800 text-sm'
          >
            {partner.email}
          </button>
        </div>
        <div>
          <button
            onClick={handleCall}
            className='text-blue-600 hover:text-blue-800 text-sm'
          >
            {formatPhoneNumber(partner.phone)}
          </button>
        </div>
      </div>

      <div className='mt-4 flex gap-2'>
        <button
          onClick={handleEdit}
          className='px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100'
        >
          Modifier
        </button>
      </div>
    </div>
  )
}
