package com.example.movieapp.util;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.Map;

public class PasswordResetCodeStore {
    private static final Map<String, String> codeStorage = new ConcurrentHashMap<>();
    private static final Map<String, Long> expirationStorage = new ConcurrentHashMap<>();
    private static final long EXPIRATION_TIME_MS = TimeUnit.MINUTES.toMillis(10); // 10-minute expiration

    public static void storeCode(String email, String code) {
        codeStorage.put(email, code);
        expirationStorage.put(email, System.currentTimeMillis() + EXPIRATION_TIME_MS);
    }

    public static boolean verifyCode(String email, String code) {
        Long expirationTime = expirationStorage.get(email);
        if (expirationTime == null || expirationTime < System.currentTimeMillis()) {
            return false; // Code expired or invalid
        }
        return code.equals(codeStorage.get(email));
    }

    public static void removeCode(String email) {
        codeStorage.remove(email);
        expirationStorage.remove(email);
    }
}