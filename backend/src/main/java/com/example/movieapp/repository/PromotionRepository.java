package com.example.movieapp.repository;

import com.example.movieapp.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
	Optional<Promotion> findByPromoCodeIgnoreCase(String promoCode);
}