import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderSummary.css";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, selectedTime, selectedSeats = [], ages = {}, screeningId } = location.state || {};

  const [movie, setMovie] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [ticketPrices, setTicketPrices] = useState({ Adult: 0, Child: 0, Senior: 0 });
  const [availableSeats, setAvailableSeats] = useState([]);

  const storedCustomer = JSON.parse(localStorage.getItem("customer"));
  const customerId = storedCustomer?.userId;

  useEffect(() => {
    if (!movieId) return;
    axios.get(`http://localhost:8080/api/movies/${movieId}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error("Failed to load movie details", err));
  }, [movieId]);

  useEffect(() => {
    if (!customerId) return;
    axios.get(`http://localhost:8080/api/payment-cards/customer/${customerId}`)
      .then((res) => {
        setCards(res.data);
        if (res.data.length > 0) setSelectedCardId(res.data[0].cardId);
      })
      .catch((err) => {
        console.error("Failed to load payment cards", err);
        setCards([]);
      });
  }, [customerId]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/ticket-prices");
        const prices = res.data;
        if (typeof prices === 'object' && prices !== null && !Array.isArray(prices)) {
          setTicketPrices({
            Adult: prices.Adult || 0,
            Child: prices.Child || 0,
            Senior: prices.Senior || 0
          });
        } else {
          console.error("Ticket prices response is not an object:", res.data);
        }
      } catch (err) {
        console.error("Failed to load ticket prices", err);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/screenings/${screeningId}`);
        const showroomId = res.data?.showroom?.showroomId;
        if (showroomId) {
          const seatRes = await axios.get(`http://localhost:8080/api/seats/showroom/${showroomId}`);
          setAvailableSeats(seatRes.data);
        }
      } catch (err) {
        console.error("Failed to load seats for showroom", err);
      }
    };
    if (screeningId) fetchScreening();
  }, [screeningId]);

  const getTicketType = (age) => {
    if (age < 13) return "Child";
    if (age >= 56) return "Senior";
    return "Adult";
  };

  const getSeatIdFromLabel = (label) => {
    const match = availableSeats.find((seat) => seat.seatNumber === label);
    return match?.seatId;
  };

  const handleRemoveSeat = (seat) => {
    const updatedSeats = selectedSeats.filter((s) => s !== seat);
    navigate("/Order-Summary", {
      state: { movieId, selectedTime, selectedSeats: updatedSeats, ages, screeningId },
    });
  };

  const handleCardSelect = (e) => setSelectedCardId(Number(e.target.value));

  const handleConfirmOrder = async () => {
    if (!selectedCardId || !screeningId) {
      alert("Missing payment or screening details.");
      return;
    }

    try {
      let promoId = null;
      if (promoCode?.length === 4) {
        try {
          const promoRes = await axios.get(`http://localhost:8080/api/promotions/code/${promoCode}`);
          promoId = promoRes.data.promoId;
        } catch {
          console.warn("Invalid or expired promo code");
        }
      }

      const bookingRes = await axios.post(
        `http://localhost:8080/api/bookings/customer/${customerId}/card/${selectedCardId}`,
        {},
        { params: promoId ? { promoId } : {} }
      );
      const bookingId = bookingRes.data.bookingId;

      for (let seatLabel of selectedSeats) {
        const seatId = getSeatIdFromLabel(seatLabel);
        const age = ages[seatLabel];
        const ticketType = getTicketType(age);

        if (!seatId) {
          console.warn(`Seat ID not found for label ${seatLabel}`);
          continue;
        }

        await axios.post(
          `http://localhost:8080/api/tickets/booking/${bookingId}/seat/${seatId}/screening/${screeningId}`,
          { ticketType }
        );
      }

      navigate("/Order-Confirmation", { state: { bookingId } });
    } catch (err) {
      console.error("Error creating booking or tickets:", err);
      alert("Something went wrong during checkout. Please try again.");
    }
  };

  const handleGoBack = () => navigate(`/Book-Ticket/${movieId}`);

  const formattedTime = selectedTime
    ? new Date(selectedTime).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="order-summary-container">
      <h1>Order Summary</h1>
      {movie && <h2>{movie.title}</h2>}
      <h3>Show Time: {formattedTime}</h3>

      <button className="back-button" onClick={handleGoBack}>
        Back to Book Ticket
      </button>

      <div className="ticket-list">
        {selectedSeats.map((seat) => {
          const age = ages[seat];
          const type = getTicketType(age);
          return (
            <div key={seat} className="ticket-item">
              <span>Seat {seat} - Age: {age} ({type})</span>
              <span>Price: ${ticketPrices[type]?.toFixed(2) ?? '0.00'}</span>
              <button className="remove-button" onClick={() => handleRemoveSeat(seat)}>Remove</button>
            </div>
          );
        })}
      </div>

      <div className="payment-section">
        <h3>Select Payment Method</h3>
        {cards.length === 0 ? (
          <p>No saved payment cards.</p>
        ) : (
          <div className="card-list">
            {cards.map((card) => {
              const exp = new Date(card.expirationDate);
              const formattedExp = `${String(exp.getMonth() + 1).padStart(2, '0')}/${exp.getFullYear()}`;
              return (
                <label key={card.cardId} className="card-option">
                  <input
                    type="radio"
                    name="paymentCard"
                    value={card.cardId}
                    checked={selectedCardId === card.cardId}
                    onChange={handleCardSelect}
                  />
                  **** **** **** {card.lastFourDigits} (exp {formattedExp})
                </label>
              );
            })}
          </div>
        )}
        {cards.length < 4 && (
          <button className="add-card-button" onClick={() => navigate("/Edit-Profile")}>Add New Card</button>
        )}
      </div>

      <div className="promo-code">
        <h3>Enter Promo Code</h3>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          placeholder="Promo Code"
          maxLength={4}
        />
        {promoError && <p className="promo-error">{promoError}</p>}
      </div>

      <button className="confirm-button" onClick={handleConfirmOrder}>
        Confirm & Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
