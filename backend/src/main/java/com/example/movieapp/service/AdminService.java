package com.example.movieapp.service;

import com.example.movieapp.model.Admin;
import com.example.movieapp.repository.AdminRepository;
import com.example.movieapp.repository.CustomerRepository;
import com.example.movieapp.util.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.movieapp.service.EmailService;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired 
    private CustomerRepository customerRepository;
    @Autowired
    private EmailService emailService;

    // Create new admin
    public Admin createAdmin(Admin admin) {

        // Make sure minimum attributes are provided
        if (admin.getFirstName() == null || admin.getFirstName().trim().isEmpty() ||
            admin.getLastName() == null || admin.getLastName().trim().isEmpty() ||
            admin.getEmail() == null || admin.getEmail().trim().isEmpty() ||
            admin.getDecryptedPassword() == null || admin.getDecryptedPassword().trim().isEmpty()) {
            throw new RuntimeException("Creating an admin requires first name, last name, email, and password.");
        }

        // Check if email exists as an admin or customer
        if (adminRepository.findByEmail(admin.getEmail()).isPresent() ||
            customerRepository.findByEmail(admin.getEmail()).isPresent()) {
            throw new RuntimeException("A user with this email already exists.");
        }

        admin.setPasswordHash(EncryptionUtil.encrypt(admin.getDecryptedPassword()));
        admin.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        admin.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        Admin savedAdmin = adminRepository.save(admin);
        savedAdmin.setDecryptedPassword(admin.getDecryptedPassword());
        return savedAdmin;
    }

    // Get all admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Get admin by ID
    public Admin getAdminById(int userId) {
        Admin admin = adminRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Admin with ID " + userId + " not found"));

        admin.setDecryptedPassword(admin.getDecryptedPassword());
        return admin;
    }

    // Get admin by email
    public Admin getAdminByEmail(String email) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin with email " + email + " not found"));

        admin.setDecryptedPassword(admin.getDecryptedPassword());
        return admin;
    }

    // Check if email exists in admin table
    public boolean emailExists(String email) {
        return adminRepository.findByEmail(email).isPresent();
    }

    // Update an existing admin
    public Admin updateAdmin(int id, Admin updatedAdmin) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin with ID " + id + " not found"));

        // Make sure attributes are provided
        if (updatedAdmin.getFirstName() != null && !updatedAdmin.getFirstName().trim().isEmpty()) {
            admin.setFirstName(updatedAdmin.getFirstName());
        }
        if (updatedAdmin.getLastName() != null && !updatedAdmin.getLastName().trim().isEmpty()) {
            admin.setLastName(updatedAdmin.getLastName());
        }
        if (updatedAdmin.getDecryptedPassword() != null && !updatedAdmin.getDecryptedPassword().isEmpty()) {
            admin.setPasswordHash(EncryptionUtil.encrypt(updatedAdmin.getDecryptedPassword()));
            admin.setDecryptedPassword(updatedAdmin.getDecryptedPassword());
        } else {
            // Preserve decrypted password
            admin.setDecryptedPassword(EncryptionUtil.decrypt(admin.getPasswordHash()));
        }

        admin.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Admin savedAdmin = adminRepository.save(admin);

        // Send profile update confirmation email
        try {
            emailService.sendProfileUpdateConfirmation(admin.getEmail());
        } catch (RuntimeException e) {
            // Most likely caused by invalid email
            throw new RuntimeException("Profile updated, but unable to send confirmation email.");
        }

        return savedAdmin;
    }

    // Delete admin by ID
    public void deleteAdminById(int id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin with ID " + id + " not found");
        }
        adminRepository.deleteById(id);
    }

    // Delete admin by email
    public void deleteAdminByEmail(String email) {
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isEmpty()) {
            throw new RuntimeException("Admin with email " + email + " not found");
        }
        adminRepository.delete(admin.get());
    }

    // Save admin to database (updated not new)
    public void saveAdmin(Admin admin) {
    adminRepository.save(admin);
    }

    // Change admin password
    public void changePassword(String email, String oldPassword, String newPassword) {
        Admin admin = adminRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Verify old password
        if (!EncryptionUtil.verifyPassword(oldPassword, admin.getPasswordHash())) {
            throw new RuntimeException("Incorrect old password");
        }

        // Encrypt and update new password
        admin.setPasswordHash(EncryptionUtil.encrypt(newPassword));
        adminRepository.save(admin);

        // Send confirmation email
        try {
            emailService.sendPasswordResetConfirmation(email);
        } catch (RuntimeException e) {
            // Most likely caused by invalid email
            throw new RuntimeException("Unable to send email. Check that email address is correct.");
        }
    }
}
