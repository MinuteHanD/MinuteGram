package com.fuckgram.controller;

import com.fuckgram.entity.Post;
import com.fuckgram.entity.User;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;


    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @AuthenticationPrincipal UserDetails userDetails) {
        Post savedPost = postService.createPost(post, userDetails.getUsername());
        return ResponseEntity.ok(savedPost);
    }


    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }
}