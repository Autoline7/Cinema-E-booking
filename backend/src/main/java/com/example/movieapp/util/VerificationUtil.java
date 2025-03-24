package com.example.movieapp.util;

import java.util.Random;

public class VerificationUtil {
    public static String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}