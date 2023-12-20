import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
    openModalVerifyAction: false,
    isVerified: false,
}

// Actual Slice
export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        admin_setOpenModalVerifyAction(state, action) {
            state.openModalVerifyAction = action.payload
        },
        admin_setIsVerified(state, action) {
            state.isVerified = action.payload
        },
        admin_reset: () => initialState,
    },
    extraReducers: builder => {
        // add extra reducers if we need
    },
})

export const admin_reducerActions = adminSlice.actions

export const admin_selectState = state => state.admin
