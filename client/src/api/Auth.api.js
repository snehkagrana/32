import { Axios } from 'src/api'

export const AuthAPI = {
    loginWithEmailAndPassword: async body => {
        return Axios({
            method: 'GET',
            withCredentials: true,
            url: '/server/login',
        })
    },
}
