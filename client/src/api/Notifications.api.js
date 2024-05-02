import { Axios } from 'src/api'

export const NotificationsAPI = {
    admin_sendGeneralNotifications: async body => {
        const response = await Axios.post(
            `/server/api/admin/notification/general/send`,
            body
        )
        return response?.data
    },

    getNotificationRecipients: async body => {
        const response = await Axios.get(
            '/server/api/admin/notification/users',
            { ...body }
        )
        return response?.data
    },

    findAll: async params => {
        const response = await Axios.get('/server/api/notification/list', {
            params,
        })
        return response?.data
    },
}
