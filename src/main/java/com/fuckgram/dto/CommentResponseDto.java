package com.fuckgram.dto;

import com.fuckgram.entity.Comment;

import java.time.LocalDateTime;

public class CommentResponseDto {
    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;
    private Long parentCommentId;


    public static CommentResponseDto fromEntity(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthorName(comment.getUser().getName());
        dto.setCreatedAt(comment.getCreatedAt());

        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getId());
        }

        return dto;
    }

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

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }
}

