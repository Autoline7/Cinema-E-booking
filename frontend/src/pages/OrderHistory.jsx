import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderHistory.css";

const OrderHistory = () => {
  const navigate = useNavigate();
  const storedCustomer = JSON.parse(localStorage.getItem("customer"));
  const customerId = storedCustomer?.userId;

  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    if (!customerId) return;

    const fetchBookings = async () => {
      try {
        const bookingRes = await axios.get(
          `http://localhost:8080/api/bookings/customer/${customerId}`
        );
        const allBookings = bookingRes.data;

        const detailed = await Promise.all(
          allBookings.map(async (b) => {
            const detailRes = await axios.get(
              `http://localhost:8080/api/bookings/${b.bookingId}`
            );
            const bookingDetail = detailRes.data;

            let tickets = [];
            try {
              const ticketRes = await axios.get(
                `http://localhost:8080/api/tickets/booking/${b.bookingId}`
              );
              tickets = ticketRes.data || [];
            } catch {
              console.error(`Tickets fetch failed for ${b.bookingId}`);
              tickets = [];
            }

            return { ...bookingDetail, tickets };
          })
        );

        const completedBookings = detailed.filter(
          (b) => Array.isArray(b.tickets) && b.tickets.length > 0
        );

        setBookings(completedBookings);
      } catch (error) {
        console.error("Failed to load bookings", error);
        setBookings([]);
      }
    };

    fetchBookings();
  }, [customerId]);

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="order-history-container">
      <h1>Order History</h1>

      {bookings === null ? (
        <p className="loading">Loading order history...</p>
      ) : bookings.length === 0 ? (
        <p className="empty">You have no past orders.</p>
      ) : (
        bookings.map((booking) => {
          const card = booking.paymentCard;
          const exp = card
            ? `${String(
                new Date(card.expirationDate).getMonth() + 1
              ).padStart(2, "0")}/${new Date(
                card.expirationDate
              ).getFullYear()}`
            : "";

          return (
            <div key={booking.bookingId} className="history-item">
              <div className="history-header">
                <h3>
                  Booking Date: {formatDateTime(booking.dateCreated || booking.bookingDate)}
                </h3>
                {card && (
                  <p className="history-card">
                    Payment: **** **** **** {card.lastFourDigits} (exp {exp})
                  </p>
                )}
              </div>

              <div className="history-tickets">
                <h4>Tickets:</h4>
                <ul>
                  {booking.tickets.map((ticket) => (
                    <li key={ticket.ticketId} className="history-ticket">
                      {ticket.seat?.seatNumber || "Seat Unknown"} —{" "}
                      {ticket.screening?.movie?.title || "Unknown Movie"} on{" "}
                      {ticket.screening?.showtime
                        ? formatDateTime(ticket.screening.showtime)
                        : "Unknown Time"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })
      )}

      <div className="history-actions">
        <button className="history-button" onClick={() => navigate("/User-Dashboard")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;
