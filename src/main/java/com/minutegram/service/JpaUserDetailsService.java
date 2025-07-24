package com.minutegram.service;

import com.minutegram.dto.SecurityUser;
import com.minutegram.entity.User;
import com.minutegram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true) // Important for performance and correctness
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Find the user entity in the database.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 2. Convert the entity's roles to Spring Security's GrantedAuthority objects.
        //    The "ROLE_" prefix is CRITICAL. Your hasRole("ADMIN") checks in SecurityConfig
        //    implicitly look for "ROLE_ADMIN". This is what connects them.
        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());

        // 3. Wrap the data in our lightweight, detached SecurityUser object.
        //    This is the object that AuthenticationManager will work with.
        return new SecurityUser(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}