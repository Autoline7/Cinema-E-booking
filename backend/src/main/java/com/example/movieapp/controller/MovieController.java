package com.example.movieapp.controller;

import com.example.movieapp.model.Movie;
import com.example.movieapp.model.Review;
import com.example.movieapp.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin("*")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Search for a movie with flexible parameters
    @GetMapping("/search")
    public List<Movie> searchMovies(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String cast,
            @RequestParam(required = false) String director,
            @RequestParam(required = false) String producer,
            @RequestParam(required = false) String mpaa
    ) {
        return movieService.searchMovies(id, title, genre, cast, director, producer, mpaa);
    }

    // Get all movies
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // Get movie by ID
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable int id) {
        Optional<Movie> movie = movieService.getMovieById(id);
        return movie.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get movies by title
    @GetMapping("/search/title/{title}")
    public List<Movie> getMoviesByTitle(@PathVariable String title) {
        return movieService.getMoviesByTitle(title);
    }

    // Get movies by genre
    @GetMapping("/search/genre/{genre}")
    public List<Movie> getMoviesByGenre(@PathVariable String genre) {
        return movieService.getMoviesByGenre(genre);
    }

    // Get movies by cast member
    @GetMapping("/search/cast/{cast}")
    public List<Movie> getMoviesByCast(@PathVariable String cast) {
        return movieService.getMoviesByCast(cast);
    }

    // Get movies by director
    @GetMapping("/search/director/{director}")
    public List<Movie> getMoviesByDirector(@PathVariable String director) {
        return movieService.getMoviesByDirector(director);
    }

    // Get movies by producer
    @GetMapping("/search/producer/{producer}")
    public List<Movie> getMoviesByProducer(@PathVariable String producer) {
        return movieService.getMoviesByProducer(producer);
    }

    // Get movies by rating
    @GetMapping("/search/rating/{mpaa}")
    public List<Movie> getMoviesByRating(@PathVariable String mpaa) {
        return movieService.getMoviesByRating(mpaa);
    }

    // Add a new movie
    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieService.addMovie(movie);
    }

    // Update a movie
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable int id, @RequestBody Movie updatedMovie) {
        Movie movie = movieService.updateMovie(id, updatedMovie);
        return movie != null ? ResponseEntity.ok(movie) : ResponseEntity.notFound().build();
    }

    // Delete a movie
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable int id) {
        boolean deleted = movieService.deleteMovie(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // Get all reviews for a movie by ID
    @GetMapping("/{id}/reviews")
    public List<Review> getReviewsForMovieById(@PathVariable int id) {
        return movieService.getReviewsForMovieById(id);
    }

    // Get all reviews for a movie by title (Fixed to use query parameter)
    @GetMapping("/search/reviews")
    public List<Review> getReviewsForMovieByTitle(@RequestParam String title) {
        return movieService.getReviewsForMovieByTitle(title);
    }

    // Get all producers (Fixed for consistency)
    @GetMapping("/search/producers")
    public List<String> getAllProducers() {
        return movieService.getAllProducers();
    }
}

