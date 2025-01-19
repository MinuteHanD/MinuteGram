package com.fuckgram.controller;

import com.fuckgram.dto.PostDto;
import com.fuckgram.dto.TopicCreateDto;
import com.fuckgram.dto.TopicDto;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import com.fuckgram.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TopicDto> createTopic(@Valid @RequestBody TopicCreateDto topicDto) {
        Topic topic = topicService.createTopic(topicDto);
        return ResponseEntity.ok(TopicDto.from(topic));
    }

    @GetMapping
    public ResponseEntity<Page<TopicDto>> getAllTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Topic> topics = topicService.getAllTopics(pageable);
        return ResponseEntity.ok(topics.map(TopicDto::from));
    }

    @GetMapping("/{name}/posts")
    public ResponseEntity<Page<PostDto>> getTopicPosts(
            @PathVariable String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = topicService.getTopicPosts(name, pageable);
        return ResponseEntity.ok(posts.map(PostDto::from));
    }
}
