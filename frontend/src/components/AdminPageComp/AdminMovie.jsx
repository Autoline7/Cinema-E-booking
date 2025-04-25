import { useEffect, useState } from "react"
import ViewPopup from "../ViewPopup";
import axios from "axios";
import SimpleAlert from "../SimpleAlert";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const AdminMovie = ({movie, editMovieForm, setEditMovieForm}) => {

  const [viewReviews, setViewReviews] = useState(false);
  const [viewSynopsis, setViewSynopsis] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showTimes, setShowTimes] = useState([]);
  

  // Generate reviewText outside the if statement to make it accessible in JSX
  const reviewText = movie.reviews ? 
    movie.reviews
      .map((review) =>
        "<strong>ReviewID:</strong> " + review.reviewId +
        "<br /><strong>Rating:</strong> " + review.rating +
        "<br /><strong>Reviewer Name:</strong> " + review.reviewerName +
        "<br /><strong>Comment:</strong> " + review.comment
      )
      .join("<br /><br />") 
    : "";

  // Format showtimes correctly based on the provided JSON structure
  const formattedShowtimes = showTimes.map(showTime => {
    const date = new Date(showTime.showtime);
    if (date instanceof Date && !isNaN(date)) {
      return date.toLocaleString();
    } else {
      return ''; // Return empty if date is invalid
    }
  }).filter(time => time !== '').join(', ');

  // Get all unique showroom IDs
  const showroomIds = [...new Set(
    showTimes
      .filter(showTime => showTime.showroom && showTime.showroom.showroomId)
      .map(showTime => showTime.showroom.showroomId)
  )].join(', ');

  async function fetchTimes() {
    const title = movie.title
    const {data} = await axios.get(`http://localhost:8080/api/screenings/movie/title/${title}`);
    setShowTimes(data);
  }

  useEffect(() => {
    fetchTimes();
  }, [movie.title]);

  async function deleteMovie(id) {
    await axios.delete(`http://localhost:8080/api/movies/${id}`);
  }

  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };



  const handleDelete = () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteMovie(movie.id);
            handleAlert();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        },
        {
          label: 'No',
          onClick: () => {
          }
        }
      ]
    });
  };
  

  
  
  return (
    <div className="admin__movie">
      <div className="admin__movie__header">
        <h3 className="admin__movie__title">{movie.title == null ? "N/A" : movie.title}</h3>
        <div>
          <button onClick={() => 
            setEditMovieForm(prevState => ({
              ...prevState,
              formOpen: prevState.movie.id === movie.id ? !prevState.formOpen : true,
              movie: movie
            }))}
             className="admin__movie__edit__button">{editMovieForm.formOpen && editMovieForm.movie.id === movie.id ? "Close" : "Edit"}</button>
        </div>
      </div>
      <div className="admin__movie__info">
        <table className="admin__movie__info__table">
          <tbody>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Movie ID: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.id == null ? "N/A" : movie.id}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Showrooms: </span></td>
              <td className="admin__movie__td">
                <span className="admin__movie__info__span2">
                  {showroomIds || "N/A"}
                </span>
              </td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Genre: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.genre == null ? "N/A" : movie.genre}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Cast: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.cast == null ? "N/A" : movie.cast}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Director: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.director == null ? "N/A" : movie.director}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Producer: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.producer == null ? "N/A" : movie.producer}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Reviews: </span></td>
              <td className="admin__movie__td">
                <span className="admin__movie__info__span2">
                  {movie.reviews == null ? "N/A" : 
                    <button onClick={() => setViewReviews(prevState => !prevState)} className="admin__movie__view__info">
                      {viewReviews ? <ViewPopup text={reviewText}/> : "View"}
                    </button>
                  }
                </span>
              </td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Image-URL: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.picture == null ? "N/A" : movie.picture}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Video-URL: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.video == null ? "N/A" : movie.video}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">MPAA: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.mpaa == null ? "N/A" : movie.mpaa}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Showtimes: </span></td>
              <td className="admin__movie__td"><span className="admin__movie__info__span2">{formattedShowtimes || "N/A"}</span></td>
            </tr>
            <tr>
              <td className="admin__movie__td"><span className="admin__movie__info__span1">Synopsis: </span></td>
              <td className="admin__movie__td">
                <span className="admin__movie__info__span2">
                  {movie.synopsis == null ? "N/A" : 
                    <button onClick={() => setViewSynopsis(prevState => !prevState)} className="admin__movie__view__info">
                      {viewSynopsis ? <>View<ViewPopup text={movie.synopsis}/></> : "View"}
                    </button>
                  }
                </span>
              </td>
            </tr>    
          </tbody>
        </table>             
      </div>
      <i onClick={handleDelete} className="material-symbols-outlined admin__movie__trash">delete</i>
      {showAlert && <SimpleAlert message="Movie Deleted Successfully!!!" />}
    </div>
  )
}

export default AdminMovie