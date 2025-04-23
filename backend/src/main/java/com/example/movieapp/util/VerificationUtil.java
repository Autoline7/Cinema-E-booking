package com.example.movieapp.util;

import java.util.Random;

public class VerificationUtil {
    // Generate a new verification code
    public static String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}