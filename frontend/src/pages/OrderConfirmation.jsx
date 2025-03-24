import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, selectedTime, selectedSeats, ages } = location.state || {};

  console.log("OrderConfirmation Loaded");
  console.log("Received Data:", location.state);

  return (
    <div className="order-confirmation-container">
      <h1>Order Confirmed!</h1>
      <h2>Thank you for your purchase.</h2>
      <div className="order-details">
        <h3>Movie ID: {movieId}</h3>
        <h3>Show Time: {selectedTime}</h3>
        <h3>Seats:</h3>
        <ul>
          {selectedSeats && selectedSeats.length > 0 ? (
            selectedSeats.map((seat) => (
              <li key={seat}>Seat {seat} - Age: {ages?.[seat]}</li>
            ))
          ) : (
            <li>No seats selected</li>
          )}
        </ul>
      </div>
      <button className="home-button" onClick={() => navigate("/User-DashBoard")}>
        Back to Home
      </button>
    </div>
  );
};

export default OrderConfirmation;
