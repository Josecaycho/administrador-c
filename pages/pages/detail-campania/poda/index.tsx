import React, { useEffect, useState , useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import CampaniaService from '../services/CampaniaDetalleService'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { string } from 'yup';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import helpers from '../../../../utils/helpers';
import { Toast } from 'primereact/toast';



const regadoComponent = () => {
  const toast = useRef(null);
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

  const [modalPoda, setModalPoda] = useState(false)
  const [podas, setPodas] = useState([]);
  const [poda, setPoda] = useState(emptyPoda);
  const [tiposPoda, setTiposPoda] = useState([]);
  const [costoTotalPoda, setCostoTotalPoda ] = useState<number>()
  const [costoTotalPodaLimpieza, setCostoTotalPodaLimpieza ] = useState<number>()
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    let costoTotal: any = poda.costo * poda.jornales * poda.trabajadores
    setCostoTotalPoda(costoTotal)
  }, [
    poda.costo,
    poda.jornales,
    poda.trabajadores
  ]);

  useEffect(() => {
    let costoTotal: any = poda.costo_limpieza * poda.jornales_limpieza * poda.trabajadores_limpieza
    setCostoTotalPodaLimpieza(costoTotal)
  }, [
    poda.costo_limpieza,
    poda.jornales_limpieza,
    poda.trabajadores_limpieza
  ]);

  useEffect(() => {
    tiposPodas()
  }, []);

  const tiposPodas = () => {
    CampaniaService.getTypes()
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
      CampaniaService.getDetailCampaniasCampania(selectItem)
      .then((res) => {
        setPodas(JSON.parse(res.data[0].poda))
        setTimeout(() => {
          setLoading(false)
        }, 1000);
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

  const openNew = () => {
    setPoda(emptyPoda);
    setModalPoda(true);
  };

  const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew}/>
                <Button icon="pi pi-refresh" className="p-button-rounded mr-2" onClick={(e) => {allData(), setLoading(true) }} />
            </div>
        </React.Fragment>
    );
  };

  const verDetallePoda = (poda: any) => {
    setModalPoda(true)
    let podaSend = {
      ...poda,
      fecha_poda: poda.fecha_poda !== '00/00/0000' ? helpers.getFormatStringDate(poda.fecha_poda) : null,
      fecha_fin_poda: poda.fecha_fin_poda !== '00/00/0000' ? helpers.getFormatStringDate(poda.fecha_fin_poda) : null,
      fecha_limpieza: poda.fecha_limpieza !== '00/00/0000' ? helpers.getFormatStringDate(poda.fecha_limpieza) : null,
      fecha_fin_limpieza: poda.fecha_fin_limpieza !== '00/00/0000' ? helpers.getFormatStringDate(poda.fecha_fin_limpieza) : null,
      tipo_poda: {
        id: poda.campania_tipo_poda_id,
        name: poda.tipo_poda
      }
    }
    setPoda(podaSend)
  };

  const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2 mb-2" onClick={() => verDetallePoda(rowData)} />
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2 mb-2" onClick={() => confirmDeleteProduct(rowData)} /> */}
            <Button icon="pi pi-align-justify" tooltip="Ver detalle"  className="p-button-rounded mb-2" onClick={() => {verDetallePoda(rowData), setDisabled(true)}} />
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
    let _poda = { ...poda };
    _poda[`${name}`] = val.replace(/^(0+)/g, '');

    setPoda(_poda);
  };

  const onSelectChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _poda = { ...poda };
    _poda[`${name}`] = {id:e.id, name: e.name}

    setPoda(_poda);
  };

  const onSelectCalendar = (e, name) => {
    let datess = e
    let _poda = { ...poda };
    _poda[`${name}`] = datess;
    setPoda(_poda);
  }

  const savePoda = () => {
    let _poda = { ...poda };
    if (poda.id) {
      let json = {
        ...poda,
        fecha_poda: helpers.getActuallyDate(poda.fecha_poda),
        fecha_fin_poda: helpers.getActuallyDate(poda.fecha_fin_poda),
        fecha_limpieza: helpers.getActuallyDate(poda.fecha_limpieza),
        fecha_fin_limpieza: helpers.getActuallyDate(poda.fecha_fin_limpieza),
        campania_tipo_poda_id: poda.tipo_poda.id,
        campania_id: localStorage.getItem('campaniaSelected')
      }

      console.log(json)

      CampaniaService.editPoda(json)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Poda Editada', life: 3000 });
        allData()
      })
    } else {
      let json = {
        ...poda,
        fecha_poda: helpers.getActuallyDate(poda.fecha_poda),
        fecha_fin_poda: helpers.getActuallyDate(poda.fecha_fin_poda),
        fecha_limpieza: helpers.getActuallyDate(poda.fecha_limpieza),
        fecha_fin_limpieza: helpers.getActuallyDate(poda.fecha_fin_limpieza),
        campania_tipo_poda_id: poda.tipo_poda.id,
        campania_id: localStorage.getItem('campaniaSelected')
      }

      CampaniaService.nuevoPoda(json)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'allData Agregada', life: 3000 });
        allData()
      })
    }
    setModalPoda(false)
  };

  const podaDialogFooter = () => {
    if(!disabled) {
      return <>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => {setModalPoda(false), setDisabled(false)}}/>
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePoda} />
            </>
    }
  }

  return (
    <div className="grid">
      <div className="col-12 md:col-12">
        <div className="card">
        <Toast ref={toast} />
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
              loading={loading}
          >
              <Column field="id" header="Orden" style={{ minWidth: '2rem' }} />
              <Column field="tipo_poda" header="Tipo de Poda" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="fecha_poda" header="Fecha Inico de Poda" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="costo" header="Costo" body={costoRiegp} style={{ minWidth: '12rem' }} />
              <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog header="Poda" className="p-fluid" visible={modalPoda} onHide={() => {setModalPoda(false), setDisabled(false)}}
          style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} draggable={false} resizable={false}
          footer={podaDialogFooter}>
          
        <Divider align="left">
          <h5>Detalle / Gastos</h5>
        </Divider>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
              <label htmlFor="anio">Año</label>
              <Dropdown value={poda.tipo_poda} onChange={(e) => onSelectChange(e.value, 'tipo_poda')} id="tipo_poda" options={tiposPoda} optionLabel="name" disabled={disabled}/>
          </div>
          <div className="field flex-1">
            <label htmlFor="name">Fecha de Inicio</label>
            <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar value={poda.fecha_poda} disabled={disabled} onChange={(e) => onSelectCalendar(e.value, 'fecha_poda')}></Calendar>
          </div>
          <div className="field flex-1">
            <label htmlFor="name">Fecha de Fin</label>
            <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar minDate={poda.fecha_poda} value={poda.fecha_fin_poda} disabled={disabled} onChange={(e) => onSelectCalendar(e.value, 'fecha_fin_poda')}></Calendar>
          </div>
        </div>
        <div className="flex flex-column md:flex-row gap-3">
          <div className='field flex-1'>
            <label>Trabajadores</label>
            <InputText id="trabajadores" placeholder='0' value={poda.trabajadores} onChange={(e) => onInputChange(e, 'trabajadores')} disabled={disabled} />
          </div>
          <div className='field flex-1'>
            <label>Jornales</label>
            <InputText id="jornales" placeholder='0' value={poda.jornales} onChange={(e) => onInputChange(e, 'jornales')} disabled={disabled} />
          </div>
          <div className='field flex-1'>
            <label>Costo mano de obra</label>
            <InputText id="costo" placeholder='0' value={poda.costo} onChange={(e) => onInputChange(e, 'costo')} disabled={disabled}/>
          </div>
          <div className='field flex-1'>
            <label>Costo total</label>
            <InputText id="name" placeholder='0' value={`S/ `+costoTotalPoda} disabled />
          </div>
        </div>
        {
          poda.tipo_poda != null ? (
            poda.tipo_poda.id == 1 ? (
              <div>
                <Divider align="left" >
                  <h5>Limpieza de Campo / Gastos</h5>
                </Divider>
                <div className="flex flex-column md:flex-row gap-3 mb-3">
                  <div className="field flex-1">
                    <label htmlFor="name">Fecha de Inicio</label>
                    <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar minDate={poda.fecha_fin_poda} value={poda.fecha_limpieza} disabled={disabled} onChange={(e) => onSelectCalendar(e.value, 'fecha_limpieza')}></Calendar>
                  </div>
                  <div className="field flex-1">
                    <label htmlFor="name">Fecha de Fin</label>
                    <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar minDate={poda.fecha_limpieza} value={poda.fecha_fin_limpieza} disabled={disabled} onChange={(e) => onSelectCalendar(e.value, 'fecha_fin_limpieza')}></Calendar>
                  </div>
                </div>
                <div className="flex flex-column md:flex-row gap-3">
                  <div className='field flex-1'>
                    <label>Trabajadores</label>
                    <InputText id="trabajadores_limpieza" placeholder='0' value={poda.trabajadores_limpieza} onChange={(e) => onInputChange(e, 'trabajadores_limpieza')} disabled={disabled} />
                  </div>
                  <div className='field flex-1'>
                    <label>Jornales</label>
                    <InputText id="jornales_limpieza" placeholder='0' value={poda.jornales_limpieza} onChange={(e) => onInputChange(e, 'jornales_limpieza')} disabled={disabled} />
                  </div>
                  <div className='field flex-1'>
                    <label>Costo mano de obra</label>
                    <InputText id="costo_limpieza" placeholder='0' value={poda.costo_limpieza} onChange={(e) => onInputChange(e, 'costo_limpieza')} disabled={disabled}/>
                  </div>
                  <div className='field flex-1'>
                    <label>Costo total</label>
                    <InputText id="name" placeholder='0' value={`S/ `+costoTotalPodaLimpieza} disabled />
                  </div>
                </div>
              </div>
            ) : ""
          ) : ""
        }
      </Dialog>
    </div>
  );
};

export default regadoComponent;
