package com.example.movieapp.service;

import com.example.movieapp.model.Screening;
import com.example.movieapp.model.Movie;
import com.example.movieapp.model.Showroom;
import com.example.movieapp.repository.ScreeningRepository;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.repository.ShowroomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final ShowroomRepository showroomRepository;

    public ScreeningService(ScreeningRepository screeningRepository,
                            MovieRepository movieRepository,
                            ShowroomRepository showroomRepository) {
        this.screeningRepository = screeningRepository;
        this.movieRepository = movieRepository;
        this.showroomRepository = showroomRepository;
    }

    public List<Screening> getAllScreenings() {
        return screeningRepository.findAll();
    }

    public Optional<Screening> getScreeningById(int id) {
        return screeningRepository.findById(id);
    }

    public Screening addScreening(int movieId, int showroomId, Screening screening) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        Showroom showroom = showroomRepository.findById(showroomId)
                .orElseThrow(() -> new IllegalArgumentException("Showroom not found"));

        // Check for uniqueness
        screeningRepository.findByShowroomShowroomIdAndShowtime(showroomId, screening.getShowtime())
            .ifPresent(existing -> {
                throw new IllegalArgumentException("A movie is already scheduled in this showroom at this time.");
            });

        screening.setMovie(movie);
        screening.setShowroom(showroom);
        return screeningRepository.save(screening);
    }

    public boolean deleteScreening(int id) {
        if (screeningRepository.existsById(id)) {
            screeningRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Screening> getScreeningsByMovieId(int movieId) {
        return screeningRepository.findByMovieId(movieId);
    }

    public List<Screening> getScreeningsByMovieTitle(String title) {
        return screeningRepository.findByMovieTitleIgnoreCase(title);
    }

    public List<Screening> getScreeningsByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return screeningRepository.findByShowtimeBetween(start, end);
    }

    public List<Map<String, Object>> getAvailableShowtimesByDate(LocalDate date) {
        List<Showroom> showrooms = showroomRepository.findAll();
        List<LocalTime> fixedTimes = List.of(
                LocalTime.of(12, 0),
                LocalTime.of(15, 0),
                LocalTime.of(18, 0),
                LocalTime.of(21, 0)
        );

        List<Map<String, Object>> result = new ArrayList<>();

        for (Showroom showroom : showrooms) {
            List<Screening> screenings = screeningRepository
                .findByShowroomShowroomIdAndShowtimeBetween(
                    showroom.getShowroomId(),
                    date.atStartOfDay(),
                    date.plusDays(1).atStartOfDay()
                );

            List<LocalTime> bookedTimes = screenings.stream()
                    .map(Screening::getShowtime)
                    .map(LocalDateTime::toLocalTime)
                    .toList();

            List<String> available = fixedTimes.stream()
                    .filter(t -> !bookedTimes.contains(t))
                    .map(LocalTime::toString)
                    .toList();

            List<Map<String, String>> bookedSlots = screenings.stream()
                    .map(s -> Map.of(
                            "time", s.getShowtime().toLocalTime().toString(),
                            "movieTitle", s.getMovie().getTitle()
                    ))
                    .toList();

            result.add(Map.of(
                    "showroomId", showroom.getShowroomId(),
                    "availableTimes", available,
                    "bookedSlots", bookedSlots
            ));
        }

        return result;
    }


}
