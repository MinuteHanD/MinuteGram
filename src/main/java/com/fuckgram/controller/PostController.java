package com.fuckgram.controller;

import com.fuckgram.dto.PostCreateDto;
import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.User;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.PostService;
import com.fuckgram.service.StorageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private PostRepository postRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> createPost(
            @RequestPart("post") String postJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        PostCreateDto postDto = objectMapper.readValue(postJson, PostCreateDto.class);

        String imageUrl = null;
        String mediaType = null;
        if (image != null && !image.isEmpty()) {
            Map<String, String> uploadResult = storageService.store(image);
            imageUrl = uploadResult.get("url");
            mediaType = uploadResult.get("mediaType");
        }

        PostResponseDto responseDto = postService.createPost(postDto, imageUrl);
        if (mediaType != null) {
            Post post = postService.getPostById(responseDto.getId());
            post.setMediaType(mediaType);
            postRepository.save(post);
            responseDto.setMediaType(mediaType);
        }

        return ResponseEntity.ok(responseDto);
    }




    @GetMapping
    public List<PostResponseDto> getAllPosts() {
        return postService.getAllPosts().stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long postId) {
        Post post = postService.getPostById(postId);
        return ResponseEntity.ok(PostResponseDto.fromEntity(post));
    }

}