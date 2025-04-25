package com.example.movieapp.controller;

import com.example.movieapp.model.Seat;
import com.example.movieapp.service.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin("*")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    // Get all seats
    @GetMapping
    public ResponseEntity<List<Seat>> getAllSeats() {
        return ResponseEntity.ok(seatService.getAllSeats());
    }

    // Get a seat by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSeatById(@PathVariable int id) {
        return seatService.getSeatById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all seats for a specific showroom
    @GetMapping("/showroom/{showroomId}")
    public ResponseEntity<List<Seat>> getSeatsByShowroom(@PathVariable int showroomId) {
        return ResponseEntity.ok(seatService.getSeatsByShowroomId(showroomId));
    }

    // Create a seat in a showroom
    @PostMapping("/showroom/{showroomId}")
    public ResponseEntity<?> addSeat(@PathVariable int showroomId, @RequestBody Seat seat) {
        try {
            return ResponseEntity.ok(seatService.addSeat(showroomId, seat));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete a seat
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSeat(@PathVariable int id) {
        if (seatService.deleteSeat(id)) {
            return ResponseEntity.ok("Seat deleted.");
        } else {
            return ResponseEntity.status(404).body("Seat not found.");
        }
    }
}
