import { Axios } from 'src/api'

export const CommonAPI = {
    batch: async payload => {
        const response = await Axios.post('/server/api/batch', payload)
        return response
    },
}
