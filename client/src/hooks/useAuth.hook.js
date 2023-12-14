import { useMemo } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { AuthAPI } from 'src/api'
import { auth_reducerActions, auth_selectState } from 'src/redux/auth'

import * as auth_thunkActions from 'src/redux/auth/auth.thunk'
import { authUtils } from 'src/utils'

export const useAuth = () => {
    const dispatch = useDispatch()
    const state = useSelector(auth_selectState)

    const isAuthenticated = useMemo(() => {
        return (
            Boolean(state.user) &&
            !state.newUser &&
            Boolean(authUtils.getUserAccessToken())
        )
    }, [state.user, state.newUser])

    const auth_syncAndGetUser = async () => {
        try {
            const response = await AuthAPI.sync()
            if (response.status === 200) {
                dispatch(auth_thunkActions.auth_getUser())
            }
        } catch (e) {
            batch(() => {
                dispatch(auth_reducerActions.auth_setUser(null))
                dispatch(auth_reducerActions.auth_setNewUser(true))
            })
        }
    }

    return {
        ...state,
        ...auth_reducerActions,
        ...auth_thunkActions,
        isAuthenticated,
        auth_syncAndGetUser,
    }
}
