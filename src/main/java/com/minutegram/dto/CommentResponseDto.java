package com.minutegram.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.minutegram.entity.Comment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CommentResponseDto {
    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;
    private Long parentCommentId;
    @JsonInclude(JsonInclude.Include.NON_EMPTY) // Don't show the 'replies' field if it's empty
    private List<CommentResponseDto> replies = new ArrayList<>();
    private String postTitle;

    // Default constructor for frameworks like Jackson
    public CommentResponseDto() {}

    /**
     * High-performance constructor for JPA Projections.
     * The database query will call this directly to build the DTO.
     * @param id The comment's ID.
     * @param content The comment's text.
     * @param authorName The name of the user who made the comment.
     * @param createdAt The timestamp of creation.
     * @param parentCommentId The ID of the parent comment, if it's a reply.
     * @param postTitle The title of the post the comment belongs to.
     */
    public CommentResponseDto(Long id, String content, String authorName, LocalDateTime createdAt, Long parentCommentId, String postTitle) {
        this.id = id;
        this.content = content;
        this.authorName = authorName;
        this.createdAt = createdAt;
        this.parentCommentId = parentCommentId;
        this.postTitle = postTitle;
    }


    /**
     * Legacy factory method. Still useful for creating a DTO from a single, fully-loaded entity.
     * For example, after creating a brand new comment.
     * AVOIDING THIS for lists of comments is the key to performance.
     */
    public static CommentResponseDto fromEntity(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        // This line causes an N+1 query if used in a loop!
        dto.setAuthorName(comment.getUser().getName());
        dto.setCreatedAt(comment.getCreatedAt());
        // This line also causes an N+1 query if used in a loop!
        dto.setPostTitle(comment.getPost().getTitle());

        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getId());
        }

        return dto;
    }


    // --- GETTERS AND SETTERS ---

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public List<CommentResponseDto> getReplies() {
        return replies;
    }

    public void setReplies(List<CommentResponseDto> replies) {
        this.replies = replies;
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
