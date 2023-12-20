import { Axios } from 'src/api'

export const AdminAPI = {
    verifyAction: async password => {
        const response = await Axios.post('/server/api/admin/action/verify', {
            password,
        })
        return response
    },
}
