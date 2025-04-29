package com.example.movieapp.model;

import com.example.movieapp.model.Ticket;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.persistence.Transient;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import java.util.List;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookingId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;

    @ManyToOne
    @JoinColumn(name = "payment_card_id", nullable = true)
    private PaymentCard paymentCard;

    @ManyToOne
    @JoinColumn(name = "promo_id")
    private Promotion promotion;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Ticket> tickets;

    @Transient
    private BigDecimal taxRate = BigDecimal.valueOf(0.07); // 7% tax

    @Column(name = "online_fee", precision = 10, scale = 2)
    private BigDecimal storedOnlineFee;

    @Column(name = "is_refunded")
    private boolean isRefunded = false;


    // Constructors
    public Booking() {}

    public Booking(Customer customer, LocalDateTime bookingDate,
                   PaymentCard paymentCard, Promotion promotion) {
        this.customer = customer;
        this.bookingDate = bookingDate;
        this.paymentCard = paymentCard;
        this.promotion = promotion;
    }

    @Transient
    public BigDecimal getTotalTicketPrice() {
        if (tickets == null || tickets.isEmpty()) return BigDecimal.ZERO;
        return tickets.stream()
                .map(ticket -> ticket.getPrice() != null ? ticket.getPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transient
    public BigDecimal getDiscountAmount() {
        if (promotion == null || promotion.getDiscountPercentage() == null) return BigDecimal.ZERO;

        BigDecimal discountRate = promotion.getDiscountPercentage().divide(BigDecimal.valueOf(100));
        BigDecimal base = getTotalTicketPrice().add(storedOnlineFee).multiply(BigDecimal.ONE.add(taxRate));
        return base.multiply(discountRate);
    }

    @Transient
    public BigDecimal getTaxAmount() {
        return (getTotalTicketPrice().add(storedOnlineFee)).multiply(taxRate);
    }

    @Transient
    public BigDecimal getTotalPrice() {
        BigDecimal base = getTotalTicketPrice().add(storedOnlineFee);
        BigDecimal taxed = base.add(getTaxAmount());
        return taxed.subtract(getDiscountAmount());
    }

    @Transient
    public BigDecimal getOnlineFee() {
        return storedOnlineFee != null ? storedOnlineFee : BigDecimal.ZERO;
    }

    public void setStoredOnlineFee(BigDecimal storedOnlineFee) {
        this.storedOnlineFee = storedOnlineFee;
    }



    // Getters and Setters
    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public PaymentCard getPaymentCard() {
        return paymentCard;
    }

    public void setPaymentCard(PaymentCard paymentCard) {
        this.paymentCard = paymentCard;
    }

    public Promotion getPromotion() {
        return promotion;
    }

    public void setPromotion(Promotion promotion) {
        this.promotion = promotion;
    }

    public boolean isRefunded() {
    return isRefunded;
    }

    public void setRefunded(boolean refunded) {
        isRefunded = refunded;
    }
}
