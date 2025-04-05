package com.example.movieapp.repository;

import com.example.movieapp.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening, Integer> {
    Optional<Screening> findByMovieIdAndShowroomShowroomIdAndShowtime(int movieId, int showroomId, LocalDateTime showtime);
    Optional<Screening> findByShowroomShowroomIdAndShowtime(int showroomId, LocalDateTime showtime);
    List<Screening> findByShowroomShowroomIdAndShowtimeBetween(int showroomId, LocalDateTime start, LocalDateTime end);
    List<Screening> findByMovieId(int movieId);
    List<Screening> findByShowroomShowroomId(int showroomId);
    List<Screening> findByMovieTitleIgnoreCase(String title);
    List<Screening> findByShowtimeBetween(LocalDateTime start, LocalDateTime end);
}
