package com.example.movieapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "promotion")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promo_id")
    private int promoId;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "discount_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal discountPercentage;

    @Column(name = "expiration_date", nullable = true)
    private Date expirationDate;

    @Column(name = "promo_code", length = 4, nullable = false, unique = true)
    private String promoCode; // 🔹 New field for promo code

    // Default constructor
    public Promotion() {}

    // Constructor with parameters
    public Promotion(String description, BigDecimal discountPercentage, Date expirationDate, String promoCode) {
        this.description = description;
        this.discountPercentage = discountPercentage;
        this.expirationDate = expirationDate;
        this.promoCode = promoCode;
    }

    // Getters and Setters
    public int getPromoId() {
        return promoId;
    }

    public void setPromoId(int promoId) {
        this.promoId = promoId;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    @Override
    public String toString() {
        return "Promotion{" +
                "promoId=" + promoId +
                ", description='" + description + '\'' +
                ", discountPercentage=" + discountPercentage +
                ", expirationDate=" + expirationDate +
                '}';
    }
}