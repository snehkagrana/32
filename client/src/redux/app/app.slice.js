import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
    app_paletteMode: 'light',
}

// Actual Slice
export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        app_setPaletteMode(state, action) {
            state.app_paletteMode = action.payload
        },
        app_togglePaletteMode(state) {
            state.app_paletteMode =
                state.app_paletteMode === 'dark' ? 'light' : 'dark'
        },
    },
})

export const app_reducerActions = appSlice.actions

export const app_selectState = state => state.app
