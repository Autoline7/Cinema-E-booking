package com.example.movieapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.movieapp.model.Address;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    // ✅ Find an existing address with all matching fields
    Optional<Address> findByStreetAndCityAndStateAndZipCodeAndCountry(
        String street, String city, String state, String zipCode, String country
    );
}
