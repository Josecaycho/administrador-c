import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import RegadoService from './services/CampaniaDetalleService'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { string } from 'yup';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import helpers from '../../../utils/helpers';

import { useRouter } from 'next/router'
import Breadcrumb from '../../components/breadcrumb';


const regadoComponent = () => {
  const router = useRouter()

  let emptyDetail = {
    costo_campania_poda: 0,
    cantidad_campania_poda: 0,
    costo_campania_fumigacion: 0,
    cantidad_campania_fumigacion: 0,
    costo_campania_regado: 0,
    cantidad_campania_regado: 0,
    costo_campania_abonado: 0,
    cantidad_campania_abonado: 0
};

  const [ controlCampania, setControlCampania ] = useState(emptyDetail)

  useEffect(() => {
    detalleCampania()
  }, []);

  const detalleCampania = () => {
    let selectItem = localStorage.getItem('campaniaSelected')
    RegadoService.getDetailCampanias(selectItem)
      .then((res) => {
        setControlCampania(res.data[0])
      })
      .catch(err => err)
  }

  const verDetalle = (ruta: string) => {
    router.push('/pages/detail-campania/'+ ruta)
  }

  return (
    <div className="grid">
      <div className="col-12 lg:col-12 xl:col-12">
        <Breadcrumb />
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
                <span className="block text-500 font-medium mb-3">Poda</span>
                <div className="text-900 font-medium text-xl">{`S/ ` + controlCampania.costo_campania_poda }</div>
            </div>
            <div className="flex align-items-center justify-content-center border-round">
                <Button onClick={(e) => verDetalle('poda')}>Ver detalles</Button>
            </div>
          </div>
          <span className="text-green-500 font-medium">Cantidad:  { controlCampania.cantidad_campania_poda } Poda </span>
          {/* <span className="text-500">since last visit</span> */}
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
                <span className="block text-500 font-medium mb-3">Fumigacion</span>
                <div className="text-900 font-medium text-xl">{`S/ ` + controlCampania.costo_campania_fumigacion }</div>
            </div>
            <div className="flex align-items-center justify-content-center border-round">
                <Button onClick={(e) => verDetalle('fumigacion')}>Ver detalles</Button>
            </div>
          </div>
          <span className="text-green-500 font-medium">Cantidad:  { controlCampania.cantidad_campania_fumigacion } Fumigacion </span>
          {/* <span className="text-500">since last visit</span> */}
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
                <span className="block text-500 font-medium mb-3">regado</span>
                <div className="text-900 font-medium text-xl">{`S/ ` + controlCampania.costo_campania_regado }</div>
            </div>
            <div className="flex align-items-center justify-content-center border-round">
                <Button onClick={(e) => verDetalle('regado')}>Ver detalles</Button>
            </div>
          </div>
          <span className="text-green-500 font-medium">Cantidad:  { controlCampania.cantidad_campania_regado } regado </span>
          {/* <span className="text-500">since last visit</span> */}
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
                <span className="block text-500 font-medium mb-3">abonado</span>
                <div className="text-900 font-medium text-xl">{`S/ ` + controlCampania.costo_campania_abonado}</div>
            </div>
          </div>
          <span className="text-green-500 font-medium">Cantidad:  { controlCampania.cantidad_campania_abonado} abonado </span>
          {/* <span className="text-500">since last visit</span> */}
        </div>
      </div>
    </div>
  );
};

export default regadoComponent;
