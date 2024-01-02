import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_GUEST_NAME, MAX_HEARTS } from 'src/constants/app.constant'
import { auth_initGuest, auth_getGuest } from 'src/redux/auth/auth.thunk'

export const INITIAL_GUEST_DATA = {
    _id: null,
    displayName: DEFAULT_GUEST_NAME,
    email: '',
    role: 'basic',
    xp: {
        current: 0,
        daily: 0,
        total: 0,
        level: 1,
    },
    streak: 0,
    lastCompletedDay: null,
    diamond: 0,
    diamondInitialized: true,
    completedDays: {},
    last_played: null,
    rewards: [],
    imgPath: null,
    lastClaimedGemsDailyQuest: null,
    heart: MAX_HEARTS,
    lastHeartAccruedAt: null,
    createdAt: null,
    score: [],
    registerToken: null,
}

// Initial state
const initialState = {
    accessToken: null,
    guest: INITIAL_GUEST_DATA,
}

// Actual Slice
export const persistedGuestSlice = createSlice({
    name: 'guest.persisted',
    initialState,
    reducers: {
        persistedGuest_setGuest(state, action) {
            state.guest = action.payload
        },
        persistedGuest_reset: () => initialState,
    },
    extraReducers: builder => {
        // silent create guest account
        builder.addCase(auth_initGuest.fulfilled, (state, action) => {
            if (action?.payload?.data?._id) {
                state.guest = action.payload.data
            }
            if (action?.payload?.accessToken) {
                state.accessToken = action.payload.accessToken
            }
        })

        // get guest
        builder.addCase(auth_getGuest.fulfilled, (state, action) => {
            if (action?.payload?.data?._id) {
                state.guest = action.payload.data
            }
        })
    },
})

export const persistedGuest_reducerActions = persistedGuestSlice.actions

export const persistedGuest_selectState = state => state['guest.persisted']
