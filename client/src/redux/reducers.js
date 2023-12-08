// Redux Toolkit
import { combineReducers } from '@reduxjs/toolkit'

// Slices & Apis
import { appSlice } from 'src/redux/app'

// plain reducers
const plainReducers = {
    [appSlice.name]: appSlice.reducer,
}

// root reducer
const combinedReducer = combineReducers(plainReducers)

const rootReducer = (state, action) => {
    return combinedReducer(state, action)
}

export { plainReducers, rootReducer }
