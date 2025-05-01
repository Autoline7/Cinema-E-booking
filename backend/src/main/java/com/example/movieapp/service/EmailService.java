package com.example.movieapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import org.springframework.mail.MailException;
import jakarta.mail.internet.MimeMessage;
import com.example.movieapp.model.Ticket;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.io.UnsupportedEncodingException;
import java.math.RoundingMode;

import java.math.BigDecimal;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;
import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Send registration verification email
    public void sendVerificationEmail(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Handle UnsupportedEncodingException
            try {
                helper.setFrom("jacobcromer01@gmail.com", "Group 12 Cinema e-Booking");
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("Invalid encoding for email sender name", e);
            }
            helper.setTo(to);
            helper.setSubject("Your Verification Code");
            helper.setText("<p>Your verification code is: <b>" + code + "</b></p>", true);

            mailSender.send(message);
        } catch (MailException | MessagingException e) {
            throw new RuntimeException("Failed to send email");
        }
    }

    // Send registration confirmation email
    public void sendConfirmationEmail(String to) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Handle UnsupportedEncodingException
            try {
                helper.setFrom("jacobcromer01@gmail.com", "Group 12 Cinema e-Booking");
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("Invalid encoding for email sender name", e);
            }
            helper.setTo(to);
            helper.setSubject("Registration Confirmed");
            helper.setText("Congratulations! Your email has been successfully verified. You may now log in to your new account.", true);

            mailSender.send(message);
        } catch (MailException | MessagingException e) {
            throw new RuntimeException("Failed to send confirmation email");
        }
    }

    // Send password reset code
    public void sendPasswordResetCode(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Handle UnsupportedEncodingException
            try {
                helper.setFrom("jacobcromer01@gmail.com", "Group 12 Cinema e-Booking");
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("Invalid encoding for email sender name", e);
            }

            helper.setTo(to);
            helper.setSubject("Your Password Reset Code");
            helper.setText("Your password reset code is: <b>" + code + "</b>", true);

            mailSender.send(message);
            System.out.println("Password reset code sent to: " + to);
        } catch (MailException | MessagingException e) {
            throw new RuntimeException("Failed to send password reset email.");
        }
    }

    // Send password reset confirmation email
    public void sendPasswordResetConfirmation(String to) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Handle UnsupportedEncodingException
            try {
                helper.setFrom("jacobcromer01@gmail.com", "Group 12 Cinema e-Booking");
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("Invalid encoding for email sender name", e);
            }

            helper.setTo(to);
            helper.setSubject("Password Reset");
            helper.setText(
                "<p>Your password has been successfully reset.</p>"
                + "<p>If you did not request this change, please contact our support team immediately.</p>",
                true
            );

            mailSender.send(message);
        } catch (MailException | MessagingException e) {
            throw new RuntimeException("Failed to send confirmation email");
        }
    }

    // Send personal information changed confirmation email
    public void sendProfileUpdateConfirmation(String to) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Handle UnsupportedEncodingException
            try {
                helper.setFrom("jacobcromer01@gmail.com", "Group 12 Cinema e-Booking");
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("Invalid encoding for email sender name", e);
            }

            helper.setTo(to);
            helper.setSubject("Profile Update Confirmation");
            helper.setText("Your profile details have been updated successfully. If you did not make these changes, please contact support immediately.", true);

            mailSender.send(message);
        } catch (MailException | MessagingException e) {
            throw new RuntimeException("Failed to send profile update confirmation email");
        }
    }

    // Send promotional email to all subscribers
    public void sendPromotionEmail(String to, String description, BigDecimal discount, Date expirationDate, String promoCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Handle UnsupportedEncodingException
            try {
                helper.setFrom("jacobcromer01@gmail.com", "Group 12 Cinema e-Booking");
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("Invalid encoding for email sender name", e);
            }

            String subject = "🔥 New Promotion Available!";
            String expirationText = (expirationDate != null) 
                ? "Offer expires on: " + new SimpleDateFormat("yyyy-MM-dd").format(expirationDate)
                : "Limited-time offer!";

            String body = "<h2>🚀 Special Offer Just for You!</h2>"
                        + "<p>" + description + "</p>"
                        + "<p><b>Discount:</b> " + discount + "% off</p>"
                        + "<p>" + expirationText + "</p>"
                        + "<p><b>Code:</b> " + promoCode + "</p>"
                        + "<p>Act fast before it's gone!</p>";

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send promotion email to " + to);
        }
    }

    // Send booking confirmation email
    public void sendBookingConfirmationEmail(String to, int bookingId, List<Ticket> tickets, String movieTitle, LocalDateTime showtime, BigDecimal finalTotal, BigDecimal taxAmount, BigDecimal onlineFee, BigDecimal discountAmount) {
        DecimalFormat df = new DecimalFormat("0.00");
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            try {
                helper.setFrom("jacobcromer01@gmail.com", "Group 12 Cinema e-Booking");
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("Invalid encoding for email sender name", e);
            }

            int numTickets = tickets.size();
            BigDecimal ticketSubtotal = tickets.stream()
                    .map(ticket -> ticket.getPrice() != null ? ticket.getPrice() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String formattedShowtime = showtime.format(DateTimeFormatter.ofPattern("EEEE, MMMM d yyyy 'at' h:mm a"));

            StringBuilder ticketDetails = new StringBuilder("<ul>");
            for (Ticket t : tickets) {
                ticketDetails.append("<li>")
                             .append(t.getTicketType()).append(" — $")
                             .append(t.getPrice()).append("</li>");
            }
            ticketDetails.append("</ul>");

            String body = "<h2>🎟️ Booking Confirmation</h2>"
                        + "<p><b>Booking ID:</b> " + bookingId + "</p>"
                        + "<p><b>Movie:</b> " + movieTitle + "</p>"
                        + "<p><b>Showtime:</b> " + formattedShowtime + "</p>"
                        + "<p><b>Tickets (" + numTickets + "):</b></p>"
                        + ticketDetails
                        + "<p><b>Ticket Subtotal:</b> $" + df.format(ticketSubtotal) + "</p>"
                        + "<p><b>Online Fee:</b> $" + df.format(onlineFee) + "</p>"
                        + "<p><b>Tax:</b> $" + df.format(taxAmount) + "</p>"
                        + "<p><b>Discount:</b> -$" + df.format(discountAmount) + "</p>"
                        + "<hr>"
                        + "<p><b>Total Charged:</b> $" + df.format(finalTotal) + "</p>"
                        + "<p>We look forward to seeing you at Group 12 Cinema!</p>";

            helper.setTo(to);
            helper.setSubject("🎟️ Booking Confirmation – Booking #" + bookingId);
            helper.setText(body, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send booking confirmation email to " + to);
        }
    }

    public void sendBookingRefundEmail(String to, String firstName, int bookingId, String movieTitle, LocalDateTime showtime, BigDecimal refundAmount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            try {
                helper.setFrom("jacobcromer01@gmail.com", "Group 12 Cinema e-Booking");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("Invalid encoding for email sender name", e);
            }

            String formattedShowtime = showtime.format(DateTimeFormatter.ofPattern("EEEE, MMM d, yyyy 'at' h:mm a"));

            String subject = "Refund Confirmation for Your Booking";
            String body = "<h2>Hello " + firstName + ",</h2>"
                        + "<p>Your booking <b>#" + bookingId + "</b> has been successfully refunded.</p>"
                        + "<p><b>Movie:</b> " + movieTitle + "<br>"
                        + "<b>Showtime:</b> " + formattedShowtime + "<br>"
                        + "<b>Refunded Amount:</b> $" + refundAmount.setScale(2, RoundingMode.HALF_UP) + "</p>"
                        + "<p>If you have any questions, feel free to contact our support team.</p>"
                        + "<p>Thank you for choosing Group 12 Cinema!</p>";

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send refund confirmation email.");
        }
    }




}