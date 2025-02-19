package com.fuckgram.dto;

import com.fuckgram.entity.Post;

import java.time.LocalDateTime;

public class PostResponseDto {
    private Long id;
    private String content;
    private String title;
    private String authorName;
    private String topicName;
    private String imageUrl;
    private LocalDateTime createdAt;


    public static PostResponseDto fromEntity(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setTitle(post.getTitle());
        dto.setAuthorName(post.getUser().getName());
        dto.setTopicName(post.getTopic().getName());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        return dto;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
