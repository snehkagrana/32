import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'
import { reduxCommonActions_resetAuthState } from '../common.actions'

export const unauthenticatedMiddleware =
    ({ dispatch }) =>
    next =>
    action => {
        if (isRejectedWithValue(action) && action.payload?.status === 401) {
            // if(action.type.toLowerCase().includes('admin')) {
            //   // do something for admin state
            // }
            dispatch(reduxCommonActions_resetAuthState())
        }
        return next(action)
    }
