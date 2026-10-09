package com.piyush.cms.security;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 15;

    private static class AttemptInfo {
        int attempts;
        LocalDateTime lockedUntil;

        AttemptInfo(int attempts) {
            this.attempts = attempts;
            this.lockedUntil = null;
        }
    }

    private final Map<String, AttemptInfo> attemptsCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
    }

    public void loginFailed(String key) {
        AttemptInfo info = attemptsCache.getOrDefault(key, new AttemptInfo(0));
        info.attempts++;
        if (info.attempts >= MAX_ATTEMPTS) {
            info.lockedUntil = LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES);
        }
        attemptsCache.put(key, info);
    }

    public boolean isBlocked(String key) {
        AttemptInfo info = attemptsCache.get(key);
        if (info == null) {
            return false;
        }
        if (info.lockedUntil != null) {
            if (LocalDateTime.now().isBefore(info.lockedUntil)) {
                return true;
            } else {
                // Lock expired
                attemptsCache.remove(key);
                return false;
            }
        }
        return false;
    }

    public int getRemainingAttempts(String key) {
        AttemptInfo info = attemptsCache.get(key);
        if (info == null) return MAX_ATTEMPTS;
        return Math.max(0, MAX_ATTEMPTS - info.attempts);
    }
}
