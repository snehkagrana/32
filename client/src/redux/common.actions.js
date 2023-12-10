import { createAction } from '@reduxjs/toolkit'

export const COMMON_ACTION_RESET_AUTH_STATE = '@COMMON_ACTION_RESET_AUTH_STATE'

export const reduxCommonActions_resetAuthState = createAction(
    COMMON_ACTION_RESET_AUTH_STATE,
    () => {
        return { payload: null }
    }
)
