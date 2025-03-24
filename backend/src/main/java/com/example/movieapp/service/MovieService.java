package com.example.movieapp.service;

import com.example.movieapp.model.Movie;
import com.example.movieapp.model.Review;
import com.example.movieapp.model.MPAARating;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository, ReviewRepository reviewRepository) {
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
    }

    // ✅ Search movies using multiple filters
    public List<Movie> searchMovies(Integer id, String title, String genre, String cast,
                                    String director, String producer, String mpaaRating) {
        MPAARating mpaaEnum = null;
        if (mpaaRating != null) {
            try {
                mpaaEnum = MPAARating.valueOf(mpaaRating.toUpperCase());
            } catch (IllegalArgumentException ignored) {
                // If the rating is invalid, keep it null to avoid errors
            }
        }
        List<Movie> movies = movieRepository.searchMovies(id, title, genre, cast, director, producer, mpaaEnum);
    
        // Assign reviews to each movie in the result
        movies.forEach(this::assignReviewsToMovie);
    
        return movies;
    }

     // Fetch all movies and assign reviews
    public List<Movie> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        movies.forEach(this::assignReviewsToMovie);
        return movies;
    }

    // Fetch a movie by ID and assign reviews
    public Optional<Movie> getMovieById(int id) {
        Optional<Movie> movie = movieRepository.findById(id);
        movie.ifPresent(this::assignReviewsToMovie);
        return movie;
    }

    // Fetch movies by title and assign reviews
    public List<Movie> getMoviesByTitle(String title) {
        List<Movie> movies = movieRepository.findByTitleContainingIgnoreCase(title);
        movies.forEach(this::assignReviewsToMovie);
        return movies;
    }

    // Fetch movies by genre and assign reviews
    public List<Movie> getMoviesByGenre(String genre) {
        List<Movie> movies = movieRepository.findByGenre(genre);
        movies.forEach(this::assignReviewsToMovie);
        return movies;
    }

    // Fetch movies by cast member and assign reviews
    public List<Movie> getMoviesByCast(String cast) {
        List<Movie> movies = movieRepository.findByCastContainingIgnoreCase(cast);
        movies.forEach(this::assignReviewsToMovie);
        return movies;
    }

    // Fetch movies by director and assign reviews
    public List<Movie> getMoviesByDirector(String director) {
        List<Movie> movies = movieRepository.findByDirectorContainingIgnoreCase(director);
        movies.forEach(this::assignReviewsToMovie);
        return movies;
    }

    // Fetch movies by producer and assign reviews
    public List<Movie> getMoviesByProducer(String producer) {
        List<Movie> movies = movieRepository.findByProducerContainingIgnoreCase(producer);
        movies.forEach(this::assignReviewsToMovie);
        return movies;
    }

    // Fetch movies by MPAA rating and assign reviews
    public List<Movie> getMoviesByRating(String mpaa) {
        try {
            MPAARating ratingEnum = MPAARating.valueOf(mpaa.toUpperCase());
            List<Movie> movies = movieRepository.findByMpaa(ratingEnum);
            movies.forEach(this::assignReviewsToMovie);
            return movies;
        } catch (IllegalArgumentException e) {
            return List.of(); // Return empty list if the rating is invalid
        }
    }

    // Helper method to assign reviews to a movie
    private void assignReviewsToMovie(Movie movie) {
        List<Review> reviews = reviewRepository.findByMovieId(movie.getId());
        movie.setReviews(reviews);
    }

    // ✅ Add a new movie
    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    // ✅ Update a movie (Fix: Null-safe field updates)
    public Movie updateMovie(int id, Movie updatedMovie) {
        return movieRepository.findById(id).map(movie -> {
            if (updatedMovie.getTitle() != null) movie.setTitle(updatedMovie.getTitle());
            if (updatedMovie.getGenre() != null) movie.setGenre(updatedMovie.getGenre());
            if (updatedMovie.getCast() != null) movie.setCast(updatedMovie.getCast());
            if (updatedMovie.getDirector() != null) movie.setDirector(updatedMovie.getDirector());
            if (updatedMovie.getProducer() != null) movie.setProducer(updatedMovie.getProducer());
            if (updatedMovie.getSynopsis() != null) movie.setSynopsis(updatedMovie.getSynopsis());
            if (updatedMovie.getPicture() != null) movie.setPicture(updatedMovie.getPicture());
            if (updatedMovie.getVideo() != null) movie.setVideo(updatedMovie.getVideo());
            if (updatedMovie.getMpaa() != null) movie.setMpaa(updatedMovie.getMpaa());
            return movieRepository.save(movie);
        }).orElse(null);
    }

    // ✅ Delete a movie
    public boolean deleteMovie(int movieId) {
        if (movieRepository.existsById(movieId)) {
            movieRepository.deleteById(movieId);
            return true;
        }
        return false;
    }

    // ✅ Get all reviews for a movie by ID
    public List<Review> getReviewsForMovieById(int movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    // ✅ Get all reviews for a movie by Title (Fix: Optimized query)
    public List<Review> getReviewsForMovieByTitle(String title) {
        Optional<Movie> movie = movieRepository.findFirstByTitleContainingIgnoreCase(title);
        return movie.map(value -> reviewRepository.findByMovieId(value.getId())).orElseGet(List::of);
    }

    // ✅ Get all distinct producers
    public List<String> getAllProducers() {
        return movieRepository.findAll().stream()
                .map(Movie::getProducer)
                .distinct()
                .collect(Collectors.toList());
    }
}
