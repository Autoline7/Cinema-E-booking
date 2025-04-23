package com.example.movieapp.util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class VerificationCodeStore {

    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    // Store a code
    public void storeCode(String email, String code) {
        verificationCodes.put(email, code);
    }

    // Verify code
    public boolean verifyCode(String email, String code) {
        return verificationCodes.containsKey(email) && verificationCodes.get(email).equals(code);
    }

    // Remove code from storage
    public void removeCode(String email) {
        verificationCodes.remove(email);
    }
}