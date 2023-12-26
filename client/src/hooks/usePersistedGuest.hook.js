import { useSelector } from 'react-redux'
import {
    persistedGuest_reducerActions,
    persistedGuest_selectState,
} from 'src/redux/persisted-guest'

export const usePersistedGuest = () => {
    const guestState = useSelector(persistedGuest_selectState)

    return {
        guestState,
        ...persistedGuest_reducerActions,
    }
}
