package com.fuckgram.repository;

import com.fuckgram.dto.PostResponseDto;
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
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * Fetch a single post with aggregated counts directly into a DTO.
     */
    @Query("SELECT new com.fuckgram.dto.PostResponseDto(" +
           "p.id, p.content, p.title, p.user.name, p.topic.name, " +
           "p.imageUrl, p.mediaType, p.createdAt, " +
           "size(p.likedByUsers), size(p.comments)) " +
           "FROM Post p WHERE p.id = :postId")
    Optional<PostResponseDto> findProjectedById(@Param("postId") Long postId);

    @Query(
        value = "SELECT new com.fuckgram.dto.PostResponseDto(" +
                "p.id, p.content, p.title, p.user.name, p.topic.name, " +
                "p.imageUrl, p.mediaType, p.createdAt, " +
                "CAST(COUNT(DISTINCT l) AS int), CAST(COUNT(DISTINCT c) AS int)) " +
        "FROM Post p " +
        "LEFT JOIN p.likedByUsers l " +
        "LEFT JOIN p.comments c " +
        "GROUP BY p.id, p.content, p.title, p.user.name, p.topic.name, p.imageUrl, p.mediaType, p.createdAt",
        countQuery = "SELECT COUNT(p) FROM Post p"
    )
    Page<PostResponseDto> findAllProjectedBy(Pageable pageable);

    @Query(
        value = "SELECT new com.fuckgram.dto.PostResponseDto(" +
                "p.id, p.content, p.title, p.user.name, p.topic.name, " +
                "p.imageUrl, p.mediaType, p.createdAt, " +
                "CAST(COUNT(DISTINCT l) AS int), CAST(COUNT(DISTINCT c) AS int)) " +
        "FROM Post p " +
        "LEFT JOIN p.likedByUsers l " +
        "LEFT JOIN p.comments c " +
        "WHERE p.topic = :topic " +
        "GROUP BY p.id, p.content, p.title, p.user.name, p.topic.name, p.imageUrl, p.mediaType, p.createdAt",
        countQuery = "SELECT COUNT(p) FROM Post p WHERE p.topic = :topic"
    )
    Page<PostResponseDto> findAllProjectedByTopic(@Param("topic") Topic topic, Pageable pageable);

    @Query("SELECT DATE(p.createdAt) as date, COUNT(p) as count FROM Post p WHERE p.createdAt >= :startDate GROUP BY DATE(p.createdAt)")
    List<Object[]> countPostsByDate(@Param("startDate") LocalDateTime startDate);

    @Modifying
    @Query("DELETE FROM Post p WHERE p.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
