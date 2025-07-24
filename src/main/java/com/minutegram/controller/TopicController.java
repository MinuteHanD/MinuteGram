package com.minutegram.controller;

import com.minutegram.dto.PostResponseDto;
import com.minutegram.dto.TopicCreateDto;
import com.minutegram.dto.TopicDto;
import com.minutegram.dto.TopicWithPostsDto;
import com.minutegram.entity.Topic;
import com.minutegram.service.TopicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TopicDto> createTopic(@Valid @RequestBody TopicCreateDto topicDto) {
        Topic topic = topicService.createTopic(topicDto);
        TopicDto responseDto = new TopicDto(
            topic.getId(),
            topic.getName(),
            topic.getDescription(),
            topic.getCreatedAt(),
            topic.getCreator().getId(),
            topic.getCreator().getName(),
            0
        );
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    public ResponseEntity<Page<TopicDto>> getAllTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TopicDto> topicsPage = topicService.getAllTopics(pageable);
        return ResponseEntity.ok(topicsPage);
    }

    
    @GetMapping("/{id}/details")
    public ResponseEntity<TopicWithPostsDto> getTopicWithPosts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        String[] sortParams = sort.split(",");
        Sort sortOrder = Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);
        TopicWithPostsDto data = topicService.getTopicWithPosts(id, pageable);
        return ResponseEntity.ok(data);
    }

    
    @GetMapping("/{id}/posts")
    public ResponseEntity<Page<PostResponseDto>> getTopicPosts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponseDto> posts = topicService.getTopicPosts(id, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TopicDto> getTopicById(@PathVariable Long id) {
        TopicDto topicDto = topicService.getTopicDtoById(id);
        return ResponseEntity.ok(topicDto);
    }
}
