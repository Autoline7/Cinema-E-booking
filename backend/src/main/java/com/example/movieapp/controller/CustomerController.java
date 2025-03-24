package com.example.movieapp.controller;

import com.example.movieapp.model.Customer;
import com.example.movieapp.model.Status;
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

     @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        try {
            Customer customer = customerService.getCustomerByEmail(email);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable int id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable int id, @RequestBody Customer updatedCustomer) {
        try {
            Customer customer = customerService.updateCustomer(id, updatedCustomer);
            return ResponseEntity.ok().body("{\"message\": \"Customer updated successfully\", \"customer\": " + customer + "}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomerById(@PathVariable int id) {
        try {
            customerService.deleteCustomerById(id);
            return ResponseEntity.ok().body("{\"message\": \"Customer with ID " + id + " deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/email/{email}")
    public ResponseEntity<?> deleteCustomerByEmail(@PathVariable String email) {
        try {
            customerService.deleteCustomerByEmail(email);
            return ResponseEntity.ok().body("{\"message\": \"Customer with email " + email + " deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        // 🔹 Check if the email is already registered as a Customer or Admin
        boolean emailExists = customerService.emailExists(email) || adminService.emailExists(email);
        if (emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email is already in use. Please log in or reset your password."));
        }

        String code = VerificationUtil.generateVerificationCode();
        verificationCodeStore.storeCode(email, code);

        try {
            emailService.sendVerificationEmail(email, code);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "Verification code sent to " + email,
            "verificationCode", code  // Include the code in the response
        ));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("code");

        if (email == null || code == null) {
            return ResponseEntity.status(400).body("{\"error\": \"Email and verification code are required.\"}");
        }

        if (verificationCodeStore.verifyCode(email, code)) {
            verificationCodeStore.removeCode(email);

            try {
                emailService.sendConfirmationEmail(email);
            } catch (RuntimeException e) {
                return ResponseEntity.status(400).body("{\"error\": \"Unable to send email. Check that email address is correct.\"}");
            }

            return ResponseEntity.ok("{\"message\": \"Verification successful. You can now register.\"}");
        } else {
            return ResponseEntity.status(400).body("{\"error\": \"Invalid verification code.\"}");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email is required.\"}");
        }

        // 🔹 Make sure the account exists
        boolean emailExists = customerService.emailExists(email);
        if (!emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No account associated with this email."));
        }

        try {
            Customer customer = customerService.getCustomerByEmail(email);

            // Generate a 6-digit code
            String resetCode = VerificationUtil.generateVerificationCode();
            
            // Store the code temporarily
            PasswordResetCodeStore.storeCode(email, resetCode);
            
            // Send email with the reset code
            try {
                emailService.sendPasswordResetCode(email, resetCode);
            } catch (RuntimeException e) {
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

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("code");
        String newPassword = requestBody.get("newPassword");

        if (email == null || code == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email, code, and new password are required.\"}");
        }

        if (!PasswordResetCodeStore.verifyCode(email, code)) {
            return ResponseEntity.status(400).body("{\"error\": \"Invalid or expired code.\"}");
        }

        try {
            Customer customer = customerService.getCustomerByEmail(email);
            customer.setPasswordHash(EncryptionUtil.encrypt(newPassword)); // Encrypt the new password
            customerService.saveCustomer(customer); // Save the updated password

            PasswordResetCodeStore.removeCode(email); // Remove code after successful reset

            try {
                emailService.sendPasswordResetConfirmation(email);
            } catch (RuntimeException e) {
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
            return ResponseEntity.status(400).body("{\"error\": \"Email and password are required.\"}");
        }

        try {
            Customer customer = customerService.getCustomerByEmail(email);

            // 🔹 Deny login if status is SUSPENDED
            if (customer.getStatus() == Status.SUSPENDED) {
                return ResponseEntity.status(403).body("{\"error\": \"Your account is suspended.\"}");
            }

            // 🔹 Compare entered password with stored password hash
            if (EncryptionUtil.verifyPassword(password, customer.getPasswordHash())) {

                // 🔹 If the status is INACTIVE, update it to ACTIVE
                if (customer.getStatus() == Status.INACTIVE) {
                    customer.setStatus(Status.ACTIVE);
                }

                // 🔹 Update lastLoggedIn timestamp
                customer.setLastLoggedIn(new Timestamp(System.currentTimeMillis()));
                
                // ✅ Save the customer directly to ensure changes persist
                customerService.saveCustomer(customer);

                return ResponseEntity.ok("{\"message\": \"Login successful.\"}");
            } else {
                return ResponseEntity.status(401).body("{\"error\": \"Invalid credentials.\"}");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("{\"error\": \"Email not found.\"}");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");

        if (email == null) {
            return ResponseEntity.status(400).body("{\"error\": \"Email is required.\"}");
        }

        try {
            Customer customer = customerService.getCustomerByEmail(email);

            // 🔹 Set lastLoggedOut timestamp to now
            customer.setLastLoggedOut(new Timestamp(System.currentTimeMillis()));

            // 🔹 Save the update
            customerService.saveCustomer(customer);

            return ResponseEntity.ok("{\"message\": \"Logout successful.\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("{\"error\": \"Customer not found.\"}");
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
            customerService.changePassword(email, oldPassword, newPassword);
            return ResponseEntity.ok("{\"message\": \"Password changed successfully.\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

}
