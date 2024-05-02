import { useSelector } from 'react-redux'
import {
    notifications_selectState,
    notifications_reducerActions,
} from 'src/redux/notifications'
import * as notifications_thunkActions from 'src/redux/notifications/notifications.thunk'

export const useNotifications = () => {
    const state = useSelector(notifications_selectState)

    return {
        ...state,
        ...notifications_reducerActions,
        ...notifications_thunkActions,
    }
}
