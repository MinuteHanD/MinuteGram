package com.fuckgram.controller;

import com.fuckgram.dto.PostDto;
import com.fuckgram.dto.PostResponseDto;
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

    @GetMapping
    public Page<Topic> getAllTopics(Pageable pageable) {
        return topicService.getAllTopics(pageable);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TopicDto> createTopic(@Valid @RequestBody TopicCreateDto topicDto) {
        Topic topic = topicService.createTopic(topicDto);
        return ResponseEntity.ok(TopicDto.from(topic));
    }



    @GetMapping("/{id}/posts")
    public ResponseEntity<Page<PostResponseDto>> getTopicPosts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Topic topic = topicService.getTopicById(id);
        Page<Post> posts = topicService.getTopicPosts(topic.getName(), pageable);
        return ResponseEntity.ok(posts.map(PostResponseDto::fromEntity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TopicDto> getTopicById(@PathVariable Long id) {
        Topic topic = topicService.getTopicById(id);
        return ResponseEntity.ok(TopicDto.from(topic));
    }

}
