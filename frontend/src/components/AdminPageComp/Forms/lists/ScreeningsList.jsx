import React, { useEffect, useState } from 'react';

const ScreeningsList = ({ initialScreenings, setScreeningsDeleted }) => {
  const [screenings, setScreenings] = useState([]);
  const handleDelete = (idToDelete) => {
    setScreeningsDeleted(prev => [...prev, idToDelete]);
    setScreenings(prev => prev.filter(screening => screening.screeningId !== idToDelete));
  };

  useEffect(() =>{
    setScreenings(initialScreenings);
  },[initialScreenings])

  return (
    <div>
      <h3>Scheduled Screenings</h3>
      {screenings.length === 0 ? (
        <p>No screenings available.</p>
      ) : (
        <ul>
          {screenings.map((screening) => (
            <li key={screening.screeningId} style={{ marginBottom: '12px' }}>
              <strong>{screening.movie.title}</strong> — {new Date(screening.showtime).toLocaleString()}  
              <br />
              Showroom: {screening.showroom.showroomId} (Seats: {screening.showroom.seatCapacity})
              <br />
              <button className='screenings__list__button' onClick={() => handleDelete(screening.screeningId)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScreeningsList;
