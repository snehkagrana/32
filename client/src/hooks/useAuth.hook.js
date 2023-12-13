import { useSelector } from 'react-redux'
import { auth_reducerActions, auth_selectState } from 'src/redux/auth'

import * as auth_thunkActions from 'src/redux/auth/auth.thunk'

export const useAuth = () => {
    const state = useSelector(auth_selectState)

    return {
        ...state,
        ...auth_reducerActions,
        ...auth_thunkActions,
    }
}
