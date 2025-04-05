import React, { useState, useEffect } from 'react';
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";
import Selector from '../../Selector';
import ReviewInput from './inputs/ReviewInput';

const AddMovieForm = () => {
    const [datesWithShowtimes, setDatesWithShowtimes] = useState({});
    const [showShowTimes, setShowShowTimes] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [screeningsData, setScreeningsData] = useState([]);
    const [loadingScreenings, setLoadingScreenings] = useState(false);
    const [screeningError, setScreeningError] = useState('');
    const [movieIdCreated, setMovieIdCreated] = useState("");
    
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
    
    const [showAlert, setShowAlert] = useState(false);
    const mpaaOptions = ["G", "PG", "PG13", "NC17", "R"];

    const handleAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    // Fetch available screenings when a date is selected
    useEffect(() => {
        if (!selectedDate) return;
        
        const fetchScreenings = async () => {
            setLoadingScreenings(true);
            setScreeningError('');
            
            try {
                const response = await axios.get(`http://localhost:8080/api/screenings/available/${selectedDate}`);
                setScreeningsData(response.data);
                
                // Initialize the date in datesWithShowtimes if it doesn't exist
                setDatesWithShowtimes(prevDates => ({
                    ...prevDates,
                    [selectedDate]: prevDates[selectedDate] || {}
                }));
            } catch (error) {
                console.error("Error fetching screenings:", error);
                setScreeningError('Failed to load available screenings. Please try again.');
            } finally {
                setLoadingScreenings(false);
            }
        };
        
        fetchScreenings();
    }, [selectedDate]);

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        
        // Initialize the structure for this date if needed
        setDatesWithShowtimes(prevDates => ({
            ...prevDates,
            [date]: prevDates[date] || {}
        }));
    };

    // Handle showroom and time selection
    const handleShowroomTimeSelection = (showroomId, time) => {
        setDatesWithShowtimes(prevDates => {
            const currentDate = selectedDate;
            const currentShowroomSelections = prevDates[currentDate] || {};
            
            // Check if this showroom-time is already selected
            const isSelected = currentShowroomSelections[showroomId]?.includes(time);
            
            // Create a new object for this date
            const updatedShowrooms = { ...currentShowroomSelections };
            
            // Initialize showroom array if needed
            if (!updatedShowrooms[showroomId]) {
                updatedShowrooms[showroomId] = [];
            }
            
            // Add or remove the time from this showroom's array
            if (isSelected) {
                updatedShowrooms[showroomId] = updatedShowrooms[showroomId].filter(t => t !== time);
            } else {
                updatedShowrooms[showroomId] = [...updatedShowrooms[showroomId], time];
            }
            
            // Return updated structure
            return {
                ...prevDates,
                [currentDate]: updatedShowrooms
            };
        });
    };

    const handleDeleteShowtime = (date, showroomId, timeToDelete) => {
        setDatesWithShowtimes(prevDates => {
            const updatedShowroom = {
                ...prevDates[date],
                [showroomId]: prevDates[date][showroomId].filter(time => time !== timeToDelete)
            };
            
            return {
                ...prevDates,
                [date]: updatedShowroom
            };
        });
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
            const movieData = await createMovie(filteredData);
            const movieId = movieData.id;
            
            console.log("Movie created with ID:", movieId);
            
            // Then create the screenings only if movie was created successfully
            if (movieId && showtimesData.length > 0) {
                await createScreenings(showtimesData, movieId); // Pass movieId directly
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

    async function createMovie(filteredData) {
        try {
            const response = await axios.post("http://localhost:8080/api/movies", filteredData);
            console.log("Movie created:", response.data);
            return response.data; // Return the entire movie data
        } catch (error) {
            console.error("Error creating movie:", error);
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
                
                console.log(`Creating screening for movie ${movieId}, showroom ${showroomId}, time ${formattedTime}`);
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

    // Helper to check if a time is selected for a showroom
    const isTimeSelected = (showroomId, time) => {
        return datesWithShowtimes[selectedDate]?.[showroomId]?.includes(time);
    };

    return (
        <div className='admin__movie__form'>
            <h2 className="admin__add__movie__title">Add a new Movie</h2>
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
                
                <div>
                    <label>Add showtime(s)</label>
                    <input
                        type="checkbox"
                        checked={showShowTimes}
                        onChange={() => setShowShowTimes(!showShowTimes)}
                    />
                </div>

                {showShowTimes && (
                    <>
                        <label htmlFor="date">Select Date:</label>
                        <input 
                            type='date' 
                            onChange={handleDateChange}
                            value={selectedDate} 
                        />
                      
                        {selectedDate && loadingScreenings && (
                            <p>Loading available screenings...</p>
                        )}
                        
                        {screeningError && (
                            <p style={{ color: 'red' }}>{screeningError}</p>
                        )}
                        
                        {selectedDate && !loadingScreenings && screeningsData.length > 0 && (
                            <div style={{ marginTop: '15px' }}>
                                <h4>Available Showtimes for {selectedDate}</h4>
                                
                                {screeningsData.map((showroom) => (
                                    <div key={showroom.showroomId} style={{ 
                                        border: "1px solid #ccc", 
                                        borderRadius: "5px",
                                        padding: "10px", 
                                        margin: "10px 0" 
                                    }}>
                                        <h5>Showroom {showroom.showroomId}</h5>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {showroom.availableTimes.map((time) => (
                                                <label 
                                                    key={time} 
                                                    style={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '5px 10px',
                                                        margin: '5px 0',
                                                        backgroundColor: isTimeSelected(showroom.showroomId, time) ? '#e6f7ff' : 'transparent',
                                                        border: isTimeSelected(showroom.showroomId, time) ? '1px solid #91d5ff' : '1px solid #d9d9d9',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isTimeSelected(showroom.showroomId, time) || false}
                                                        onChange={() => handleShowroomTimeSelection(showroom.showroomId, time)}
                                                        style={{ marginRight: '5px' }}
                                                    />
                                                    {time}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                      
                        <div style={{ marginTop: '20px' }}>
                            <h4>Selected Showtimes:</h4>
                            {Object.entries(datesWithShowtimes).map(([date, showrooms]) => (
                                <div key={date} style={{ marginBottom: '15px' }}>
                                    <strong>{date}:</strong>
                                    {Object.entries(showrooms).length === 0 ? (
                                        <p>No showtimes selected</p>
                                    ) : (
                                        Object.entries(showrooms).map(([showroomId, times]) => (
                                            <div key={`${date}-${showroomId}`} style={{ margin: '5px 0 5px 15px' }}>
                                                <strong>Showroom {showroomId}:</strong>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                                    {times.map((time) => (
                                                        <span 
                                                            key={`${date}-${showroomId}-${time}`} 
                                                            style={{ 
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                background: '#f0f0f0',
                                                                padding: '2px 8px',
                                                                borderRadius: '4px',
                                                                border: '1px solid #ddd'
                                                            }}
                                                        >
                                                            {time}
                                                            <span
                                                                onClick={() => handleDeleteShowtime(date, showroomId, time)}
                                                                style={{ 
                                                                    marginLeft: '5px',
                                                                    color: 'red',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    userSelect: 'none'
                                                                }}
                                                            >
                                                                ×
                                                            </span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className='admin__add__movie__form__button__container'>
                    <button className='admin__add__movie__form__button' type="submit">Create Movie</button>
                </div>

                {showAlert && <SimpleAlert message="Movie Created Successfully!!!" />}

            </form>
        </div>
    );
};

export default AddMovieForm;