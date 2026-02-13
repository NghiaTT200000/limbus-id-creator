import { configureStore } from '@reduxjs/toolkit'
import { AlertReducer } from './Slices/AlertSlice'
import { useDispatch, useSelector } from 'react-redux'
import { BaseApi } from 'Api/BaseApi'


export const AppStore = configureStore({
    reducer: {
        alert: AlertReducer,
        api: BaseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(BaseApi.middleware),
})

export type RootState = ReturnType<typeof AppStore.getState>
export type AppDispatch = typeof AppStore.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()