import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
    openSidebar: false,
    app_paletteMode: localStorage.getItem('theme') ?? 'light',
    skills: [],
    dailyXP: 0,
    totalXP: 0,
    modalLevelUp: {
        open: false,
        data: null,
    },
    openModalHowToEarnDiamond: false,
    openModalHeartRunOut: false,
    openModalConfirmCloseHeartRunOut: false,
}

// Actual Slice
export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        app_setOpenSidebar(state, action) {
            state.openSidebar = action.payload
        },
        app_setModalLevelUp(state, action) {
            state.modalLevelUp = action.payload
        },
        app_setPaletteMode(state, action) {
            state.app_paletteMode = action.payload
        },
        app_togglePaletteMode(state) {
            state.app_paletteMode =
                state.app_paletteMode === 'dark' ? 'light' : 'dark'
        },
        app_setSkills(state, action) {
            state.skills = action.payload
        },
        app_setDailyXP(state, action) {
            state.dailyXP = action.payload
        },
        app_setTotalXP(state, action) {
            state.totalXP = action.payload
        },
        app_setOpenModalHowToEarnDiamond(state, action) {
            state.openModalHowToEarnDiamond = action.payload
        },
        app_setOpenModalHeartRunOut(state, action) {
            state.openModalHeartRunOut = action.payload
        },
        app_setOpenModalConfirmCloseHeartRunOut(state, action) {
            state.openModalConfirmCloseHeartRunOut = action.payload
        },
    },
})

export const app_reducerActions = appSlice.actions

export const app_selectState = state => state.app
