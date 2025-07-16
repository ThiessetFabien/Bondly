import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './index'

// Hooks typés pour Redux
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
