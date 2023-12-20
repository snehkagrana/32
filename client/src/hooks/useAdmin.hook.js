import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AdminAPI } from 'src/api'
import { admin_selectState, admin_reducerActions } from 'src/redux/admin'
import { authPersisted_selectState } from 'src/redux/auth'

export const useAdmin = () => {
    const dispatch = useDispatch()
    const authState = useSelector(authPersisted_selectState)
    const state = useSelector(admin_selectState)

    const admin_verifyAction = useCallback(
        async pass => {
            let result = false
            if (authState.user?.role === 'admin' && pass) {
                try {
                    const response = await AdminAPI.verifyAction(pass)
                    if (response.status === 200) {
                        result = true
                    } else result = false
                } catch (err) {
                    result = false
                }
            } else {
                result = false
            }
            dispatch(admin_reducerActions.admin_setIsVerified(result))
            return result
        },
        [authState.user?.role, dispatch]
    )

    return {
        ...state,
        ...admin_reducerActions,
        admin_verifyAction,
    }
}
