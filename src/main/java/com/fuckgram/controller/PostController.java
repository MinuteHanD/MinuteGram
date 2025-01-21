package com.fuckgram.controller;

import com.fuckgram.dto.PostCreateDto;
import com.fuckgram.dto.PostResponseDto;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;


    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@RequestBody PostCreateDto postDto, @AuthenticationPrincipal UserDetails userDetails) {
        Post savedPost = postService.createPost(postDto, postDto.getTopicName());
        return ResponseEntity.ok(PostResponseDto.fromEntity(savedPost));
    }


    @GetMapping
    public List<PostResponseDto> getAllPosts() {
        return postService.getAllPosts().stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}