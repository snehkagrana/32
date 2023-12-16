import { createSlice } from '@reduxjs/toolkit'
import { reward_adminGetList, reward_getList } from './reward.thunk'

// Initial state
const initialState = {
    adminListRewardIsLoading: false,
    adminListRewardIsError: false,
    adminListRewardData: [],
    modalForm: {
        open: false,
        data: null,
    },
    openModalListReward: false,

    listRewardData: [],
    listRewardIsLoading: false,
    listRewardIsError: false,
}

// Actual Slice
export const rewardSlice = createSlice({
    name: 'reward',
    initialState,
    reducers: {
        reward_setModalForm(state, action) {
            state.modalForm = action.payload
        },
        reward_setOpenModalListReward(state, action) {
            state.openModalListReward = action.payload
        },
        reward_reset: () => initialState,
    },
    extraReducers: builder => {
        // Get list reward for admin
        builder.addCase(reward_adminGetList.pending, state => {
            state.adminListRewardIsLoading = true
            state.adminListRewardIsError = false
        })
        builder.addCase(reward_adminGetList.rejected, (state, action) => {
            state.adminListRewardIsLoading = false
            state.adminListRewardIsError = true
        })
        builder.addCase(reward_adminGetList.fulfilled, (state, action) => {
            state.adminListRewardIsError = false
            state.adminListRewardIsLoading = false
            state.adminListRewardData = action.payload?.data || []
        })

        // Get list reward for user basic
        builder.addCase(reward_getList.pending, state => {
            state.listRewardIsLoading = true
            state.listRewardIsError = false
        })
        builder.addCase(reward_getList.rejected, (state, action) => {
            state.listRewardIsLoading = false
            state.listRewardIsError = true
        })
        builder.addCase(reward_getList.fulfilled, (state, action) => {
            state.listRewardIsError = false
            state.listRewardIsLoading = false
            state.listRewardData = action.payload?.data || []
        })
    },
})

export const reward_reducerActions = rewardSlice.actions

export const reward_selectState = state => state.reward
