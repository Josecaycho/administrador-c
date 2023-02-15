import { API_GATEWAY } from '../../../../utils/constants';

export default {
    async getCampanias() {
      const response = await fetch(API_GATEWAY.URL + '/campanias');
      return response.json()
    },

    async editCampanias(payload) {
        const response = await fetch(API_GATEWAY.URL + '/campanias/'+payload.id ,
        {
            method: 'put',
            headers: {
              "Content-Type": "application/json",
              "x-access-token": "token-value",
            },
            body: JSON.stringify(payload),
        }
      );
      return response.json()
    },

    async saveCampanias(payload) {
        const response = await fetch(API_GATEWAY.URL + '/campanias/',
        {
          method: 'post',
          headers: {
            "Content-Type": "application/json",
            "x-access-token": "token-value",
          },
          body: JSON.stringify(payload),
        }
      );
      return response.json()
    },

    async deleteCampanias(payload) {
      const response = await fetch(API_GATEWAY.URL + '/campanias/'+payload.id,
      {
          method: 'delete',
      }
    );
    return response.json()
  }
}
