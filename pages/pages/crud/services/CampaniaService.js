import { API_GATEWAY } from '../../../../utils/constants';

export default {
    async getCampanias() {
        const response = await fetch(API_GATEWAY.URL + '/campanias');
        return response.json()
    }
}
