package com.example.movieapp.service;

import com.example.movieapp.model.Promotion;
import com.example.movieapp.model.Customer;
import com.example.movieapp.repository.PromotionRepository;
import com.example.movieapp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.movieapp.service.EmailService;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private EmailService emailService;

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public Promotion createPromotion(Promotion promotion) {
        // Ensure expiration date is stored as java.sql.Date
        if (promotion.getExpirationDate() != null) {
            promotion.setExpirationDate(new java.sql.Date(promotion.getExpirationDate().getTime()));
        }

        if (promotion.getPromoCode() == null || promotion.getPromoCode().length() != 4) {
            throw new IllegalArgumentException("Promo code must be exactly 4 uppercase characters.");
        }
        
        Promotion savedPromotion = promotionRepository.save(promotion);

        // Fetch all subscribed customers
        List<Customer> subscribers = customerRepository.findByIsSubscriberTrue();

        // Send email to each subscriber
        for (Customer customer : subscribers) {
            emailService.sendPromotionEmail(
                customer.getEmail(),
                promotion.getDescription(),
                promotion.getDiscountPercentage(),
                promotion.getExpirationDate()
            );
        }

        return savedPromotion;
    }

    // 🔹 GET promotion by ID
    public Optional<Promotion> getPromotionById(int id) {
        return promotionRepository.findById(id);
    }

    // 🔹 UPDATE an existing promotion
    public Promotion updatePromotion(int id, Map<String, Object> updates) {
        Optional<Promotion> existingPromotionOpt = promotionRepository.findById(id);
        if (existingPromotionOpt.isEmpty()) {
            throw new RuntimeException("Promotion not found.");
        }

        Promotion promotion = existingPromotionOpt.get();

        if (updates.containsKey("description")) {
            promotion.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("discount_percentage")) {
            BigDecimal discountPercentage = new BigDecimal(updates.get("discount_percentage").toString());
            if (discountPercentage.compareTo(BigDecimal.ZERO) < 0 || discountPercentage.compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new RuntimeException("Discount percentage must be between 0 and 100.");
            }
            promotion.setDiscountPercentage(discountPercentage);
        }
        if (updates.containsKey("expiration_date")) {
            String dateStr = updates.get("expiration_date").toString();
            if (dateStr != null && !dateStr.isEmpty()) {
                promotion.setExpirationDate(Date.valueOf(dateStr)); // Use java.sql.Date consistently
            } else {
                promotion.setExpirationDate(null);
            }
        }

        return promotionRepository.save(promotion);
    }

    // 🔹 DELETE promotion by ID
    public boolean deletePromotionById(int id) {
        if (promotionRepository.existsById(id)) {
            promotionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
