import { useState } from "react"
import ViewPopup from "../ViewPopup";
import axios from "axios";
import SimpleAlert from "../SimpleAlert";

const AdminAdmin = ({admin}) => {


  const [showAlert, setShowAlert] = useState(false);



  async function deleteAdmin(id) {
    await axios.delete(`http://localhost:8080/api/admins/${id}`);//db
   console.log("Admin deleted")
  }

  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
};

  const handleDelete = ()=>{
    deleteAdmin(admin.userId);
    handleAlert();
    setTimeout(() => {
      window.location.reload();
    }, 3000);
   
  }


  
  


  return (
      <div className="admin__admin">
              <div className="admin__customer__header">
                <h3 className="admin__customer__title">{admin.firstName == null || admin.lastName == null ? "N/A" : admin.firstName + " " + admin.lastName}</h3>
                <button className="admin__customer__edit__button">Edit</button>
              </div>
                <div className="admin__customer__info">
                    <table className="admin__customer__info__table">
                      <tbody>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Admin ID: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.userId == null ? "N/A" : admin.userId}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Created At: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.createdAt == null ? "N/A" : admin.createdAt}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Decrypted Password: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.decryptedPassword == null ? "N/A" : admin.decryptedPassword}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Email: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.email == null ? "N/A" : admin.email}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Last Logged In: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.lastLoggedIn == null ? "N/A" : admin.lastLoggedIn}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Last Logged Out: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.lastLoggedOut == null ? "N/A" : admin.lastLoggedOut}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Role: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.role == null ? "N/A" : admin.role}</span></td>
                        </tr>
                      </tbody>
                    </table>       
                    
                 
                </div>
                <i onClick={handleDelete} className="material-symbols-outlined admin__customer__trash">delete</i>
                {showAlert && <SimpleAlert message="Admin Deleted Successfully!!!" />}
      
            </div>
  )
}

export default AdminAdmin
