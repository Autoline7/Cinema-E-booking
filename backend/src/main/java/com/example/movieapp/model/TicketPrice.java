package com.example.movieapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ticket_price")
public class TicketPrice {

    @Id
    @Column(name = "ticket_type")
    @Enumerated(EnumType.STRING)
    private TicketType ticketType;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    public TicketPrice() {}

    public TicketPrice(TicketType ticketType, BigDecimal price) {
        this.ticketType = ticketType;
        this.price = price;
    }

    public TicketType getTicketType() {
        return ticketType;
    }

    public void setTicketType(TicketType ticketType) {
        this.ticketType = ticketType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
