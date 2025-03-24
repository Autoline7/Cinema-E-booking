package com.example.movieapp.controller;

import com.example.movieapp.model.PaymentCard;
import com.example.movieapp.model.Address;
import com.example.movieapp.service.PaymentCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment-cards")
@CrossOrigin("*")
public class PaymentCardController {

    private final PaymentCardService paymentCardService;

    public PaymentCardController(PaymentCardService paymentCardService) {
        this.paymentCardService = paymentCardService;
    }

    // ✅ Get all payment cards
    @GetMapping
    public ResponseEntity<List<PaymentCard>> getAllPaymentCards() {
        return ResponseEntity.ok(paymentCardService.getAllPaymentCards());
    }

    // ✅ Get a single payment card by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentCard> getPaymentCardById(@PathVariable int id) {
        Optional<PaymentCard> paymentCard = paymentCardService.getPaymentCardById(id);
        return paymentCard.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Get all payment cards for a specific customer
    @GetMapping("/customer/{customerId}")
        public ResponseEntity<List<PaymentCard>> getCardsByCustomer(@PathVariable int customerId) {
        List<PaymentCard> cards = paymentCardService.getCardsByCustomerId(customerId);
        return ResponseEntity.ok(cards);
    }

    // ✅ Add a new card using the customer's existing address
    @PostMapping("/customer/{customerId}")
    public ResponseEntity<?> addCardUsingCustomerAddress(
            @PathVariable int customerId,
            @RequestBody PaymentCard paymentCard) {
        try {
            PaymentCard savedCard = paymentCardService.addCardUsingCustomerAddress(customerId, paymentCard);
            return ResponseEntity.ok(savedCard);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Add a new card with a new billing address
    @PostMapping("/customer/{customerId}/new-address")
    public ResponseEntity<?> addCardWithNewBillingAddress(
            @PathVariable int customerId,
            @RequestBody PaymentCardRequest request) {
        try {
            PaymentCard savedCard = paymentCardService.addCardWithNewAddress(customerId, request);
            return ResponseEntity.ok(savedCard);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @DeleteMapping("/{id}")
public ResponseEntity<?> deletePaymentCard(@PathVariable int id) {
    boolean deleted = paymentCardService.deletePaymentCard(id);

    if (deleted) {
        return ResponseEntity.ok("Payment card deleted successfully.");
    } else {
        return ResponseEntity.status(404).body("Payment card not found in the database.");
    }
}

    // ✅ Get decrypted card number
    @GetMapping("/{id}/decrypt-card")
    public ResponseEntity<String> getDecryptedCardNumber(@PathVariable int id) {
        String decryptedCard = paymentCardService.getDecryptedCardNumber(id);
        return ResponseEntity.ok(decryptedCard);
    }

    // ✅ Get decrypted CVV (ONLY for processing payments)
    @GetMapping("/{id}/decrypt-cvv")
    public ResponseEntity<String> getDecryptedCvv(@PathVariable int id) {
        String decryptedCvv = paymentCardService.getDecryptedCvv(id);
        return ResponseEntity.ok(decryptedCvv);
    }

    // ✅ Handle Errors Gracefully
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

     // ✅ Helper class for request body with a new billing address
    public static class PaymentCardRequest {
        private PaymentCard paymentCard;
        private Address billingAddress;

        public PaymentCard getPaymentCard() {
            return paymentCard;
        }

        public void setPaymentCard(PaymentCard paymentCard) {
            this.paymentCard = paymentCard;
        }

        public Address getBillingAddress() {
            return billingAddress;
        }

        public void setBillingAddress(Address billingAddress) {
            this.billingAddress = billingAddress;
        }
    }
}
