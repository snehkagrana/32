// Redux & Redux Persist
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

// Store
import { persistor, store } from 'src/redux'

const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate loading='Loading...' persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}

export default ReduxProvider
