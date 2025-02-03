package com.fuckgram.controller;

import com.fuckgram.entity.Role;
import com.fuckgram.entity.User;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private AdminService adminService;

    @PostMapping("/users/{userId}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long userId) {
        User bannedUser = adminService.banUser(userId);
        return ResponseEntity.ok(bannedUser);
    }

    @PostMapping("/users/{userId}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long userId) {
        User unbannedUser = adminService.unbanUser(userId);
        return ResponseEntity.ok(unbannedUser);
    }

    @PostMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role newRole
    ) {
        User updatedUser = adminService.updateUserRole(userId, newRole);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId){
        postRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId){
        postRepository.deleteById(postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(){
        return ResponseEntity.ok(userRepository.findAll());
    }
}