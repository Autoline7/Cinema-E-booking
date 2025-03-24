package com.example.movieapp.service;

import com.example.movieapp.model.Review;
import com.example.movieapp.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.movieapp.model.Movie; 
import com.example.movieapp.repository.MovieRepository; 
import java.util.Optional; 

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, MovieRepository movieRepository) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
    }

    // ✅ Add a review by movie ID
    public Review addReviewByMovieId(int movieId, Review review) {
        Optional<Movie> movie = movieRepository.findById(movieId);
        if (movie.isPresent()) {
            review.setMovieId(movieId);
            return reviewRepository.save(review);
        }
        return null; // If movie not found, return null
    }

     // ✅ Add a review by movie title
    public Review addReviewByMovieTitle(String title, Review review) {
        Optional<Movie> movie = movieRepository.findFirstByTitleContainingIgnoreCase(title);
        if (movie.isPresent()) {
            review.setMovieId(movie.get().getId());
            return reviewRepository.save(review);
        }
        return null; // If movie not found, return null
    }

    public List<Review> getReviewsForMovie(int movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    // ✅ Delete a review by ID
    public boolean deleteReviewById(int reviewId) {
        if (reviewRepository.existsById(reviewId)) {
            reviewRepository.deleteById(reviewId);
            return true;
        }
        return false;
    }   

}