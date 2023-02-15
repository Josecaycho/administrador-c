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
import MaterialesService from './services/MaterialesService'
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

import helpers from '../../../utils/helpers';

const Crud = () => {
    let emptyProduct = {
        id: null,
        name: '',
        observaciones: ''
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useEffect(() => {
      getDataMateriales()
    }, []);

    const getDataMateriales = () => {
      MaterialesService.getMateriales()
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

    const saveProduct = () => {
      // setSubmitted(true);

      if (product.name.trim()) {
        let _products = [...products];
        let _product = { ...product };
        if (product.id) {
          MaterialesService.editMateriales(product)
          .then((res) => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Fungisidad Editada', life: 3000 });
            getDataMateriales()
          })
        } else {
          MaterialesService.saveMateriales(product)
          .then((res) => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Fungisidad Agregada', life: 3000 });
            getDataMateriales()
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

    const confirmDeleteProduct = (product) => {
      setProduct(product);
      setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
    MaterialesService.deleteMateriales(product)
        .then((res) => {
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Fungisidad Eliminada', life: 3000 });
          getDataMateriales()
          setDeleteProductDialog(false);
        })
    };

    const onInputChange = (e, name) => {
      const val = (e.target && e.target.value) || '';
      let _product = { ...product };
      _product[`${name}`] = val;

      setProduct(_product);
    };

    const rigthTitleTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <h2>Fungisidas</h2>
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

    const nameObservacionesTemplate = (rowData) => {
      return (
        <>
          <span className="p-column-title">Name</span>
          {rowData.observaciones}
        </>
      );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
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
                    >
                        <Column field="id" header="Orden" sortable body={nameIdTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="observaciones" header="Observaciones" sortable body={nameObservacionesTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Fungisidas" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Observaciones</label>
                            <InputTextarea value={product.observaciones} onChange={(e) => onInputChange(e, 'observaciones')} placeholder="Your Message" autoResize rows="3" cols="30" />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
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
                </div>
            </div>
        </div>
    );
};

export default Crud;
