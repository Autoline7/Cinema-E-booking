import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AddCustomerForm from './Forms/AddCustomerForm'
import AdminCustomer from './AdminCustomer';
import AdminAdmin from './AdminAdmin';
import AddAdminForm from './Forms/AddAdminForm';
const AdminUsers = ({addCustomerForm, addAdminForm}) => {
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);

  async function fetchCustomers() {  
    const {data} = await axios.get("http://localhost:8080/api/customers");
    console.log(data);
    setCustomers(data);
  }

  async function fetchAdmins() {  
    const {data} = await axios.get("http://localhost:8080/api/admins");
    console.log(data);
    setAdmins(data);
  }

  useEffect(() =>{
    fetchCustomers();
    fetchAdmins();
  },[]);


  return (
            <div className="admin__users__container">
              <div className="admin__users">
                {customers.length > 0 && customers.map((customer, index) => <AdminCustomer customer={customer} key={index} /> )}
                {admins.length > 0 && admins.map((admin, index) => <AdminAdmin admin={admin} key={index} /> )}
              </div>
              {addCustomerForm && <AddCustomerForm />}
              {addAdminForm && <AddAdminForm />}
            </div>
  )
  
}

export default AdminUsers
