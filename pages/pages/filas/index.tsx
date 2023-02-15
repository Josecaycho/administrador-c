import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import FilaService from './services/FilaService'
import VariedadService from '../variedad/services/VariedadService'
import { InputNumber } from 'primereact/InputNumber';
import { Dropdown } from 'primereact/dropdown';

import helpers from '../../../utils/helpers';

const Crud = () => {
    let emptyProduct = {
        id: null,
        name: '',
        cantidad: ''
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [addVariedadFila,setAddVariedadFila] = useState(false)
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteVariedadfilaDialog, setDeleteVariedadfilaDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [variedad , setVariedad] = useState(null)
    const [cantidad , setCantidad] = useState(0)
    const [limite , setLimite] = useState(0)
    const [variedades , setVariedades] = useState([])
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [expandedRows, setExpandedRows] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);
    const [editVariedad, setEditVariedad] = useState(null)

    useEffect(() => {
      getDataFila()
      getDataVariedades()
    }, []);

    const getDataVariedades = () => {
      VariedadService.getVariedad()
        .then((res) => {
          setVariedades(res.data)
        })
        .catch(err => err)
    }

    const getDataFila = () => {
      FilaService.getFilas()
        .then((res) => {
          setProducts(res.data)
        })
        .catch(err => err)
    }

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideVariedadfilaDialog = () => {
      setDeleteVariedadfilaDialog(false)
    }

    const hideAddVariedadDialog = () => {
      setAddVariedadFila(false);
  };

    const saveProduct = () => {
      // setSubmitted(true);

      if (product.name.trim()) {
        let _products = [...products];
        let _product = { ...product };
        if (product.id) {
          FilaService.editFilas(product)
          .then((res) => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Fila Editada', life: 3000 });
            getDataFila()
          })
        } else {
          FilaService.saveFilas(product)
          .then((res) => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Fila Agregada', life: 3000 });
            getDataFila()
          })
        }

        setProducts(_products);
        setProductDialog(false);
        setProduct(emptyProduct);
      }
    };

    const editProduct = (product: any) => {
      setProduct(product);
      setProductDialog(true);
    };

    const addNewVariedad = (product: any) => {
      let cant = 0
      let varid = JSON.parse(product.todas_variedades)
      if(varid !== null)
        for (let i = 0; i < varid.length; i++) {
          console.log(varid[i].cantidad)

          cant += parseInt(varid[i].cantidad);
        }
      setLimite(product.cantidad - cant)
      setProduct(product)
      setAddVariedadFila(true)
    }

    const setValueVariedad = (e: any) => {
      if(e.target.value <= limite ) {
        setCantidad(e.target.value)
      }
    }

    const onSelectChangeVariedad = (variedad: any) => {
      setVariedad(variedad)
    }

    const confirmDeleteProduct = (product) => {
      setProduct(product);
      setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
      FilaService.deleteFilas(product)
        .then((res) => {
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Fila Eliminada', life: 3000 });
          getDataFila()
          setDeleteProductDialog(false);
        })
    };

    const deleteVariedadFila = () => {
      FilaService.deleteVariedadFila(editVariedad)
        .then((res) => {
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Fila Eliminada', life: 3000 });
          getDataFila()
          setDeleteVariedadfilaDialog(false);
        })
    }

    const saveVariedad = () => {
      let params = {
        id: editVariedad !== null ? editVariedad.id : null,
        fila_id: product.id == null ? editVariedad.fila_id : product.id,
        variedad_id: variedad.id,
        cantidad: cantidad
      } 
      FilaService.addVariedadFila(params)
        .then((res) => {
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Variedad Agregada', life: 3000 });
          getDataFila()
          setAddVariedadFila(false);
          setVariedad(null)
          setCantidad(0)
          setEditVariedad(null)
        })
    }

    const editVariedadFila = (data: any) => {
      setProduct(emptyProduct)
      setVariedad({id: data.variedad_id, name: data.variedad})
      let cant = 0
      let filterFila = products.filter((res) => res.id == data.fila_id)
      let varid = JSON.parse(filterFila[0].todas_variedades)
      if(varid !== null)
        for (let i = 0; i < varid.length; i++) {
          cant += parseInt(varid[i].cantidad);
        }
      setLimite((filterFila[0].cantidad - cant) + data.cantidad)
      setCantidad(0)
      setEditVariedad({
        fila_id: data.fila_id,
        id: data.id
      })
      setAddVariedadFila(true);
    };

    const confirmDeleteVariedadFila = (product) => {
      setEditVariedad({
        id: product.id
      })
      setDeleteVariedadfilaDialog(true);
    };

    const onInputChange = (e, name) => {
      const val = (e.target && e.target.value) || '';
      let _product = { ...product };
      _product[`${name}`] = val;

      setProduct(_product);
    };

    const setValueInput = (e, name) => {
      const val = (e.target && e.target.value) || '';
      let _product = { ...product };
      _product[`${name}`] = val;

      setProduct(_product);
    };

    const rigthTitleTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <h2>Fila de Uvas</h2>
                </div>
            </React.Fragment>
        );
    }
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };
    const nameIdTemplate = (rowData) => {
      return (
        <>
          <span className="p-column-title">Name</span>
          {rowData.id}
        </>
      );
    };
    const nameBodyTemplate = (rowData) => {
      return (
        <>
          <span className="p-column-title">Name</span>
          {rowData.name}
        </>
      );
    };
    const cantidadBodyTemplate = (rowData) => {
      return (
        <>
          <span className="p-column-title">Name</span>
          {rowData.cantidad}
        </>
      );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={() => confirmDeleteProduct(rowData)} />
                <Button icon="pi pi-arrow-circle-up" className="p-button-rounded p-button-secondary" onClick={() => addNewVariedad(rowData)} />
            </>
        );
    };

    const actionBodyInterTemplate = (rowData) => {
      return (
          <>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editVariedadFila(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={() => confirmDeleteVariedadFila(rowData)} />
          </>
      );
  };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    const variedadfilaDialogFooter = (
      <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideVariedadfilaDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteVariedadFila} />
        </>
    );

    const variedadProductDialogFooter = (
      <>
          <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideAddVariedadDialog} />
          <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={saveVariedad} />
      </>
    );

    const variedadBodyTemplate = (rowData) => {
      return (
        <>
          <span className="p-column-title">Name</span>
          {rowData.variedad}
        </>
      );
    };


    const rowExpansionTemplate = (data) => {
      return (
          <div className="orders-subtable">
              <h5>Variedad por {data.name}</h5>
              <DataTable value={JSON.parse(data.todas_variedades)} responsiveLayout="scroll">
                  <Column field="variedad" header="Variedad" body={variedadBodyTemplate} sortable></Column>
                  <Column field="cantidad" header="Cantidad" body={cantidadBodyTemplate} sortable></Column>
                  <Column body={actionBodyInterTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
              </DataTable>
          </div>
      );
    };

    const expandAll = () => {
        let _expandedRows = {};
        products.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
        setAllExpanded(true);
    };

    const collapseAll = () => {
        setExpandedRows(null);
        setAllExpanded(false);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={rigthTitleTemplate} right={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        responsiveLayout="scroll"
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                    >
                      <Column expander style={{ width: '3em' }} />
                      <Column field="id" header="Orden" sortable body={nameIdTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                      <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                      <Column field="cantidad" header="Cantidad" sortable body={cantidadBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                      <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Filas" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className='field'>
                          <label htmlFor="cantidad">Cantidad</label>
                          <InputText keyfilter="int" value={product.cantidad} onChange={(e) => setValueInput(e, 'cantidad')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={addVariedadFila} style={{ width: '450px' }} className="p-fluid" header="Agregar Variedad" modal footer={limite > 0 ?variedadProductDialogFooter : ''} onHide={() => setAddVariedadFila(false)}>
                      <div className="formgrid grid">
                        <div className='field col'>
                          <label htmlFor="anio">Variedad</label>
                          <Dropdown value={variedad} onChange={(e) => onSelectChangeVariedad(e.value)} id="anio" options={variedades} optionLabel="name" placeholder="Select" />
                        </div>
                      </div>
                      <div className='field'>
                          <label htmlFor="cantidad">Cantidad</label>
                          <InputText keyfilter="int" disabled={limite == 0 ? true : false} value={cantidad} onChange={(e) => setValueVariedad(e)} />
                          <span className="p-error">* Limite de plantas a agregar {limite}</span>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteVariedadfilaDialog} style={{ width: '450px' }} header="Confirm" modal footer={variedadfilaDialogFooter} onHide={hideVariedadfilaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
