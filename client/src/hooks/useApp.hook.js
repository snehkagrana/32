import { useMemo } from 'react'
import { app_selectState, app_reducerActions } from 'src/redux/app'
import { useSelector } from 'react-redux'

const useApp = () => {
    const state = useSelector(app_selectState)

    const app_isDarkTheme = useMemo(() => {
        return state.app_paletteMode === 'dark'
    }, [state.app_paletteMode])

    return {
        app_isDarkTheme,
        ...state,
        ...app_reducerActions,
    }
}

export { useApp }
