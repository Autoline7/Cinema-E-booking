import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AddCustomerForm from './Forms/AddCustomerForm'
import AdminCustomer from './AdminCustomer';
import AdminAdmin from './AdminAdmin';
import AddAdminForm from './Forms/AddAdminForm';
import EditCustomerForm from './Forms/EditCustomerForm';
import EditAdminForm from './Forms/EditAdminForm';
const AdminUsers = ({addCustomerForm, addAdminForm}) => {
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [editCustomerForm, setEditCustomerForm] = useState({ formOpen: false, customer: {} });
  const [editAdminForm, setEditAdminForm] = useState({ formOpen: false, customer: {} });

  async function fetchCustomers() {  
    const {data} = await axios.get("http://localhost:8080/api/customers");
    setCustomers(data);
  }

  async function fetchAdmins() {  
    const {data} = await axios.get("http://localhost:8080/api/admins");
    setAdmins(data);
  }

  useEffect(() =>{
    fetchCustomers();
    fetchAdmins();
  },[]);


  return (
            <div className="admin__users__container">
              <div className="admin__users">
                {customers.length > 0 && customers.map((customer, index) => <AdminCustomer customer={customer} key={index} editCustomerForm={editCustomerForm} setEditCustomerForm={setEditCustomerForm}/> )}
                {admins.length > 0 && admins.map((admin, index) => <AdminAdmin admin={admin} key={index} editAdminForm={editAdminForm} setEditAdminForm={setEditAdminForm}/> )}
              </div>
              {addCustomerForm && <AddCustomerForm />}
              {addAdminForm && <AddAdminForm />}
              {editCustomerForm.formOpen && <EditCustomerForm customer={editCustomerForm.customer} />}
              {editAdminForm.formOpen && <EditAdminForm admin={editAdminForm.admin} />}
            </div>
  )
  
}

export default AdminUsers
