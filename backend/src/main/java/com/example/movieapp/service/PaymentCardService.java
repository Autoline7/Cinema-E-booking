package com.example.movieapp.service;

import com.example.movieapp.model.PaymentCard;
import com.example.movieapp.model.Customer;
import com.example.movieapp.model.Address;
import com.example.movieapp.repository.PaymentCardRepository;
import com.example.movieapp.controller.PaymentCardController.PaymentCardRequest;
import org.springframework.transaction.annotation.Transactional;
import com.example.movieapp.repository.CustomerRepository;
import com.example.movieapp.repository.AddressRepository;
import com.example.movieapp.util.EncryptionUtil;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentCardService {

    private final PaymentCardRepository paymentCardRepository;
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;

    public PaymentCardService(PaymentCardRepository paymentCardRepository, 
                              CustomerRepository customerRepository,
                              AddressRepository addressRepository) {
        this.paymentCardRepository = paymentCardRepository;
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
    }

    // ✅ Get all payment cards
    public List<PaymentCard> getAllPaymentCards() {
        return paymentCardRepository.findAll();
    }

    // ✅ Get a specific payment card by ID
    public Optional<PaymentCard> getPaymentCardById(int id) {
        return paymentCardRepository.findById(id);
    }

    // ✅ Get all payment cards for a specific customer
    public List<PaymentCard> getCardsByCustomerId(int customerId) {
        return paymentCardRepository.findByCustomerUserId(customerId);
    }

     // ✅ Add a card using the customer's existing address
    public PaymentCard addCardUsingCustomerAddress(int customerId, PaymentCard paymentCard) {
        validateCardDetails(paymentCard);

        // Fetch the customer and their existing address
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (customer.getAddress() == null) {
            throw new IllegalArgumentException("Customer does not have a registered address.");
        }

        paymentCard.setCustomer(customer);
        paymentCard.setBillingAddress(customer.getAddress()); // Use the customer's existing address
        return encryptAndSavePaymentCard(paymentCard);
    }

    // ✅ Add a card with a new billing address
    public PaymentCard addCardWithNewAddress(int customerId, PaymentCardRequest request) {
        validateCardDetails(request.getPaymentCard());

        // Encrypt card details
        String encryptedCardNumber = EncryptionUtil.encrypt(request.getPaymentCard().getDecryptedCardNumber());

        // ✅ Check if card already exists
        Optional<PaymentCard> existingCard = paymentCardRepository.findByEncryptedCardNumber(encryptedCardNumber);
        if (existingCard.isPresent()) {
            throw new IllegalArgumentException("This payment card already exists in the system.");
        }

        // ✅ Fetch Customer
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // ✅ Check if address already exists
        Address newAddress = request.getBillingAddress();
        Optional<Address> existingAddress = addressRepository.findByStreetAndCityAndStateAndZipCodeAndCountry(
                newAddress.getStreet(),
                newAddress.getCity(),
                newAddress.getState(),
                newAddress.getZipCode(),
                newAddress.getCountry()
        );

        if (existingAddress.isPresent()) {
            newAddress = existingAddress.get(); // Use the existing address
        } else {
            newAddress = addressRepository.save(newAddress); // Save only if it doesn't exist
        }

        // ✅ Create and save the payment card
        PaymentCard paymentCard = request.getPaymentCard();
        paymentCard.setCustomer(customer);
        paymentCard.setBillingAddress(newAddress);
        return encryptAndSavePaymentCard(paymentCard);
    }

    // ✅ Encrypt card details, validate uniqueness, and enforce max 3 cards per customer
    private PaymentCard encryptAndSavePaymentCard(PaymentCard paymentCard) {
        String encryptedCardNumber = EncryptionUtil.encrypt(paymentCard.getDecryptedCardNumber());
        String encryptedCvv = EncryptionUtil.encrypt(paymentCard.getDecryptedCvv());

        // Ensure the card is unique
        Optional<PaymentCard> existingCard = paymentCardRepository.findByEncryptedCardNumber(encryptedCardNumber);
        if (existingCard.isPresent()) {
            throw new IllegalArgumentException("This payment card already exists in the system.");
        }

        // Ensure a maximum of 3 cards per customer
        long cardCount = paymentCardRepository.countByCustomer(paymentCard.getCustomer());
        if (cardCount >= 3) {
            throw new IllegalArgumentException("A customer can have at most 3 payment cards.");
        }

        // Set last four digits and encrypted values
        paymentCard.setLastFourDigits(paymentCard.getDecryptedCardNumber().substring(paymentCard.getDecryptedCardNumber().length() - 4));
        paymentCard.setEncryptedCardNumber(encryptedCardNumber);
        paymentCard.setEncryptedCvv(encryptedCvv);

        return paymentCardRepository.save(paymentCard);
    }


    @Transactional
    public boolean deletePaymentCard(int id) {
        Optional<PaymentCard> existingCard = paymentCardRepository.findById(id);

        if (existingCard.isPresent()) {
            PaymentCard card = existingCard.get();
            
            // Remove the card from the customer's list
            Customer customer = card.getCustomer();
            if (customer != null) {
                customer.getPaymentCards().remove(card);
                customerRepository.save(customer);
            }

            paymentCardRepository.delete(card);
            return true;
        } else {
            return false;
        }
    }

    // ✅ Retrieve decrypted card number
    public String getDecryptedCardNumber(int paymentCardId) {
        return paymentCardRepository.findById(paymentCardId)
                .map(PaymentCard::getDecryptedCardNumber)
                .orElseThrow(() -> new IllegalArgumentException("Payment card not found"));
    }

    // ✅ Retrieve decrypted CVV (ONLY when needed for processing)
    public String getDecryptedCvv(int paymentCardId) {
        return paymentCardRepository.findById(paymentCardId)
                .map(PaymentCard::getDecryptedCvv)
                .orElseThrow(() -> new IllegalArgumentException("Payment card not found"));
    }

    // ✅ Validate card details before processing
    private void validateCardDetails(PaymentCard paymentCard) {
        String cardNumber = paymentCard.getDecryptedCardNumber();
        String cvv = paymentCard.getDecryptedCvv();

        if (cardNumber == null || !cardNumber.matches("\\d{4,19}")) {
            throw new IllegalArgumentException("Invalid card number");
        }
        if (cvv == null || !cvv.matches("\\d{3,4}")) {
            throw new IllegalArgumentException("Invalid CVV");
        }
    }
}
