import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';

const ShowtimesInput = ({screeningsData, setScreeningsData, selectedDate, setSelectedDate, datesWithShowtimes, setDatesWithShowtimes}) => {
    const [loadingScreenings, setLoadingScreenings] = useState(false);
    const [screeningError, setScreeningError] = useState('');

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

    // Helper to check if a time is selected for a showroom
    const isTimeSelected = (showroomId, time) => {
        return datesWithShowtimes[selectedDate]?.[showroomId]?.includes(time);
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


  return (
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
  )
}

export default ShowtimesInput
