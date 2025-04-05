package com.example.movieapp.service;

import com.example.movieapp.model.Customer;
import com.example.movieapp.model.Address;
import com.example.movieapp.model.PaymentCard;
import com.example.movieapp.controller.PaymentCardController.PaymentCardRequest;
import org.springframework.transaction.annotation.Transactional;
import com.example.movieapp.repository.CustomerRepository;
import com.example.movieapp.repository.AddressRepository;
import com.example.movieapp.repository.PaymentCardRepository;
import com.example.movieapp.repository.AdminRepository;
import com.example.movieapp.service.PaymentCardService;
import com.example.movieapp.util.EncryptionUtil;
import org.springframework.http.ResponseEntity;
import com.example.movieapp.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.movieapp.model.Status;
import com.example.movieapp.model.Role;

import java.sql.Timestamp;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private PaymentCardService paymentCardService;
    @Autowired 
    private EmailService emailService;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private PaymentCardRepository paymentCardRepository;
    @Autowired
    private AdminRepository adminRepository;

    // Create new customer
    @Transactional
    public Customer createCustomer(Customer customer) {
        // Validate required fields
        if (customer.getFirstName() == null || customer.getFirstName().trim().isEmpty() ||
            customer.getLastName() == null || customer.getLastName().trim().isEmpty() ||
            customer.getEmail() == null || customer.getEmail().trim().isEmpty() ||
            customer.getDecryptedPassword() == null || customer.getDecryptedPassword().trim().isEmpty()) {
            throw new RuntimeException("Creating a customer requires first name, last name, email, and password.");
        }

        // Check if email exists as an admin or customer
        if (customerRepository.findByEmail(customer.getEmail()).isPresent() ||
            adminRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("A user with this email already exists.");
        }

        // Set default role
        customer.setRole(Role.CUSTOMER);

        // Set default status
        if (customer.getStatus() == null) {
        customer.setStatus(Status.ACTIVE); // Replace with appropriate default
        }

        // Encrypt password
        customer.setPasswordHash(EncryptionUtil.encrypt(customer.getDecryptedPassword()));
        customer.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        customer.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        // Add address
        if (customer.getAddress() != null) {
            Optional<Address> existingAddress = addressRepository.findByStreetAndCityAndStateAndZipCodeAndCountry(
                customer.getAddress().getStreet(),
                customer.getAddress().getCity(),
                customer.getAddress().getState(),
                customer.getAddress().getZipCode(),
                customer.getAddress().getCountry()
            );

            if (existingAddress.isPresent()) {
                // Use existing address instead of saving a new one
                customer.setAddress(existingAddress.get());
            } else {
                // Create new address
                Address savedAddress = addressRepository.save(customer.getAddress());
                customer.setAddress(savedAddress);
            }
        }

        Customer savedCustomer = customerRepository.save(customer);

        // Handle Payment Cards (if any) this doesn't work and I gave up on it, but the bones are here
        if (customer.getPaymentCards() != null && !customer.getPaymentCards().isEmpty()) {
            for (PaymentCard card : customer.getPaymentCards()) {
                if (card.getBillingAddress() == null) {
                    // Use customer's registered address
                    paymentCardService.addCardUsingCustomerAddress(savedCustomer.getUserId(), card);
                } else {
                    // Use a new billing address
                    PaymentCardRequest request = new PaymentCardRequest();
                    request.setPaymentCard(card);
                    request.setBillingAddress(card.getBillingAddress());

                    paymentCardService.addCardWithNewAddress(savedCustomer.getUserId(), request);
                }
            }
        }

        savedCustomer.setDecryptedPassword(customer.getDecryptedPassword());
        return savedCustomer;
    }

    // Get all customers
    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        
        // Ensure payment cards are loaded
        for (Customer customer : customers) {
            customer.getPaymentCards().size();
        }

        return customers;
    }

    // Get customer by email
    public Customer getCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer with email " + email + " not found"));
        
        customer.setDecryptedPassword(customer.getDecryptedPassword());
        return customer;
    }

    // Check if an email is in the customer table
    public boolean emailExists(String email) {
        return customerRepository.findByEmail(email).isPresent();
    }

    // Get customer by ID
    public Customer getCustomerById(int id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer with ID " + id + " not found."));
        
        customer.setDecryptedPassword(customer.getDecryptedPassword());
        return customer;
    }

    // Update customer
    public Customer updateCustomer(int id, Customer updatedCustomer) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer with ID " + id + " not found"));

        // Update attributes provided
        if (updatedCustomer.getFirstName() != null && !updatedCustomer.getFirstName().trim().isEmpty()) {
            customer.setFirstName(updatedCustomer.getFirstName());
        }
        if (updatedCustomer.getLastName() != null && !updatedCustomer.getLastName().trim().isEmpty()) {
            customer.setLastName(updatedCustomer.getLastName());
        }
        
        if (updatedCustomer.getStatus() != null) {
            customer.setStatus(updatedCustomer.getStatus());
        }

        if (updatedCustomer.getIsSubscriber() != null) {
            customer.setIsSubscriber(updatedCustomer.getIsSubscriber());
        }

        if (updatedCustomer.getDecryptedPassword() != null && !updatedCustomer.getDecryptedPassword().trim().isEmpty()) {
            customer.setPasswordHash(EncryptionUtil.encrypt(updatedCustomer.getDecryptedPassword()));
            customer.setDecryptedPassword(updatedCustomer.getDecryptedPassword());
        } else {
            // Preserve decrypted password
            customer.setDecryptedPassword(EncryptionUtil.decrypt(customer.getPasswordHash()));
        }

        // Handle address update
        if (updatedCustomer.getAddress() != null) {
            Optional<Address> existingAddress = addressRepository.findByStreetAndCityAndStateAndZipCodeAndCountry(
                updatedCustomer.getAddress().getStreet(),
                updatedCustomer.getAddress().getCity(),
                updatedCustomer.getAddress().getState(),
                updatedCustomer.getAddress().getZipCode(),
                updatedCustomer.getAddress().getCountry()
            );

            if (existingAddress.isPresent()) {
                customer.setAddress(existingAddress.get()); // Use existing address
            } else {
                Address savedAddress = addressRepository.save(updatedCustomer.getAddress());
                customer.setAddress(savedAddress); // Save and set new address
            }
        }

        customer.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Customer savedCustomer = customerRepository.save(customer);

        // Send profile update confirmation email
        try {
            emailService.sendProfileUpdateConfirmation(customer.getEmail());
        } catch (RuntimeException e) {
            // Most likely caused by invalid email
            throw new RuntimeException("Profile updated, but unable to send confirmation email.");
        }
        
        return savedCustomer;
    }

    // Delete customer by ID
    public void deleteCustomerById(int id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer with ID " + id + " not found.");
        }
        customerRepository.deleteById(id);
    }

    // Delete customer by email
    public void deleteCustomerByEmail(String email) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            throw new RuntimeException("Customer with email " + email + " not found.");
        }
        customerRepository.delete(customer.get());
    }

    // Save customer in table (updated not new)
    public void saveCustomer(Customer customer) {
    customerRepository.save(customer);
    }

    // Customer change password
    public void changePassword(String email, String oldPassword, String newPassword) {
        Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Verify old password
        if (!EncryptionUtil.verifyPassword(oldPassword, customer.getPasswordHash())) {
            throw new RuntimeException("Incorrect old password");
        }

        // Encrypt and update new password
        customer.setPasswordHash(EncryptionUtil.encrypt(newPassword));
        customerRepository.save(customer);

        // Send confirmation email
        try {
            emailService.sendPasswordResetConfirmation(email);
        } catch (RuntimeException e) {
            // Most likely caused by invalid email
            throw new RuntimeException("Unable to send email. Check that email address is correct.");
        }
    }

}

