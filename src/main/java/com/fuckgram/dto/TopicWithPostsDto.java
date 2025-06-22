package com.fuckgram.dto;

import org.springframework.data.domain.Page;

/**
 * A DTO to bundle a Topic with a paginated list of its Posts.
 * This is for the optimized TopicPage endpoint.
 */
public class TopicWithPostsDto {

    private TopicDto topic;
    private Page<PostResponseDto> posts;

    public TopicWithPostsDto(TopicDto topic, Page<PostResponseDto> posts) {
        this.topic = topic;
        this.posts = posts;
    }

    // Getters and Setters
    public TopicDto getTopic() {
        return topic;
    }

    public void setTopic(TopicDto topic) {
        this.topic = topic;
    }

    public Page<PostResponseDto> getPosts() {
        return posts;
    }

    public void setPosts(Page<PostResponseDto> posts) {
        this.posts = posts;
    }
}
