import { createSlice } from '@reduxjs/toolkit'
import {
    notifications_getNotificationRecipients,
    notifications_getList,
    notifications_getListNotificationTemplate,
} from './notifications.thunk'

// Initial state
const initialState = {
    notificationRecipientsIsLoading: false,
    notificationRecipientsIsError: false,
    notificationRecipientsData: [],
    openModalUserRecipients: false,
    selectedUserRecipients: [],
    openModallistNotificaitons: false,
    openModalListMyReward: false,
    openModalClaimReward: {
        open: false,
        data: {
            type: null,
            value: 0,
        },
    },
    modalDetail: {
        open: false,
        data: null,
    },

    listNotificaitonsData: [],
    listNotificaitonsIsLoading: false,
    listNotificaitonsIsError: false,

    listNotificationTemplateData: [],
    listNotificationTemplateIsLoading: false,
    listNotificationTemplateIsError: false,
}

// Actual Slice
export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        notifications_setOpenModalUserRecipients(state, action) {
            state.openModalUserRecipients = action.payload
        },
        notifications_setSelectedUserRecipients(state, action) {
            state.selectedUserRecipients = action.payload
        },
        notifications_setOpenModallistNotificaitons(state, action) {
            state.openModallistNotificaitons = action.payload
        },
        notifications_setOpenModalListMyReward(state, action) {
            state.openModalListMyReward = action.payload
        },
        notifications_setOpenModalClaimReward(state, action) {
            state.openModalClaimReward = action.payload
        },
        notifications_setModalDetail(state, action) {
            state.modalDetail = action.payload
        },
        notifications_reset: () => initialState,
    },
    extraReducers: builder => {
        // Get list notification  for admin
        builder.addCase(
            notifications_getNotificationRecipients.pending,
            state => {
                state.notificationRecipientsIsLoading = true
                state.notificationRecipientsIsError = false
            }
        )
        builder.addCase(
            notifications_getNotificationRecipients.rejected,
            (state, action) => {
                state.notificationRecipientsIsLoading = false
                state.notificationRecipientsIsError = true
            }
        )
        builder.addCase(
            notifications_getNotificationRecipients.fulfilled,
            (state, action) => {
                state.notificationRecipientsIsError = false
                state.notificationRecipientsIsLoading = false
                state.notificationRecipientsData = action.payload?.data || []
            }
        )

        builder.addCase(notifications_getList.pending, state => {
            state.listNotificaitonsIsLoading = true
            state.listNotificaitonsIsError = false
        })
        builder.addCase(notifications_getList.rejected, (state, action) => {
            state.listNotificaitonsIsLoading = false
            state.listNotificaitonsIsError = true
        })
        builder.addCase(notifications_getList.fulfilled, (state, action) => {
            state.listNotificaitonsIsError = false
            state.listNotificaitonsIsLoading = false
            state.listNotificaitonsData = action.payload?.data || []
        })

        builder.addCase(
            notifications_getListNotificationTemplate.pending,
            state => {
                state.listNotificationTemplateIsLoading = true
                state.listNotificationTemplateIsError = false
            }
        )
        builder.addCase(
            notifications_getListNotificationTemplate.rejected,
            (state, action) => {
                state.listNotificationTemplateIsLoading = false
                state.listNotificationTemplateIsError = true
            }
        )
        builder.addCase(
            notifications_getListNotificationTemplate.fulfilled,
            (state, action) => {
                state.listNotificationTemplateIsError = false
                state.listNotificationTemplateIsLoading = false
                state.listNotificationTemplateData = action.payload?.data || []
            }
        )
    },
})

export const notifications_reducerActions = notificationsSlice.actions

export const notifications_selectState = state => state.notifications
