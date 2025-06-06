import { useState } from "react"
import ViewPopup from "../ViewPopup";
import axios from "axios";
import SimpleAlert from "../SimpleAlert";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { formattedDate } from "../../utils/DateUtils";

const AdminAdmin = ({admin, editAdminForm, setEditAdminForm}) => {
  const [showAlert, setShowAlert] = useState(false);
  const createdAtFormattedDate = formattedDate(admin.createdAt);
  const loggedInFormattedDate = formattedDate(admin.lastLoggedIn);
  const loggedOutFormattedDate = formattedDate(admin.lastLoggedOut);



  async function deleteAdmin(id) {
    await axios.delete(`http://localhost:8080/api/admins/${id}`);//db
  }

  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
};


  const handleDelete = () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteAdmin(admin.userId);
            handleAlert();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        },
        {
          label: 'No',
          onClick: () => {
          }
        }
      ]
    });
  };


  
  


  return (
      <div className="admin__admin">
              <div className="admin__customer__header">
                <h3 className="admin__customer__title">{admin.firstName == null || admin.lastName == null ? "N/A" : admin.firstName + " " + admin.lastName}</h3>
                <div>
                <button onClick={() => 
                  setEditAdminForm(prevState => ({
                    ...prevState,
                    formOpen: prevState.admin?.userId === admin.userId ? !prevState.formOpen : true,
                    admin: admin
                  }))}
                  className="admin__movie__edit__button">{editAdminForm.formOpen && editAdminForm.admin?.userId === admin.userId ? "Close" : "Edit"}</button>
                </div>
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
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.createdAt == null ? "N/A" : createdAtFormattedDate}</span></td>
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
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.lastLoggedIn == null ? "N/A" : loggedInFormattedDate}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Last Logged Out: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{admin.lastLoggedOut == null ? "N/A" : loggedOutFormattedDate}</span></td>
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
