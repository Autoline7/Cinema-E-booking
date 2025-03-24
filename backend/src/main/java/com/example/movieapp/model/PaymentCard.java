package com.example.movieapp.model;

import jakarta.persistence.*;
import com.example.movieapp.util.EncryptionUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Entity
@Table(name = "payment_card")
public class PaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cardId;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "user_id", nullable = false)
    @JsonBackReference
    private Customer customer;

    @Column(name = "last_four_digits", length = 4, nullable = false)
    private String lastFourDigits;

    @Column(name = "encrypted_card_number", length = 100, nullable = false)
    private String encryptedCardNumber;

    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate;

    @JsonIgnore // Prevent CVV from being exposed in API responses
    @Column(name = "encrypted_cvv", length = 100, nullable = false)
    private String encryptedCvv;

    @ManyToOne
    @JoinColumn(name = "billing_address_id", referencedColumnName = "address_id", nullable = false)
    private Address billingAddress;

    @Transient // Not stored in DB, but available in object
    private String decryptedCardNumber;

    @Transient // Not stored in DB, but available in object
    private String decryptedCvv;

    // ✅ No-Args Constructor for JPA
    public PaymentCard() {}

    // ✅ Constructor for Fetching from Database (Auto-Decryption)
    @PostLoad
    private void decryptFields() {
        this.decryptedCardNumber = (encryptedCardNumber != null) ? EncryptionUtil.decrypt(encryptedCardNumber) : null;
        this.decryptedCvv = (encryptedCvv != null) ? EncryptionUtil.decrypt(encryptedCvv) : null;
    }

    // ✅ Constructor for Creating a New Card from API Request (Auto-Encryption)
    public PaymentCard(Customer customer, String cardNumber, LocalDate expirationDate, String cvv, Address billingAddress) {
        this.customer = customer;
        this.expirationDate = expirationDate;
        this.billingAddress = billingAddress;

        // Set last four digits
        this.lastFourDigits = cardNumber.substring(cardNumber.length() - 4);

        // Store decrypted values (for object reference)
        this.decryptedCardNumber = cardNumber;
        this.decryptedCvv = cvv;

        // Encrypt and store in DB
        this.encryptedCardNumber = EncryptionUtil.encrypt(cardNumber);
        this.encryptedCvv = EncryptionUtil.encrypt(cvv);
    }

    // ✅ Getters & Setters
    public int getCardId() {
        return cardId;
    }

    public void setCardId(int cardId) {
        this.cardId = cardId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getLastFourDigits() {
        return lastFourDigits;
    }

    public void setLastFourDigits(String lastFourDigits) {
        this.lastFourDigits = lastFourDigits;
    }

    public String getEncryptedCardNumber() {
        return encryptedCardNumber;
    }

    public void setEncryptedCardNumber(String encryptedCardNumber) {
        this.encryptedCardNumber = encryptedCardNumber;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getEncryptedCvv() {
        return encryptedCvv;
    }

    public void setEncryptedCvv(String encryptedCvv) {
        this.encryptedCvv = encryptedCvv;
    }

    public Address getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(Address billingAddress) {
        this.billingAddress = billingAddress;
    }

    // ✅ Get Decrypted Values (For Processing & Validation)
    public String getDecryptedCardNumber() {
        return decryptedCardNumber;
    }

    public String getDecryptedCvv() {
        return decryptedCvv;
    }

    public void setDecryptedCardNumber(String decryptedCardNumber) {
        this.decryptedCardNumber = decryptedCardNumber;
        this.encryptedCardNumber = EncryptionUtil.encrypt(decryptedCardNumber);
    }

    public void setDecryptedCvv(String decryptedCvv) {
        this.decryptedCvv = decryptedCvv;
        this.encryptedCvv = EncryptionUtil.encrypt(decryptedCvv);
    }
}
