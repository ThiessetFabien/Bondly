export type PartnerClassification = {
  id: string
  name: string
  label: string
}
export type Partner = {
  id: string
  firstName: string
  lastName: string
  profession: string
  email: string
  phone: string
  company: string
  rating: number
  status: string // 'active' | 'archived' | 'blacklisted'
  notes: string
  classifications: string[]
  createdAt: string
  updatedAt: string
  relations?: Array<{
    id: string
    name: string
    company: string
    type: string
  }>
}

export interface PartnersTableProps {
  selectedRows?: string[]
  onSelectionChange?: ((selected: string[]) => void) | undefined
}
