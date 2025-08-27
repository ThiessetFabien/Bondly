export const ALL_COLUMNS = [
  'Entreprise',
  'Interlocuteur',
  'Relations',
  'Contacts',
  'Notation',
] as const

export const STATUS_OPTIONS = [
  { value: '', label: 'Tout' },
  { value: 'actived', label: 'Actif' },
  { value: 'archived', label: 'Archivé' },
  { value: 'blacklisted', label: 'Blacklisté' },
]
