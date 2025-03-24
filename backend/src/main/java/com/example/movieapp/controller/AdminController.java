package com.example.movieapp.controller;

import com.example.movieapp.model.Admin;
import com.example.movieapp.service.AdminService;
import com.example.movieapp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.movieapp.util.EncryptionUtil;
import com.example.movieapp.util.VerificationCodeStore;
import com.example.movieapp.util.VerificationUtil;
import com.example.movieapp.service.EmailService;
import com.example.movieapp.util.PasswordResetCodeStore;

import java.sql.Timestamp;

import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private VerificationCodeStore verificationCodeStore;

    // Create an admin
    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        try {
            Admin createdAdmin = adminService.createAdmin(admin);
            return ResponseEntity.ok().body("{\"message\": \"Admin created successfully\", \"admin\": " + createdAdmin + "}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Get all admins
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // Get an admin by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable int id) {
        try {
            Admin admin = adminService.getAdminById(id);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Get an admin by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getAdminByEmail(@PathVariable String email) {
        try {
            Admin admin = adminService.getAdminByEmail(email);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Update an admin by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable int id, @RequestBody Admin updatedAdmin) {
        try {
            Admin admin = adminService.updateAdmin(id, updatedAdmin);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage()); 
        }
    }

    // Delete an admin 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdminById(@PathVariable int id) {
        try {
            adminService.deleteAdminById(id);
            return ResponseEntity.ok().body("{\"message\": \"Admin with ID " + id + " deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Delete an admin by email
    @DeleteMapping("/email/{email}")
    public ResponseEntity<?> deleteAdminByEmail(@PathVariable String email) {
        try {
            adminService.deleteAdminByEmail(email);
            return ResponseEntity.ok().body("{\"message\": \"Admin with email " + email + " deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Send a verification code to an admin's email
    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        // Make sure passed email is not blank
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        // Check if the email is already registered as a Customer or Admin
        boolean emailExists = customerService.emailExists(email) || adminService.emailExists(email);
        if (emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email is already in use. Please log in or reset your password."));
        }

        // Create and store a temporary verification code
        String code = VerificationUtil.generateVerificationCode();
        verificationCodeStore.storeCode(email, code);
        
        // Send verification email
        try {
            emailService.sendVerificationEmail(email, code);
        } catch (RuntimeException e) {
            // Most likely caused by inputting an invalid email
            return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
        }

        // Success
        return ResponseEntity.ok(Map.of(
            "message", "Verification code sent to " + email,
            "verificationCode", code  // Include the code in the response
        ));
    }

    // Verifies an admin's registration by checking verification code and email against hashed values
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("code");

        // Make sure email and code are provided
        if (email == null || code == null) {
            return ResponseEntity.status(400).body("{\"error\": \"Email and verification code are required.\"}");
        }

        // If the code is correct, then stop storing the code
        if (verificationCodeStore.verifyCode(email, code)) {
            verificationCodeStore.removeCode(email);
            
            // Send confirmation email
            try {
                emailService.sendConfirmationEmail(email);
            } catch (RuntimeException e) {
                // Most likely caused by inputting an invalid email
                return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
            }

            // Success
            return ResponseEntity.ok("{\"message\": \"Verification successful. You can now register.\"}");
        } else {
            // Wrong code and/or email
            return ResponseEntity.status(400).body("{\"error\": \"Invalid verification code.\"}");
        }
    }


    // Log a user in
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");

        // Make sure email and password are provided
        if (email == null || password == null) {
            return ResponseEntity.status(400).body("{\"error\": \"Email and password are required.\"}");
        }

        try {
            Admin admin = adminService.getAdminByEmail(email);

            // Compare entered password with stored password hash
            if (EncryptionUtil.verifyPassword(password, admin.getPasswordHash())) {

                // Update lastLoggedIn
                admin.setLastLoggedIn(new Timestamp(System.currentTimeMillis()));
                
                // Save admin to database to commit LastLoggedIn
                adminService.saveAdmin(admin);

                // Success
                return ResponseEntity.ok("{\"message\": \"Login successful.\"}");
            } else {
                // Wrong password
                return ResponseEntity.status(401).body("{\"error\": \"Invalid credentials.\"}");
            }
        } catch (RuntimeException e) {
            // No user by that email
            return ResponseEntity.status(404).body("{\"error\": \"Email not found.\"}");
        }
    }

    // Log a user out
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        // Make sure email is provided
        if (email == null) {
            return ResponseEntity.status(400).body("{\"error\": \"Email is required.\"}");
        }

        try {
            Admin admin = adminService.getAdminByEmail(email);

            // Update lastLoggedOut
            admin.setLastLoggedOut(new Timestamp(System.currentTimeMillis()));

            // Save the update
            adminService.saveAdmin(admin);

            // Success
            return ResponseEntity.ok("{\"message\": \"Logout successful.\"}");
        } catch (RuntimeException e) {
            // No user by that email
            return ResponseEntity.status(404).body("{\"error\": \"Email not found.\"}");
        }
    }

    // Admin forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        // Check email is provided
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email is required.\"}");
        }

        // Make sure the account exists
        boolean emailExists = adminService.emailExists(email);
        if (!emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No account associated with this email."));
        }

        try {
            Admin admin = adminService.getAdminByEmail(email);

            // Generate a reset code
            String resetCode = VerificationUtil.generateVerificationCode();
            
            // Store the code temporarily
            PasswordResetCodeStore.storeCode(email, resetCode);
            
            // Send email with the reset code
            try {
                emailService.sendPasswordResetCode(email, resetCode);
            } catch (RuntimeException e) {
                return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
            }

            // Success
            return ResponseEntity.ok(Map.of(
                "message", "Verification code sent to " + email,
                "resetCode", resetCode
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
        }
    }

    // Reset Admin password after verification
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("code");
        String newPassword = requestBody.get("newPassword");

        // Make sure all fields provided
        if (email == null || code == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email, code, and new password are required.\"}");
        }

        // Wrong code and/or email
        if (!PasswordResetCodeStore.verifyCode(email, code)) {
            return ResponseEntity.status(400).body("{\"error\": \"Invalid or expired code.\"}");
        }

        try {
            Admin admin = adminService.getAdminByEmail(email);

            // Encrypt and save new password
            admin.setPasswordHash(EncryptionUtil.encrypt(newPassword));
            adminService.saveAdmin(admin);

            // Remove code after successful reset
            PasswordResetCodeStore.removeCode(email); 

            try {
                // Send confirmation email
                emailService.sendPasswordResetConfirmation(email);
            } catch (RuntimeException e) {
                return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
            }

            return ResponseEntity.ok("{\"message\": \"Password has been successfully reset.\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Error resetting password.\"}");
        }
    }


    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String oldPassword = requestBody.get("oldPassword");
        String newPassword = requestBody.get("newPassword");

        if (email == null || oldPassword == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email, old password, and new password are required.\"}");
        }

        try {
            adminService.changePassword(email, oldPassword, newPassword);
            return ResponseEntity.ok("{\"message\": \"Password changed successfully.\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

}