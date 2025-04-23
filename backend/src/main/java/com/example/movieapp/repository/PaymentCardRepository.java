package com.example.movieapp.repository;

import com.example.movieapp.model.PaymentCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.movieapp.model.Customer;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentCardRepository extends JpaRepository<PaymentCard, Integer> {
    Optional<PaymentCard> findByEncryptedCardNumber(String encryptedCardNumber);

    long countByCustomer(Customer customer);
    List<PaymentCard> findByCustomerUserId(int customerId);
}
