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
    private String mediaType;
    private LocalDateTime createdAt;
    private int likesCount;
    private int commentsCount;


    public static PostResponseDto fromEntity(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setTitle(post.getTitle());
        dto.setAuthorName(post.getUser().getName());
        dto.setTopicName(post.getTopic().getName());
        dto.setImageUrl(post.getImageUrl());
        dto.setMediaType(post.getMediaType());
        dto.setCreatedAt(post.getCreatedAt());
        dto.likesCount = post.getLikedByUsers().size();
        dto.commentsCount = post.getComments().size();
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

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }
}
