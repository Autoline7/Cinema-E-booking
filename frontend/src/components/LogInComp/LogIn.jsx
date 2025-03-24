import InputField from "./InputField";
import SocialLogin from "./SocialLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../LogIn-SignUp.css";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  async function logIn(e) {
    e.preventDefault();

    try {
      console.log("Trying customer login...");

      // Attempt to log in as a customer
      const customerResponse = await axios.post("http://localhost:8080/api/customers/login", {
        email,
        password
      });

      const response = await axios.get(`http://localhost:8080/api/customers/email/${email}`);
      localStorage.setItem("customer", JSON.stringify(response.data));

      console.log("Customer login successful:", customerResponse.data);
      navigate("/User-Dashboard"); // Redirect if customer login succeeds
      return;
    } catch (customerError) {
      console.log("Customer login failed. Trying admin login...");
    }

    try {
      // Attempt to log in as an admin
      const adminResponse = await axios.post("http://localhost:8080/api/admins/login", {
        email,
        password
      });
      
      const response = await axios.get(`http://localhost:8080/api/admins/email/${email}`);
      localStorage.setItem("admin", JSON.stringify(response.data));


      console.log("Admin login successful:", adminResponse.data);
      navigate("/Admin-DashBoard"); // Redirect if admin login succeeds
    } catch (adminError) {
      console.error("Both customer and admin login failed.");
      alert("Invalid Email or Password. Please try again.");
    }
  }

  return (
    <div id="Log-In-Sign-Up">
      <div className="login-container">
        <h2 className="form-title">Log in with</h2>
        <SocialLogin />

        <p className="separator"><span>or</span></p>

        <form onSubmit={logIn} className="login-form">
          <InputField 
            value={email} 
            type="email" 
            placeholder="Email address" 
            icon="mail" 
            onChange={(e) => setEmail(e.target.value)} 
            required={true} 
          />
          <InputField 
            value={password} 
            type="password" 
            placeholder="Password" 
            icon="lock" 
            onChange={(e) => setPassword(e.target.value)} 
            required={true} 
          />
          
          <a href="/forgot-password" className="forgot-pass-link">Forgot Password?</a>

          <button type="submit" className="login-button">Log In</button>
        </form>

        <p className="signup-text">Don&apos;t have an account? <a href="/Sign-Up">Sign Up now</a></p>
        <p className="signup-text">An admin? <a href="/Sign-Up/Admin">Sign Up now</a></p>
      </div>
    </div>
  );
};

export default LogIn;
