package com.minutegram.dto;

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

    // Default constructor for frameworks like Jackson/JPA.
    public PostResponseDto() {}

    // The new, high-performance constructor for JPA Projections.
    // The database will call this directly.
    public PostResponseDto(Long id, String content, String title, String authorName, String topicName, String imageUrl, String mediaType, LocalDateTime createdAt, int likesCount, int commentsCount) {
        this.id = id;
        this.content = content;
        this.title = title;
        this.authorName = authorName;
        this.topicName = topicName;
        this.imageUrl = imageUrl;
        this.mediaType = mediaType;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
        this.commentsCount = commentsCount;
    }

    // --- GETTERS AND SETTERS ---
    // (Your existing getters and setters are fine, keep them here)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }

    public static PostResponseDto fromEntity(com.minutegram.entity.Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setTitle(post.getTitle());
        dto.setAuthorName(post.getUser() != null ? post.getUser().getName() : null);
        dto.setTopicName(post.getTopic() != null ? post.getTopic().getName() : null);
        dto.setImageUrl(post.getImageUrl());
        dto.setMediaType(post.getMediaType());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setLikesCount(post.getLikedByUsers() != null ? post.getLikedByUsers().size() : 0);
        dto.setCommentsCount(post.getComments() != null ? post.getComments().size() : 0);
        return dto;
    }
}