import { Axios } from 'src/api'

export const InformationAPI = {
    getDropdown: async params => {
        const response = await Axios.get('/server/api/information/dropdown', {
            params,
        })
        return response
    },
}
