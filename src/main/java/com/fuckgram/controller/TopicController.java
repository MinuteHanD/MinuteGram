package com.fuckgram.controller;

import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.dto.TopicCreateDto;
import com.fuckgram.dto.TopicDto;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import com.fuckgram.service.TopicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    // This is fine, but we need to create the DTO manually now since from() is gone.
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TopicDto> createTopic(@Valid @RequestBody TopicCreateDto topicDto) {
        Topic topic = topicService.createTopic(topicDto);
        // Manually create the DTO for the response. This is acceptable for a single creation event.
        TopicDto responseDto = new TopicDto(
            topic.getId(),
            topic.getName(),
            topic.getDescription(),
            topic.getCreatedAt(),
            topic.getCreator().getId(),
            topic.getCreator().getName(),
            0 // A new topic has 0 posts.
        );
        return ResponseEntity.ok(responseDto);
    }

    // --- ENDPOINT REWRITTEN FOR PERFORMANCE ---
    // This is now incredibly simple. It takes the DTO page from the service and returns it.
    // The evil .map() call is gone forever.
    @GetMapping
    public ResponseEntity<Page<TopicDto>> getAllTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TopicDto> topicsPage = topicService.getAllTopics(pageable);
        return ResponseEntity.ok(topicsPage);
    }

    // I am fixing this one proactively before you complain about it being slow too.
    @GetMapping("/{id}/posts")
    public ResponseEntity<Page<PostResponseDto>> getTopicPosts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponseDto> posts = topicService.getTopicPosts(id, pageable);
        return ResponseEntity.ok(posts);
    }
    
    // --- ENDPOINT REWRITTEN FOR PERFORMANCE ---
    // This also needs to be optimized to prevent an N+1 when fetching a single topic.
    @GetMapping("/{id}")
    public ResponseEntity<TopicDto> getTopicById(@PathVariable Long id) {
        TopicDto topicDto = topicService.getTopicDtoById(id);
        return ResponseEntity.ok(topicDto);
    }
}