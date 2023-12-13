import { createSlice } from '@reduxjs/toolkit'
import { auth_loginWithEmailAndPassword } from './auth.thunk'

// Initial state
const initialState = {
    auth_openModalLogin: false,
    auth_openModalRegister: false,
    user: null,
    newUser: false,

    loginIsLoading: false,
    loginIsError: false,
}

// Actual Slice
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        auth_setOpenModalLogin(state, action) {
            state.auth_openModalLogin = action.payload
        },
        auth_setOpenModalRegister(state, action) {
            state.auth_openModalRegister = action.payload
        },
        auth_setUser(state, action) {
            state.user = action.payload
        },
        auth_setNewUser(state, action) {
            state.newUser = action.payload
        },
    },
    extraReducers: builder => {
        // Login
        builder.addCase(auth_loginWithEmailAndPassword.pending, state => {
            state.loginIsLoading = true
            state.loginIsError = false
        })
        builder.addCase(
            auth_loginWithEmailAndPassword.rejected,
            (state, action) => {
                state.loginIsLoading = false
                state.loginIsError = true
            }
        )
        builder.addCase(
            auth_loginWithEmailAndPassword.fulfilled,
            (state, action) => {
                state.loginIsError = false
                state.loginIsLoading = false
                if (action.payload.data?.redirect == '/login') {
                    state.newUser = true
                    state.user = null
                } else if (action.payload.data?.user?.email) {
                    state.user = action.payload.data.user
                }
            }
        )
    },
})

export const auth_reducerActions = authSlice.actions

export const auth_selectState = state => state.auth
