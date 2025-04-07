import React, { useEffect, useState } from 'react'
import AdminCode from "./AdminCode"
import AddCodeForm from './Forms/AddCodeForm';
import axios from 'axios';

const AdminCodes = ({addCodeForm}) => {
  const [codes, setCodes] = useState([]);

  async function fetchPromoCodes() {
    const {data} = await axios.get("http://localhost:8080/api/promotions");
    setCodes(data);
  }

  useEffect(() =>{
    fetchPromoCodes();
  },[]);



  return (
    <div className="admin__codes__container">
            <div className="admin__codes">
              {codes.length > 0 && codes.map((code, index) => <AdminCode code={code} key={index} /> )}
              
            </div>
            {addCodeForm && <AddCodeForm />}
    </div>
  )
}

export default AdminCodes
