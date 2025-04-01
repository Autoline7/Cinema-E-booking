import InputField from "./InputField";
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
      console.log("Trying Login...");

      // Attempt to log in as a customer
      const logResponse = await axios.post("http://localhost:8080/api/customers/login", {
        email,
        password
      });
      const role = logResponse.data.role;
      
      
      if(role === "ADMIN"){
        const response = await axios.get(`http://localhost:8080/api/admins/email/${email}`);
        console.log(response);
        localStorage.setItem("admin", JSON.stringify(response.data));
        console.log("Login successful");
        navigate("/Admin-DashBoard");

      } else if(role === "CUSTOMER"){
        const response = await axios.get(`http://localhost:8080/api/customers/email/${email}`);
        console.log(response);
        localStorage.setItem("customer", JSON.stringify(response.data));
        console.log("Login successful");
        navigate("/User-Dashboard");
      }
      return;
    } catch (e) {
      console.log("Login failed.");
      alert("Invalid Email or Password. Please try again.");
    }
  }

  return (
    <div id="Log-In-Sign-Up">
      <div className="login-container">
        <h2 className="form-title">Log in</h2>
      

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
