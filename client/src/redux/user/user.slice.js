import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
    completedDays: [],
}

// Actual Slice
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_setCompletedDays(state, action) {
            state.completedDays = action.payload
        },
    },
})

export const user_reducerActions = userSlice.actions

export const user_selectState = state => state.user
