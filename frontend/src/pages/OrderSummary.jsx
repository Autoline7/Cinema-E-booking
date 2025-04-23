import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSummary.css";

const ticketPrice = 12.99;

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, selectedTime, selectedSeats, ages } = location.state || {};

  const handleRemoveSeat = (seat) => {
    const updatedSeats = selectedSeats.filter((s) => s !== seat);
    navigate("/Order-Summary", {
      state: { movieId, selectedTime, selectedSeats: updatedSeats, ages },
    });
  };

  const handleConfirmOrder = () => {
    navigate("/Order-Confirmation", { state: { movieId, selectedTime, selectedSeats, ages } });
  };

  const handleGoBack = () => {
    navigate(`/Book-Ticket/${movieId}`);
  };

  const totalCost = selectedSeats.length * ticketPrice;

  return (
    <div className="order-summary-container">
      <h1>Order Summary</h1>
      <h2>Movie ID: {movieId}</h2>
      <h3>Show Time: {selectedTime}</h3>
      
      {}
      <button className="back-button" onClick={handleGoBack}>Back to Book Ticket</button>
      
      <div className="ticket-list">
        {selectedSeats.map((seat) => (
          <div key={seat} className="ticket-item">
            <span>Seat {seat} - Age: {ages[seat]}</span>
            <span>Price: ${ticketPrice.toFixed(2)}</span>
            <button className="remove-button" onClick={() => handleRemoveSeat(seat)}>Remove</button>
          </div>
        ))}
      </div>
      <h2>Total: ${totalCost.toFixed(2)}</h2>
      <button className="confirm-button" onClick={handleConfirmOrder}>Confirm & Checkout</button>
    </div>
  );
};

export default OrderSummary;
