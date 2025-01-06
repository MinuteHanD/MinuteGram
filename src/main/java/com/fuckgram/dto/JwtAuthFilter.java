package com.fuckgram.dto;

import com.fuckgram.entity.User;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.TokenManagementService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenManagementService tokenManagementService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (tokenManagementService.isTokenBlacklisted(token)){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            try {
                String email = jwtService.validateTokenAndGetEmail(token);
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found: " + email));

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user, null, user.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(auth);


                System.out.println("Successfully authenticated user: " + email);

            } catch (Exception e) {
                SecurityContextHolder.getContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;

            }
        }

        filterChain.doFilter(request, response);
    }
}
