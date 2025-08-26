import {
  allFirstLetterToUpperCase,
  normalizeKey,
} from '@/shared/utils/formatStrings'
import partnersData from '../../../data/partners.json' with { type: 'json' }

export function getAllClassifications() {
  const allClassifications = (partnersData.partners || []).flatMap(
    partner => partner.classifications || []
  )
  const uniqueClassifications = Array.from(
    new Map(
      allClassifications.filter(Boolean).map(raw => [
        normalizeKey(raw),
        {
          id: normalizeKey(raw),
          name: normalizeKey(allFirstLetterToUpperCase(raw)),
          label: allFirstLetterToUpperCase(raw),
        },
      ])
    ).values()
  )
  return uniqueClassifications
}
