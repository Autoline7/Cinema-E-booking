import React, { useEffect, useState } from 'react'
import AdminMovie from './AdminMovie'
import AddMovieForm from './Forms/AddMovieForm'
import EditMovieForm from './Forms/EditMovieForm'
import axios from "axios";
import ScheduleAMovieForm from './Forms/ScheduleAMovieForm';

const AdminMovies = ({addMovieForm, scheduleMovieForm}) => {
  const [movies, setMovies] = useState([]);
  const [editMovieForm, setEditMovieForm] = useState({ formOpen: false, movie: {} });

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
              {movies.length > 0 && movies.map((movie, index) => <AdminMovie movie={movie} key={index} editMovieForm={editMovieForm} setEditMovieForm={setEditMovieForm}/> )}     
        </div>
        {addMovieForm && <AddMovieForm />}
        {scheduleMovieForm && <ScheduleAMovieForm />}
        {editMovieForm.formOpen && <EditMovieForm movie={editMovieForm.movie} />}
    </div>

  )
}

export default AdminMovies
