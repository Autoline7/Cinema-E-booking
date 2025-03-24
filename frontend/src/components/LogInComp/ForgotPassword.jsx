import React, { useState } from 'react';
import axios from 'axios';
import '../LogIn-SignUp.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setcode] = useState('');
  const [newPassword, setNewPassword] = useState(''); // New state for the new password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false); // State to track if code is sent
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCodeSent) {
      // Step 1: Request Verification Code
      try {
        const response = await axios.post("http://localhost:8080/api/customers/forgot-password", { email });
        setMessage(`Verification code sent to ${email}`);
        setIsCodeSent(true); // Show the code input field after sending the code
        setError('');
      } catch (err) {
        setError('There was an issue with your request. Please try again.');
        setMessage('');
      }
    } else if (code && newPassword) {
      // Step 2: Verify the Code
      try {
        const response = await axios.post("http://localhost:8080/api/customers/reset-password", { email, code, newPassword });
        setMessage('Code verified successfully! Password is Changed!!.');
        setcode('');
        setNewPassword('');
        setError('');
        navigate("/Log-In");
      } catch (err) {
        setError('Invalid verification code. Please try again.');
        setMessage('');
      }
    } 
  };

  return (
    <div className="forgot__password__container">
      <h2 className="forgot__password__h2">Forgot Your Password?</h2>
      <p className="forgot__password__h2">Enter your email address below and we’ll send you instructions to reset your password.</p>

      {message && <p className="forgot__password__message">{message}</p>}
      {error && <p className="forgot__password__message" style={{ color: 'red' }}>{error}</p>}

      <form className='forgot__password__form' onSubmit={handleSubmit}>
        {!isCodeSent ? (
          // Step 1: Request Verification Code
          <>
            <label className='forgot__password__h2' htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='forgot__password__input'
              placeholder="Enter your email"
            />
            <button type="submit" className="forgot__password__button">Send Verification Code</button>
          </>
        ) : (
          // Step 2: Verify Code and Update Password
          <>
            <label className='forgot__password__h2' htmlFor="code">Verification Code</label>
            <input
              type="text"
              id="code"
              name="code"
              required
              value={code}
              onChange={(e) => setcode(e.target.value)}
              className='forgot__password__input'
              placeholder="Enter your verification code"
            />
            {code && (
              <>
                <label className='forgot__password__h2' htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='forgot__password__input'
                  placeholder="Enter your new password"
                />
              </>
            )}
            <button type="submit" className="forgot__password__button">
              {newPassword ? "Reset Password" : "Verify Code"}
            </button>
          </>
        )}
      </form>

      <p className="forgot__password__back-to-login">
        <a href="/Log-In">Back to Login</a>
      </p>
    </div>
  );
};

export default ForgotPassword;
