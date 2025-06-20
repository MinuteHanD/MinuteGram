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

    // --- PROJECTION QUERIES FOR HIGH PERFORMANCE ---

    @Query("SELECT new com.fuckgram.dto.TopicDto(" +
           "   t.id, t.name, t.description, t.createdAt, " +
           "   t.creator.id, t.creator.name, size(t.posts)) " +
           "FROM Topic t")
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