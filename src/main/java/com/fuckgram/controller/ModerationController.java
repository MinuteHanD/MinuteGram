package com.fuckgram.controller;

import com.fuckgram.dto.CommentResponseDto;
import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.repository.CommentRepository;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.AdminService;
import com.fuckgram.service.CommentService;
import com.fuckgram.service.ModeratorService;
import com.fuckgram.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/moderation")
public class ModerationController {

    @Autowired
    private ModeratorService moderatorService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentService commentService;

    @Autowired
    private PostService postService;

    @DeleteMapping("/posts/{postId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            moderatorService.deletePost(postId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            moderatorService.deleteComment(commentId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/{userId}/ban")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> banUser(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(moderatorService.banUser(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
        try {
            return ResponseEntity.ok(moderatorService.unbanUser(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/comments")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<List<CommentResponseDto>> getAllComments() {
        try {
            List<CommentResponseDto> comments = commentService.getAllComments();
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @GetMapping("/posts")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        try {
            List<PostResponseDto> posts = postService.getAllPosts().stream()
                    .map(PostResponseDto::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}