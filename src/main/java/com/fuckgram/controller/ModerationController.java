package com.fuckgram.controller;

import com.fuckgram.repository.CommentRepository;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import com.fuckgram.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moderation")
public class ModerationController {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private AdminService adminService;

    @DeleteMapping("/posts/{postId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        postRepository.deleteById(postId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        commentRepository.deleteById(commentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/ban")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> banUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.banUser(userId));
    }

    @DeleteMapping("/topics/{topicId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deleteTopic(@PathVariable Long topicId) {
        topicRepository.deleteById(topicId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/unban")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> unbanUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.unbanUser(userId));
    }
}