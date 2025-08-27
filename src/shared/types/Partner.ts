export type PartnerClassification = {
  id: string
  name: string
  label: string
}

export type PartnerStatus = 'active' | 'archived' | 'blacklisted'

export type Partner = {
  id: string
  firstname: string
  lastname: string
  job: string
  email: string
  phone: string
  company: string
  rating: number
  status: PartnerStatus
  comment: string
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
