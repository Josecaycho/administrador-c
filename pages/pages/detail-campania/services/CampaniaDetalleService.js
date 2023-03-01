import { API_GATEWAY } from '../../../../utils/constants';

export default {
  async getDetailCampanias(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/detalle/'+payload);
    return response.json()
  },

  async getDetailCampaniasCampania(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/detalle/campania/'+payload);
    return response.json()
  },

  async getDetailCampaniasCampaniaFumigacion(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/detalle/campania/fumigacion/'+payload);
    return response.json()
  },

  async getDetailCampaniasCampaniaAbonado(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/detalle/campania/abonado/'+payload);
    return response.json()
  },

  async getTypes(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/typesP');
    return response.json()
  },

  async formasFumigacion(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/formasFumigacion');
    return response.json()
  },

  async tiposFumigacion(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/tiposFumigacion');
    return response.json()
  },

  async materialesFumigacion(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/materialesFumigacion');
    return response.json()
  },

  async materialesAbonado(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/materialesAbonado');
    return response.json()
  },

  async nuevoPoda(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/poda',
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

  async editPoda(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/poda/'+ payload.id ,
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

  async nuevoRiego(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/riego',
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

  async editRiego(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/riego/'+ payload.id ,
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

  async editfumigacion(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/fumigacion/'+ payload.id ,
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

  async nuevofumigacion(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/fumigacion',
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

  async editabonado(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/abonado/'+ payload.id ,
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

  async nuevoabonado(payload) {
    const response = await fetch(API_GATEWAY.URL + '/campanias/abonado',
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


}
