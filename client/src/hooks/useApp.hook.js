import { useMemo } from 'react'
import { app_selectState, app_reducerActions } from 'src/redux/app'
import { useSelector } from 'react-redux'
import { CommonAPI } from 'src/api'
import { useAuth } from './useAuth.hook'
import toast from 'react-hot-toast'

export const useApp = () => {
    const state = useSelector(app_selectState)
    const { isAuthenticated, user } = useAuth()

    const app_isDarkTheme = useMemo(() => {
        return state.app_paletteMode === 'dark'
    }, [state.app_paletteMode])

    const appBatch = async paramsPayload => {
        let payload = {
            ...paramsPayload,
            userId: isAuthenticated && user ? user._id : null,
        }
        try {
            const response = await CommonAPI.batch(payload)
            if (response?.status !== 200) {
                toast.error('Something went wrong')
            }
        } catch (err) {
            toast.error('Something went wrong')
        }
    }

    return {
        app_isDarkTheme,
        ...state,
        ...app_reducerActions,
        appBatch,
    }
}
