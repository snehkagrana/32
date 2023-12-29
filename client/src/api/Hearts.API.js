import { Axios } from 'src/api'

export const HeartsAPI = {
    refill: async payload => {
        const response = await Axios.post('/server/api/heart/refill', payload)
        return response
    },
}
