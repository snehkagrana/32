import { Axios } from 'src/api'
import { authUtils } from 'src/utils'

export const AuthAPI = {
    register: async body => {
        const response = await Axios.post('/server/api/auth/register', body)
        return response?.data
    },
    loginWithEmailAndPassword: async body => {
        const response = await Axios.post('/server/api/auth/login', body)
        if (response?.data?.data?.access_token) {
            authUtils.saveUserAccessToken(response.data.data.access_token)
        }
        return response.data
    },
    getAuthenticatedUser: async token => {
        const response = await Axios.get('/server/api/auth/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response?.data
    },
    sync: async () => {
        const response = await Axios.get('/server/api/auth/sync')
        return response?.data
    },
    revokeToken: async () => {
        const response = await Axios.get('/server/api/auth/logout')
        return response?.data
    },
}
