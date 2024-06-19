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

    // notification template
    admin_getListNotificationTemplate: async params => {
        const response = await Axios.get(
            `/server/api/admin/notification/template`,
            { params }
        )
        return response?.data
    },

    admin_createOrUpdateNotificationTemplate: async (body, isUpdate) => {
        if (body?._id && isUpdate) {
            const response = await Axios.put(
                `/server/api/admin/notification/template/${body._id}`,
                body
            )
            return response?.data
        } else {
            const response = await Axios.post(
                `/server/api/admin/notification/template`,
                body
            )
            return response?.data
        }
    },

    admin_deleteNotificationTemplate: async id => {
        const response = await Axios.delete(
            `/server/api/admin/notification/template/${id}`
        )
        return response?.data
    },

    admin_uploadImage: async body => {
        const response = await Axios.post(
            `/server/api/admin/notification/image`,
            body
        )
        return response?.data
    },

    // notification history
    admin_getListNotificationHistory: async params => {
        const response = await Axios.get(
            `/server/api/admin/notification/history`,
            { params }
        )
        return response?.data
    },
}
