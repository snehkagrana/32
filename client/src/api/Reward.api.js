import { Axios } from 'src/api'

export const RewardApi = {
    admin_createOrUpdateReward: async (body, isEdit) => {
        const endpoint = isEdit
            ? '/server/api/admin/reward/update'
            : '/server/api/admin/reward'
        const response = await Axios.post(endpoint, body)
        return response?.data
    },
    admin_findAll: async params => {
        const response = await Axios.get('/server/api/admin/reward', { params })
        return response?.data
    },
    admin_delete: async body => {
        const response = await Axios.post(
            '/server/api/admin/reward/delete',
            body
        )
        return response?.data
    },
    upload: async body => {
        const response = await Axios.post(
            '/server/api/admin/reward/upload',
            body
        )
        return response?.data
    },

    findAll: async params => {
        const response = await Axios.get('/server/api/reward', { params })
        return response?.data
    },
    redeem: async body => {
        const response = await Axios.post('/server/api/reward/redeem', body)
        return response?.data
    },
    findAllMyReward: async params => {
        const response = await Axios.get('/server/api/account/my-reward', {
            params,
        })
        return response?.data
    },
}
