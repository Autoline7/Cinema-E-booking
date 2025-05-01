import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookTicket.css";
import axios from "axios";
import Swal from 'sweetalert2'

const seats = Array.from({ length: 30 }, (_, i) => i + 1);

const BookTicket = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedScreeningId, setSelectedScreeningId] = useState(null);
  const [takenSeats, setTakenSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ages, setAges] = useState({});

  useEffect(() => {
    const fetchMovieAndScreenings = async () => {
      try {
        const movieRes = await axios.get(`http://localhost:8080/api/movies/${movieId}`);
        setMovie(movieRes.data);

        const screeningRes = await axios.get(`http://localhost:8080/api/screenings/movie/id/${movieId}`);
        setScreenings(screeningRes.data);
      } catch (error) {
        console.error("Error loading movie or screenings:", error);
      }
    };
    fetchMovieAndScreenings();
  }, [movieId]);

  useEffect(() => {
    const loadTakenSeats = async () => {
      if (!selectedScreeningId) {
        setTakenSeats([]);
        return;
      }

      try {
        const ticketsRes = await axios.get("http://localhost:8080/api/tickets");
        const booked = ticketsRes.data
          .filter((t) => t.screening?.screeningId === selectedScreeningId && t.seat?.seatNumber)
          .map((t) => t.seat.seatNumber);
        setTakenSeats(booked);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setTakenSeats([]);
      }
    };

    loadTakenSeats();
  }, [selectedScreeningId]);

  const handleTimeSelect = (showtime) => {
    setSelectedTime(showtime);
    setSelectedSeats([]);
    setAges({});
    const screening = screenings.find((s) => s.showtime === showtime);
    setSelectedScreeningId(screening?.screeningId || null);
  };

  const handleSeatToggle = (seatNumber) => {
    if (takenSeats.includes(seatNumber)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleAgeChange = (seat, age) => {
    setAges((prev) => ({ ...prev, [seat]: Number(age) }));
  };

  const handleConfirm = () => {
    if (!selectedTime || selectedSeats.length === 0) {
      Swal.fire({
        title: "Select a showtime and at least one seat",
        icon: "error",
        confirmButtonColor: "#e50914"
      });
      return;
    }

    const conflict = selectedSeats.filter((seat) => takenSeats.includes(seat));
    if (conflict.length > 0) {
      alert(`Seat(s) ${conflict.join(", ")} already booked. Please select different seats.`);
      return;
    }

    const allAgesProvided = selectedSeats.every((seat) => typeof ages[seat] === "number" && ages[seat] >= 0);
    if (!allAgesProvided) {
      alert("Please enter age for all selected seats.");
      return;
    }

    navigate("/Order-Summary", {
      state: {
        movieId,
        selectedTime,
        selectedSeats,
        ages,
        screeningId: selectedScreeningId,
      },
    });
  };

  const handleBack = () => navigate("/User-Dashboard");
  const isComingSoon = screenings.length === 0;

  return (
    <div className="book-ticket-container">
      {movie ? (
        <div className="movie-info">
          <h2>{movie.title}</h2>
          {movie.trailerPicture && <img src={movie.trailerPicture} alt={`${movie.title} Trailer`} />}
          <p><strong>Category:</strong> {movie.genre}</p>
          <p><strong>Cast:</strong> {Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Producer:</strong> {movie.producer}</p>
          <p><strong>Synopsis:</strong> {movie.synopsis}</p>
          {movie.rating && <p><strong>Rating:</strong> {movie.rating}</p>}
          <p><strong>MPAA Rating:</strong> {movie.mpaa}</p>
          {movie.showDates && <p><strong>Show Dates:</strong> {movie.showDates.join(", ")}</p>}
          <div className="trailer-section">
            <h3>Trailer</h3>
            <iframe
              src={movie.video.includes("watch?v=") ? movie.video.replace("watch?v=", "embed/") : movie.video}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : (
        <p>Loading movie info...</p>
      )}

      {movie && !isComingSoon && (
        <>
          <h1>Book Your Ticket</h1>
          <p style={{ color: "#e50914" }}>Movie ID: {movieId}</p>

          <div className="showtimes">
            <h3>Select Show Time:</h3>
            {screenings.map((s, i) => {
              const date = new Date(s.showtime);
              const label = date.toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });
              return (
                <button
                  key={i}
                  className={selectedTime === s.showtime ? "selected" : ""}
                  onClick={() => handleTimeSelect(s.showtime)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="seats">
            <h3>Select Seats:</h3>
            <div className="screen-placeholder">SCREEN</div>
            <div className="seat-grid">
              {seats.map((seat) => {
                const row = Math.floor((seat - 1) / 6) + 1;
                const col = ((seat - 1) % 6) + 1;
                const seatNumber = `${row}-${col}`;
                const isTaken = takenSeats.includes(seatNumber);

                return (
                  <div
                    key={seat}
                    className={`seat ${selectedSeats.includes(seatNumber) ? "selected" : ""} ${isTaken ? "taken" : ""}`}
                    onClick={() => handleSeatToggle(seatNumber)}
                    style={{
                      pointerEvents: isTaken ? "none" : "auto",
                      opacity: isTaken ? 0.4 : 1,
                      backgroundColor: isTaken ? "#222" : undefined,
                      cursor: isTaken ? "not-allowed" : "pointer",
                    }}
                  >
                    {seat}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="age-inputs">
              <h3>Enter Age:</h3>
              {selectedSeats.map((seat) => (
                <div key={seat} className="age-entry">
                  <label>Seat {seat}:</label>
                  <input
                    type="number"
                    min="0"
                    value={ages[seat] || ""}
                    onChange={(e) => handleAgeChange(seat, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="button-row">
            <button className="back-button" onClick={handleBack}>Back</button>
            <button className="confirm-button" onClick={handleConfirm}>Confirm Booking</button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookTicket;
