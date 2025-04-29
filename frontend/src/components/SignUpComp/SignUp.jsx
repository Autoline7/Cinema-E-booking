import InputField from "./InputField.jsx"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../LogIn-SignUp.css";
import SimpleAlert from "../SimpleAlert";
import axios from "axios";
import PaymentCardInput from "../AdminPageComp/Forms/inputs/PaymentCardInput.jsx";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [givenSecPass, setGivenSecPass] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("Registration Successful!!!");
    const [showPopup, setShowPopup] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [newPaymentCards, setNewPaymentCards] = useState([]);
    
    const navigate = useNavigate();
    const location = useLocation();

    const [formCustomer, setCustomer] = useState({
        address: { street: "", city: "", state: "", zipCode: "", country: "" }, // Optional
        decryptedPassword: "",
        email: "",
        firstName: "",
        isSubscriber: "",
        lastName: "",
        phoneNumber: "",
        role: "CUSTOMER",
        status: "ACTIVE",
    });

    useEffect(() => {
        setIsAdmin(givenSecPass === "admin123");
    }, [givenSecPass]);

    useEffect(() => {
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            firstName,
            lastName,
            email,
            decryptedPassword: password,
            phoneNumber: phone,
            isSubscriber: isSubscriber ? "TRUE" : "FALSE"
        }));
    }, [firstName, lastName, email, password, phone, isSubscriber]);

    const handleAlert = (message = "Registration Successful!!!") => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    async function signUp(event) {
        event.preventDefault();
        try {
            if (isAdmin) {
                const filteredData = JSON.stringify(formCustomer, (key, value) => 
                    key === "address" || key === "isSubscriber" || key === "role" || key === "status" ? undefined : value
                );
                await axios.post("http://localhost:8080/api/admins", JSON.parse(filteredData));
                handleAlert();

                setTimeout(() => {
                    navigate("/Log-In");
                }, 3000);
                
            } else {
                const response = await axios.post("http://localhost:8080/api/customers/send-verification", { email });
                setShowPopup(true);
            }
            
        } catch (error) {
            console.error("Error sending verification code:", error.message);
            handleAlert("Error: " + (error.response?.data?.message || error.message));
        }
    }

    async function verifyCodeAndCreateAccount() {
        try {
            // Verify the code
            const verifyResponse = await axios.post("http://localhost:8080/api/customers/verify", { 
                email, 
                code: verificationCode 
            });

            // Create the customer
            await axios.post("http://localhost:8080/api/customers", formCustomer);


            const customerResponse = await axios.get(`http://localhost:8080/api/customers/email/${email}`);
            
            const customerId = customerResponse.data.userId;

            // Create new Payment Cards if any
            if (showPayment && newPaymentCards.length > 0 && customerId) {
                
                try {
                    for (const paymentCard of newPaymentCards) {
                        await axios.post(
                            `http://localhost:8080/api/payment-cards/customer/${customerId}/new-address`,
                            paymentCard
                        );
                    }
                    
                } catch (cardError) {
                    console.error("Error adding payment cards:", cardError.response?.data || cardError.message);
                    // Continue with account creation even if payment card addition fails
                }
            }

            // Hide popup and show success alert
            setShowPopup(false);
            handleAlert("Registration Successful! You can now log in.");

            setTimeout(() => {
                navigate("/Log-In");
            }, 3000);

        } catch (error) {
            console.error("Error verifying code:", error.message);
            handleAlert("Invalid verification code. Please try again.");
        }
    }

    const handleDeletePaymentCard = async (cardId) => {
        // This function shouldn't be needed during signup as there are no existing cards to delete
        // But kept for future reference
    };

    return (
        <div id="Log-In-Sign-Up">
            <div className="login-container">
                <h2 className="form-title">Sign Up</h2>
                
                <h2 className="form-title">Create Account</h2>
                <form onSubmit={signUp} action="#" className="login-form">
                    <p className="registration__fields">* Required *</p>
                    <InputField value={firstName} type="text" placeholder="First Name" icon="person" onChange={(e) => setFirstName(e.target.value)} required={true}/>
                    <p className="registration__fields">* Required *</p>
                    <InputField value={lastName} type="text" placeholder="Last Name" icon="person" onChange={(e) => setLastName(e.target.value)} required={true} />
                    <p className="registration__fields">* Required *</p>
                    <InputField value={email} type="email" placeholder="Email address" icon="mail" onChange={(e) => setEmail(e.target.value)} required={true}/>
                    <p className="registration__fields">* Required *</p>
                    <InputField value={password} type="password" placeholder="Password.....(6 >= characters)" icon="lock" onChange={(e) => setPassword(e.target.value)} required={true}/>
                    <p className="registration__fields">* Required *</p>
                    <InputField value={phone} type="tel" placeholder="Phone Number" icon="call" onChange={(e) => setPhone(e.target.value)} required={true} />
                    <div className="input-group">
                        <label htmlFor="promotions-toggle">Subscribe to Promotions:</label>
                        <input
                            id="promotions-toggle"
                            type="checkbox"
                            checked={isSubscriber}
                            onChange={() => setIsSubscriber(!isSubscriber)}
                        />
                    </div>
                    
                    {!isAdmin && (
                        <div className="input-group">
                            <label>Add Payment Card(s)</label>
                            <input
                                type="checkbox"
                                checked={showPayment}
                                onChange={() => setShowPayment(!showPayment)}
                            />
                        </div>
                    )}

                    {showPayment && !isAdmin && (
                        <div className="input-group">
                            <label htmlFor="paymentCards">Add New Payment Card(s):</label>
                            <PaymentCardInput
                                paymentCards={newPaymentCards}
                                setPaymentCards={setNewPaymentCards}
                                existingPaymentCards={[]} // No existing cards for new users
                                handleDeletePaymentCard={handleDeletePaymentCard}
                            />
                        </div>
                    )}
                    
                    {location.pathname === "/Sign-Up/Admin" ? (
                        <>
                            <p className="registration__fields">* Required *</p>
                            <InputField value={givenSecPass} type="password" placeholder="Admin Security Password.....(6 >= characters)" icon="lock" onChange={(e) => setGivenSecPass(e.target.value)} />
                            <button disabled={!isAdmin} type="submit" className="login-button">Create Account</button>
                        </>
                    ) : (
                        <button type="submit" className="login-button">Create Account</button>
                    )}
                </form>

                <p className="signup-text">Already have an account? <a href="/Log-In" className="signup-text-link">Login now</a></p>
                {showAlert && <SimpleAlert message={alertMessage} />}

                {showPopup && (
                    <div className="login-form signup__popup">
                        <div className="popup-content">
                            <h3>Enter Verification Code</h3>
                            <InputField
                                value={verificationCode}
                                type="text"
                                placeholder="Enter your code"
                                icon="key"
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                            <button onClick={verifyCodeAndCreateAccount} className="login-button">Verify</button>
                            <button onClick={() => setShowPopup(false)} className="cancel-button">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SignUp;