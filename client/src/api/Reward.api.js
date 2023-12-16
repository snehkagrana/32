import { Axios } from 'src/api'

export const RewardApi = {
    admin_createReward: async body => {
        const response = await Axios.post('/server/api/admin/reward', body)
        return response?.data
    },
    admin_findAll: async params => {
        const response = await Axios.get('/server/api/admin/reward', { params })
        return response?.data
    },
}
