package com.example.movieapp.dto;

import java.math.BigDecimal;

public class TicketPricingResponse {
    private BigDecimal ticketSubtotal;
    private BigDecimal taxAmount;
    private BigDecimal onlineFee;
    private BigDecimal discountAmount;
    private BigDecimal totalPrice;

    // Getters and Setters
    public BigDecimal getTicketSubtotal() {
        return ticketSubtotal;
    }

    public void setTicketSubtotal(BigDecimal ticketSubtotal) {
        this.ticketSubtotal = ticketSubtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getOnlineFee() {
        return onlineFee;
    }

    public void setOnlineFee(BigDecimal onlineFee) {
        this.onlineFee = onlineFee;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
