package com.fuckgram.repository;

import com.fuckgram.dto.TopicDto;
import com.fuckgram.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    Optional<Topic> findByName(String name);
    boolean existsByName(String name);
    Optional<Topic> findById(Long id);

    /**
     * Fetch topics with aggregated post counts in one query to avoid N+1 subselects.
     * The constructor signature is:
     * (Long id, String name, String description, LocalDateTime createdAt, Long creatorId, String creatorName, int postCount)
     */
    @Query(
        value = "SELECT new com.fuckgram.dto.TopicDto(" +
                "t.id, t.name, t.description, t.createdAt, t.creator.id, t.creator.name, CAST(COUNT(p) AS int)) " +
        "FROM Topic t " +
        "LEFT JOIN t.posts p " +
        "GROUP BY t.id, t.name, t.description, t.createdAt, t.creator.id, t.creator.name",
        countQuery = "SELECT COUNT(t) FROM Topic t"
    )
    Page<TopicDto> findAllProjected(Pageable pageable);

    @Query("SELECT new com.fuckgram.dto.TopicDto(" +
           "   t.id, t.name, t.description, t.createdAt, " +
           "   t.creator.id, t.creator.name, size(t.posts)) " +
           "FROM Topic t WHERE t.id = :id")
    Optional<TopicDto> findProjectedById(Long id);

    // This was the missing piece for the AdminController search
    @Query("SELECT new com.fuckgram.dto.TopicDto(" +
           "   t.id, t.name, t.description, t.createdAt, " +
           "   t.creator.id, t.creator.name, size(t.posts)) " +
           "FROM Topic t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<TopicDto> findProjectedByNameContainingIgnoreCase(String name, Pageable pageable);
}