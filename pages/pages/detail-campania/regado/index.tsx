import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import RegadoService from '../services/CampaniaDetalleService'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { string } from 'yup';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import helpers from '../../../../utils/helpers';


const regadoComponent = () => {
  let dateNow = new Date
  let emptyPoda = {
    id: null,
    fecha_poda: dateNow,
    fecha_fin_poda: dateNow,
    tipo_poda: null,
    observaciones: string,
    fecha_limpieza: dateNow,
    fecha_fin_limpieza: dateNow,
    trabajadores: 0,
    trabajadores_limpieza: 0,
    jornales: 0,
    jornales_limpieza: 0,
    costo: 0,
    costo_limpieza: 0,
    campania_tipo_poda_id: 0
};

  const [regados, setRegados] = useState([]);
  const [regado, setRegado] = useState([])
  const [modalRiego, setModalRiego] = useState(false)
  const [fumigacion, setFumigacion] = useState([]);
  const [abono, setAbono] = useState([]);
  const [podas, setPodas] = useState([]);
  const [poda, setPoda] = useState(emptyPoda);
  const [tiposPoda, setTiposPoda] = useState([]);
  const [costoTotalRiego, setCostoTotalRiego ] = useState<number>()

  useEffect(() => {
    let costoTotal: any = poda.costo * poda.jornales * poda.trabajadores
    setCostoTotalRiego(costoTotal)
  }, [
    poda.costo,
    poda.jornales,
    poda.trabajadores
  ]);

  useEffect(() => {
    tiposRegados()
  }, []);

  const tiposRegados = () => {
    RegadoService.getTypes()
      .then((res) => {
        setTiposPoda(res.data.poda)
      })
      .catch(err => err)
  }
  
  useEffect(() => {
    allData()
  }, []);

  const allData = () => {
    try {
      let selectItem = localStorage.getItem('campaniaSelected')
      RegadoService.getCampaniasRegado(selectItem)
      .then((res) => {
        console.log(JSON.parse(res.data[0].poda))
        setRegados(JSON.parse(res.data[0].regado))
        setFumigacion(JSON.parse(res.data[0].fumigacion))
        setAbono(JSON.parse(res.data[0].abonado))
        setPodas(JSON.parse(res.data[0].poda))
      })
      .catch(err => err)
    } catch (error) {
      
    }
  }

  const rigthTitleTemplate = (title: string) => {
    return (
        <React.Fragment>
            <div className="my-2">
                <h3>{title}</h3>
            </div>
        </React.Fragment>
    );
  }

  const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2"/>
            </div>
        </React.Fragment>
    );
  };

  const verDetallePoda = (poda: any) => {
    setModalRiego(true)
    let podaSend = {
      ...poda,
      fecha_poda:  helpers.getFormatStringDate(poda.fecha_poda),
      fecha_fin_poda: helpers.getFormatStringDate(poda.fecha_fin_poda),
      tipo_poda: {
        id: poda.campania_tipo_poda_id,
        name: poda.tipo_poda
      }
    }
    setPoda(podaSend)
  }

  const actionBodyTemplate = (rowData) => {
    return (
        <>
            {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2 mb-2" onClick={() => editProduct(rowData)} /> */}
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2 mb-2" onClick={() => confirmDeleteProduct(rowData)} /> */}
            <Button icon="pi pi-align-justify" tooltip="Ver detalle"  className="p-button-rounded mb-2" onClick={() => verDetallePoda(rowData)} />
        </>
    );
  };

  const costoRiegp = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {(rowData.trabajadores * rowData.jornales * rowData.costo).toFixed(2)}
      </>
    );
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _regado = { ...regado };
    _regado[`${name}`] = val.replace(/^(0+)/g, '');

    setRegado(_regado);
  };

  const onSelectChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _regado = { ...regado };
    _regado[`${name}`] = {id:e.id, name: e.name}

    setRegado(_regado);
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-12">
        <div className="card">
        <Toolbar className="mb-4" left={rigthTitleTemplate('Control de Poda')} right={leftToolbarTemplate}></Toolbar>
          <DataTable
              value={podas}
              paginator
              className="p-datatable-gridlines"
              showGridlines
              rows={10}
              dataKey="id"
              responsiveLayout="scroll"
              emptyMessage="No customers found."
          >
              <Column field="id" header="Id" style={{ minWidth: '12rem' }} />
              <Column field="tipo_poda" header="Categoria" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="fecha_poda" header="Fecha de Poda" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="costo" header="Costo" body={costoRiegp} style={{ minWidth: '12rem' }} />
              <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
          </DataTable>
        </div>
        <div className="card">
          <h5>Control de riego</h5>
          <DataTable
              value={regados}
              paginator
              className="p-datatable-gridlines"
              showGridlines
              rows={10}
              dataKey="id"
              responsiveLayout="scroll"
              emptyMessage="No customers found."
          >
              <Column field="id" header="Id" style={{ minWidth: '12rem' }} />
              <Column field="fecha_regado" header="Fecha de Regado" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="observaciones" header="observaciones" style={{ minWidth: '12rem' }} />
          </DataTable>
        </div>
        <div className="card">
          <h5>Control de Fumigacion</h5>
          <DataTable
              value={fumigacion}
              paginator
              className="p-datatable-gridlines"
              showGridlines
              rows={10}
              dataKey="id"
              responsiveLayout="scroll"
              emptyMessage="No customers found."
          >
              <Column field="id" header="Id" style={{ minWidth: '12rem' }} />
              <Column field="fecha_fumigacion" header="Fecha de Fumigacion" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="observaciones" header="observaciones" style={{ minWidth: '12rem' }} />
          </DataTable>
        </div>
        <div className="card">
          <h5>Control de Abono</h5>
          <DataTable
              value={abono}
              paginator
              className="p-datatable-gridlines"
              showGridlines
              rows={10}
              dataKey="id"
              responsiveLayout="scroll"
              emptyMessage="No customers found."
          >
              <Column field="id" header="Id" style={{ minWidth: '12rem' }} />
              <Column field="fecha_abono" header="Fecha de Abono" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="observaciones" header="observaciones" style={{ minWidth: '12rem' }} />
          </DataTable>
        </div>
      </div>

      <Dialog header="Riego" className="p-fluid" visible={modalRiego} onHide={() => setModalRiego(false)}
          style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} draggable={false} resizable={false}>
          
        <Divider align="left">
          <h5>Detalle</h5>
        </Divider>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
              <label htmlFor="anio">Año</label>
              <Dropdown value={poda.tipo_poda} onChange={(e) => onSelectChange(e.value, 'tipo_poda')} id="tipo_poda" options={tiposPoda} optionLabel="name"/>
          </div>
          <div className="field flex-1">
            <label htmlFor="name">Fecha de Inicio</label>
            <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar value={poda.fecha_poda}></Calendar>
          </div>
          <div className="field flex-1">
            <label htmlFor="name">Fecha de Fin</label>
            <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar value={poda.fecha_fin_poda}></Calendar>
          </div>
        </div>
        <Divider align="left">
          <h5>Gastos</h5>
        </Divider>
        <div className="flex flex-column md:flex-row gap-3">
          <div className='field flex-1'>
            <label>Trabajadores</label>
            <InputText id="trabajadores" placeholder='0' value={poda.trabajadores} onChange={(e) => onInputChange(e, 'trabajadores')} />
          </div>
          <div className='field flex-1'>
            <label>Jornales</label>
            <InputText id="jornales" placeholder='0' value={poda.jornales} onChange={(e) => onInputChange(e, 'jornales')} />
          </div>
          <div className='field flex-1'>
            <label>Costo mano de obra</label>
            <InputText id="costo" placeholder='0' value={poda.costo} onChange={(e) => onInputChange(e, 'costo')}/>
          </div>
          <div className='field flex-1'>
            <label>Costo total</label>
            <InputText id="name" placeholder='0' value={`S/ `+costoTotalRiego} disabled />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default regadoComponent;
