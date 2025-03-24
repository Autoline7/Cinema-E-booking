import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";
import PaymentCardInput from "../components/AdminPageComp/Forms/inputs/PaymentCardInput";

const EditProfile = () => {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer")) || null;
  const customerId = customer?.userId;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentCards, setPaymentCards] = useState([]);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFirstName(customer.firstName || "");
    setLastName(customer.lastName || "");
    setEmail(customer.email || "");
    setPaymentCards(customer.paymentCards || []);
    setIsSubscriber(customer.isSubscriber || false);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        firstName,
        lastName,
        paymentCards,
        password: password || undefined,
        currentPassword: password ? currentPassword : undefined,
        isSubscriber,
      };

      await axios.put(`http://localhost:8080/api/customers/${customerId}`, updatedData);
      alert("Profile updated successfully!");

      if (showPassword) {
        if (!password || !currentPassword) {
          alert("Please enter both your current and new password.");
          return;
        }
        setCurrentPassword(customer.decryptedPassword);
        const changePass = {
          email: email,
          oldPassword: currentPassword,
          newPassword: password,
        };
        console.log(changePass);
        try {
          const changePassResponse = await axios.post(
            `http://localhost:8080/api/customers/change-password`,
            changePass
          );
          alert("Password updated successfully!");
        } catch (error) {
          console.error("Error changing password:", error.response?.data || error.message);
          alert(`Failed to change password: ${error.response?.data?.message || "Unknown error"}`);
          return;
        }
      }

      localStorage.setItem("customer", JSON.stringify({ ...customer, ...updatedData }));
      navigate("/User-Dashboard");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert(`Failed to update profile: ${error.response?.data?.message || "Unknown error"}`);
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
            <label>Payment Card(s):</label>
            <PaymentCardInput paymentCards={paymentCards} setPaymentCards={setPaymentCards} required />
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
              <label>New Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="input-group">
              <label>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password to confirm"
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" className="cancel-button" onClick={() => navigate("/User-Dashboard")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
