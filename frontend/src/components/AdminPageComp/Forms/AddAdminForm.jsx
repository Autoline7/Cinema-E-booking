import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";

const AddAdminForm = () => {
  const [formData, setFormData] = useState({
    decryptedPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "ADMIN",
  });


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
      const response = await axios.post(
        "http://localhost:8080/api/admins",
        formData
      );

      handleAlert();
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error("Error creating customer or processing data:", error);  
        console.error("Error:", error.message);
    }
  };

  return (
    <div className="admin__customer__form">
      <h2 className="admin__add__customer__title">Add a New Admin</h2>
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

        <div className="admin__add__customer__form__button__container">
          <button
            className="admin__add__customer__form__button"
            type="submit"
          >
            Create Admin
          </button>
        </div>

        {showAlert && <SimpleAlert message="Admin Created Successfully!" />}
      </form>
    </div>
  );
};

export default AddAdminForm;