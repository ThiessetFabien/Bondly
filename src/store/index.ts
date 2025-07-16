/**
 * Store Redux - VERSION FONCTIONNELLE
 * Configuration du store avec slices UI et Classifications
 */

import { configureStore } from '@reduxjs/toolkit'
import classificationsReducer from './slices/classificationsSlice'
import uiReducer from './slices/uiSlice'

// Store avec les reducers nécessaires
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    classifications: classificationsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
