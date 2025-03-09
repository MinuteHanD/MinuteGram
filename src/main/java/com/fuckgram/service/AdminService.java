package com.fuckgram.service;

import com.fuckgram.entity.User;
import com.fuckgram.entity.Role;
import com.fuckgram.repository.CommentRepository;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import com.fuckgram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Cacheable(value = "adminStats", key = "'stats'")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", postRepository.count());
        stats.put("totalComments", commentRepository.count());
        stats.put("totalTopics", topicRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByBannedFalse());
        stats.put("bannedUsers", userRepository.countByBannedTrue());
        return stats;
    }

    @Transactional
    @CacheEvict(value = "adminStats", key = "'stats'")
    public User banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoles().contains(Role.ADMIN)) {
            throw new RuntimeException("Cannot ban admin user");
        }

        user.setBanned(true);
        return userRepository.save(user);
    }

    @Transactional
    @CacheEvict(value = "adminStats", key = "'stats'")
    public User unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBanned(false);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoles().contains(Role.ADMIN)) {
            throw new RuntimeException("Cannot modify admin user's role");
        }

        Set<Role> roles = user.getRoles();
        roles.clear();
        roles.add(newRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Transactional
    @CacheEvict(value = "adminStats", key = "'stats'")
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new RuntimeException("Comment not found");
        }
        commentRepository.deleteById(commentId);
    }

    @Transactional
    @CacheEvict(value = "adminStats", key = "'stats'")
    public void deletePost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        postRepository.deleteById(postId);
    }

    @Transactional
    @CacheEvict(value = "adminStats", key = "'stats'")
    public void deleteTopic(Long topicId) {
        if (!topicRepository.existsById(topicId)) {
            throw new RuntimeException("Topic not found");
        }
        topicRepository.deleteById(topicId);
    }
}