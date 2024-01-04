import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_ACTIVE_SOUND } from 'src/constants/app.constant'

// Initial state
export const appPersisted_initialState = {
    settings: {
        soundsEffect: DEFAULT_ACTIVE_SOUND,
    },
}

// Actual Slice
export const appPersistedSlice = createSlice({
    name: 'app.persisted',
    initialState: appPersisted_initialState,
    reducers: {
        appPersisted_setSettings(state, action) {
            state.settings = action.payload
        },
        appPersisted_reset: () => appPersisted_initialState,
    },
})

export const appPersisted_reducerActions = appPersistedSlice.actions

export const appPersisted_selectState = state => state['app.persisted']
