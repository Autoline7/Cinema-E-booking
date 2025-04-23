package com.example.movieapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "screening", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"movie_id", "showroom_id", "showtime"})
})
public class Screening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int screeningId;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @Column(name = "showtime", nullable = false)
    private LocalDateTime showtime;

    public Screening() {}

    public Screening(Movie movie, Showroom showroom, LocalDateTime showtime) {
        this.movie = movie;
        this.showroom = showroom;
        this.showtime = showtime;
    }

    public int getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(int screeningId) {
        this.screeningId = screeningId;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Showroom getShowroom() {
        return showroom;
    }

    public void setShowroom(Showroom showroom) {
        this.showroom = showroom;
    }

    public LocalDateTime getShowtime() {
        return showtime;
    }

    public void setShowtime(LocalDateTime showtime) {
        this.showtime = showtime;
    }
}
