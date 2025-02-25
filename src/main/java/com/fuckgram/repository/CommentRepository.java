package com.fuckgram.repository;

import com.fuckgram.entity.Comment;

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
    List<Comment> findByPostId(Long postId);
    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);
    List<Comment> findByParentCommentIdOrderByCreatedAt(Long parentCommentId);

    Page<Comment> findByContentContainingIgnoreCase(String content, Pageable pageable);

    @Query("SELECT DATE(c.createdAt) as date, COUNT(c) as count FROM Comment c WHERE c.createdAt >= :startDate GROUP BY DATE(c.createdAt)")
    List<Object[]> countCommentsByDate(@Param("startDate") LocalDateTime startDate);
}
