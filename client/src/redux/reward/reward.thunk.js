import { createAsyncThunk } from '@reduxjs/toolkit'
import { RewardApi } from 'src/api'

export const reward_adminGetList = createAsyncThunk(
    '@reward/reward_adminGetList',
    async (body, { rejectWithValue }) => {
        try {
            const response = await RewardApi.admin_findAll(body)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const reward_adminCreateReward = createAsyncThunk(
    '@reward/reward_adminCreateReward',
    async (body, { rejectWithValue }) => {
        try {
            const response = await RewardApi.admin_createReward(body)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const reward_getList = createAsyncThunk(
    '@reward/getList',
    async (params, { rejectWithValue }) => {
        try {
            const response = await RewardApi.findAll(params)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const reward_redeem = createAsyncThunk(
    '@reward/getList',
    async (body, { rejectWithValue }) => {
        try {
            const response = await RewardApi.redeem(body)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)
