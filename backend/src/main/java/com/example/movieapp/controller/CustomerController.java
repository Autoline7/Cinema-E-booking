package com.example.movieapp.controller;

import com.example.movieapp.model.Customer;
import com.example.movieapp.model.Status;
import com.example.movieapp.model.Admin;
import com.example.movieapp.model.Role;
import com.example.movieapp.service.CustomerService;
import com.example.movieapp.service.AdminService;
import com.example.movieapp.service.EmailService;
import com.example.movieapp.util.VerificationCodeStore;
import com.example.movieapp.util.PasswordResetCodeStore;
import com.example.movieapp.util.VerificationUtil;
import com.example.movieapp.util.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;

import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private VerificationCodeStore verificationCodeStore;
    @Autowired
    private AdminService adminService;

    // Create new customer
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {

        try {
            Customer createdCustomer = customerService.createCustomer(customer);
            verificationCodeStore.removeCode(customer.getEmail()); // Remove code after successful registration
            return ResponseEntity.ok().body("{\"message\": \"Customer created successfully\", \"customer\": " + createdCustomer + "}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Return all customers
     @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    // Get a customer by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        try {
            Customer customer = customerService.getCustomerByEmail(email);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Get a customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable int id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Update customer information
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable int id, @RequestBody Customer updatedCustomer) {
        try {
            Customer customer = customerService.updateCustomer(id, updatedCustomer);
            return ResponseEntity.ok().body("{\"message\": \"Customer updated successfully\", \"customer\": " + customer + "}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Delete a customer by their ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomerById(@PathVariable int id) {
        try {
            customerService.deleteCustomerById(id);
            return ResponseEntity.ok().body("{\"message\": \"Customer with ID " + id + " deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Delete a customer by their email
    @DeleteMapping("/email/{email}")
    public ResponseEntity<?> deleteCustomerByEmail(@PathVariable String email) {
        try {
            customerService.deleteCustomerByEmail(email);
            return ResponseEntity.ok().body("{\"message\": \"Customer with email " + email + " deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Send a verification code to a customer
    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        // Make sure email is provided
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        // Make sure email is not already registered
        boolean emailExists = customerService.emailExists(email) || adminService.emailExists(email);
        if (emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email is already in use. Please log in or reset your password."));
        }

        // Generate a temporary verification code
        String code = VerificationUtil.generateVerificationCode();
        verificationCodeStore.storeCode(email, code);

        try {
            // Send verification email
            emailService.sendVerificationEmail(email, code);
        } catch (RuntimeException e) {
            // Most likely caused by an invalid email address
            return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
        }
        
        // Success
        return ResponseEntity.ok(Map.of(
            "message", "Verification code sent to " + email,
            "verificationCode", code  // Include the code in the response
        ));
    }

    // Verify a customer's code
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("code");

        // Make sure both code and email are provided
        if (email == null || code == null) {
            return ResponseEntity.status(400).body("{\"error\": \"Email and verification code are required.\"}");
        }

        // Check that code and email exist in hash table
        if (verificationCodeStore.verifyCode(email, code)) {
            // Removie the code from storage
            verificationCodeStore.removeCode(email);

            // Send confirmation email
            try {
                emailService.sendConfirmationEmail(email);
            } catch (RuntimeException e) {
                // Most likely caused by invalid email address
                return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
            }

            return ResponseEntity.ok("{\"message\": \"Verification successful. You can now register.\"}");
        } else {
            return ResponseEntity.status(400).body("{\"error\": \"Invalid verification code.\"}");
        }
    }

    // Customer forgot their password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        // Make sure email is provided
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email is required.\"}");
        }

        // Make sure that the email belongs to a customer
        boolean emailExists = customerService.emailExists(email);
        if (!emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No account associated with this email."));
        }

        try {
            Customer customer = customerService.getCustomerByEmail(email);

            // Generate a code
            String resetCode = VerificationUtil.generateVerificationCode();
            
            // Store the code temporarily
            PasswordResetCodeStore.storeCode(email, resetCode);
            
            // Send email with the reset code
            try {
                emailService.sendPasswordResetCode(email, resetCode);
            } catch (RuntimeException e) {
                // Most likely caused by an invalid email
                return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
            }

            return ResponseEntity.ok(Map.of(
                "message", "Verification code sent to " + email,
                "resetCode", resetCode
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
        }
    }

    // Reset password from verification code
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("code");
        String newPassword = requestBody.get("newPassword");

        // Make sure email, code, and new password are provided
        if (email == null || code == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email, code, and new password are required.\"}");
        }

        // Check that the code provided is correct for the email
        if (!PasswordResetCodeStore.verifyCode(email, code)) {
            return ResponseEntity.status(400).body("{\"error\": \"Invalid or expired code.\"}");
        }

        try {
            // Update the customer
            Customer customer = customerService.getCustomerByEmail(email);
            customer.setPasswordHash(EncryptionUtil.encrypt(newPassword)); // Encrypt the new password
            customerService.saveCustomer(customer); // Save the updated password

            // Stop storing temporary code
            PasswordResetCodeStore.removeCode(email); // Remove code after successful reset

            // Send confirmation email
            try {
                emailService.sendPasswordResetConfirmation(email);
            } catch (RuntimeException e) {
                // Most likely caused by an invalid email
                return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
            }

            return ResponseEntity.ok("{\"message\": \"Password has been successfully reset.\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Error resetting password.\"}");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Email and password are required."));
        }

        // Try logging in as Customer
        try {
            Customer customer = customerService.getCustomerByEmail(email);

            if (customer.getStatus() == Status.SUSPENDED) {
                return ResponseEntity.status(403).body(Map.of("error", "Your account is suspended."));
            }

            if (EncryptionUtil.verifyPassword(password, customer.getPasswordHash())) {
                if (customer.getStatus() == Status.INACTIVE) {
                    customer.setStatus(Status.ACTIVE);
                }

                customer.setLastLoggedIn(new Timestamp(System.currentTimeMillis()));
                customerService.saveCustomer(customer);

                return ResponseEntity.ok(Map.of(
                    "message", "Login successful.",
                    "role", customer.getRole().toString()
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials."));
            }
        } catch (RuntimeException e) {
            // This will happen if the email is not a customer, then it will try to login an admin instead.
        }

        // Try logging in as Admin
        try {
            Admin admin = adminService.getAdminByEmail(email);

            if (EncryptionUtil.verifyPassword(password, admin.getPasswordHash())) {
                admin.setLastLoggedIn(new Timestamp(System.currentTimeMillis()));
                adminService.saveAdmin(admin);

                return ResponseEntity.ok(Map.of(
                    "message", "Login successful.",
                    "role", admin.getRole().toString()
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials."));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Email not found."));
        }
    }

    // Customer logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        // Make sure email is provided
        if (email == null) {
            return ResponseEntity.status(400).body("{\"error\": \"Email is required.\"}");
        }

        try {
            Customer customer = customerService.getCustomerByEmail(email);

            // Set lastLoggedOut
            customer.setLastLoggedOut(new Timestamp(System.currentTimeMillis()));
            customerService.saveCustomer(customer);

            return ResponseEntity.ok("{\"message\": \"Logout successful.\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("{\"error\": \"Customer not found.\"}");
        }
    }

    // Change customer password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String oldPassword = requestBody.get("oldPassword");
        String newPassword = requestBody.get("newPassword");

        // Make sure email, old password, and new password provided
        if (email == null || oldPassword == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email, old password, and new password are required.\"}");
        }

        // Send confirmation email
        try {
            customerService.changePassword(email, oldPassword, newPassword);
            return ResponseEntity.ok("{\"message\": \"Password changed successfully.\"}");
        } catch (RuntimeException e) {
            // Most likely caused by invalid email
            return ResponseEntity.status(400).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

}
