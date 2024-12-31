package com.fuckgram.controller;

import com.fuckgram.entity.Post;
import com.fuckgram.entity.User;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}