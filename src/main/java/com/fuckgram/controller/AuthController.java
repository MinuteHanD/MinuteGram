package com.fuckgram.controller;



import com.fuckgram.dto.JwtService;
import com.fuckgram.dto.LoginRequest;
import com.fuckgram.dto.LoginResponse;
import com.fuckgram.entity.User;
import com.fuckgram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        System.out.println("Signup attempt for: " + user.getEmail());  // Debug log
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER"));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok("User registered: " + user.getEmail());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }



        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail()
        ));
    }

    @GetMapping("/test")
    public String test() {
        return "Auth endpoint working";
    }
}
