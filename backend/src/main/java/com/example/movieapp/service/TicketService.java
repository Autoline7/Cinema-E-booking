package com.example.movieapp.service;

import com.example.movieapp.model.*;
import com.example.movieapp.repository.*;
import org.springframework.stereotype.Service;
import com.example.movieapp.service.TicketPricingService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final ScreeningRepository screeningRepository;
    private final TicketPricingService pricingService;

    public TicketService(TicketRepository ticketRepository,
                         BookingRepository bookingRepository,
                         SeatRepository seatRepository,
                         ScreeningRepository screeningRepository,
                         TicketPricingService pricingService) {
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.screeningRepository = screeningRepository;
        this.pricingService = pricingService;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(int id) {
        return ticketRepository.findById(id);
    }

    public List<Ticket> getTicketsByBookingId(int bookingId) {
        return ticketRepository.findByBookingBookingId(bookingId);
    }

    public Ticket createTicket(int bookingId, int seatId, int screeningId, Ticket ticket) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new IllegalArgumentException("Seat not found"));
        Screening screening = screeningRepository.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found"));

        // ✅ Check if seat belongs to the same showroom as the screening
        int seatShowroomId = seat.getShowroom().getShowroomId();
        int screeningShowroomId = screening.getShowroom().getShowroomId();
        if (seatShowroomId != screeningShowroomId) {
            throw new IllegalArgumentException("Seat does not belong to the screening's showroom.");
        }

        if (ticketRepository.findBySeatSeatIdAndScreeningScreeningId(seatId, screeningId).isPresent()) {
            throw new IllegalArgumentException("Seat is already booked for this screening.");
        }

        ticket.setBooking(booking);
        ticket.setSeat(seat);
        ticket.setScreening(screening);

        if (ticket.getTicketType() == null) {
            ticket.setTicketType(TicketType.Adult);
        }

        ticket.setPrice(pricingService.getPrice(ticket.getTicketType()));

        return ticketRepository.save(ticket);
    }

    public boolean deleteTicket(int id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
