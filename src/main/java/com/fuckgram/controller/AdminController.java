package com.fuckgram.controller;

import com.fuckgram.dto.CommentResponseDto;
import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.dto.TopicDto;
import com.fuckgram.entity.Comment;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Role;
import com.fuckgram.entity.Topic;
import com.fuckgram.entity.User;
import com.fuckgram.repository.CommentRepository;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private AdminService adminService;



    @GetMapping("/posts")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Page<PostResponseDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postsPage = postRepository.findByTitleContainingIgnoreCase(search, pageable);
        Page<PostResponseDto> dtoPage = postsPage.map(PostResponseDto::fromEntity);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/comments")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Page<CommentResponseDto>> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentsPage = commentRepository.findByContentContainingIgnoreCase(search, pageable);
        Page<CommentResponseDto> dtoPage = commentsPage.map(CommentResponseDto::fromEntity);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        return ResponseEntity.ok(usersPage);
    }

    @GetMapping("/topics")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Page<TopicDto>> getAllTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Topic> topicsPage;
        if (search.isEmpty()) {
            topicsPage = topicRepository.findAll(pageable);
        } else {
            topicsPage = topicRepository.findByNameContainingIgnoreCase(search, pageable);
        }
        Page<TopicDto> dtoPage = topicsPage.map(TopicDto::from);
        return ResponseEntity.ok(dtoPage);
    }



    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalPosts", postRepository.count());
        stats.put("totalComments", commentRepository.count());
        stats.put("totalTopics", topicRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByBannedFalse());
        stats.put("bannedUsers", userRepository.countByBannedTrue());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/posts/over-time")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getPostsOverTime() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        List<Object[]> postCounts = postRepository.countPostsByDate(startDate);
        List<Object[]> commentCounts = commentRepository.countCommentsByDate(startDate);

        Map<String, Map<String, Long>> dataMap = new HashMap<>();
        for (Object[] row : postCounts) {
            String date = ((Date) row[0]).toString();
            long count = ((Number) row[1]).longValue();
            dataMap.computeIfAbsent(date, k -> new HashMap<>()).put("postCount", count);
        }
        for (Object[] row : commentCounts) {
            String date = ((Date) row[0]).toString();
            long count = ((Number) row[1]).longValue();
            dataMap.computeIfAbsent(date, k -> new HashMap<>()).put("commentCount", count);
        }

        LocalDateTime currentDate = startDate;
        while (currentDate.isBefore(LocalDateTime.now())) {
            String dateStr = currentDate.toLocalDate().toString();
            dataMap.computeIfAbsent(dateStr, k -> new HashMap<>()).putIfAbsent("postCount", 0L);
            dataMap.computeIfAbsent(dateStr, k -> new HashMap<>()).putIfAbsent("commentCount", 0L);
            currentDate = currentDate.plusDays(1);
        }

        List<Map<String, Object>> data = dataMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", entry.getKey());
                    map.put("postCount", entry.getValue().getOrDefault("postCount", 0L));
                    map.put("commentCount", entry.getValue().getOrDefault("commentCount", 0L));
                    return map;
                })
                .sorted(Comparator.comparing(m -> m.get("date").toString()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(data);
    }

    @GetMapping("/users/roles-distribution")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Map<Role, Long>> getUserRolesDistribution() {
        List<User> users = userRepository.findAll();
        Map<Role, Long> distribution = users.stream()
                .flatMap(user -> user.getRoles().stream())
                .collect(Collectors.groupingBy(role -> role, Collectors.counting()));
        return ResponseEntity.ok(distribution);
    }

    @PostMapping("/users/{userId}/ban")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> banUser(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(adminService.banUser(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/{userId}/unban")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> unbanUser(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(adminService.unbanUser(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role newRole
    ) {
        User updatedUser = adminService.updateUserRole(userId, newRole);
        return ResponseEntity.ok(updatedUser);
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

    @DeleteMapping("/topics/{topicId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deleteTopic(@PathVariable Long topicId) {
        topicRepository.deleteById(topicId);
        return ResponseEntity.ok().build();
    }
}