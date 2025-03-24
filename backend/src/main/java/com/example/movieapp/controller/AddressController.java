package com.example.movieapp.controller;

import com.example.movieapp.model.Address;
import com.example.movieapp.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin("*")  // Allow frontend calls (adjust as needed)
public class AddressController {

    private final AddressService addressService;


    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }


    // Get all addresses
    @GetMapping
    public List<Address> getAllAddresses() {
        return addressService.getAllAddresses();
    }

    // Get an address by ID
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable int id) {
        Optional<Address> address = addressService.getAddressById(id);
        return address.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete an address by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable int id) {
        boolean deleted = addressService.deleteAddress(id);
        if (deleted) {
            return ResponseEntity.ok("Address deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Address cannot be deleted. It may still be in use.");
        }
    }
}