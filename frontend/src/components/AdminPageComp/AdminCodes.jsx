import React, { useEffect, useState } from 'react'
import AdminCode from "./AdminCode"
import AddCodeForm from './Forms/AddCodeForm';

const AdminCodes = ({addCodeForm}) => {
  const [codes, setCodes] = useState([]);

  async function fetchPromoCodes() {
    //const {data} = await axios.get("http://localhost:8080/api/");
    //setMovies(data);
  }

  useEffect(() =>{
    fetchPromoCodes();
  },[]);



  return (
    <div className="admin__codes__container">
            <div className="admin__codes">
              <AdminCode />
              <AdminCode />
              <AdminCode />
              <AdminCode />
              <AdminCode />
              <AdminCode />      
            </div>
            {addCodeForm && <AddCodeForm />}
    </div>
  )
}

export default AdminCodes
