// const setBody = (init:any)=>{

//   let dateAudit = helpers.getActuallyDate().split("|");
//   let {body}=init;
//       body = {body:{ 
//         ...body,
//         auditoria: {
//           usuario: localStorageGet("rimac_user_info")  ? localStorageGet("rimac_user_info").email : null,
//           fecha: dateAudit[0], 
//           hora: dateAudit[1],
//           canal: "jvvida",
//           identificador_usuario: localStorageGet("rimac_user_info")  ? localStorageGet("rimac_user_info").id_usuario.toString() : null,
//           trace:  localStorageGet("rimac_user_info")  ? localStorageGet("rimac_user_info").trace : null,
//           autenticacion: localStorageGet('tkn')  || null,
//         }
//       }
//       }
//   return body;
// }




const get = async (apiName: any, path: any, init: any) => {
  try {
    const response = await get(apiName, path, init);
    return response;
  
  } catch (exception) {
    return exception
  }
}

const post = async (apiName: any, path: any, init: any) => {
  try {
    const response = await post(apiName, path, init);
    return response;
  
  } catch (exception) {
    return exception
  }
}

const put = async (apiName: any, path: any, init: any) => {
  try {
    const response = await put(apiName, path, init);
    return response;
  
  } catch (exception) {
    return exception
  }
}

const API_FETCH = {
get,
post,
put
}

export default API_FETCH;
