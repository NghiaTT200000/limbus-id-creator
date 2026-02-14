import { useAppDispatch, useAppSelector } from 'Stores/AppStore'
import { openLoginMenu, closeLoginMenu } from 'Stores/Slices/UiSlice'

export function useLoginMenu() {
    const isLoginMenuActive = useAppSelector(state => state.ui.isLoginMenuActive)
    const dispatch = useAppDispatch()
    return {
        isLoginMenuActive,
        setIsLoginMenuActive: (v: boolean) => dispatch(v ? openLoginMenu() : closeLoginMenu()),
    }
}
