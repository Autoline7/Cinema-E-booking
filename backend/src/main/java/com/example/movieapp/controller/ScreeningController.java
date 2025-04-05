package com.example.movieapp.controller;

import com.example.movieapp.model.Screening;
import com.example.movieapp.service.ScreeningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/screenings")
@CrossOrigin("*")
public class ScreeningController {

    private final ScreeningService screeningService;

    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    @GetMapping
    public ResponseEntity<List<Screening>> getAllScreenings() {
        return ResponseEntity.ok(screeningService.getAllScreenings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getScreeningById(@PathVariable int id) {
        return screeningService.getScreeningById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/movie/{movieId}/showroom/{showroomId}")
    public ResponseEntity<?> addScreening(@PathVariable int movieId,
                                          @PathVariable int showroomId,
                                          @RequestBody Screening screening) {
        try {
            return ResponseEntity.ok(screeningService.addScreening(movieId, showroomId, screening));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteScreening(@PathVariable int id) {
        if (screeningService.deleteScreening(id)) {
            return ResponseEntity.ok("Screening deleted.");
        } else {
            return ResponseEntity.status(404).body("Screening not found.");
        }
    }

    @GetMapping("/movie/id/{movieId}")
    public ResponseEntity<List<Screening>> getScreeningsByMovieId(@PathVariable int movieId) {
        return ResponseEntity.ok(screeningService.getScreeningsByMovieId(movieId));
    }

    @GetMapping("/movie/title/{title}")
    public ResponseEntity<List<Screening>> getScreeningsByMovieTitle(@PathVariable String title) {
        return ResponseEntity.ok(screeningService.getScreeningsByMovieTitle(title));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Screening>> getScreeningsByDate(@PathVariable String date) {
        try {
            LocalDate parsedDate = LocalDate.parse(date);
            return ResponseEntity.ok(screeningService.getScreeningsByDate(parsedDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/available/{date}")
    public ResponseEntity<List<Map<String, Object>>> getAvailableShowtimes(@PathVariable String date) {
        try {
            LocalDate parsedDate = LocalDate.parse(date);  // Format: YYYY-MM-DD
            return ResponseEntity.ok(screeningService.getAvailableShowtimesByDate(parsedDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
