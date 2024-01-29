import { __DEV__ } from 'src/constants/app.constant'

export const appConfig = {
    appName: 'Fingo',
    // prettier-ignore
    appBaseUrl: __DEV__ ? `http://localhost:3000` : `${window.location.protocol}//${window.location.hostname}`,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL ?? '',
    sidebarWidth: 320,
    footerHeight: 78,
}
