import { Axios } from 'src/api'

export const AuthAPI = {
    register: async body => {
        return Axios.post('/server/api/auth/register', body)
    },
    loginWithEmailAndPassword: async body => {
        return Axios.post('/server/api/auth/login', body)
    },
    getAuthenticatedUser: async body => {
        return Axios.get('/server/api/auth/user')
    },
    sync: async body => {
        return Axios.get('/server/api/auth/sync')
    },
    revokeToken: async body => {
        return Axios.get('/server/api/auth/logout')
    },
}
