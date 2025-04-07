import React, { useEffect, useState } from 'react'
import AdminMovie from './AdminMovie'
import AddMovieForm from './Forms/AddMovieForm'
import axios from "axios";
import ScheduleAMovieForm from './Forms/ScheduleAMovieForm';
const AdminMovies = ({addMovieForm, scheduleMovieForm}) => {
  const [movies, setMovies] = useState([]);

  async function fetchMovies() {
    const {data} = await axios.get("http://localhost:8080/api/movies");
    setMovies(data);
  }

  useEffect(() =>{
    fetchMovies();
  },[]);

  return (
      <div className="admin__movies__container">
            <div className="admin__movies">
              {movies.length > 0 && movies.map((movie, index) => <AdminMovie movie={movie} key={index} /> )}     
        </div>
        {addMovieForm && <AddMovieForm />}
        {scheduleMovieForm && <ScheduleAMovieForm />}
    </div>

  )
}

export default AdminMovies
