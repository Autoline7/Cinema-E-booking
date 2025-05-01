import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import axios from "axios";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(""); // NEW
  const [moviesData, setMoviesData] = useState([]);
  const [runningMovies, setRunningMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMoviesAndScreenings = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/movies");
        const movies = res.data;

        const moviesWithScreenings = await Promise.all(
          movies.map(async (movie) => {
            try {
              const screeningRes = await axios.get(
                `http://localhost:8080/api/screenings/movie/id/${movie.id}`
              );
              const screenings = screeningRes.data;
              return {
                ...movie,
                hasScreenings: screenings.length > 0,
                screenings: screenings,
              };
            } catch {
              return { ...movie, hasScreenings: false, screenings: [] };
            }
          })
        );

        setMoviesData(moviesWithScreenings);
        setRunningMovies(moviesWithScreenings.filter((m) => m.hasScreenings));
        setComingSoonMovies(moviesWithScreenings.filter((m) => !m.hasScreenings));
      } catch (err) {
        console.error("Error fetching movies or screenings:", err);
      }
    };

    fetchMoviesAndScreenings();
  }, []);

  const filteredMovies = (list) =>
    list.filter((movie) => {
      const search = searchTerm.toLowerCase();
      const matchesText =
        movie.title.toLowerCase().includes(search) ||
        movie.genre.toLowerCase().includes(search);

      if (!searchDate) return matchesText;

      const dateMatch = movie.screenings?.some(
        (s) => s.showtime.split("T")[0] === searchDate
      );

      return matchesText && dateMatch;
    });

  const renderMovieCard = (movie) => (
    <div key={movie.id} className="movie-card">
      <h3>{movie.title}</h3>
      <iframe
        width="300"
        height="200"
        src={movie.video}
        title={movie.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <p>
        <strong>MPAA Rating:</strong> {movie.mpaa}
      </p>
      {/* Book button intentionally hidden on Home Page */}
    </div>
  );

  return (
    <div className="home-container">
      <header className="header">
        <h1>Welcome to Cinema E-Booking</h1>
        <div className="homepage-buttons">
          <button onClick={() => navigate("/Log-In")}>Log In</button>
        </div>
      </header>

      <input
        type="text"
        placeholder="Search movies by title or genre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* NEW: Date filter input */}
      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="search-bar"
        style={{ marginTop: "10px" }}
      />

      <h2>Currently Running</h2>
      <div className="movies-section">
        {filteredMovies(runningMovies).length > 0 ? (
          filteredMovies(runningMovies).map(renderMovieCard)
        ) : (
          <p>No currently running movies found matching your search.</p>
        )}
      </div>

      <h2>Coming Soon</h2>
      <div className="movies-section">
        {filteredMovies(comingSoonMovies).length > 0 ? (
          filteredMovies(comingSoonMovies).map(renderMovieCard)
        ) : (
          <p>No coming soon movies found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
