package com.fuckgram.repository;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
@Repository
public interface PostRepository extends JpaRepository<Post, Long>{
    @Modifying
    @Query("DELETE FROM Post p WHERE p.user.id = :userId")
    void deleteByUserId(Long userId);
    Page<Post> findAllByTopic(Topic topic, SpringDataWebProperties.Pageable pageable);
}


