const formatDate = (inputDate: string) => {
  const [dd, mm, yyyy] = (inputDate).split('/');
  return yyyy + '-' + mm + '-' + dd;
};

const getActuallyDate = (date: any) => {
  let dateActual = new Date(date);
  let datestring =  dateActual.getFullYear()  + "-" +  ("0" + (dateActual.getMonth() + 1)).slice(-2)  + "-" + ("0" + dateActual.getDate()).slice(-2)
  return datestring;
};

const getFormatStringDate = (date: any) => {
  let firstDate = date.split('/')
  let dateFinal = new Date(firstDate[2] , firstDate[1] ,firstDate[0])
  
  return dateFinal
}

export default {
  formatDate,
  getActuallyDate,
  getFormatStringDate
}