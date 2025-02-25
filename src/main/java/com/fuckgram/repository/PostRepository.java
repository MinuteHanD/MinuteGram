package com.fuckgram.repository;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
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
public interface PostRepository extends JpaRepository<Post, Long>{
    @Modifying
    @Query("DELETE FROM Post p WHERE p.user.id = :userId")
    void deleteByUserId(Long userId);
    Page<Post> findAllByTopic(Topic topic, Pageable pageable);
    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query("SELECT DATE(p.createdAt) as date, COUNT(p) as count FROM Post p WHERE p.createdAt >= :startDate GROUP BY DATE(p.createdAt)")
    List<Object[]> countPostsByDate(@Param("startDate") LocalDateTime startDate);

}



