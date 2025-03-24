package com.example.movieapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import org.springframework.mail.MailException;
import jakarta.mail.internet.MimeMessage;

import java.math.BigDecimal;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // ✅ Handle UnsupportedEncodingException
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

    public void sendConfirmationEmail(String to) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // ✅ Handle UnsupportedEncodingException
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

    public void sendPasswordResetCode(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // ✅ Handle UnsupportedEncodingException
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

    public void sendPasswordResetConfirmation(String to) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // ✅ Handle UnsupportedEncodingException
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

    public void sendProfileUpdateConfirmation(String to) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // ✅ Handle UnsupportedEncodingException
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

    public void sendPromotionEmail(String to, String description, BigDecimal discount, Date expirationDate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // ✅ Handle UnsupportedEncodingException
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
                        + "<p>Act fast before it's gone!</p>";

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send promotion email to " + to);
        }
    }
}