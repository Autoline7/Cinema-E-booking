import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";
import PaymentCardInput from "../components/AdminPageComp/Forms/inputs/PaymentCardInput";
import Swal from 'sweetalert2'

const EditProfile = () => {
  const navigate = useNavigate();
  const initialCustomerData = JSON.parse(localStorage.getItem("customer")) || null;
  const customerId = initialCustomerData?.userId;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [existingPaymentCards, setExistingPaymentCards] = useState([]);
  const [newPaymentCards, setNewPaymentCards] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customers/${customerId}`);
        const customerData = response.data;
        setFirstName(customerData.firstName || "");
        setLastName(customerData.lastName || "");
        setEmail(customerData.email || "");
        setIsSubscriber(customerData.isSubscriber || false);
        setExistingPaymentCards(customerData.paymentCards || []);
        localStorage.setItem("customer", JSON.stringify(customerData));
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  const refreshPaymentCards = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/customers/${customerId}`);
      const customerData = response.data;
      setExistingPaymentCards(customerData.paymentCards || []);
      const updatedCustomer = {
        ...JSON.parse(localStorage.getItem("customer")),
        paymentCards: customerData.paymentCards,
      };
      localStorage.setItem("customer", JSON.stringify(updatedCustomer));
    } catch (error) {
      console.error("Error fetching updated payment cards:", error);
    }
  };

  const handleAlert = (message) => {
    alert(message);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const updatedData = { firstName, lastName, isSubscriber };
      await axios.put(`http://localhost:8080/api/customers/${customerId}`, updatedData);

      Swal.fire({
        title: "Profile Updated Successfully!!!",
        icon: "success",
        confirmButtonColor: "#e50914"
      });

      if (showPayment && newPaymentCards.length > 0) {
        for (const paymentCard of newPaymentCards) {
          await axios.post(
            `http://localhost:8080/api/payment-cards/customer/${customerId}/new-address`,
            paymentCard
          );
        }
        await refreshPaymentCards();
        handleAlert("Payment Cards added successfully!");
        setNewPaymentCards([]);
      }

      if (showPassword) {
        if (!password || !currentPassword) {
          handleAlert("Please enter both your current and new password.");
          return;
        }

        const changePass = {
          email,
          oldPassword: currentPassword,
          newPassword: password,
        };

        try {
          await axios.post(`http://localhost:8080/api/customers/change-password`, changePass);
          handleAlert("Password updated successfully!");
          setPassword("");
          setCurrentPassword("");
          setShowPassword(false);
        } catch (error) {
          console.error("Error changing password:", error.response?.data || error.message);
          handleAlert(`Failed to change password: ${error.response?.data?.message || "Unknown error"}`);
          return;
        }
      }

      const updatedCustomer = {
        ...JSON.parse(localStorage.getItem("customer")),
        firstName,
        lastName,
        isSubscriber,
      };
      localStorage.setItem("customer", JSON.stringify(updatedCustomer));

      navigate("/User-Dashboard");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      handleAlert(`Failed to update profile: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  const handleDeletePaymentCard = async (cardId) => {
    try {
      await axios.delete(`http://localhost:8080/api/payment-cards/${cardId}`);
      await refreshPaymentCards();
      handleAlert("Payment card removed successfully!");
    } catch (error) {
      console.error("Error deleting payment card:", error);
      handleAlert("Failed to delete payment card. Please try again.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <div className="input-group">
          <label>First Name:</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Last Name:</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Email (not editable):</label>
          <input value={email} disabled />
        </div>

        <div className="input-group">
          <label htmlFor="promotions-toggle">Subscribe to Promotions:</label>
          <input
            id="promotions-toggle"
            type="checkbox"
            checked={isSubscriber}
            onChange={() => setIsSubscriber(!isSubscriber)}
          />
        </div>

        <div className="input-group">
          <label>Change Payment Card(s)</label>
          <input
            type="checkbox"
            checked={showPayment}
            onChange={() => setShowPayment(!showPayment)}
          />
        </div>

        {showPayment && (
          <div className="input-group">
            <label htmlFor="paymentCards">Add New Payment Card(s):</label>
            <PaymentCardInput
              paymentCards={newPaymentCards}
              setPaymentCards={setNewPaymentCards}
              existingPaymentCards={existingPaymentCards}
              handleDeletePaymentCard={handleDeletePaymentCard}
            />
          </div>
        )}

        <div className="input-group">
          <label>Change Password</label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
        </div>

        {showPassword && (
          <>
            <div className="input-group">
              <label>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password to confirm"
                required={showPassword}
              />
            </div>
            <div className="input-group">
              <label>New Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required={showPassword}
              />
            </div>
          </>
        )}

        {/* New Order History button */}
        <button
          type="button"
          className="order-history-button"
          onClick={() => navigate("/Order-History")}
        >
          Order History
        </button>

        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" className="cancel-button" onClick={() => navigate("/User-Dashboard")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
