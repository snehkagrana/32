import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'

// Redux Persist
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Reducers
import { rootReducer } from './reducers'

import { unauthenticatedMiddleware } from './middlewares'
import { authPersistedSlice } from './auth/auth.persisted.slice'
// import { appSlice } from 'src/redux/app'

// Config for Redux Persist
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: [authPersistedSlice.name],
}

// Listener Middleware
export const listenerMiddleware = createListenerMiddleware()

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        })
            .prepend(listenerMiddleware.middleware)
            .concat([unauthenticatedMiddleware]),
    devTools: true,
})

const persistor = persistStore(store)

export { store, persistor }
