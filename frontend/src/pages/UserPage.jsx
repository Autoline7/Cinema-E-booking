import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import axios from "axios";

const UserPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer")) || null;
  const [moviesData, setMoviesData] = useState([]);
  const [runningMovies, setRunningMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);

  useEffect(() => {
    setUserName(customer?.firstName || "");
  }, [customer]);

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
              return { ...movie, hasScreenings: screeningRes.data.length > 0 };
            } catch {
              return { ...movie, hasScreenings: false };
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

  const handleSignOut = async () => {
    try {
      await axios.post("http://localhost:8080/api/customers/logout", { email: customer.email });
      localStorage.removeItem("customer");
      navigate("/Log-In");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const filteredMovies = (list) =>
    list.filter((movie) => {
      const search = searchTerm.toLowerCase();
      return (
        movie.title.toLowerCase().includes(search) ||
        movie.genre.toLowerCase().includes(search)
      );
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
      <button className="book-button" onClick={() => navigate(`/Book-Ticket/${movie.id}`)}>
        Book Movie
      </button>
    </div>
  );

  return (
    <div className="home-container">
      <header className="header">
        <h1>Hi, {userName}</h1>
        <div className="user-buttons">
          <button className="account-button" onClick={() => navigate("/Edit-Profile")}>My Account</button>
          <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
        </div>
      </header>

      <input
        type="text"
        placeholder="Search movies by title or genre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <h2 className="user__h2">Currently Running</h2>
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

export default UserPage;