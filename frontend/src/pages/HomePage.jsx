import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [moviesData, setMoviesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getEmbedUrl = (url) => {
    if (!url) return "";
    return url.includes("watch?v=")
      ? url.replace("watch?v=", "embed/")
      : url;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/movies");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMoviesData(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = moviesData.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentlyRunningGenres = ["Drama", "Sci-Fi", "Action"];
  const comingSoonGenres = ["Fantasy", "Animation"];

  const renderMovieCard = (movie) => (
    <div key={movie.id} className="movie-card">
      <h3>{movie.title}</h3>
      <iframe
        width="300"
        height="200"
        src={getEmbedUrl(movie.video)}
        title={movie.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );

  return (
    <div className="home-container">
      <header className="homepage-header">
        <h1>Welcome to CineWorld</h1>
        <div className="homepage-buttons">
          <button onClick={() => navigate("/Log-In")}>Log In</button>
          <button onClick={() => navigate("/Sign-Up")}>Sign Up</button>
        </div>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </header>

      <h2 className="homepage-section-title">Currently Running</h2>
      <div className="movies-section">
        {filteredMovies
          .filter((movie) => currentlyRunningGenres.includes(movie.genre))
          .map(renderMovieCard)}
      </div>

      <h2 className="homepage-section-title">Coming Soon</h2>
      <div className="movies-section">
        {filteredMovies
          .filter((movie) => comingSoonGenres.includes(movie.genre))
          .map(renderMovieCard)}
      </div>
    </div>
  );
};

export default HomePage;
