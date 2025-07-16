/**
 * Partners Slice - VERSION ALLÉGÉE
 * Export minimal pour éviter le code mort
 */

import { createSlice } from '@reduxjs/toolkit'

// Interface minimale
export interface Partner {
  id: string
  firstName: string
  lastName: string
  email: string
}

// État initial minimal
const initialState = {
  items: [] as Partner[],
  loading: false,
  error: null as string | null,
}

// Slice minimal
const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    // Reducer minimal pour éviter le fichier vide
    reset: () => initialState,
  },
})

export const { reset } = partnersSlice.actions
export default partnersSlice.reducer

// Exports commentés - décommentez si nécessaire :
// export { fetchPartners, addPartner, updatePartner, deletePartner, clearError, updateStats }
// export { selectPartners, selectPartnersLoading, selectPartnersError, selectPartnersStats, selectPartnersByClassification }
