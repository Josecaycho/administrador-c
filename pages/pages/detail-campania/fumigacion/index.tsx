import React, { useEffect, useState , useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import CampaniaService from '../services/CampaniaDetalleService'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { array, number, string } from 'yup';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import helpers from '../../../../utils/helpers';
import { Toast } from 'primereact/toast';
import { json } from 'stream/consumers';
import { Chip } from 'primereact/chip';
import { MoreLinkRoot } from '@fullcalendar/core';


const regadoComponent = () => {
  const toast = useRef(null);
  let dateNow = new Date
  let emptyFumigacion = {
    id: null,
    campania_id: number,
    fecha_fumigacion: dateNow,
    trabajadores: 0,
    jornales: 0,
    costo: 0,
    all_materiales: [],
    tipo_fumigacion: null,
    forma_fumigacion: null
  };

  const tiposDosis = ["ML","KG","LT"]

  const [modalfumigacion, setModalfumigacion] = useState(false)
  const [fumigacions, setfumigacions] = useState([]);
  const [fumigacion, setfumigacion] = useState(emptyFumigacion);
  const [formasFumigacion, setFormasFumigacion] = useState([]);
  const [tiposFumigacion, setTiposFumigacion] = useState([]);
  const [materialesFumigacion, setMaterialesFumigacion] = useState([]);
  const [costoTotalfumigacion, setCostoTotalfumigacion ] = useState<number>()
  const [costoTotalfumigacionLimpieza, setCostoTotalfumigacionLimpieza ] = useState<number>()
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false)
  const [materialesView, setMaterialesView] = useState([])

  useEffect(() => {
    let costoTotal: any = fumigacion.costo * fumigacion.jornales
    setCostoTotalfumigacion(costoTotal)
  }, [
    fumigacion.costo,
    fumigacion.jornales,
    fumigacion.trabajadores
  ]);


  useEffect(() => {
    tiposfumigacions()
  }, []);

  const tiposfumigacions = () => {
    try {
      CampaniaService.formasFumigacion()
      .then((res) => {
        setFormasFumigacion(res.data)
      })
      .catch(err => err) 

      CampaniaService.tiposFumigacion()
      .then((res) => {
        setTiposFumigacion(res.data)
      })
      .catch(err => err) 

      CampaniaService.materialesFumigacion()
      .then((res) => {
        setMaterialesFumigacion(res.data)
      })
      .catch(err => err) 
    } catch (error) {
      
    }
  }
  
  useEffect(() => {
    allData()
  }, []);

  const allData = () => {
    try {
      let selectItem = localStorage.getItem('campaniaSelected')
      console.log(selectItem)
      CampaniaService.getDetailCampaniasCampaniaFumigacion(selectItem)
      .then((res) => {
        console.log(res)
        setfumigacions(res.data)
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
    setfumigacion(emptyFumigacion);
    setModalfumigacion(true);
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

  const verDetallefumigacion = (fumigacion: any) => {
    setModalfumigacion(true)
    let fumigacionSend = {
      ...fumigacion,
      fecha_fumigacion: fumigacion.fecha_fumigacion !== '00/00/0000' ? helpers.getFormatStringDate(fumigacion.fecha_fumigacion) : null,
      all_materiales: JSON.parse(fumigacion.all_materiales),
      tipo_fumigacion: {
        id: fumigacion.fumigacion_tipo_id,
        name: fumigacion.fumigacion_tipo_name
      },
      forma_fumigacion: {
        id: fumigacion.fumigacion_forma_id,
        name: fumigacion.fumigacion_forma_name
      }
    }
    console.log(fumigacionSend)
    setfumigacion(fumigacionSend)
  };

  const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2 mb-2" onClick={() => verDetallefumigacion(rowData)} />
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2 mb-2" onClick={() => confirmDeleteProduct(rowData)} /> */}
            <Button icon="pi pi-align-justify" tooltip="Ver detalle"  className="p-button-rounded mb-2" onClick={() => {verDetallefumigacion(rowData), setDisabled(true)}} />
        </>
    );
  };

  const costoRiegp = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {(rowData.jornales * rowData.costo).toFixed(2)}
      </>
    );
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _fumigacion = { ...fumigacion };
    _fumigacion[`${name}`] = val.replace(/^(0+)/g, '');

    setfumigacion(_fumigacion);
  };

  const onSelectChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _fumigacion = { ...fumigacion };
    _fumigacion[`${name}`] = {id:e.id, name: e.name}

    setfumigacion(_fumigacion);
  };

  const onSelectCalendar = (e, name) => {
    let datess = e
    let _fumigacion = { ...fumigacion };
    _fumigacion[`${name}`] = datess;
    setfumigacion(_fumigacion);
  }

  const savefumigacion = () => {
    let _fumigacion = { ...fumigacion };
    if (fumigacion.id) {
      let json = {
        ...fumigacion,
        fecha_fumigacion: helpers.getActuallyDate(fumigacion.fecha_fumigacion),
        campania_id: localStorage.getItem('campaniaSelected'),
        fumigacion_forma_id: fumigacion.forma_fumigacion.id,
        fumigacion_tipo_id: fumigacion.tipo_fumigacion.id
      }

      CampaniaService.editfumigacion(json)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'fumigacion Editada', life: 3000 });
        allData()
      })
    } else {
      let json = {  
        ...fumigacion,
        fecha_fumigacion: helpers.getActuallyDate(fumigacion.fecha_fumigacion),
        campania_id: localStorage.getItem('campaniaSelected'),
        fumigacion_forma_id: fumigacion.forma_fumigacion.id,
        fumigacion_tipo_id: fumigacion.tipo_fumigacion.id
      }

      CampaniaService.nuevofumigacion(json)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'allData Agregada', life: 3000 });
        allData()
      })
    }
    setModalfumigacion(false)
  };

  const fumigacionDialogFooter = () => {
    if(!disabled) {
      return <>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => {setModalfumigacion(false), setDisabled(false)}}/>
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savefumigacion} />
            </>
    }
  }

  const onSelectChangeMaterial = (e, name) => {
    let fumMaterial = fumigacion.all_materiales
    if(fumigacion.all_materiales !== null) {
      if(!fumigacion.all_materiales.find(el => el.fumigacion_materiales_id === e.id)) {
        fumMaterial.push({
          cantidad_material: 0,
          fumigacion_materiales_id: e.id,
          fumigacion_materiales_name: e.name,
          id: null,
          campania_fumigacion_id: fumigacion.id
        })
      }
    }else {
      fumMaterial.push({
        cantidad_material: 0,
        fumigacion_materiales_id: e.id,
        fumigacion_materiales_name: e.name,
        id: null,
        campania_fumigacion_id: fumigacion.id
      })
    }

    setfumigacion({
      ...fumigacion,
      all_materiales: fumMaterial
    })

  }

  const changeCantidadMaterial = (e, id_material) => {
    const val = (e.target && e.target.value) || '';
    const materiales = fumigacion.all_materiales
    for (let i = 0; i < materiales.length; i++) {
      if(materiales[i].fumigacion_materiales_id === id_material){
        materiales[i].cantidad_material = val
      }
    }
    
    setfumigacion({
      ...fumigacion,
      all_materiales: materiales
    })
  }

  const changeDosisMaterila = (e, id_material) => {
    console.log(e)
    const materiales = fumigacion.all_materiales
    for (let i = 0; i < materiales.length; i++) {
      if(materiales[i].fumigacion_materiales_id === id_material){
        materiales[i].dosis = e
      }
    }
    
    setfumigacion({
      ...fumigacion,
      all_materiales: materiales
    })
  }

  return (
    <div className="grid">
      <div className="col-12 md:col-12">
        <div className="card">
        <Toast ref={toast} />
        <Toolbar className="mb-4" left={rigthTitleTemplate('Control de Fumigacion')} right={leftToolbarTemplate}></Toolbar>
          <DataTable
              value={fumigacions}
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
              <Column field="fumigacion_forma_name" header="Forma de fumigacion" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="fecha_fumigacion" header="Fecha de Fumigacion" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="costo" header="Costo" body={costoRiegp} style={{ minWidth: '12rem' }} />
              <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog header="fumigacion" className="p-fluid" visible={modalfumigacion} onHide={() => {setModalfumigacion(false), setDisabled(false)}}
          style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} draggable={false} resizable={false}
          footer={fumigacionDialogFooter}>
          
        <Divider align="left">
          <h5>Detalle / Gastos</h5>
        </Divider>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
              <label htmlFor="anio">Formato de Fumigacion</label>
              <Dropdown value={fumigacion.forma_fumigacion} onChange={(e) => onSelectChange(e.value, 'forma_fumigacion')} id="forma_fumigacion" options={formasFumigacion} optionLabel="name" disabled={disabled}/>
          </div>
          <div className="field flex-1">
              <label htmlFor="anio">Tipo de Fumigacion</label>
              <Dropdown value={fumigacion.tipo_fumigacion} onChange={(e) => onSelectChange(e.value, 'tipo_fumigacion')} id="tipo_fumigacion" options={tiposFumigacion} optionLabel="name" disabled={disabled}/>
          </div>
          <div className="field flex-1">
            <label htmlFor="name">Fecha de Fumigacion</label>
            <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar value={fumigacion.fecha_fumigacion} disabled={disabled} onChange={(e) => onSelectCalendar(e.value, 'fecha_fumigacion')}></Calendar>
          </div>
        </div>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className='field flex-1'>
            <label>Trabajadores</label>
            <InputText id="trabajadores" placeholder='0' value={fumigacion.trabajadores} onChange={(e) => onInputChange(e, 'trabajadores')} disabled={disabled} />
          </div>
          <div className='field flex-1'>
            <label>Cilindros</label>
            <InputText id="jornales" placeholder='0' value={fumigacion.jornales} onChange={(e) => onInputChange(e, 'jornales')} disabled={disabled} />
          </div>
          <div className='field flex-1'>
            <label>Costo por cilindro</label>
            <InputText id="costo" placeholder='0' value={fumigacion.costo} onChange={(e) => onInputChange(e, 'costo')} disabled={disabled}/>
          </div>
          <div className='field flex-1'>
            <label>Costo total</label>
            <InputText id="name" placeholder='0' value={`S/ `+costoTotalfumigacion} disabled />
          </div>
        </div>
        <Divider align="left">
          <h5>Detalle / Materiales</h5>
        </Divider>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
              <label htmlFor="anio">Materiales a Usar</label>
              <Dropdown value={materialesView} onChange={(e) => onSelectChangeMaterial(e.value, 'materiales_fumigacion')} id="materiales_fumigacion" options={materialesFumigacion} optionLabel="name" disabled={disabled}/>
          </div>
        </div>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
              <div className="card gap-2">
                {
                  fumigacion.all_materiales !== null ?
                    fumigacion.all_materiales.map((el, i) => {
                      return  <div key={i} className='card content-material'>
                                <div className='content-material-info'>
                                  <div className='content-material-info_name'>
                                    <span>{el.fumigacion_materiales_name}</span>
                                  </div>
                                  <div className='flex align-items-center gap-1'>
                                  <InputText id='cantidad_material' value={el.cantidad_material} disabled={disabled } onChange={(e) => changeCantidadMaterial(e, el.fumigacion_materiales_id) }></InputText>
                                    <Dropdown value={el.dosis} onChange={(e) => changeDosisMaterila(e.value, el.fumigacion_materiales_id)} id="dosis"  options={tiposDosis} disabled={disabled}/>
                                    <span className='color-black'> /cil </span>
                                  </div>
                                  {
                                    !disabled ?
                                    <div className='content-material-info_buttons'>
                                      <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2"/>
                                    </div>
                                    :''
                                  }
                                </div>
                              </div>
                    })
                  :
                  <span>No hay materiales seleccionados</span>
                }
              </div>
            </div>
        </div>
      </Dialog>
    </div>
  );
};

export default regadoComponent;
