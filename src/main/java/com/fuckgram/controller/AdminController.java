package com.fuckgram.controller;

import com.fuckgram.dto.CommentResponseDto;
import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.dto.TopicDto;
import com.fuckgram.entity.Comment;
import com.fuckgram.entity.Role;
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
        // Use the new, efficient projection query. No more .map()
        Page<PostResponseDto> dtoPage = postRepository.findProjectedByTitleContainingIgnoreCase(search, pageable);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/comments")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Page<CommentResponseDto>> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page, size);
        // NOTE: This will be your next bottleneck. You should create a projection for comments too.
        // For now, we leave it, as it wasn't the original complaint.
        Page<Comment> commentsPage = commentRepository.findByContentContainingIgnoreCase(search, pageable);
        return ResponseEntity.ok(commentsPage.map(CommentResponseDto::fromEntity));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page, size);
        // DANGER: Returning the full User entity is a security risk. You should create a UserAdminDto
        // and a projection query for this as well to avoid exposing password hashes etc.
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
        Page<TopicDto> dtoPage;
        if (search.isEmpty()) {
            // Use the projection query for all topics
            dtoPage = topicRepository.findAllProjected(pageable);
        } else {
            // Use the new projection query for searching
            dtoPage = topicRepository.findProjectedByNameContainingIgnoreCase(search, pageable);
        }
        // The evil .map() call is gone forever.
        return ResponseEntity.ok(dtoPage);
    }

    // --- All other endpoints below are single-action or stat lookups ---
    // They are not causing your page-load performance issues. They remain unchanged.
    
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

    // ... (rest of your unchanged methods: /posts/over-time, /users/roles-distribution, etc.)
    // These methods can also be optimized later, but they are not the critical path.
    @GetMapping("/posts/over-time")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getPostsOverTime() {
        // This logic is complex and can be optimized later with a dedicated DTO and custom query
        // but it is not a simple N+1 issue on a paginated list.
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
        // This is inefficient (fetches all users) but is not a page-load bottleneck.
        List<User> users = userRepository.findAll();
        Map<Role, Long> distribution = users.stream()
                .flatMap(user -> user.getRoles().stream())
                .collect(Collectors.groupingBy(role -> role, Collectors.counting()));
        return ResponseEntity.ok(distribution);
    }

    @PostMapping("/users/{userId}/ban")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> banUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.banUser(userId));
    }

    @PostMapping("/users/{userId}/unban")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> unbanUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.unbanUser(userId));
    }

    @PostMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestParam Role newRole) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, newRole));
    }

    @DeleteMapping("/posts/{postId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        adminService.deletePost(postId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        adminService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/topics/{topicId}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<?> deleteTopic(@PathVariable Long topicId) {
        topicRepository.deleteById(topicId);
        return ResponseEntity.ok().build();
    }
}