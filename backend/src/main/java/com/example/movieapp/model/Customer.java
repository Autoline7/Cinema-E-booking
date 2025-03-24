package com.example.movieapp.model;

import jakarta.persistence.*;
import java.util.List;
import com.example.movieapp.model.Role;
import com.example.movieapp.model.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.example.movieapp.util.EncryptionUtil;
import java.sql.Timestamp;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @Column(name = "user_id")
    private int userId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role = Role.CUSTOMER; // ✅ Default role

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @Column(name = "is_subscriber", nullable = false)
    private boolean isSubscriber;


    @ManyToOne
    @JoinColumn(name = "address_id", referencedColumnName = "address_id", nullable = true)
    private Address address; // Optional field

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<PaymentCard> paymentCards;

     @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.sql.Timestamp createdAt;

    @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private java.sql.Timestamp updatedAt;

    @Column(name = "last_logged_in", nullable = true)
    private java.sql.Timestamp lastLoggedIn;

    @Column(name = "last_logged_out", nullable = true)
    private java.sql.Timestamp lastLoggedOut;

    @Transient
    private String decryptedPassword;

    public Customer() {}

    public Customer(String firstName, String lastName, String email, String decryptedPassword, Status status, boolean isSubscriber, Address address) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = EncryptionUtil.encrypt(decryptedPassword);
        this.decryptedPassword = decryptedPassword;
        this.status = status;
        this.isSubscriber = isSubscriber;
        this.address = address;
        this.role = Role.CUSTOMER;
        this.status = status;
    }


    public boolean addPaymentCard(PaymentCard card) {
        if (paymentCards.size() >= 3) {
            return false; // Exceeds limit
        }
        paymentCards.add(card);
        return true;
    }

    // ✅ Getters & Setters
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getDecryptedPassword() {
        if (this.decryptedPassword == null && this.passwordHash != null) {
            this.decryptedPassword = EncryptionUtil.decrypt(this.passwordHash);
        }
        return this.decryptedPassword;
    }

    public void setDecryptedPassword(String decryptedPassword) {
        this.decryptedPassword = decryptedPassword;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean getIsSubscriber() {
        return isSubscriber;
    }

    public void setIsSubscriber(boolean subscriber) {
        isSubscriber = subscriber;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public List<PaymentCard> getPaymentCards() {
        return paymentCards;
    }

    public void setPaymentCards(List<PaymentCard> paymentCards) {
        this.paymentCards = paymentCards;
    }

    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public java.sql.Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.sql.Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public java.sql.Timestamp getLastLoggedIn() {
        return lastLoggedIn;
    }

    public void setLastLoggedIn(java.sql.Timestamp lastLoggedIn) {
        this.lastLoggedIn = lastLoggedIn;
    }

    public java.sql.Timestamp getLastLoggedOut() {
        return lastLoggedOut;
    }

    public void setLastLoggedOut(java.sql.Timestamp lastLoggedOut) {
        this.lastLoggedOut = lastLoggedOut;
    }

}
