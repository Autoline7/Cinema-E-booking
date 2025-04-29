import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";
import Swal from 'sweetalert2'

const EditAdminForm = ({ admin }) => {
  const [formData, setFormData] = useState({
    decryptedPassword: "",
    firstName: "",
    lastName: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Admin Updated Successfully!");

  // Initialize form data with admin prop values when component mounts or admin changes
  useEffect(() => {
    if (admin) {
      setFormData({
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        decryptedPassword: "", // Password field should be empty for security reasons
      });
    }
  }, [admin]);

  const handleAlert = (message = "Admin Updated Successfully!") => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create a copy of the form data for submission
      const dataToSend = {...formData};
      
      // If password field is empty, remove it from the request
      // This will signal to the backend to keep the existing password
      if (!dataToSend.decryptedPassword.trim()) {
        delete dataToSend.decryptedPassword;
      }

      // Use PUT for update instead of POST
      const response = await axios.put(
        `http://localhost:8080/api/admins/${admin.userId}`,
        dataToSend
      );

      Swal.fire({
              title: "Admin Updated Successfully!!",
              icon: "success",
              confirmButtonColor: "#e50914"
            });
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error("Error updating admin:", error);
      handleAlert(`Error updating admin: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="admin__customer__form">
      <h2 className="admin__add__customer__title">Edit Admin</h2>
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
          Email: <span className="email-note">(Cannot be changed)</span>
        </label>
        <input
          type="email"
          name="email"
          value={admin.email}
          disabled
          className="disabled-input"
        />

        <label htmlFor="decryptedPassword">
          Password: <span className="password-note">(Leave blank to keep current password)</span>
        </label>
        <input
          type="password"
          name="decryptedPassword"
          value={formData.decryptedPassword}
          onChange={handleChange}
          placeholder="Enter new password or leave blank"
        />

        <div className="admin__add__customer__form__button__container">
          <button
            className="admin__add__customer__form__button"
            type="submit"
          >
            Update Admin
          </button>
        </div>

        {showAlert && <SimpleAlert message={alertMessage} />}
      </form>
    </div>
  );
};

export default EditAdminForm;