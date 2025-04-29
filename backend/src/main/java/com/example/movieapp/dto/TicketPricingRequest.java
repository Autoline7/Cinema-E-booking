package com.example.movieapp.dto;

import java.math.BigDecimal;
import java.util.List;

public class TicketPricingRequest {
    private List<BigDecimal> ticketPrices;
    private String promoCode; // Optional

    // Getters and Setters
    public List<BigDecimal> getTicketPrices() {
        return ticketPrices;
    }

    public void setTicketPrices(List<BigDecimal> ticketPrices) {
        this.ticketPrices = ticketPrices;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }
}
