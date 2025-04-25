package com.example.movieapp.controller;

import com.example.movieapp.model.TicketType;
import com.example.movieapp.service.TicketPricingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/ticket-prices")
@CrossOrigin("*")
public class TicketPricingController {

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

}
