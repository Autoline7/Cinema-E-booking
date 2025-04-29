package com.example.movieapp.controller;

import com.example.movieapp.model.TicketType;
import com.example.movieapp.service.PromotionService;
import com.example.movieapp.service.TicketPricingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.RoundingMode;
import java.util.Optional;
import com.example.movieapp.model.Promotion;
import com.example.movieapp.dto.TicketPricingRequest;
import com.example.movieapp.dto.TicketPricingResponse;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/ticket-prices")
@CrossOrigin("*")
public class TicketPricingController {

    @Autowired
    private PromotionService promotionService;


    private final TicketPricingService pricingService;

    public TicketPricingController(TicketPricingService pricingService) {
        this.pricingService = pricingService;
    }

    // Get all ticket prices
    @GetMapping
    public ResponseEntity<Map<TicketType, BigDecimal>> getAllPrices() {
        return ResponseEntity.ok(pricingService.getAllPrices());
    }

    // Update ticket price
    @PutMapping("/{type}")
    public ResponseEntity<String> updatePrice(@PathVariable TicketType type,
                                              @RequestParam BigDecimal newPrice) {
        pricingService.setPrice(type, newPrice);
        return ResponseEntity.ok("Updated price for " + type + " to $" + newPrice);
    }

    // Update online fees
    @PutMapping("/online-fee")
    public ResponseEntity<String> updateOnlineFee(@RequestParam BigDecimal newFee) {
        pricingService.setOnlineFee(newFee);
        return ResponseEntity.ok("Online fee updated to $" + newFee);
    }

    // Get online fee
    @GetMapping("/online-fee")
    public ResponseEntity<BigDecimal> getOnlineFee() {
        return ResponseEntity.ok(pricingService.getOnlineFee());
    }

    @PostMapping("/calculate-total")
    public ResponseEntity<TicketPricingResponse> calculateTotal(@RequestBody TicketPricingRequest request) {
        BigDecimal subtotal = request.getTicketPrices()
                .stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal onlineFee = pricingService.getOnlineFee();
        BigDecimal taxRate = new BigDecimal("0.07"); // 7% tax
        BigDecimal taxAmount = subtotal.multiply(taxRate);

        BigDecimal discountAmount = BigDecimal.ZERO;

        if (request.getPromoCode() != null && !request.getPromoCode().isEmpty()) {
            Optional<Promotion> promo = promotionService.getPromotionByCode(request.getPromoCode());
            if (promo.isPresent()) {
                BigDecimal discountPercentage = promo.get().getDiscountPercentage()
                        .divide(new BigDecimal("100")); // Because 20% = 0.20
                discountAmount = subtotal.add(taxAmount).add(onlineFee).multiply(discountPercentage);
            }
        }

        BigDecimal totalPrice = subtotal.add(taxAmount).add(onlineFee).subtract(discountAmount);

        TicketPricingResponse response = new TicketPricingResponse();
        response.setTicketSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        response.setTaxAmount(taxAmount.setScale(2, RoundingMode.HALF_UP));
        response.setOnlineFee(onlineFee.setScale(2, RoundingMode.HALF_UP));
        response.setDiscountAmount(discountAmount.setScale(2, RoundingMode.HALF_UP));
        response.setTotalPrice(totalPrice.setScale(2, RoundingMode.HALF_UP));

        return ResponseEntity.ok(response);
    }


}
