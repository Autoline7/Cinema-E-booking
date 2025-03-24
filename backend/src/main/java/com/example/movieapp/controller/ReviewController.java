package com.example.movieapp.controller;

import com.example.movieapp.model.Review;
import com.example.movieapp.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // GET /reviews/movie/{movieId} → Fetch all reviews for a movie
    @GetMapping("/movie/{movieId}")
    public List<Review> getReviewsForMovie(@PathVariable int movieId) {
        return reviewService.getReviewsForMovie(movieId);
    }

    // ✅ Add a review using movie ID
    @PostMapping("/movie/{id}")
    public ResponseEntity<Review> addReviewByMovieId(@PathVariable int id, @RequestBody Review review) {
        Review savedReview = reviewService.addReviewByMovieId(id, review);
        return savedReview != null ? ResponseEntity.ok(savedReview) : ResponseEntity.notFound().build();
    }

    // ✅ Add a review using movie title
    @PostMapping("/movie/title/{title}")
    public ResponseEntity<Review> addReviewByMovieTitle(@PathVariable String title, @RequestBody Review review) {
        Review savedReview = reviewService.addReviewByMovieTitle(title, review);
        return savedReview != null ? ResponseEntity.ok(savedReview) : ResponseEntity.notFound().build();
    }

    // ✅ Delete a review by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReviewById(@PathVariable int id) {
        boolean deleted = reviewService.deleteReviewById(id);
        if (deleted) {
            return ResponseEntity.ok("Review deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Review not found.");
        }
    }
}