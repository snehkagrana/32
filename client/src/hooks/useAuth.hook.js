import { useMemo } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { AuthAPI } from 'src/api'
import {
    auth_reducerActions,
    auth_selectState,
    authPersisted_reducerActions,
    authPersisted_selectState,
} from 'src/redux/auth'

import * as auth_thunkActions from 'src/redux/auth/auth.thunk'
import { authUtils } from 'src/utils'

export const useAuth = () => {
    const dispatch = useDispatch()
    const state = useSelector(auth_selectState)
    const statePersisted = useSelector(authPersisted_selectState)

    const isAuthenticated = useMemo(() => {
        return (
            Boolean(statePersisted.user) &&
            !statePersisted.newUser &&
            Boolean(authUtils.getUserAccessToken())
        )
    }, [statePersisted.user, statePersisted.newUser])

    const auth_syncAndGetUser = async () => {
        try {
            const response = await AuthAPI.sync()
            if (response?.message) {
                dispatch(
                    auth_thunkActions.auth_getUser(
                        authUtils.getUserAccessToken()
                    )
                )
            }
        } catch (err) {
            // invalid token
            if (err?.response?.status === 401) {
                batch(() => {
                    dispatch(
                        authPersisted_reducerActions.authPersisted_setUser(null)
                    )
                    dispatch(
                        authPersisted_reducerActions.authPersisted_setNewUser(true)
                    )
                })
            }
        }
    }

    return {
        ...state,
        ...statePersisted,
        ...auth_reducerActions,
        ...authPersisted_reducerActions,
        ...auth_thunkActions,
        isAuthenticated,
        auth_syncAndGetUser,
    }
}
