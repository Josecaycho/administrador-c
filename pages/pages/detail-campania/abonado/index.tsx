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
  let emptyAbonado = {
    id: null,
    campania_id: number,
    fecha_abonado: dateNow,
    fecha_abonado_fin: dateNow,
    trabajadores: 0,
    jornales: 0,
    costo: 0,
    all_materiales: []
  };

  const tiposDosis = ["ML","KG","LT"]

  const [modalAbonado, setModalAbonado] = useState(false)
  const [abonados, setAbonados] = useState([]);
  const [abonado, setAbonado] = useState(emptyAbonado);
  const [formasAbonado, setFormasAbonado] = useState([]);
  const [tiposAbonado, setTiposAbonado] = useState([]);
  const [materialesAbonado, setMaterialesAbonado] = useState([]);
  const [costoTotalAbonado, setCostoTotalAbonado ] = useState<number>()
  const [costoTotalAbonadoLimpieza, setCostoTotalAbonadoLimpieza ] = useState<number>()
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false)
  const [materialesView, setMaterialesView] = useState([])
  const [materialDelete, setMaterialDelete] = useState([])

  useEffect(() => {
    let costoTotal: any = abonado.costo * abonado.jornales * abonado.trabajadores
    setCostoTotalAbonado(costoTotal)
  }, [
    abonado.costo,
    abonado.jornales,
    abonado.trabajadores
  ]);


  useEffect(() => {
    tiposAbonados()
  }, []);

  const tiposAbonados = () => {
    try {
      CampaniaService.materialesAbonado()
      .then((res) => {
        setMaterialesAbonado(res.data)
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
      CampaniaService.getDetailCampaniasCampaniaAbonado(selectItem)
      .then((res) => {
        console.log(res)
        setAbonados(res.data)
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
    setAbonado(emptyAbonado);
    setModalAbonado(true);
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

  const verDetalleAbonado = (abonado: any) => {
    setModalAbonado(true)
    let abonadoSend = {
      ...abonado,
      fecha_abonado: abonado.fecha_abonado !== '00/00/0000' ? helpers.getFormatStringDate(abonado.fecha_abonado) : null,
      fecha_abonado_fin: abonado.fecha_abonado_fin !== '00/00/0000' ? helpers.getFormatStringDate(abonado.fecha_abonado_fin) : null,
      all_materiales: JSON.parse(abonado.all_materiales),
    }
    console.log(abonadoSend)
    setAbonado(abonadoSend)
  };

  const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2 mb-2" onClick={() => verDetalleAbonado(rowData)} />
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2 mb-2" onClick={() => confirmDeleteProduct(rowData)} /> */}
            <Button icon="pi pi-align-justify" tooltip="Ver detalle"  className="p-button-rounded mb-2" onClick={() => {verDetalleAbonado(rowData), setDisabled(true)}} />
        </>
    );
  };

  const costoRiegp = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {(rowData.jornales * rowData.costo * rowData.trabajadores).toFixed(2)}
      </>
    );
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _abonado = { ...abonado };
    _abonado[`${name}`] = val.replace(/^(0+)/g, '');

    setAbonado(_abonado);
  };

  const onSelectChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _abonado = { ...abonado };
    _abonado[`${name}`] = {id:e.id, name: e.name}

    setAbonado(_abonado);
  };

  const onSelectCalendar = (e, name) => {
    let datess = e
    let _abonado = { ...abonado };
    _abonado[`${name}`] = datess;
    setAbonado(_abonado);
  }

  const saveAbonado = () => {
    let _abonado = { ...abonado };
    if (abonado.id) {
      let json = {
        ...abonado,
        fecha_abonado: helpers.getActuallyDate(abonado.fecha_abonado),
        fecha_abonado_fin: helpers.getActuallyDate(abonado.fecha_abonado_fin),
        campania_id: localStorage.getItem('campaniaSelected'),
        material_borrado: materialDelete
      }

      CampaniaService.editabonado(json)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Abonado Editada', life: 3000 });
        allData()
      })
    } else {
      let json = {  
        ...abonado,
        fecha_abonado: helpers.getActuallyDate(abonado.fecha_abonado),
        fecha_abonado_fin: helpers.getActuallyDate(abonado.fecha_abonado_fin),
        campania_id: localStorage.getItem('campaniaSelected'),
      }

      CampaniaService.nuevoabonado(json)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'allData Agregada', life: 3000 });
        allData()
      })
    }
    setModalAbonado(false)
    setMaterialDelete([])
  };

  const abonadoDialogFooter = () => {
    if(!disabled) {
      return <>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => {setModalAbonado(false), setDisabled(false)}}/>
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveAbonado} />
            </>
    }
  }

  const onSelectChangeMaterial = (e, name) => {
    let fumMaterial = abonado.all_materiales
    if(abonado.all_materiales !== null) {
      if(!abonado.all_materiales.find(el => el.abonado_materiales_id === e.id)) {
        fumMaterial.push({
          cantidad_material: 0,
          abonado_materiales_id: e.id,
          abonado_materiales_name: e.name,
          id: null,
          campania_abonado_id: abonado.id
        })
      }
    }else {
      fumMaterial.push({
        cantidad_material: 0,
        abonado_materiales_id: e.id,
        abonado_materiales_name: e.name,
        id: null,
        campania_abonado_id: abonado.id
      })
    }

    setAbonado({
      ...abonado,
      all_materiales: fumMaterial
    })

    let materialBorrado = materialDelete.filter((dl) => dl.id !== e.id)
    setMaterialDelete(materialBorrado)
  }

  const changeCantidadMaterial = (e, id_material) => {
    const val = (e.target && e.target.value) || '';
    const materiales = abonado.all_materiales
    for (let i = 0; i < materiales.length; i++) {
      if(materiales[i].abonado_materiales_id === id_material){
        materiales[i].cantidad_material = val
      }
    }
    
    setAbonado({
      ...abonado,
      all_materiales: materiales
    })
  }

  const changeDosisMaterila = (e, id_material) => {
    console.log(e)
    const materiales = abonado.all_materiales
    for (let i = 0; i < materiales.length; i++) {
      if(materiales[i].abonado_materiales_id === id_material){
        materiales[i].dosis = e
      }
    }
    
    setAbonado({
      ...abonado,
      all_materiales: materiales
    })
  }

  const deleteMaterialFumigagacion = (data) => {
    let materiales = abonado.all_materiales

    setAbonado({
      ...abonado,
      all_materiales: materiales.filter((dt) => dt.id !== data.id)
    })

    let materialBorrado = []
    materialBorrado.push(data)
    setMaterialDelete(materialBorrado)
  }

  return (
    <div className="grid">
      <div className="col-12 md:col-12">
        <div className="card">
        <Toast ref={toast} />
        <Toolbar className="mb-4" left={rigthTitleTemplate('Control de Abonado')} right={leftToolbarTemplate}></Toolbar>
          <DataTable
              value={abonados}
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
              <Column field="fecha_abonado" header="Fecha de Abonado" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="fecha_abonado_fin" header="Fecha fin de Abonado" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="costo" header="Costo" body={costoRiegp} style={{ minWidth: '12rem' }} />
              <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog header="Abonado" className="p-fluid" visible={modalAbonado} onHide={() => {setModalAbonado(false), setDisabled(false)}}
          style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} draggable={false} resizable={false}
          footer={abonadoDialogFooter}>
          
        <Divider align="left">
          <h5>Detalle / Gastos</h5>
        </Divider>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
            <label htmlFor="name">Fecha de abonado</label>
            <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar value={abonado.fecha_abonado} disabled={disabled} onChange={(e) => onSelectCalendar(e.value, 'fecha_abonado')}></Calendar>
          </div>
          <div className="field flex-1">
            <label htmlFor="name">Fecha fin de abonado</label>
            <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar value={abonado.fecha_abonado_fin} disabled={disabled} onChange={(e) => onSelectCalendar(e.value, 'fecha_abonado_fin')}></Calendar>
          </div>
        </div>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className='field flex-1'>
            <label>Trabajadores</label>
            <InputText id="trabajadores" placeholder='0' value={abonado.trabajadores} onChange={(e) => onInputChange(e, 'trabajadores')} disabled={disabled} />
          </div>
          <div className='field flex-1'>
            <label>Jornales</label>
            <InputText id="jornales" placeholder='0' value={abonado.jornales} onChange={(e) => onInputChange(e, 'jornales')} disabled={disabled} />
          </div>
          <div className='field flex-1'>
            <label>Costo por jornal</label>
            <InputText id="costo" placeholder='0' value={abonado.costo} onChange={(e) => onInputChange(e, 'costo')} disabled={disabled}/>
          </div>
          <div className='field flex-1'>
            <label>Costo total</label>
            <InputText id="name" placeholder='0' value={`S/ `+costoTotalAbonado} disabled />
          </div>
        </div>
        <Divider align="left">
          <h5>Detalle / Materiales</h5>
        </Divider>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
              <label htmlFor="anio">Materiales a Usar</label>
              <Dropdown value={materialesView} onChange={(e) => onSelectChangeMaterial(e.value, 'materiales_abonado')} id="materiales_abonado" options={materialesAbonado} optionLabel="name" disabled={disabled}/>
          </div>
        </div>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
              <div className="card gap-2">
                {
                  abonado.all_materiales.length > 0 ?
                    abonado.all_materiales.map((el, i) => {
                      return  <div key={i} className='card content-material'>
                                <div className='content-material-info'>
                                  <div className='content-material-info_name'>
                                    <span>{el.abonado_materiales_name}</span>
                                  </div>
                                  <div className='flex align-items-center gap-1'>
                                  <InputText id='cantidad_material' value={el.cantidad_material} disabled={disabled } onChange={(e) => changeCantidadMaterial(e, el.abonado_materiales_id) }></InputText>
                                    <span className='color-black'> /saco </span>
                                  </div>
                                  {
                                    !disabled ?
                                    <div className='content-material-info_buttons'>
                                      <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={(e) => deleteMaterialFumigagacion(el)}/>
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
