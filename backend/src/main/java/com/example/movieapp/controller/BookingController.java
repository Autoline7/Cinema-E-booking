package com.example.movieapp.controller;

import com.example.movieapp.model.Booking;
import com.example.movieapp.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable int id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all bookings for a specific customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getBookingsByCustomer(@PathVariable int customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomerId(customerId));
    }


    // Create a new booking
    @PostMapping("/customer/{customerId}/card/{cardId}")
    public ResponseEntity<?> createBooking(@PathVariable int customerId,
                                           @PathVariable int cardId,
                                           @RequestParam(required = false) Integer promoId,
                                           @RequestBody Booking booking) {

        // Attempt to create the booking and save to DB
        try {
            Booking saved = bookingService.createBooking(customerId, cardId, promoId, booking);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete booking by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable int id) {
        if (bookingService.deleteBooking(id)) {
            return ResponseEntity.ok("Booking deleted.");
        } else {
            return ResponseEntity.status(404).body("Booking not found.");
        }
    }

    // Send booking confirmation email
    @PutMapping("/{id}/send-confirmation-email")
    public ResponseEntity<String> sendBookingEmail(@PathVariable int id) {
        try {
            bookingService.sendBookingConfirmationEmail(id);
            return ResponseEntity.ok("Confirmation email sent.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

    // Refund a booking
    @PutMapping("/{id}/refund")
    public ResponseEntity<Booking> refundBooking(@PathVariable int id) {
        Booking refunded = bookingService.refundBooking(id);
        return ResponseEntity.ok(refunded);
    }

}
