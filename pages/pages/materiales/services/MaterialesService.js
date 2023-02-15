import { API_GATEWAY } from '../../../../utils/constants';

export default {
    async getMateriales() {
      const response = await fetch(API_GATEWAY.URL + '/materiales');
      return response.json()
    },

    async editMateriales(payload) {
        const response = await fetch(API_GATEWAY.URL + '/materiales/'+payload.id ,
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

    async saveMateriales(payload) {
        const response = await fetch(API_GATEWAY.URL + '/materiales/',
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

    async deleteMateriales(payload) {
      const response = await fetch(API_GATEWAY.URL + '/materiales/'+payload.id,
      {
          method: 'delete',
      }
    );
    return response.json()
  }
}
