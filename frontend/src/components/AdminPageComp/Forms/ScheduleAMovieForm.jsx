import React, { useState, useEffect } from 'react';
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";
import ShowtimesInput from './inputs/ShowtimesInput';

const ScheduleAMovieForm = () => {
    const [datesWithShowtimes, setDatesWithShowtimes] = useState({});
    const [showShowTimes, setShowShowTimes] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [movieId, setMovieId] = useState("");
    
    
    const handleAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        
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
        
        
        try {
            if (movieId > 0 && showtimesData.length > 0) {
                await createScreenings(showtimesData); // Pass movieId directly
            }
            
        
            setDatesWithShowtimes({});
            setSelectedDate('');
            handleAlert();
            setTimeout(() => {
                window.location.reload();
              }, 3000);
              
        } catch (error) {
            console.error("Error scheduling movie or screenings:", error);
        }
    };
    
    async function createScreenings(showTimesData) {
        try {
            
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
            console.error("Error Schduling screenings:", error);
            throw error;
        }
    }

    return (
        <div className='admin__movie__form'>
            <h2 className="admin__add__movie__title">Schedule a Movie</h2>
            <form onSubmit={handleSubmit} className='admin__add__movie__form'>

                <p className="admin__form__required__fields">Note: Required = <span className='red'>*</span></p>
                <label htmlFor="movieId"><span className='red'>*</span>Movie ID:</label>
                <input type="number" name="movieId" placeholder="Enter the Movie ID" value={movieId} onChange={(e) => setMovieId(e.target.value)} required />

  
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
                    <button className='admin__add__movie__form__button' type="submit">Schedule Movie</button>
                </div>

                {showAlert && <SimpleAlert message="Movie Scheduled Successfully!!!" />}

            </form>
        </div>
    );
};

export default ScheduleAMovieForm;