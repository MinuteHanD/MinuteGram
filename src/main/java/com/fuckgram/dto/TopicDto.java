package com.fuckgram.dto;

import com.fuckgram.entity.Topic;

import java.time.LocalDateTime;

public class TopicDto {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private Long creatorId;
    private String creatorName;
    private int postCount;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public int getPostCount() {
        return postCount;
    }

    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }

    public static TopicDto from(Topic topic){
        TopicDto dto = new TopicDto();
        dto.setId(topic.getId());
        dto.setName(topic.getName());
        dto.setDescription(topic.getDescription());
        dto.setCreatedAt(topic.getCreatedAt());
        dto.setCreatorId(topic.getCreator().getId());
        dto.setCreatorName(topic.getCreator().getName());
        dto.setPostCount(topic.getPosts().size());
        return dto;
    }
}
