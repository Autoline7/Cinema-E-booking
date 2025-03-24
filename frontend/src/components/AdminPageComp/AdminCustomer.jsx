import { useState } from "react"
import ViewPopup from "../ViewPopup";
import axios from "axios";
import SimpleAlert from "../SimpleAlert";

const AdminCustomer = ({customer}) => {


  const [showAlert, setShowAlert] = useState(false);
  const [viewPaymentCards, setViewPaymentCards] = useState(false);
  const addressText = customer.address.street + " " + customer.address.city + " " + customer.address.state + " " + customer.address.zipCode + " " + customer.address.country 
  

  const paymentCardsText = customer.paymentCards
  .map((card) =>
    "<br /><strong>Card ID:</strong> " + card.cardId +
    "<br /><strong>Billing Adress:</strong> " + card.billingAddress.street + " " + card.billingAddress.city + " " + card.billingAddress.state + " " + card.billingAddress.zipCode + " " + card.billingAddress.country +
    "<br /><strong>Card Number:</strong> " + card.decryptedCardNumber +
    "<br /><strong>CVV:</strong> " + card.decryptedCvv +
    "<br /><strong>Exp Date:</strong> " + card.expirationDate +
    "<br /><strong>Last 4 Digits:</strong> " + card.lastFourDigits 
  )
  .join("<br /><br />");



  async function deletecustomer(id) {
    await axios.delete(`http://localhost:8080/api/customers/${id}`);//db
   console.log("customer deleted")
  }

  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
};

  const handleDelete = ()=>{
    deletecustomer(customer.userId);
    handleAlert();
    setTimeout(() => {
      window.location.reload();
    }, 3000);
   
  }


  
  


  return (
      <div className="admin__customer">
              <div className="admin__customer__header">
                <h3 className="admin__customer__title">{customer.firstName == null || customer.lastName == null ? "N/A" : customer.firstName + " " + customer.lastName}</h3>
                <button className="admin__customer__edit__button">Edit</button>
              </div>
                <div className="admin__customer__info">
                    <table className="admin__customer__info__table">
                      <tbody>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Customer ID: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.userId == null ? "N/A" : customer.userId}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Created At: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.createdAt == null ? "N/A" : customer.createdAt}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Decrypted Password: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.decryptedPassword == null ? "N/A" : customer.decryptedPassword}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Email: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.email == null ? "N/A" : customer.email}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Subscriber?: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.isSubscriber == null ? "N/A" : customer.isSubscriber + ""}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Home Address: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.address == null ? "N/A" : addressText}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Last Logged In: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.lastLoggedIn == null ? "N/A" : customer.lastLoggedIn}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Last Logged Out: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.lastLoggedOut == null ? "N/A" : customer.lastLoggedOut}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Role: </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.role == null ? "N/A" : customer.role}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__customer__td"><span className="admin__customer__info__span1">Payment Card(s): </span></td>
                          <td className="admin__customer__td"><span className="admin__customer__info__span2">{customer.paymentCards == null ? "N/A" : <button onClick={() => setViewPaymentCards(prevState => !prevState)} className="admin__customer__view__info">{viewPaymentCards ? <>View<ViewPopup text={paymentCardsText}/></> : "View"}</button>}</span></td>
                        </tr>    
                      </tbody>
                    </table>       
                    
                 
                </div>
                <i onClick={handleDelete} className="material-symbols-outlined admin__customer__trash">delete</i>
                {showAlert && <SimpleAlert message="Customer Deleted Successfully!!!" />}
      
            </div>
  )
}

export default AdminCustomer
