import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookTicket.css";

const showTimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
const seats = Array.from({ length: 30 }, (_, i) => i + 1);

const BookTicket = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [ages, setAges] = useState({});

    const handleSeatSelection = (seat) => {
        setSelectedSeats((prev) =>
            prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
        );
    };

    const handleAgeChange = (seat, age) => {
        setAges((prev) => ({ ...prev, [seat]: Number(age) }));
    };

    const handleConfirmBooking = () => {
        if (!selectedTime || selectedSeats.length === 0) {
            alert("Please select a show time and at least one seat.");
            return;
        }
        navigate("/Order-Summary", { state: { movieId, selectedTime, selectedSeats, ages } });
    };

    const handleBack = () => {
        navigate("/User-Dashboard");
    };

    return (
        <div className="book-ticket-container">
            <h1>Book Your Ticket</h1>
            <h2>Movie ID: {movieId}</h2>

            <div className="showtimes">
                <h3>Select Show Time:</h3>
                {showTimes.map((time) => (
                    <button
                        key={`time-${time}`}
                        className={selectedTime === time ? "selected" : ""}
                        onClick={() => setSelectedTime(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <div className="seats">
                <h3>Select Seats:</h3>
                <div className="screen-placeholder">Screen</div> {}
                <div className="seat-grid">
                    {seats.map((seat) => (
                        <div
                            key={`seat-${seat}`}
                            className={`seat ${selectedSeats.includes(seat) ? "selected" : ""}`}
                            onClick={() => handleSeatSelection(seat)}
                        >
                            {seat}
                        </div>
                    ))}
                </div>
            </div>

            <div className="age-inputs">
                <h3>Enter Age for Each Selected Seat:</h3>
                {selectedSeats.map((seat) => (
                    <div key={`age-${seat}`} className="age-entry">
                        <label>Seat {seat}:</label>
                        <input
                            type="number"
                            min="1"
                            max="99"
                            value={ages[seat] || ""}
                            onChange={(e) => handleAgeChange(seat, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <div className="button-row">
                <button className="back-button" onClick={handleBack}>Back</button>
                <button className="confirm-button" onClick={handleConfirmBooking}>Confirm Booking</button>
            </div>
        </div>
    );
};

export default BookTicket;
