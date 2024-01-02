import { useSelector } from 'react-redux'
import {
    persistedGuest_reducerActions,
    persistedGuest_selectState,
} from 'src/redux/persisted-guest'

import { auth_initGuest } from 'src/redux/auth/auth.thunk'

export const usePersistedGuest = () => {
    const state = useSelector(persistedGuest_selectState)

    return {
        ...state,
        ...persistedGuest_reducerActions,
        auth_initGuest,
    }
}
