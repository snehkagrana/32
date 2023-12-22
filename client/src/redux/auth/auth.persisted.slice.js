import { createSlice } from '@reduxjs/toolkit'
import {
    auth_loginWithEmailAndPassword,
    auth_getUser,
    auth_logout,
} from './auth.thunk'

// Initial state
const initialState = {
    user: null,
    newUser: true,
}

// Actual Slice
export const authPersistedSlice = createSlice({
    name: 'auth.persisted',
    initialState,
    reducers: {
        authPersisted_setUser(state, action) {
            state.user = action.payload
        },
        authPersisted_setNewUser(state, action) {
            state.newUser = action.payload
        },
        authPersisted_reset: () => initialState,
    },
    extraReducers: builder => {
        builder.addCase(
            auth_loginWithEmailAndPassword.rejected,
            (state, action) => {
                state.newUser = true
            }
        )

        // prettier-ignore
        builder.addCase(auth_loginWithEmailAndPassword.fulfilled, (state, action) => {
            // eslint-disable-next-line eqeqeq
            if (action.payload.data?.redirect == '/login') {
                state.newUser = true
                state.user = null
            }
            else if (action.payload.data?.access_token) {
                state.user = action.payload.data.user
            }
        })
        // prettier-ignore
        builder.addCase(auth_getUser.fulfilled, (state, action) => {
            if (action?.payload?.data?._id) {
                state.newUser = false
                state.user = {
                    ...state.user,
                    ...action.payload.data,
                    lastClaimedGemsDailyQuest: !action.payload?.data?.lastClaimedGemsDailyQuest ? null : action.payload?.data?.lastClaimedGemsDailyQuest
                }
            }
        })

        builder.addCase(auth_logout.rejected, (state, action) => {
            state.newUser = true
            state.user = null
        })
        builder.addCase(auth_logout.fulfilled, (state, action) => {
            state.newUser = true
            state.user = null
        })
    },
})

export const authPersisted_reducerActions = authPersistedSlice.actions

export const authPersisted_selectState = state => state['auth.persisted']
