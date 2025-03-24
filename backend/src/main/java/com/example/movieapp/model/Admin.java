package com.example.movieapp.model;

import com.example.movieapp.util.EncryptionUtil;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment PK
    @Column(name = "user_id")
    private int userId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "ENUM('ADMIN') DEFAULT 'ADMIN'")
    private Role role = Role.ADMIN;  // Default role

    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private Timestamp updatedAt;

    @Column(name = "last_logged_in")
    private Timestamp lastLoggedIn;

    @Column(name = "last_logged_out")
    private Timestamp lastLoggedOut;

    @Transient
    private String decryptedPassword;

    // Default constructor
    public Admin() {}

    // Constructor with parameters
    public Admin(String firstName, String lastName, String email, String decryptedPassword) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = EncryptionUtil.encrypt(decryptedPassword);
        this.role = Role.ADMIN;
        Timestamp now = new Timestamp(System.currentTimeMillis());
        this.createdAt = now;
        this.updatedAt = now;
        this.decryptedPassword = decryptedPassword;

    }

    // Getters and setters
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Timestamp getLastLoggedIn() {
        return lastLoggedIn;
    }

    public void setLastLoggedIn(Timestamp lastLoggedIn) {
        this.lastLoggedIn = lastLoggedIn;
    }

    public Timestamp getLastLoggedOut() {
        return lastLoggedOut;
    }

    public void setLastLoggedOut(Timestamp lastLoggedOut) {
        this.lastLoggedOut = lastLoggedOut;
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

}
