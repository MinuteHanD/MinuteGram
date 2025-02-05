package com.fuckgram.controller;

import com.fuckgram.dto.CommentResponseDto;
import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.dto.TopicDto;
import com.fuckgram.entity.Role;
import com.fuckgram.entity.Topic;
import com.fuckgram.entity.User;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.AdminService;
import com.fuckgram.service.CommentService;
import com.fuckgram.service.PostService;
import com.fuckgram.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopicService topicService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private AdminService adminService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private PostService postService;

    @Autowired
    private TopicRepository topicRepository;

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
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            adminService.deletePost(postId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            adminService.deleteComment(commentId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(){
        return ResponseEntity.ok(userRepository.findAll());
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

    @GetMapping("/topics")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Page<TopicDto>> getAllTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Topic> topics = topicService.getAllTopics(pageable);
        return ResponseEntity.ok(topics.map(TopicDto::from));
    }

    @DeleteMapping("/topics/{topicId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deleteTopic(@PathVariable Long topicId) {
        topicRepository.deleteById(topicId);
        return ResponseEntity.ok().build();
    }
}