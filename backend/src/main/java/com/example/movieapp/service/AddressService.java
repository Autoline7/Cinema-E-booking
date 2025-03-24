package com.example.movieapp.service;

import com.example.movieapp.model.Address;
import com.example.movieapp.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

     // ✅ Get an address by ID
    public Optional<Address> getAddressById(int id) {
        return addressRepository.findById(id);
    }

    // ✅ Delete an address (only if not referenced)
    public boolean deleteAddress(int id) {
        Optional<Address> address = addressRepository.findById(id);
        if (address.isPresent()) {
            try {
                addressRepository.deleteById(id);
                return true;
            } catch (Exception e) {
                return false;  // Deletion failed due to foreign key constraint
            }
        }
        return false;  // Address not found
    }
}