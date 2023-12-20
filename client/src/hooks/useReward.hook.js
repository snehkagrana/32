import { useSelector } from 'react-redux'
import { reward_selectState, reward_reducerActions } from 'src/redux/reward'
import * as reward_thunkActions from 'src/redux/reward/reward.thunk'

export const useReward = () => {
    const state = useSelector(reward_selectState)

    return {
        ...state,
        ...reward_reducerActions,
        ...reward_thunkActions,
    }
}
