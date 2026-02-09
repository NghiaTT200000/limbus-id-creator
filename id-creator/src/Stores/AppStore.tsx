import { configureStore } from '@reduxjs/toolkit'
import { AlertReducer } from './Slices/AlertSlice'
import { useDispatch, useSelector } from 'react-redux'


export const store = configureStore({
    reducer: {
        alert: AlertReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()