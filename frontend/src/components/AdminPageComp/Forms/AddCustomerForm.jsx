import React, { useState} from "react";
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";
import Selector from "../../Selector";
import PaymentCardInput from "./inputs/PaymentCardInput";
import AddressInput from "./inputs/AddressInput";
import Swal from 'sweetalert2'

const AddCustomerForm = () => {
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

  const [formDataPaymentCards, setFormDataPaymentCards] = useState({
    paymentCards: [],
  });

  const [showAlert, setShowAlert] = useState(false);
  const subscriberOptions = ["TRUE", "FALSE"];

  const handleAlert = () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/customers",
        formData
      );
      const customerResponse = await axios.get(
        `http://localhost:8080/api/customers/email/${formData.email}`
      );
      const customerId = customerResponse.data.userId;

      if (formDataPaymentCards.paymentCards.length > 0) {
        await Promise.all(
          formDataPaymentCards.paymentCards.map((paymentCard) =>
            axios.post(
              `http://localhost:8080/api/payment-cards/customer/${customerId}/new-address`,
              paymentCard
            )
          )
        );
      }

      handleAlert();
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      Swal.fire({
              title: "There was an error",
              icon: "error",
              confirmButtonColor: "#e50914"
      });
    }
  };

  return (
    <div className="admin__customer__form">
      <h2 className="admin__add__customer__title">Add a New Customer</h2>
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
          <span className="red">*</span> Email:
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="decryptedPassword">
          <span className="red">*</span> Password:
        </label>
        <input
          type="password"
          name="decryptedPassword"
          value={formData.decryptedPassword}
          onChange={handleChange}
          required
        />

        <AddressInput
          label="Home"
          address={formData.address}
          setAddress={handleAddressChange}
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

        <label htmlFor="paymentCards">
          <span className="red">*</span> Payment Card(s):
        </label>
        <PaymentCardInput
          paymentCards={formDataPaymentCards.paymentCards}
          setPaymentCards={(newCards) =>
            setFormDataPaymentCards((prev) => ({
              ...prev,
              paymentCards: newCards,
            }))
          }
          required
        />

        <div className="admin__add__customer__form__button__container">
          <button
            className="admin__add__customer__form__button"
            type="submit"
          >
            Create Customer
          </button>
        </div>

        {showAlert && <SimpleAlert message="Customer Created Successfully!" />}
      </form>
    </div>
  );
};

export default AddCustomerForm;