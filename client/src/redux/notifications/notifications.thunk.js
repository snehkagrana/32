import { createAsyncThunk } from '@reduxjs/toolkit'
import { NotificationsAPI } from 'src/api'

export const notifications_getNotificationRecipients = createAsyncThunk(
    '@reward/notifications_getNotificationRecipients',
    async (body, { rejectWithValue }) => {
        try {
            const response =
                await NotificationsAPI.getNotificationRecipients(body)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const notifications_sendGeneralNotifications = createAsyncThunk(
    '@reward/notifications_sendGeneralNotifications',
    async (body, { rejectWithValue }) => {
        try {
            const response =
                await NotificationsAPI.admin_sendGeneralNotifications(body)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const notifications_getList = createAsyncThunk(
    '@reward/getList',
    async (params, { rejectWithValue }) => {
        try {
            const response = await NotificationsAPI.findAll(params)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)
