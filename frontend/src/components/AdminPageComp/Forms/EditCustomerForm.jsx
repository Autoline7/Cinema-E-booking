import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";
import Selector from "../../Selector";
import PaymentCardInput from "./inputs/PaymentCardInput";
import AddressInput from "./inputs/AddressInput";

const EditCustomerForm = ({ customer }) => {
  const [formData, setFormData] = useState({
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    decryptedPassword: "",
    email: "",
    firstName: "",
    isSubscriber: "",
    lastName: "",
    role: "CUSTOMER",
    status: "ACTIVE",
  });

  // Store original data to compare what's changed
  const [originalData, setOriginalData] = useState(null);
  
  // State for existing payment cards (from customer)
  const [existingPaymentCards, setExistingPaymentCards] = useState([]);
  
  // State for new payment cards (to be added)
  const [newPaymentCards, setNewPaymentCards] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const subscriberOptions = ["TRUE", "FALSE"];
  const statusOptions = ["ACTIVE", "INACTIVE", "SUSPENDED"];

  // Use useEffect to prefill the form with customer data when component mounts
  useEffect(() => {
    if (customer) {
      const initialData = {
        address: customer.address || { street: "", city: "", state: "", zipCode: "", country: "" },
        email: customer.email || "",
        firstName: customer.firstName || "",
        isSubscriber: customer.isSubscriber ? "TRUE" : "FALSE",
        lastName: customer.lastName || "",
        role: customer.role || "CUSTOMER",
        status: customer.status || "ACTIVE",
      };

      setFormData({
        ...initialData,
        decryptedPassword: "", 
      });
      
      setOriginalData(initialData);

      // If customer has payment cards, store them as existing cards
      if (customer.paymentCards && customer.paymentCards.length > 0) {
        setExistingPaymentCards(customer.paymentCards);
      }
    }
  }, [customer]);

  const handleAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (newAddress) => {
    setFormData((prevData) => ({
      ...prevData,
      address: newAddress,
    }));
  };
  
  const handleDeletePaymentCard = async (cardId) => {
    try {
      // Call API to delete the payment card
      await axios.delete(`http://localhost:8080/api/payment-cards/${cardId}`);
      
      // Remove the card from the state
      setExistingPaymentCards(prevCards => 
        prevCards.filter(card => card.cardId !== card.cardId)
      );
      
      handleAlert("Payment card removed successfully!");
    } catch (error) {
      console.error("Error deleting payment card:", error);
      handleAlert("Failed to delete payment card. Please try again.");
    }
  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create payload with only changed fields
      const payload = {};
      
      // Compare and include only changed fields
      Object.keys(formData).forEach(key => {
        // Skip password if empty
        if (key === 'decryptedPassword') {
          if (formData[key] && formData[key].trim() !== '') {
            payload[key] = formData[key];
          }
          return;
        }
        
        // Skip email entirely as we don't want to update it
        if (key === 'email') {
          return;
        }
        
        // For address, compare each field
        if (key === 'address') {
          const addressChanged = Object.keys(formData.address).some(
            addrKey => formData.address[addrKey] !== originalData.address[addrKey]
          );
          
          if (addressChanged) {
            payload.address = formData.address;
          }
          return;
        }
        
        // For other fields, check if changed
        if (formData[key] !== originalData[key]) {
          payload[key] = formData[key];
        }
      });
      
      // Always include customer ID and email for identification
      payload.email = customer.email;
      
      // Only make the request if there are changes
      if (Object.keys(payload).length > 1) { // > 1 because email is always included
        const response = await axios.put(
          `http://localhost:8080/api/customers/${customer.userId}`,
          payload
        );
      }

      // Handle new payment cards
      if (newPaymentCards.length > 0) {
        await Promise.all(
          newPaymentCards.map((paymentCard) =>
            axios.post(
              `http://localhost:8080/api/payment-cards/customer/${customer.userId}/new-address`,
              paymentCard
            )
          )
        );
      }

      handleAlert("Customer Updated Successfully!");
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error("Error updating customer or processing data:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        handleAlert(
          `Server Error: ${error.response.data.message ||
            error.response.statusText}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        handleAlert("No response received from the server.");
      } else {
        console.error("Error setting up the request:", error.message);
        handleAlert(`An error occurred: ${error.message}`);
      }
    }
  };

  return (
    <div className="admin__customer__form">
      <h2 className="admin__add__customer__title">
        Edit Customer: {customer && `${customer.firstName} ${customer.lastName}`}
      </h2>
      <form onSubmit={handleSubmit} className="admin__add__customer__form">
        <p className="admin__form__required__fields">
          Note: Required = <span className="red">*</span>
        </p>

        <label htmlFor="firstName">
          <span className="red">*</span> First Name:
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">
          <span className="red">*</span> Last Name:
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">
          Email: <span className="admin__form__email__readonly">(cannot be changed)</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          disabled
          className="admin__form__input__readonly"
        />

        <label htmlFor="decryptedPassword">
          New Password (leave blank to keep current):
        </label>
        <input
          type="password"
          name="decryptedPassword"
          value={formData.decryptedPassword}
          onChange={handleChange}
        />

        <AddressInput
          label="Home"
          address={formData.address}
          setAddress={handleAddressChange}
          required={false}
        />

        <label htmlFor="isSubscriber">
          <span className="red">*</span> Subscriber?:
        </label>
        <Selector
          options={subscriberOptions}
          selectedValue={formData.isSubscriber}
          onChange={(value) =>
            setFormData((prevData) => ({ ...prevData, isSubscriber: value }))
          }
          name="isSubscriber"
          required={true}
        />
        <Selector
          options={statusOptions}
          selectedValue={formData.status}
          onChange={(value) =>
            setFormData((prevData) => ({ ...prevData, status: value }))
          }
          name="status"
          required={true}
        />

        {/* Display existing payment cards with delete buttons */}
        {existingPaymentCards.length > 0 && (
          <div className="existing-payment-cards">
            <label>Existing Payment Cards:</label>
            <div className="payment-cards-list">
              {existingPaymentCards.map((card, index) => (
                <div key={card.id || index} className="payment-card-item">
                  <div className="payment-card-details">
                    <p>
                      <strong>Card Number:</strong> {card.decryptedCardNumber}
                    </p>
                    <p>
                      <strong>Expiration Date:</strong> {card.expirationDate}
                    </p>
                    <p>
                      <strong>CVV:</strong> {card.decryptedCvv}
                    </p>
                    <div className="billing-address-details">
                      <p><strong>Billing Address:</strong></p>
                      <p>{card.billingAddress?.street}</p>
                      <p>{card.billingAddress?.city}, {card.billingAddress?.state} {card.billingAddress?.zipCode}</p>
                      <p>{card.billingAddress?.country}</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="screenings__list__button"
                    onClick={() => handleDeletePaymentCard(card.cardId)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input for new payment cards */}
        <label htmlFor="paymentCards">
          Add New Payment Card(s):
        </label>
        <PaymentCardInput
          paymentCards={newPaymentCards}
          setPaymentCards={setNewPaymentCards}
        />

        <div className="admin__add__customer__form__button__container">
          <button
            className="admin__add__customer__form__button"
            type="submit"
          >
            Update Customer
          </button>
        </div>

        {showAlert && <SimpleAlert message={alertMessage} />}
      </form>
    </div>
  );
};

export default EditCustomerForm;