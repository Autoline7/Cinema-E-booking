import React, { useState, useEffect } from 'react';
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";
import Selector from '../../Selector';
import ShowtimesInput from './inputs/ShowtimesInput';
import ScreeningsList from './lists/ScreeningsList';

const EditMovieForm = ({movie}) => {
    const [datesWithShowtimes, setDatesWithShowtimes] = useState({});
    const [showShowTimes, setShowShowTimes] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const mpaaOptions = ["G", "PG", "PG13", "NC17", "R"];
    const [screeningsFetched, setScreeningsFetched] = useState([]);
    const [screeningsDeleted, setScreeningsDeleted] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        cast: "",
        director: "",
        producer: "",
        synopsis: "",
        reviews: [{ reviewerName: "", rating: -1, comment: "", }], 
        picture: "",
        video: "",
        mpaa: null,
    });

    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title || "",
                genre: movie.genre || "",
                cast: movie.cast || "",
                director: movie.director || "",
                producer: movie.producer || "",
                synopsis: movie.synopsis || "",
                reviews: movie.reviews?.length ? movie.reviews : [{ reviewerName: "", rating: -1, comment: "" }],
                picture: movie.picture || "",
                video: movie.video || "",
                mpaa: movie.mpaa || "",
            });

            const getScreenings = async () =>{
                setScreeningsFetched( await fetchScreenings(movie.id));
            }
            getScreenings();
        }

    }, [movie]);
    
    
    const handleAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!formData.mpaa) {
            alert("Please select an MPAA rating before submitting.");
            return; // Prevent form submission
        }
        
        // Prepare showtimes data from datesWithShowtimes
        const showtimesData = [];
        
        Object.entries(datesWithShowtimes).forEach(([date, showrooms]) => {
            Object.entries(showrooms).forEach(([showroomId, times]) => {
                times.forEach(time => {
                    showtimesData.push({
                        date: date,
                        showroomId: parseInt(showroomId),
                        time: time
                    });
                });
            });
        });
        
        const filteredData = { 
            ...formData, 
        };
        
        try {
            // First create the movie
            const movieData = await updateMovie(filteredData);
            const movieId = movieData.id;
          
            // Then create the screenings only if movie was created successfully
            if (movieId && showtimesData.length > 0) {
                await createScreenings(showtimesData, movieId); // Pass movieId directly
            }

            //delete the movies selected
            if(movieId && screeningsDeleted.length > 0){
                await deleteScreenings(screeningsDeleted, movieId);
            }
            
            // Reset form
            setFormData({
                title: "",
                genre: "",
                cast: "",
                director: "",
                producer: "",
                synopsis: "",
                reviews: [{ reviewerName: "", rating: -1, comment: "", }],
                picture: "",
                video: "",
                mpaa: "",
            });
            
            setScreeningsDeleted([])
            setScreeningsFetched([]);
            setDatesWithShowtimes({});
            setSelectedDate('');
            handleAlert();
            setTimeout(() => {
                window.location.reload();
              }, 3000);
              
        } catch (error) {
            console.error("Error creating movie or screenings:", error);
            alert("Failed to create movie or screenings. Please try again.");
        }
    };

    async function updateMovie(filteredData) {
        try {
            const response = await axios.put(`http://localhost:8080/api/movies/${movie.id}`, filteredData);
            return response.data; // Return the entire movie data
        } catch (error) {
            throw error;
        }
    }
    
    async function createScreenings(showTimesData, movieId) {
        try {
            // Make sure we have a movie ID
            if (!movieId) {
                console.error("No movie ID available");
                return;
            }
            
            for (const showTime of showTimesData) {
                const showroomId = showTime.showroomId;
                const date = showTime.date;
                const time = showTime.time;
                
                // Format the datetime string as "YYYY-MM-DDThh:mm:ss"
                const formattedTime = time.includes('T') ? time : `${date}T${time}`;
                
                const payload = {
                    showtime: formattedTime
                };
                await axios.post(
                    `http://localhost:8080/api/screenings/movie/${movieId}/showroom/${showroomId}`, 
                    payload
                );
            }
        } catch (error) {
            console.error("Error creating screenings:", error);
            throw error;
        }
    }

    async function deleteScreenings(showTimesData, id) {
        try {
            // Make sure we have a movie ID
            if (!id) {
                console.error("No movie ID available");
                return;
            }
            for (const showTime of showTimesData) {
                await axios.delete(
                    `http://localhost:8080/api/screenings/${showTime}`
                );
            }
        } catch (error) {
            console.error("Error creating screenings:", error);
            throw error;
        }
    }

    async function fetchScreenings(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/screenings/movie/id/${id}`);
            return response.data; // Return the entire showtime data
        } catch (error) {
            throw error;
        }
    }

    return (
        <div className='admin__movie__form'>
            <h2 className="admin__add__movie__title">Edit Movie ID {movie.id}</h2>
            <form onSubmit={handleSubmit} className='admin__add__movie__form'>

                <p className="admin__form__required__fields">Note: Required = <span className='red'>*</span></p>
                <label htmlFor="title"><span className='red'>*</span>Title:</label>
                <input type="text" name="title" placeholder="Enter the Title" value={formData.title} onChange={handleChange} required />

                <label htmlFor="genre"><span className='red'>*</span>Genre:</label>
                <input type="text" name="genre" placeholder="Enter the Genre" value={formData.genre} onChange={handleChange} required />
                
                <label htmlFor="cast"><span className='red'>*</span>Cast:</label>
                <input type="text" name="cast" placeholder="Enter the Cast" value={formData.cast} onChange={handleChange} required />

                <label htmlFor="director"><span className='red'>*</span>Director:</label>
                <input type="text" name="director" placeholder="Enter the Director" value={formData.director} onChange={handleChange} required />

                <label htmlFor="producer"><span className='red'>*</span>Producer(s):</label>
                <input type="text" name="producer" placeholder="Enter the Producer(s)" value={formData.producer} onChange={handleChange} required />

                <label htmlFor="synopsis"><span className='red'>*</span>Synopsis</label>
                <textarea name="synopsis" placeholder="Enter the Synopsis" value={formData.synopsis} onChange={handleChange}></textarea>
                
                <label htmlFor="picture"><span className='red'>*</span>Picture URL:</label>
                <input type="url" name="picture" placeholder="Enter the Image URL" value={formData.picture} onChange={handleChange} required />

                <label htmlFor="video"><span className='red'>*</span>Video URL:</label>
                <input type="url" name="video" placeholder="Enter the Video URL" value={formData.video} onChange={handleChange} required/>

                <label htmlFor="mpaa"><span className='red'>*</span>MPAA:</label>
                <Selector options={mpaaOptions} selectedValue={formData.mpaa} onChange={(value) => setFormData(prevData => ({ ...prevData, mpaa: value }))} name="mpaa" required={true}/>
                
               <ScreeningsList initialScreenings={screeningsFetched} setScreeningsDeleted={setScreeningsDeleted}/>

                <div>
                    <label>Add showtime(s)</label>
                    <input
                        type="checkbox"
                        checked={showShowTimes}
                        onChange={() => setShowShowTimes(!showShowTimes)}
                    />
                </div>

                

                {showShowTimes && <ShowtimesInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} datesWithShowtimes={datesWithShowtimes} setDatesWithShowtimes={setDatesWithShowtimes}/>}

                <div className='admin__add__movie__form__button__container'>
                    <button className='admin__add__movie__form__button' type="submit">Update Movie</button>
                </div>

                {showAlert && <SimpleAlert message="Movie Updated Successfully!!!" />}

            </form>
        </div>
    );
};

export default EditMovieForm;