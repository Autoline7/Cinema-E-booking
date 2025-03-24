import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import axios from "axios";

const UserPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer")) || null;
  const [userData, setUserData] = useState(null);
  const currentlyRunningGenres = ["Drama", "Sci-Fi", "Action"];
  const comingSoonGenres = ["Fantasy", "Animation"];
  const [moviesData, setMoviesData] = useState([]);


  useEffect(() => {
    const fetchCustomer = async () => {
        setUserData(customer);
        console.log(customer)
        setUserName(customer.firstName)
        
    };

    fetchCustomer();
  }, [navigate]);

    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const res = await axios.get("http://localhost:8080/api/movies");
          const data = res.data
          setMoviesData(data);
        } catch (err) {
          console.error("Error fetching movies:", err);
        }
      };

      fetchMovies();
    }, []);


  async function handleSignOut() {
    try {
      await axios.post("http://localhost:8080/api/customers/logout", {email :userData.email});
      console.log("User signed out successfully");
      localStorage.removeItem("customer");
      navigate("/Log-In");
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
    }
  }

  const filteredMovies = moviesData.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmbedUrl = (url) => {
    if (!url) return "";
    return url.includes("watch?v=")
      ? url.replace("watch?v=", "embed/")
      : url;
  };

  const renderMovieCard = (movie) => (
    <div key={movie.id} className="movie-card">
      <h3>{movie.title}</h3>
      <iframe
        width="100%"
        height="180"
        src={getEmbedUrl(movie.video)}
        title={movie.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <button
        className="book-button"
        onClick={() => navigate(`/Book-Ticket/${movie.id}`)}
      >
        Book Movie
      </button>
    </div>
  );

  return (
    <div className="home-container">
      <header className="header">
        <h1>Hi, {userName}</h1>
        <div className="user-buttons">
          <button className="account-button" onClick={() => navigate("/Edit-Profile")}>
            My Account
          </button>
          <button className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <h2 className="user__h2">Currently Running</h2>
      <div className="movies-section">
        {filteredMovies
          .filter((movie) => currentlyRunningGenres.includes(movie.genre))
          .map(renderMovieCard)}
      </div>

      <h2>Coming Soon</h2>
      <div className="movies-section">
        {filteredMovies
          .filter((movie) => comingSoonGenres.includes(movie.genre))
          .map(renderMovieCard)}
      </div>
    </div>
  );
};

export default UserPage;
