import { API_GATEWAY } from '../../../../utils/constants';

export default {
    async getFilas() {
      const response = await fetch(API_GATEWAY.URL + '/filas');
      return response.json()
    },

    async editFilas(payload) {
        const response = await fetch(API_GATEWAY.URL + '/filas/'+payload.id ,
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

    async saveFilas(payload) {
        const response = await fetch(API_GATEWAY.URL + '/filas/',
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

    async deleteFilas(payload) {
        const response = await fetch(API_GATEWAY.URL + '/filas/'+payload.id,
        {
            method: 'delete',
        }
      );
      return response.json()
    },

    async addVariedadFila(payload) {
      const response = await fetch(API_GATEWAY.URL + '/filas/addVariedadfilas/',
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

    async deleteVariedadFila(payload) {
      const response = await fetch(API_GATEWAY.URL + '/filas/deleteFilasVariedad/'+payload.id,
      {
          method: 'delete',
      }
    );
    return response.json()
  },
}
