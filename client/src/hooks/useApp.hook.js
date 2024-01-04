import { useMemo } from 'react'
import {
    app_selectState,
    app_reducerActions,
    appPersisted_selectState,
    appPersisted_reducerActions,
} from 'src/redux/app'
import { useSelector } from 'react-redux'
import { CommonAPI } from 'src/api'
import { useAuth } from './useAuth.hook'
import toast from 'react-hot-toast'
import { usePersistedGuest } from './usePersistedGuest.hook'

export const useApp = () => {
    const state = useSelector(app_selectState)
    const statePersisted = useSelector(appPersisted_selectState)
    const { isAuthenticated, user } = useAuth()
    const { guest } = usePersistedGuest()

    const app_isDarkTheme = useMemo(() => {
        return state.app_paletteMode === 'dark'
    }, [state.app_paletteMode])

    const appBatch = async paramsPayload => {
        let payload = {
            ...paramsPayload,
            userId: isAuthenticated && user ? user._id : null,
            guestId: !isAuthenticated && guest._id ? guest._id : null,
        }
        try {
            const response = await CommonAPI.batch(payload)
            if (response?.status !== 200) {
                toast.error('Something went wrong')
            }
            return response.data
        } catch (err) {
            toast.error('Something went wrong')
            return false
        }
    }

    return {
        app_isDarkTheme,
        ...state,
        ...statePersisted,
        ...app_reducerActions,
        ...appPersisted_reducerActions,
        appBatch,
    }
}
