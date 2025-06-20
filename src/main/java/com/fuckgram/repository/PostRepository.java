package com.fuckgram.repository;

import com.fuckgram.dto.PostResponseDto; // Added necessary import
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findAllByTopic(Topic topic, Pageable pageable);

    // --- PROJECTION QUERY FOR ADMIN POSTS PAGE ---
    @Query("SELECT new com.fuckgram.dto.PostResponseDto(" +
           "   p.id, p.content, p.title, p.user.name, p.topic.name, " +
           "   p.imageUrl, p.mediaType, p.createdAt, " +
           "   size(p.likedByUsers), size(p.comments)) " +
           "FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    Page<PostResponseDto> findProjectedByTitleContainingIgnoreCase(@Param("title") String title, Pageable pageable);

    @Query("SELECT DATE(p.createdAt) as date, COUNT(p) as count FROM Post p WHERE p.createdAt >= :startDate GROUP BY DATE(p.createdAt)")
    List<Object[]> countPostsByDate(@Param("startDate") LocalDateTime startDate);

    @Modifying
    @Query("DELETE FROM Post p WHERE p.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}