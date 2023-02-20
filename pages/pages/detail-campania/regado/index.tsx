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
  let emptyRiego = {
    id: null,
    fecha_regado: dateNow,
    trabajadores: 0,
    jornales: 0,
    costo: 0
  };

  const [modalRiego, setModalRiego] = useState(false)
  const [riegos, setRiegos] = useState([]);
  const [riego, setRiego] = useState(emptyRiego);
  const [tiposRiego, setTiposRiego] = useState([]);
  const [costoTotalRiego, setCostoTotalRiego ] = useState<number>()
  const [costoTotalRiegoLimpieza, setCostoTotalRiegoLimpieza ] = useState<number>()
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    let costoTotal: any = riego.costo * riego.jornales * riego.trabajadores
    setCostoTotalRiego(costoTotal)
  }, [
    riego.costo,
    riego.jornales,
    riego.trabajadores
  ]);
  
  useEffect(() => {
    allData()
  }, []);

  const allData = () => {
    try {
      let selectItem = localStorage.getItem('campaniaSelected')
      CampaniaService.getDetailCampaniasCampania(selectItem)
      .then((res) => {
        setRiegos(JSON.parse(res.data[0].regado))
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
    setRiego(emptyRiego);
    setModalRiego(true);
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

  const verDetalleRiego = (riego: any) => {
    setModalRiego(true)
    let RiegoSend = {
      ...riego,
      fecha_regado: riego.fecha_regado !== '00/00/0000' ? helpers.getFormatStringDate(riego.fecha_regado) : null,
    }
    setRiego(RiegoSend)
  };

  const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2 mb-2" onClick={() => verDetalleRiego(rowData)} />
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2 mb-2" onClick={() => confirmDeleteProduct(rowData)} /> */}
            <Button icon="pi pi-align-justify" tooltip="Ver detalle"  className="p-button-rounded mb-2" onClick={() => {verDetalleRiego(rowData), setDisabled(true)}} />
        </>
    );
  };

  const costoRiegp = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {'S/ ' + (rowData.trabajadores * rowData.jornales * rowData.costo).toFixed(2)}
      </>
    );
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _riego = { ...riego };
    _riego[`${name}`] = val.replace(/^(0+)/g, '');

    setRiego(_riego);
  };

  const onSelectChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _riego = { ...riego };
    _riego[`${name}`] = {id:e.id, name: e.name}

    setRiego(_riego);
  };

  const onSelectCalendar = (e, name) => {
    let datess = e
    let _riego = { ...riego };
    _riego[`${name}`] = datess;
    setRiego(_riego);
  }

  const saveRiego = () => {
    let _riego = { ...riego };
    if (riego.id) {
      let json = {
        ...riego,
        fecha_regado: helpers.getActuallyDate(riego.fecha_regado),
        campania_id: localStorage.getItem('campaniaSelected')
      }

      console.log(json)

      CampaniaService.editRiego(json)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Riego Editada', life: 3000 });
        allData()
      })
    } else {
      let json = {
        ...riego,
        fecha_regado: helpers.getActuallyDate(riego.fecha_regado),
        campania_id: localStorage.getItem('campaniaSelected')
      }

      CampaniaService.nuevoRiego(json)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'allData Agregada', life: 3000 });
        allData()
      })
    }
    setModalRiego(false)
  };

  const RiegoDialogFooter = () => {
    if(!disabled) {
      return <>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => {setModalRiego(false), setDisabled(false)}}/>
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveRiego} />
            </>
    }
  }

  return (
    <div className="grid">
      <div className="col-12 md:col-12">
        <div className="card">
        <Toast ref={toast} />
        <Toolbar className="mb-4" left={rigthTitleTemplate('Control de Riego')} right={leftToolbarTemplate}></Toolbar>
          <DataTable
              value={riegos}
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
              <Column field="fecha_regado" header="Fecha de Regado" headerStyle={{ minWidth: '15rem' }}></Column>
              <Column field="costo" header="Costo" body={costoRiegp} style={{ minWidth: '12rem' }} />
              <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog header="Riego" className="p-fluid" visible={modalRiego} onHide={() => {setModalRiego(false), setDisabled(false)}}
          style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} draggable={false} resizable={false}
          footer={RiegoDialogFooter}>
          
        <Divider align="left">
          <h5>Detalle / Gastos</h5>
        </Divider>
        <div className="flex flex-column md:flex-row gap-3 mb-3">
          <div className="field flex-1">
            <label htmlFor="name">Fecha de Inicio</label>
            <Calendar dateFormat="dd/mm/yy" showIcon showButtonBar value={riego.fecha_regado} disabled={disabled} onChange={(e) => onSelectCalendar(e.value, 'fecha_regado')}></Calendar>
          </div>
        </div>
        <div className="flex flex-column md:flex-row gap-3">
          <div className='field flex-1'>
            <label>Trabajadores</label>
            <InputText id="trabajadores" placeholder='0' value={riego.trabajadores} onChange={(e) => onInputChange(e, 'trabajadores')} disabled={disabled} />
          </div>
          <div className='field flex-1'>
            <label>Jornales</label>
            <InputText id="jornales" placeholder='0' value={riego.jornales} onChange={(e) => onInputChange(e, 'jornales')} disabled={disabled} />
          </div>
          <div className='field flex-1'>
            <label>Costo mano de obra</label>
            <InputText id="costo" placeholder='0' value={riego.costo} onChange={(e) => onInputChange(e, 'costo')} disabled={disabled}/>
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
