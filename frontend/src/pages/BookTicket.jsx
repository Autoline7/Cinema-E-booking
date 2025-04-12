import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookTicket.css";
import axios from "axios";

const seats = Array.from({ length: 30 }, (_, i) => i + 1);

const BookTicket = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ages, setAges] = useState({});
  const [movie, setMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);

  useEffect(() => {
    const fetchMovieAndScreenings = async () => {
      try {
        const movieRes = await axios.get(`http://localhost:8080/api/movies/${movieId}`);
        setMovie(movieRes.data);

        const screeningsRes = await axios.get(`http://localhost:8080/api/screenings/movie/id/${movieId}`);
        setScreenings(screeningsRes.data);
      } catch (err) {
        console.error("Error fetching movie or screenings:", err);
      }
    };

    fetchMovieAndScreenings();
  }, [movieId]);

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
    navigate("/Order-Summary", {
      state: { movieId, selectedTime, selectedSeats, ages },
    });
  };

  const handleBack = () => {
    navigate("/User-Dashboard");
  };

  const isComingSoon = screenings.length === 0;

  return (
    <div className="book-ticket-container">
      {movie ? (
        <div className="movie-info">
          <h2>{movie.title}</h2>
          {movie.trailerPicture && (
            <img src={movie.trailerPicture} alt={`${movie.title} Trailer`} />
          )}
          <p><strong>Category:</strong> {movie.genre}</p>
          <p><strong>Cast:</strong> {Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Producer:</strong> {movie.producer}</p>
          <p><strong>Synopsis:</strong> {movie.synopsis}</p>
          {movie.rating && <p><strong>Rating:</strong> {movie.rating}</p>}
          <p><strong>MPAA Rating:</strong> {movie.mpaa}</p>
          {movie.showDates && Array.isArray(movie.showDates) && (
            <p><strong>Show Dates:</strong> {movie.showDates.join(", ")}</p>
          )}

          <div style={{ marginTop: "10px" }}>
            <strong>Reviews:</strong>
            {Array.isArray(movie.reviews) && movie.reviews.length > 0 ? (
              <ul style={{ marginTop: "5px" }}>
                {movie.reviews.map((rev, idx) => (
                  <li key={idx} style={{ margin: "5px 0" }}>
                    {rev.comment && `"${rev.comment}"`}
                    {rev.rating && ` — Rating: ${rev.rating}`}
                    {rev.reviewer && ` (by ${rev.reviewer})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ marginTop: "5px" }}>No reviews available.</p>
            )}
          </div>

          <div className="trailer-section">
            <h3>Trailer</h3>
            <iframe
              src={
                movie.video.includes("watch?v=")
                  ? movie.video.replace("watch?v=", "embed/")
                  : movie.video
              }
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : (
        <p>Loading movie information...</p>
      )}

      {movie && (
        <>
          {isComingSoon ? (
            <>
              <h1>Book Your Ticket</h1>
              <p style={{ color: "#e50914" }}>Movie ID: {movieId}</p>
              <div className="coming-soon-message">
                <h3 style={{ color: "#fff", fontSize: "1.2rem" }}>
                  No Showtimes yet - Check back soon!
                </h3>
              </div>
              <div className="button-row">
                <button className="back-button" onClick={handleBack}>
                  Back
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Book Your Ticket</h1>
              <p style={{ color: "#e50914" }}>Movie ID: {movieId}</p>

              <div className="showtimes">
                <h3>Select Show Time:</h3>
                {screenings.map((screening, idx) => {
                  const dateObj = new Date(screening.showtime);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  });
                  const display = `${formattedDate} at ${formattedTime}`;

                  return (
                    <button
                      key={`screening-${idx}`}
                      className={selectedTime === display ? "selected" : ""}
                      onClick={() => setSelectedTime(display)}
                    >
                      {display}
                    </button>
                  );
                })}
              </div>

              <div className="seats">
                <h3>Select Seats:</h3>
                <div className="screen-placeholder">Screen</div>
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

              {selectedSeats.length > 0 && (
                <div className="age-inputs">
                  <h3>Enter Age for Selected Seats</h3>
                  {selectedSeats.map((seat) => (
                    <div key={`age-${seat}`} className="age-entry">
                      <label htmlFor={`age-${seat}`}>Seat {seat}:</label>
                      <input
                        id={`age-${seat}`}
                        type="number"
                        min="0"
                        placeholder="Age"
                        value={ages[seat] || ""}
                        onChange={(e) => handleAgeChange(seat, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="button-row">
                <button className="back-button" onClick={handleBack}>Back</button>
                <button className="confirm-button" onClick={handleConfirmBooking}>
                  Confirm Booking
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BookTicket;