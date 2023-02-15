import { BreadCrumb } from 'primereact/breadcrumb';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

export default function breadcrumb() {
    
    const [ items, setItems ] = useState([]);
    const home = { icon: 'pi pi-home' }

    useEffect(() => {
      let newro = []
      let rot = window.location.pathname.split('/')
      for (let i = 0; i < rot.length; i++) {
        if(rot[i] !== ''){
          newro.push({ label: rot[i] })
        }
      }
      console.log(newro)
      setItems(newro)
    }, []);

    return (
        <BreadCrumb model={items} home={home} />
    )
}