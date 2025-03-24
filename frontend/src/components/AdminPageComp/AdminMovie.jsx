import { useState } from "react"
import ViewPopup from "../ViewPopup";
import axios from "axios";
import SimpleAlert from "../SimpleAlert";

const AdminMovie = ({movie}) => {

  const [viewReviews, setViewReviews] = useState(false);
  const [viewSynopsis, setViewSynopsis] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const reviewText = movie.reviews
  .map((review) =>
    "<strong>ReviewID:</strong> " + review.reviewId +
    "<br /><strong>Rating:</strong> " + review.rating +
    "<br /><strong>Reviewer Name:</strong> " + review.reviewerName +
    "<br /><strong>Comment:</strong> " + review.comment
  )
  .join("<br /><br />"); // Separate each review with extra spacing

  async function deleteMovie(id) {
   await axios.delete(`http://localhost:8080/api/movies/${id}`);//db
   console.log("movie deleted")
  }

  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
};

  const handleDelete = ()=>{
    deleteMovie(movie.id);
    handleAlert();
    setTimeout(() => {
      window.location.reload();
    }, 3000);
   
  }

  


  return (
      <div className="admin__movie">
              <div className="admin__movie__header">
                <h3 className="admin__movie__title">{movie.title == null ? "N/A" : movie.title}</h3>
                <button className="admin__movie__edit__button">Edit</button>
              </div>
                <div className="admin__movie__info">
                    <table className="admin__movie__info__table">
                      <tbody>
                        <tr>
                          <td className="admin__movie__td"><span className="admin__movie__info__span1">Movie ID: </span></td>
                          <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.id == null ? "N/A" : movie.id}</span></td>
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
                          <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.reviews == null ? "N/A" : <button onClick={() => setViewReviews(prevState => !prevState)} className="admin__movie__view__info">{viewReviews ? <ViewPopup text={reviewText}/> : "View"}</button>}</span></td>
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
                          <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.showtimes == null ? "N/A" : movie.showtimes}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__movie__td"><span className="admin__movie__info__span1">Sypnopsis: </span></td>
                          <td className="admin__movie__td"><span className="admin__movie__info__span2">{movie.synopsis == null ? "N/A" : <button onClick={() => setViewSynopsis(prevState => !prevState)} className="admin__movie__view__info">{viewSynopsis ? <>View<ViewPopup text={movie.synopsis}/></> : "View"}</button>}</span></td>
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
