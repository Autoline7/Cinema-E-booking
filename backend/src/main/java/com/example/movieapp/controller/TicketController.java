package com.example.movieapp.controller;

import com.example.movieapp.model.Ticket;
import com.example.movieapp.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin("*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // Get all tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // Get a ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable int id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all tickets for a specific booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Ticket>> getTicketsByBooking(@PathVariable int bookingId) {
        return ResponseEntity.ok(ticketService.getTicketsByBookingId(bookingId));
    }

    // Create a ticket for a specific booking, screening, and seat
    @PostMapping("/booking/{bookingId}/seat/{seatId}/screening/{screeningId}")
    public ResponseEntity<?> createTicket(@PathVariable int bookingId,
                                          @PathVariable int seatId,
                                          @PathVariable int screeningId,
                                          @RequestBody Ticket ticket) {
        try {
            Ticket created = ticketService.createTicket(bookingId, seatId, screeningId, ticket);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete a ticket by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable int id) {
        if (ticketService.deleteTicket(id)) {
            return ResponseEntity.ok("Ticket deleted.");
        } else {
            return ResponseEntity.status(404).body("Ticket not found.");
        }
    }
}
