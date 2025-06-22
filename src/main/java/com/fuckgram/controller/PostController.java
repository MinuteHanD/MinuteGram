package com.fuckgram.controller;

import com.fuckgram.dto.PostCreateDto;
import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.dto.PostWithCommentsDto;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.User;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.UserRepository;
import com.fuckgram.service.PostService;
import com.fuckgram.service.StorageService;
import com.fuckgram.service.UserService;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fuckgram.dto.SecurityUser;

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

    @Autowired
    private UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> createPost(
            @RequestPart("post") String postJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal SecurityUser userDetails) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        PostCreateDto postDto = objectMapper.readValue(postJson, PostCreateDto.class);

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            Map<String, String> uploadResult = storageService.store(image);
            imageUrl = uploadResult.get("url");
            // mediaType is set in the service now
        }
        
        PostResponseDto responseDto = postService.createPost(postDto, imageUrl);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/{postId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> likePost(@PathVariable Long postId, @AuthenticationPrincipal SecurityUser userDetails) {
        User currentUser = userService.getCurrentUser();
        try {
            postService.likePost(postId, currentUser.getId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{postId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unlikePost(@PathVariable Long postId, @AuthenticationPrincipal SecurityUser userDetails) {
        User currentUser = userService.getCurrentUser();
        try {
            postService.unlikePost(postId, currentUser.getId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<PostResponseDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        Page<PostResponseDto> postsPage = postService.getAllPosts(pageable);
        return ResponseEntity.ok(postsPage);
    }

    /**
     * REWRITTEN FOR PERFORMANCE
     * This single endpoint now returns the post and all its comments.
     * Your frontend should call this instead of calling two separate endpoints.
     */
    @GetMapping("/{postId}")
    public ResponseEntity<PostWithCommentsDto> getPostById(@PathVariable Long postId) {
        PostWithCommentsDto data = postService.getPostWithComments(postId);
        return ResponseEntity.ok(data);
    }

}
