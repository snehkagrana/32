import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthAPI } from 'src/api'

export const auth_loginWithEmailAndPassword = createAsyncThunk('@auth/login', async body => {
    return await AuthAPI.loginWithEmailAndPassword(body)
})