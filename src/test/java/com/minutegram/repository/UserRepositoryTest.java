package com.minutegram.repository;

import com.minutegram.entity.Role;
import com.minutegram.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser1;
    private User testUser2;
    private User bannedUser;

    @BeforeEach
    void setUp() {
        // Create test users
        testUser1 = new User();
        testUser1.setName("John Doe");
        testUser1.setEmail("john.doe@example.com");
        testUser1.setUsername("johndoe");
        testUser1.setPassword("password123");
        testUser1.setAge(25);
        testUser1.setBanned(false);
        Set<Role> roles1 = new HashSet<>();
        roles1.add(Role.USER);
        testUser1.setRoles(roles1);

        testUser2 = new User();
        testUser2.setName("Jane Smith");
        testUser2.setEmail("jane.smith@example.com");
        testUser2.setUsername("janesmith");
        testUser2.setPassword("password456");
        testUser2.setAge(30);
        testUser2.setBanned(false);
        Set<Role> roles2 = new HashSet<>();
        roles2.add(Role.USER);
        testUser2.setRoles(roles2);

        bannedUser = new User();
        bannedUser.setName("Banned User");
        bannedUser.setEmail("banned@example.com");
        bannedUser.setUsername("banneduser");
        bannedUser.setPassword("password789");
        bannedUser.setAge(35);
        bannedUser.setBanned(true);
        Set<Role> roles3 = new HashSet<>();
        roles3.add(Role.USER);
        bannedUser.setRoles(roles3);

        // Persist test data
        entityManager.persistAndFlush(testUser1);
        entityManager.persistAndFlush(testUser2);
        entityManager.persistAndFlush(bannedUser);
    }

    @Test
    void findByEmail_WithExistingEmail_ShouldReturnUser() {
        // Act
        Optional<User> result = userRepository.findByEmail("john.doe@example.com");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        assertEquals("john.doe@example.com", result.get().getEmail());
    }

    @Test
    void findByEmail_WithNonExistingEmail_ShouldReturnEmpty() {
        // Act
        Optional<User> result = userRepository.findByEmail("nonexistent@example.com");

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void existsByEmail_WithExistingEmail_ShouldReturnTrue() {
        // Act
        boolean exists = userRepository.existsByEmail("john.doe@example.com");

        // Assert
        assertTrue(exists);
    }

    @Test
    void existsByEmail_WithNonExistingEmail_ShouldReturnFalse() {
        // Act
        boolean exists = userRepository.existsByEmail("nonexistent@example.com");

        // Assert
        assertFalse(exists);
    }

    @Test
    void findByUsername_WithExistingUsername_ShouldReturnUser() {
        // Act
        Optional<User> result = userRepository.findByUsername("johndoe");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        assertEquals("johndoe", result.get().getUsername());
    }

    @Test
    void findByUsername_WithNonExistingUsername_ShouldReturnEmpty() {
        // Act
        Optional<User> result = userRepository.findByUsername("nonexistent");

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase_WithNameMatch_ShouldReturnUsers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<User> result = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                "john", "john", pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("John Doe", result.getContent().get(0).getName());
    }

    @Test
    void findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase_WithEmailMatch_ShouldReturnUsers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<User> result = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                "jane.smith", "jane.smith", pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("Jane Smith", result.getContent().get(0).getName());
    }

    @Test
    void findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase_CaseInsensitive_ShouldReturnUsers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<User> result = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                "JOHN", "JOHN", pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("John Doe", result.getContent().get(0).getName());
    }

    @Test
    void countByBannedFalse_ShouldReturnCountOfActiveUsers() {
        // Act
        long count = userRepository.countByBannedFalse();

        // Assert
        assertEquals(2, count); // testUser1 and testUser2 are not banned
    }

    @Test
    void countByBannedTrue_ShouldReturnCountOfBannedUsers() {
        // Act
        long count = userRepository.countByBannedTrue();

        // Assert
        assertEquals(1, count); // Only bannedUser is banned
    }

    @Test
    void save_NewUser_ShouldPersistUser() {
        // Arrange
        User newUser = new User();
        newUser.setName("New User");
        newUser.setEmail("new@example.com");
        newUser.setUsername("newuser");
        newUser.setPassword("newpassword");
        newUser.setAge(28);
        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER);
        newUser.setRoles(roles);

        // Act
        User savedUser = userRepository.save(newUser);

        // Assert
        assertNotNull(savedUser.getId());
        assertEquals("New User", savedUser.getName());
        assertEquals("new@example.com", savedUser.getEmail());

        // Verify it's actually persisted
        Optional<User> foundUser = userRepository.findByEmail("new@example.com");
        assertTrue(foundUser.isPresent());
    }

    @Test
    void delete_ExistingUser_ShouldRemoveUser() {
        // Arrange
        Long userId = testUser1.getId();

        // Act
        userRepository.delete(testUser1);
        entityManager.flush();

        // Assert
        Optional<User> deletedUser = userRepository.findById(userId);
        assertFalse(deletedUser.isPresent());
    }
}