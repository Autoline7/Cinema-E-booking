package com.example.movieapp.repository;

import com.example.movieapp.model.TicketPrice;
import com.example.movieapp.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TicketPriceRepository extends JpaRepository<TicketPrice, TicketType> {
	Optional<TicketPrice> findByTicketType(TicketType ticketType);
}
