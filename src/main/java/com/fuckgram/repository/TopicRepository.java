package com.fuckgram.repository;

import com.fuckgram.entity.Topic;


import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import org.springframework.stereotype.Repository;


import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findByName(String name);
    boolean existsByName(String name);
    Page<Topic> findAll(Pageable pageable);
    Optional<Topic> findById(Long id);
    Page<Topic> findByNameContainingIgnoreCase(String name, Pageable pageable);

}
