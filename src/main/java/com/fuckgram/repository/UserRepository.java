package com.fuckgram.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fuckgram.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
}
