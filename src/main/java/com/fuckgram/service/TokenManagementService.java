package com.fuckgram.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenManagementService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    private final String BLACKLIST_KEY = "blacklisted_tokens";
    private final String USER_TOKEN_KEY = "user_tokens";

    public void saveUserToken(String email, String token) {
        String existingToken = (String) redisTemplate.opsForHash().get(USER_TOKEN_KEY, email);
        if (existingToken != null) {
            redisTemplate.opsForSet().add(BLACKLIST_KEY, existingToken);
        }
        redisTemplate.opsForHash().put(USER_TOKEN_KEY, email, token);
    }

    public boolean isTokenBlacklisted(String token) {
        Boolean isMember = redisTemplate.opsForSet().isMember(BLACKLIST_KEY, token);
        return isMember != null && isMember;
    }

    public void invalidateToken(String token) {
        redisTemplate.opsForSet().add(BLACKLIST_KEY, token);
        redisTemplate.opsForHash().entries(USER_TOKEN_KEY).forEach((email, userToken) -> {
            if (userToken.equals(token)) {
                redisTemplate.opsForHash().delete(USER_TOKEN_KEY, email);
            }
        });
    }

    public void invalidateUserTokens(String email) {
        String token = (String) redisTemplate.opsForHash().get(USER_TOKEN_KEY, email);
        if (token != null) {
            redisTemplate.opsForSet().add(BLACKLIST_KEY, token);
            redisTemplate.opsForHash().delete(USER_TOKEN_KEY, email);
        }
    }
}
