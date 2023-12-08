import { useSelector } from 'react-redux'
import { user_reducerActions, user_selectState } from 'src/redux/user'

export const useUser = () => {
    const state = useSelector(user_selectState)

    return {
        ...state,
        ...user_reducerActions,
    }
}
