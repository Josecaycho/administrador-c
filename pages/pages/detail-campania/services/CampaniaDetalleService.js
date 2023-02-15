import { API_GATEWAY } from '../../../../utils/constants';

export default {
  async getDetailCampanias(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/detalle/'+payload);
    return response.json()
  },

  async getDetailCampaniasPoda(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/detalle/poda/'+payload);
    return response.json()
  },

  async getTypes(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/types');
    return response.json()
  },
}
