import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
    displayName: 'Stranger',
    email: '',
    role: 'basic',
    xp: {
        current: 0,
        daily: 0,
        total: 0,
        level: 1,
    },
    streak: 0,
    lastCompletedDay: {},
    score: [],
    diamondInitialized: true,
    completedDays: {},
    last_played: null,
    rewards: [],
    imgPath: null,
    diamond: 0,
    lastClaimedGemsDailyQuest: null,
}

// Actual Slice
export const persistedGuestSlice = createSlice({
    name: 'guest.persisted',
    initialState,
    reducers: {
        persistedGuest_setScore(state, action) {
            state.score = action.payload
        },
        persistedGuest_setLastPlayed(state, action) {
            state.last_played = action.payload
        },
        persistedGuest_reset: () => initialState,
    },
})

export const persistedGuest_reducerActions = persistedGuestSlice.actions

export const persistedGuest_selectState = state => state['guest.persisted']
