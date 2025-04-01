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

    // Get all adresses
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

     // Get address by ID
    public Optional<Address> getAddressById(int id) {
        return addressRepository.findById(id);
    }

    // Delete an address
    public boolean deleteAddress(int id) {
        Optional<Address> address = addressRepository.findById(id);
        if (address.isPresent()) {
            try {
                addressRepository.deleteById(id);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }
}