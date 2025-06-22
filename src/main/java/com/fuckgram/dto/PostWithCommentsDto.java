package com.fuckgram.dto;

import java.util.List;

/**
 * A DTO to bundle a Post with all of its comments for a single API response.
 * This avoids the frontend having to make two separate API calls.
 */
public class PostWithCommentsDto {

    private PostResponseDto post;
    private List<CommentResponseDto> comments;

    public PostWithCommentsDto(PostResponseDto post, List<CommentResponseDto> comments) {
        this.post = post;
        this.comments = comments;
    }

    // Getters and Setters
    public PostResponseDto getPost() {
        return post;
    }

    public void setPost(PostResponseDto post) {
        this.post = post;
    }

    public List<CommentResponseDto> getComments() {
        return comments;
    }

    public void setComments(List<CommentResponseDto> comments) {
        this.comments = comments;
    }
}
