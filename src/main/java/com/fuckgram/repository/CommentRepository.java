package com.fuckgram.repository;

import com.fuckgram.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);
    List<Comment> findByParentCommentIdOrderByCreatedAt(Long parentCommentId);
}
