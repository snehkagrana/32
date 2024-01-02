import { Axios } from 'src/api'

export const QuizAPI = {
    saveScore: async payload => {
        const response = await Axios.post('/server/api/save-score', payload)
        return response?.data
    },
    saveXP: async payload => {
        const response = await Axios.post('/server/api/save-xp', payload)
        return response?.data
    },
}
