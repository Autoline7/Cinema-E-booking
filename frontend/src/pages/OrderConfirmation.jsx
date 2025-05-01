import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location.state || {};

  const [booking, setBooking] = useState(null);
  const [screening, setScreening] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [card, setCard] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [ticketPrices, setTicketPrices] = useState({ Adult: 0, Child: 0, Senior: 0 });

  useEffect(() => {
    if (!bookingId) return;

    const fetchDetailsAndSendEmail = async () => {
      try {
        const bookingRes = await axios.get(`http://localhost:8080/api/bookings/${bookingId}`);
        const bookingData = bookingRes.data;
        setBooking(bookingData);

        const screeningId = bookingData?.tickets?.[0]?.screening?.screeningId;
        if (screeningId) {
          const screeningRes = await axios.get(`http://localhost:8080/api/screenings/${screeningId}`);
          setScreening(screeningRes.data);
        }

        const ticketsRes = await axios.get(`http://localhost:8080/api/tickets/booking/${bookingId}`);
        setTickets(ticketsRes.data);

        const cardRes = await axios.get(`http://localhost:8080/api/payment-cards/${bookingData.paymentCard.cardId}`);
        setCard(cardRes.data);

        await axios.put(`http://localhost:8080/api/bookings/${bookingId}/send-confirmation-email`);
        setEmailSent(true);
      } catch (err) {
        console.error("Error loading confirmation data or sending email", err);
      }
    };

    fetchDetailsAndSendEmail();
  }, [bookingId]);

  useEffect(() => {
    const fetchTicketPrices = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/ticket-prices");
        const prices = res.data;
        setTicketPrices({
          Adult: prices.Adult || 0,
          Child: prices.Child || 0,
          Senior: prices.Senior || 0,
        });
      } catch (err) {
        console.error("Failed to load ticket prices", err);
      }
    };
    fetchTicketPrices();
  }, []);

  const calculateTotal = () => {
    let total = 0;
    tickets.forEach((ticket) => {
      total += ticketPrices[ticket.ticketType] || 0;
    });

    if (booking?.promotion?.discountPercentage) {
      const discount = booking.promotion.discountPercentage / 100;
      total *= 1 - discount;
    }

    return total.toFixed(2);
  };

  const formattedExp = card
    ? `${String(new Date(card.expirationDate).getMonth() + 1).padStart(2, "0")}/${new Date(
        card.expirationDate
      ).getFullYear()}`
    : "";

  const formattedShowTime = screening?.showtime
    ? new Date(screening.showtime).toLocaleString()
    : "Unavailable";

  const formattedPurchaseDate =
    booking?.dateCreated || booking?.bookingDate
      ? new Date(booking.dateCreated || booking.bookingDate).toLocaleDateString()
      : "Unavailable";

  return (
    <div className="order-confirmation-container">
      <h1>Order Confirmed!</h1>
      <h2>Thank you for your purchase.</h2>

      {!booking ? (
        <p>Loading booking details...</p>
      ) : (
        <div className="order-details">
          <h3>Booking ID: {booking.bookingId}</h3>
          <h3>Movie: {screening?.movie?.title || "Unknown"}</h3>
          <h3>Show Time: {formattedShowTime}</h3>
          <h3>Date of Purchase: {formattedPurchaseDate}</h3>

          <h3>Tickets:</h3>
          <ul>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <li key={ticket.ticketId}>
                  Seat {ticket.seat?.seatNumber} — Type: {ticket.ticketType}
                </li>
              ))
            ) : (
              <li>Loading tickets...</li>
            )}
          </ul>

          {card && (
            <div className="payment-details">
              <h3>Payment Method:</h3>
              <p>**** **** **** {card.lastFourDigits} (exp {formattedExp})</p>
            </div>
          )}

          <h3>Total Paid: ${calculateTotal()}</h3>
          {booking.promotion && (
            <p>Promotion Applied: {booking.promotion.promoCode} (-{booking.promotion.discountPercentage}%)</p>
          )}
          {emailSent && <p style={{ color: "green" }}>Confirmation email sent!</p>}
        </div>
      )}

      <div className="confirmation-buttons">
        <button className="home-button" onClick={() => navigate("/User-Dashboard")}>Back to Home</button>
        <button className="home-button" onClick={() => navigate("/Order-History")}>Order History</button>
      </div>
    </div>
  );
};

export default OrderConfirmation;