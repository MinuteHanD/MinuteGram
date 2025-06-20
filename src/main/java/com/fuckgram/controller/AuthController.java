package com.fuckgram.controller;

import com.fuckgram.dto.JwtService;
import com.fuckgram.dto.LoginRequest;
import com.fuckgram.entity.Role;
import com.fuckgram.entity.User;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.TokenManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenManagementService tokenManagementService;

    @Autowired
    private JwtService jwtService;

    // CRITICAL: Inject the AuthenticationManager. This is the standard Spring Security way.
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER);

        // Assign ADMIN role to the first registered user.
        if (userRepository.count() == 0) {
            roles.add(Role.ADMIN);
        }

        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Delegate authentication to Spring Security's AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // If authentication is successful, Spring provides a fully populated Authentication object.
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // Generate a token that INCLUDES the user's roles.
        String token = jwtService.generateToken(username, authorities);

        // Correctly save the token to enable our logout blacklist logic.
        tokenManagementService.saveUserToken(username, token);
        
        // Fetch the user for the response payload. This is OKAY to do here, as it only happens once on login.
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found after successful authentication. This should not happen."));


        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail(),
                "name", user.getName(), // Send back useful info
                "roles", authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList())
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenManagementService.invalidateToken(token);
        }
        return ResponseEntity.ok("Logged out successfully");
    }
}