package com.example.movieapp.controller;

import com.example.movieapp.model.Showroom;
import com.example.movieapp.service.ShowroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showrooms")
@CrossOrigin("*")
public class ShowroomController {

    private final ShowroomService showroomService;

    public ShowroomController(ShowroomService showroomService) {
        this.showroomService = showroomService;
    }

    // Get all showrooms
    @GetMapping
    public ResponseEntity<List<Showroom>> getAllShowrooms() {
        return ResponseEntity.ok(showroomService.getAllShowrooms());
    }

    // Get a showroom by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getShowroomById(@PathVariable int id) {
        return showroomService.getShowroomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new showroom
    @PostMapping
    public ResponseEntity<Showroom> createShowroom(@RequestBody Showroom showroom) {
        return ResponseEntity.ok(showroomService.addShowroom(showroom));
    }

    // Delete a showroom
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShowroom(@PathVariable int id) {
        if (showroomService.deleteShowroom(id)) {
            return ResponseEntity.ok("Showroom deleted.");
        } else {
            return ResponseEntity.status(404).body("Showroom not found.");
        }
    }
}