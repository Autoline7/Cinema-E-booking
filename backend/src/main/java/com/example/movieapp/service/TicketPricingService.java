package com.example.movieapp.service;

import com.example.movieapp.model.TicketPrice;
import com.example.movieapp.model.TicketType;
import com.example.movieapp.repository.TicketPriceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class TicketPricingService {

    private final TicketPriceRepository ticketPriceRepository;
    private final Map<TicketType, BigDecimal> pricing = new EnumMap<>(TicketType.class);

    public TicketPricingService(TicketPriceRepository ticketPriceRepository) {
        this.ticketPriceRepository = ticketPriceRepository;
        loadPricesFromDb();
    }

    private void loadPricesFromDb() {
        List<TicketPrice> prices = ticketPriceRepository.findAll();
        for (TicketPrice price : prices) {
            pricing.put(price.getTicketType(), price.getPrice());
        }
    }

    public BigDecimal getPrice(TicketType type) {
        return pricing.getOrDefault(type, BigDecimal.valueOf(10.00));
    }

    public void setPrice(TicketType type, BigDecimal newPrice) {
        pricing.put(type, newPrice);
        ticketPriceRepository.save(new TicketPrice(type, newPrice));
    }

    public Map<TicketType, BigDecimal> getAllPrices() {
        return pricing;
    }

    public BigDecimal getOnlineFee() {
        return ticketPriceRepository.findByTicketType(TicketType.OnlineFee) // or TicketType.ONLINE_FEE if enum
            .map(TicketPrice::getPrice)
            .orElseThrow(() -> new RuntimeException("Online fee not configured"));
    }


    public void setOnlineFee(BigDecimal newFee) {
        TicketPrice feeRow = ticketPriceRepository.findByTicketType(TicketType.OnlineFee)
            .orElse(new TicketPrice(TicketType.OnlineFee, newFee)); // OR use TicketType.ONLINE_FEE

        feeRow.setPrice(newFee);
        ticketPriceRepository.save(feeRow);
    }

}
