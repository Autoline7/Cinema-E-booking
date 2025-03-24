package com.example.movieapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Ensures AUTO_INCREMENT on Primary Key
    private int reviewId;

    @Column( nullable = false)
    private int movieId;

    @Column(name = "reviewerName", nullable = false)
    private String reviewerName;

    @Column(name = "rating", nullable = false)
    private int rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    public Review() {}

    public Review(int movieId, String reviewerName, int rating, String comment) {
        this.movieId = movieId;
        this.reviewerName = reviewerName;
        this.rating = rating;
        this.comment = comment;
    }

    // Getters and Setters
    public int getReviewId() {
        return reviewId;
    }

    public void setReviewId(int reviewId) {
        this.reviewId = reviewId;
    }

    public int getMovieId() {
        return movieId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "Review{" +
                "reviewId=" + reviewId +
                ", movieId=" + movieId +
                ", reviewerName='" + reviewerName + '\'' +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                '}';
    }
}
