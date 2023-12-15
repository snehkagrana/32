import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthAPI } from 'src/api'

export const auth_loginWithEmailAndPassword = createAsyncThunk(
    '@auth/loginWithEmailAndPassword',
    async body => {
        return await AuthAPI.loginWithEmailAndPassword(body)
    }
)

export const auth_getUser = createAsyncThunk('@auth/getUser', async (token) => {
    return await AuthAPI.getAuthenticatedUser(token)
})

export const auth_logout = createAsyncThunk('@auth/logout', async (token) => {
    return await AuthAPI.revokeToken(token)
})
