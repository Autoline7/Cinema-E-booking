package com.example.movieapp.controller;

import com.example.movieapp.model.Promotion;
import com.example.movieapp.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin("*")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    // Get all admins
    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }


    @PostMapping
    public ResponseEntity<?> createPromotion(@RequestBody Promotion promotion) {
        try {
            Promotion newPromotion = promotionService.createPromotion(promotion);
            return ResponseEntity.ok(Map.of("message", "Promotion created successfully.", "promotion", newPromotion));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPromotionById(@PathVariable int id) {
        Optional<Promotion> promotion = promotionService.getPromotionById(id);

        if (promotion.isPresent()) {
            return ResponseEntity.ok(promotion.get());
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Promotion not found."));
        }
    }

    // 🔹 UPDATE promotion by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromotion(@PathVariable int id, @RequestBody Map<String, Object> updates) {
        try {
            Promotion updatedPromotion = promotionService.updatePromotion(id, updates);
            return ResponseEntity.ok(Map.of("message", "Promotion updated successfully.", "promotion", updatedPromotion));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // 🔹 DELETE promotion by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotionById(@PathVariable int id) {
        boolean deleted = promotionService.deletePromotionById(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Promotion deleted successfully."));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Promotion not found."));
        }
    }
}