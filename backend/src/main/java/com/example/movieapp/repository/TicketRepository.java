package com.example.movieapp.repository;

import com.example.movieapp.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    Optional<Ticket> findBySeatSeatIdAndScreeningScreeningId(int seatId, int screeningId);
    List<Ticket> findByBookingBookingId(int bookingId);
    List<Ticket> findByScreeningScreeningId(int screeningId);
}
