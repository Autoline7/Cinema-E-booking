import React, { useState } from 'react';
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";
import Selector from '../../Selector';
import ReviewInput from './inputs/ReviewInput';

const AddMovieForm = () => {
    const [datesWithShowtimes, setDatesWithShowtimes] = useState({});
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
        mpaa: "",
        showtimes: [],
    });
    const [showAlert, setShowAlert] = useState(false);
    const availableShowtimes = [
        "11:00 AM - 12:30 PM", "12:00 PM - 1:30 PM", "01:00 PM - 2:30PM",
        "02:00 PM - 3:30PM", "03:00 PM - 4:30 PM", "04:00 PM - 5:30 PM",
        "05:00 PM - 6:30 PM", "06:00 PM - 7:30 PM", "07:00 PM - 8:30 PM",
        "08:00 PM - 9:30 PM", "09:00 PM - 10:30 PM", "10:00 PM - 11:30 PM",
        "11:00 PM - 12:30 AM"
    ];
    const mpaaOptions = ["G", "PG", "PG13", "NC17", "R"];

    const handleAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const convertTo24HourFormat = (time) => {
        const [timePart, meridian] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (meridian === "PM" && hours !== 12) hours += 12;
        if (meridian === "AM" && hours === 12) hours = 0;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;

        setDatesWithShowtimes((prevDates) => ({
            ...prevDates,
            [selectedDate]: prevDates[selectedDate] || [] // Initialize if not exists
        }));
    };

    const handleTimeChange = (event, selectedDate) => {
        const selectedTime = event.target.value;

        setDatesWithShowtimes((prevDates) => {
            const updatedShowtimes = prevDates[selectedDate].includes(selectedTime)
                ? prevDates[selectedDate].filter(time => time !== selectedTime) // Remove if selected
                : [...prevDates[selectedDate], selectedTime]; // Add if not selected

            return {
                ...prevDates,
                [selectedDate]: updatedShowtimes,
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

    const handleSubmit = (event) => {
        event.preventDefault();
    
        if (!formData.mpaa) {
            alert("Please select an MPAA rating before submitting.");
            return; // Prevent form submission
        }
    
        const filteredData = { ...formData, showtimes: "exampletimes" };
        createMovie(filteredData);
    
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
            showtimes: [],
        });
    
        setDatesWithShowtimes({});
        handleAlert();
        setTimeout(() => {
            window.location.reload();
          }, 3000);
        
    };
    

    async function createMovie(filteredData) {
        //await axios.post("https://611f89f2-320e-47c4-87f6-ba96954ccc48.mock.pstmn.io", filteredData); //postman
       await axios.post("http://localhost:8080/api/movies", filteredData);//db
    }

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

                {/* <label htmlFor="reviews"><span className='red'>*</span>Reviews:</label>
                <ReviewInput reviews={formData.reviews} setReviews={(newReviews) => setFormData(prev => ({ ...prev, reviews: newReviews }))} required/>
                */}
                
                <label htmlFor="picture"><span className='red'>*</span>Picture URL:</label>
                <input type="url" name="picture" placeholder="Enter the Image URL" value={formData.picture} onChange={handleChange} required />

                <label htmlFor="video"><span className='red'>*</span>Video URL:</label>
                <input type="url" name="video" placeholder="Enter the Video URL" value={formData.video} onChange={handleChange} required/>

                <label htmlFor="mpaa"><span className='red'>*</span>MPAA:</label>
                <Selector options={mpaaOptions} selectedValue={formData.mpaa} onChange={(value) => setFormData(prevData => ({ ...prevData, mpaa: value }))} name="mpaa" required={true}/>


                {/* <label htmlFor="date">Select Dates:</label>
                <input type='date' onChange={handleDateChange} />

                {Object.keys(datesWithShowtimes).map((date) => (
                    <div key={date} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
                        <h4>Showtimes for {date}</h4>
                        {availableShowtimes.map((time) => (
                            <label key={time} style={{ display: 'block', margin: '5px 0' }}>
                                <input
                                    type="checkbox"
                                    value={time}
                                    checked={datesWithShowtimes[date].includes(time)}
                                    onChange={(e) => handleTimeChange(e, date)}
                                />
                                {time}
                            </label>
                        ))}
                    </div>
                ))}

                <p>Selected Showtimes:</p>
                {Object.entries(datesWithShowtimes).map(([date, times]) => (
                    <p key={date}>
                        <strong>{date}:</strong> {times.length > 0 ? times.join(", ") : "No showtimes selected"}
                    </p>
                ))} */}

                <div className='admin__add__movie__form__button__container'>
                    <button className='admin__add__movie__form__button' type="submit">Create Movie</button>
                </div>

                {showAlert && <SimpleAlert message="Movie Created Successfully!!!" />}

            </form>
        </div>
    );
};

export default AddMovieForm;
