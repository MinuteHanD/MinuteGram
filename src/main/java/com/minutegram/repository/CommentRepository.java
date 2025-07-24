package com.minutegram.repository;

import com.minutegram.dto.CommentResponseDto;
import com.minutegram.entity.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * NEW: Fetches all comments for a post directly into DTOs.
     * This is the high-performance query that avoids the N+1 problem by joining
     * User and Post entities within the database to get the names and titles.
     * @param postId The ID of the post to fetch comments for.
     * @return A flat list of Comment DTOs.
     */
    @Query("SELECT new com.minutegram.dto.CommentResponseDto(c.id, c.content, c.user.name, c.createdAt, c.parentComment.id, c.post.title) " +
           "FROM Comment c " +
           "WHERE c.post.id = :postId")
    List<CommentResponseDto> findDtosByPostId(@Param("postId") Long postId);

    // This method is still used for fetching replies to a comment, although the new getPostComments handles this.
    // It is less performant if used in a loop, but can be kept for specific use cases.
    List<Comment> findByParentCommentIdOrderByCreatedAt(Long parentCommentId);
    
    // Kept for the admin panel search functionality
    Page<Comment> findByContentContainingIgnoreCase(String content, Pageable pageable);

    // Kept for the admin stats panel
    @Query("SELECT DATE(c.createdAt) as date, COUNT(c) as count FROM Comment c WHERE c.createdAt >= :startDate GROUP BY DATE(c.createdAt)")
    List<Object[]> countCommentsByDate(@Param("startDate") LocalDateTime startDate);

    // DEPRECATED FOR PERFORMANCE REASONS. Using findDtosByPostId instead.
    // List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);

}
