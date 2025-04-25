package com.example.movieapp.service;

import com.example.movieapp.model.Booking;
import com.example.movieapp.model.Customer;
import com.example.movieapp.model.PaymentCard;
import com.example.movieapp.model.Promotion;
import com.example.movieapp.service.EmailService;
import com.example.movieapp.service.TicketPricingService;
import com.example.movieapp.repository.BookingRepository;
import com.example.movieapp.repository.CustomerRepository;
import com.example.movieapp.repository.PaymentCardRepository;
import com.example.movieapp.repository.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.movieapp.model.Ticket;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired 
    private EmailService emailService;
    @Autowired
    private TicketPricingService ticketPricingService;

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final PromotionRepository promotionRepository;

    public BookingService(BookingRepository bookingRepository,
                          CustomerRepository customerRepository,
                          PaymentCardRepository paymentCardRepository,
                          PromotionRepository promotionRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.promotionRepository = promotionRepository;
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get a booking by ID
    public Optional<Booking> getBookingById(int id) {
        return bookingRepository.findById(id);
    }

    // Get all bookings for a specific customer
    public List<Booking> getBookingsByCustomerId(int customerId) {
        return bookingRepository.findByCustomerUserId(customerId);
    }

    // Create a new booking
    public Booking createBooking(int customerId, int cardId, Integer promoId, Booking booking) {
        
        // Check if customer and payment card exist
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        PaymentCard paymentCard = paymentCardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Payment card not found"));

        // Check if promotion is used/exists
        Promotion promotion = null;
        if (promoId != null) {
            promotion = promotionRepository.findById(promoId)
                    .orElseThrow(() -> new IllegalArgumentException("Promotion not found"));
        }

        // Calculates pricing
        BigDecimal fee = ticketPricingService.getOnlineFee(); // pulled from DB
        booking.setStoredOnlineFee(fee);
        booking.setCustomer(customer);
        booking.setPaymentCard(paymentCard);
        booking.setPromotion(promotion);
        booking.setBookingDate(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Delete a booking
    public boolean deleteBooking(int id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Send booking confirmation
    public void sendBookingConfirmationEmail(int bookingId) {
        // Check if booking exists
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Get all the tickets associated with the booking, can't confirm an empty booking
        List<Ticket> tickets = booking.getTickets();
        if (tickets == null || tickets.isEmpty()) {
            throw new RuntimeException("No tickets found for booking");
        }

        // Gather info for email
        Ticket firstTicket = tickets.get(0);
        String movieTitle = firstTicket.getScreening().getMovie().getTitle();
        LocalDateTime showtime = firstTicket.getScreening().getShowtime();

        String email = booking.getCustomer().getEmail();

        // Send email
        emailService.sendBookingConfirmationEmail(
                email,
                bookingId,
                tickets,
                movieTitle,
                showtime,
                booking.getTotalPrice(),
                booking.getTaxAmount(),
                booking.getOnlineFee(),
                booking.getDiscountAmount()
        );
    }

    // Refund a booking and send confirmation
    public Booking refundBooking(int bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if already refunded
        if (booking.isRefunded()) {
            throw new RuntimeException("Booking has already been refunded.");
        }

        // Mark as refunded
        booking.setRefunded(true);
        bookingRepository.save(booking);

        // Gather info for email
        String email = booking.getCustomer().getEmail();
        String firstName = booking.getCustomer().getFirstName();
        List<Ticket> tickets = booking.getTickets();

        if (tickets == null || tickets.isEmpty()) {
            throw new RuntimeException("No tickets associated with this booking.");
        }

        String movieTitle = tickets.get(0).getScreening().getMovie().getTitle();
        LocalDateTime showtime = tickets.get(0).getScreening().getShowtime();
        BigDecimal refundAmount = booking.getTotalPrice();

        // Send email
        emailService.sendBookingRefundEmail(
                email,
                firstName,
                bookingId,
                movieTitle,
                showtime,
                refundAmount
        );

        return booking;
    }



}
