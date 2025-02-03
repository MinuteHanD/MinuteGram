package com.fuckgram.service;

import com.fuckgram.entity.User;
import com.fuckgram.entity.Role;
import com.fuckgram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (user.getRoles().contains(Role.ADMIN)) {
            throw new RuntimeException("Cannot ban admin user");
        }

        user.setBanned(true);
        return userRepository.save(user);
    }

    @Transactional
    public User unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBanned(false);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoles().contains(Role.ADMIN)) {
            throw new RuntimeException("Cannot modify admin user's role");
        }

        Set<Role> roles = user.getRoles();
        roles.clear();
        roles.add(newRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }
}