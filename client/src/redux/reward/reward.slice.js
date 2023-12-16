import { createSlice } from '@reduxjs/toolkit'
import { reward_adminGetList } from './reward.thunk'

// Initial state
const initialState = {
    listIsLoading: false,
    listIsError: false,
    listData: [],
    modalForm: {
        open: false,
        data: null,
    },
}

// Actual Slice
export const rewardSlice = createSlice({
    name: 'reward',
    initialState,
    reducers: {
        reward_setModalForm(state, action) {
            state.modalForm = action.payload
        },
        reward_reset: () => initialState,
    },
    extraReducers: builder => {
        // Login
        builder.addCase(reward_adminGetList.pending, state => {
            state.listIsLoading = true
            state.listIsError = false
        })
        builder.addCase(reward_adminGetList.rejected, (state, action) => {
            state.listIsLoading = false
            state.listIsError = true
        })
        builder.addCase(reward_adminGetList.fulfilled, (state, action) => {
            state.listIsError = false
            state.listIsLoading = false
            state.listData = action.payload?.data || []
        })
    },
})

export const reward_reducerActions = rewardSlice.actions

export const reward_selectState = state => state.reward
