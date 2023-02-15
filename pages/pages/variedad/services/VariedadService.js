import { API_GATEWAY } from '../../../../utils/constants';

export default {
    async getVariedad() {
      const response = await fetch(API_GATEWAY.URL + '/variedad');
      return response.json()
    },

    async editVariedad(payload) {
        const response = await fetch(API_GATEWAY.URL + '/variedad/'+payload.id ,
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

    async saveVariedad(payload) {
        const response = await fetch(API_GATEWAY.URL + '/variedad/',
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

    async deleteVariedad(payload) {
      const response = await fetch(API_GATEWAY.URL + '/variedad/'+payload.id,
      {
          method: 'delete',
      }
    );
    return response.json()
  }
}
