import { Axios } from 'src/api'

export const AuthAPI = {
    register: async body => {
        const response = await Axios.post('/server/api/auth/register', body)
        return response?.data
    },
    loginWithEmailAndPassword: async body => {
        const response = await Axios.post('/server/api/auth/login', body)
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
