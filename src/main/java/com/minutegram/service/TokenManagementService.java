package com.minutegram.service;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenManagementService {
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();
    private final ConcurrentHashMap<String, String> userTokenMap = new ConcurrentHashMap<>();

    public void saveUserToken(String email, String token){
        String existingToken = userTokenMap.get(email);
        if (existingToken != null){
            blacklistedTokens.add(existingToken);
        }
        userTokenMap.put(email, token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    public void invalidateToken(String token) {
        blacklistedTokens.add(token);
        userTokenMap.values().remove(token);
    }

    public void invalidateUserTokens(String email) {
        String token = userTokenMap.remove(email);
        if (token != null) {
            blacklistedTokens.add(token);
        }
    }
}
