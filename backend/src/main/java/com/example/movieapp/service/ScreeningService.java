package com.example.movieapp.service;

import com.example.movieapp.model.Screening;
import com.example.movieapp.model.Movie;
import com.example.movieapp.model.Seat;
import com.example.movieapp.model.Ticket;
import com.example.movieapp.model.Showroom;
import com.example.movieapp.repository.ScreeningRepository;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.repository.ShowroomRepository;
import com.example.movieapp.repository.SeatRepository;
import com.example.movieapp.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final ShowroomRepository showroomRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    public ScreeningService(ScreeningRepository screeningRepository,
                            MovieRepository movieRepository,
                            ShowroomRepository showroomRepository,
                            SeatRepository seatRepository,
                            TicketRepository ticketRepository) {
        this.screeningRepository = screeningRepository;
        this.movieRepository = movieRepository;
        this.showroomRepository = showroomRepository;
        this.seatRepository = seatRepository;
        this.ticketRepository = ticketRepository;
    }

    // Get all screenings
    public List<Screening> getAllScreenings() {
        return screeningRepository.findAll();
    }

    // Get a screening by ID
    public Optional<Screening> getScreeningById(int id) {
        return screeningRepository.findById(id);
    }

    // Create a new screening
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

    // Delete a screening
    public boolean deleteScreening(int id) {
        if (screeningRepository.existsById(id)) {
            screeningRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get screenings by movie ID
    public List<Screening> getScreeningsByMovieId(int movieId) {
        return screeningRepository.findByMovieId(movieId);
    }

    // Get screenings by movie title
    public List<Screening> getScreeningsByMovieTitle(String title) {
        return screeningRepository.findByMovieTitleIgnoreCase(title);
    }

    // Get screenings for a specific date
    public List<Screening> getScreeningsByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return screeningRepository.findByShowtimeBetween(start, end);
    }

    // Get all showtimes available to be booked
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

    // Get available seats for a booking
    public List<Map<String, Object>> getSeatAvailabilityForScreening(int screeningId) {
        Screening screening = screeningRepository.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found"));

        int showroomId = screening.getShowroom().getShowroomId();

        List<Seat> showroomSeats = seatRepository.findByShowroomShowroomId(showroomId);
        List<Ticket> bookedTickets = ticketRepository.findByScreeningScreeningId(screeningId);

        Set<Integer> bookedSeatIds = bookedTickets.stream()
                .map(ticket -> ticket.getSeat().getSeatId())
                .collect(Collectors.toSet());

        return showroomSeats.stream()
                .map(seat -> {
                    Map<String, Object> seatMap = new HashMap<>();
                    seatMap.put("seatId", seat.getSeatId());
                    seatMap.put("seatNumber", seat.getSeatNumber());
                    seatMap.put("row", seat.getRowNumber());
                    seatMap.put("column", seat.getColumnNumber());
                    seatMap.put("available", !bookedSeatIds.contains(seat.getSeatId()));
                    return seatMap;
                })
                .collect(Collectors.toList());
    }

}
