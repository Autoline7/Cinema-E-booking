import React, { useState } from "react";
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";

const AddCodeForm = () => {
  const [formData, setFormData] = useState({
    promoCode: "",
    description: "",
    discountPercentage: "",
    expirationDate: ""
  });

  /* { "promoCode": "SAVE10", "description": "Get 10% off all tickets!", "discountPercentage": 10.00, "expirationDate": "2025-12-31" } */

  const [showAlert, setShowAlert] = useState(false);

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


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("Data being sent:", formData);
      const response = await axios.post(
        "http://localhost:8080/api/promotions",
        formData
      );
      console.log("Promo Code created successfully:", response.data);

      handleAlert();
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error("Error creating code:", error);
    }
  };

  return (
    <div className="admin__customer__form">
      <h2 className="admin__add__customer__title">Add a New Promo Code</h2>
      <form onSubmit={handleSubmit} className="admin__add__customer__form">
        <p className="admin__form__required__fields">
          Note: Required = <span className="red">*</span>
        </p>

        <label htmlFor="firstName">
          <span className="red">*</span> Promo Code:
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.promoCode}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">
          <span className="red">*</span> Description:
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">
          <span className="red">*</span> Discount Percentage (0.00 - 100.00):
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
          type="date"
          name="decryptedPassword"
          value={formData.expirationDate}
          onChange={handleChange}
          required
        />
        

        <div className="admin__add__customer__form__button__container">
          <button
            className="admin__add__customer__form__button"
            type="submit"
          >
            Create Promo Code
          </button>
        </div>

        {showAlert && <SimpleAlert message="Promo Code Created Successfully!" />}
      </form>
    </div>
  );
};

export default AddCodeForm;