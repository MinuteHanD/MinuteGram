package com.minutegram.dto;

import java.time.LocalDateTime;

public class TopicDto {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private Long creatorId;
    private String creatorName;
    private int postCount;

    // Default constructor for frameworks like Jackson
    public TopicDto() {}

    // The new, high-performance constructor for JPA Projections.
    // This is called directly from the database query.
    public TopicDto(Long id, String name, String description, LocalDateTime createdAt, Long creatorId, String creatorName, int postCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.creatorId = creatorId;
        this.creatorName = creatorName;
        this.postCount = postCount;
    }

    // --- GETTERS AND SETTERS ---
    // (Your existing getters and setters are fine, keep them here)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }
    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }
    public int getPostCount() { return postCount; }
    public void setPostCount(int postCount) { this.postCount = postCount; }
}