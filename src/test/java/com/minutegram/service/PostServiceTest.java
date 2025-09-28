package com.minutegram.service;

import com.minutegram.dto.PostCreateDto;
import com.minutegram.dto.PostResponseDto;
import com.minutegram.dto.PostWithCommentsDto;
import com.minutegram.entity.Post;
import com.minutegram.entity.Topic;
import com.minutegram.entity.User;
import com.minutegram.exception.InvalidInputException;
import com.minutegram.exception.TopicNotFoundException;
import com.minutegram.repository.PostRepository;
import com.minutegram.repository.TopicRepository;
import com.minutegram.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private UserService userService;

    @Mock
    private StorageService storageService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentService commentService;

    @InjectMocks
    private PostService postService;

    private User testUser;
    private Topic testTopic;
    private Post testPost;
    private PostCreateDto postCreateDto;
    private PostResponseDto postResponseDto;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("John Doe");
        testUser.setEmail("john.doe@example.com");

        // Setup test topic
        testTopic = new Topic();
        testTopic.setId(1L);
        testTopic.setName("Technology");
        testTopic.setDescription("Tech discussions");

        // Setup test post
        testPost = new Post();
        testPost.setId(1L);
        testPost.setTitle("Test Post");
        testPost.setContent("This is a test post content");
        testPost.setUser(testUser);
        testPost.setTopic(testTopic);
        testPost.setCreatedAt(LocalDateTime.now());
        testPost.setLikedByUsers(new HashSet<>());

        // Setup DTOs
        postCreateDto = new PostCreateDto();
        postCreateDto.setTitle("Test Post");
        postCreateDto.setContent("This is a test post content");
        postCreateDto.setTopicName("Technology");

        postResponseDto = new PostResponseDto() {
            @Override
            public Long getId() { return 1L; }
            @Override
            public String getTitle() { return "Test Post"; }
            @Override
            public String getContent() { return "This is a test post content"; }
            @Override
            public String getImageUrl() { return null; }
            @Override
            public String getMediaType() { return null; }
            @Override
            public LocalDateTime getCreatedAt() { return LocalDateTime.now(); }
            @Override
            public String getAuthorName() { return "John Doe"; }
            @Override
            public String getTopicName() { return "Technology"; }
            @Override
            public int getLikesCount() { return 0; }
            @Override
            public int getCommentsCount() { return 0; }
        };
    }

    @Test
    void createPost_WithValidData_ShouldCreatePost() {
        // Arrange
        when(topicRepository.findByName("Technology")).thenReturn(Optional.of(testTopic));
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(postRepository.save(any(Post.class))).thenReturn(testPost);
        when(postRepository.findProjectedById(1L)).thenReturn(Optional.of(postResponseDto));

        // Act
        PostResponseDto result = postService.createPost(postCreateDto, null, null);

        // Assert
        assertNotNull(result);
        assertEquals("Test Post", result.getTitle());
        assertEquals("This is a test post content", result.getContent());
        
        verify(topicRepository).findByName("Technology");
        verify(userService).getCurrentUser();
        verify(postRepository).save(any(Post.class));
        verify(postRepository).findProjectedById(1L);
    }

    @Test
    void createPost_WithNonExistentTopic_ShouldThrowException() {
        // Arrange
        when(topicRepository.findByName("Technology")).thenReturn(Optional.empty());

        // Act & Assert
        TopicNotFoundException exception = assertThrows(TopicNotFoundException.class, () -> {
            postService.createPost(postCreateDto, null, null);
        });

        assertEquals("Technology", exception.getMessage());
        verify(topicRepository).findByName("Technology");
        verify(userService, never()).getCurrentUser();
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    void createPost_WithEmptyContent_ShouldThrowException() {
        // Arrange
        postCreateDto.setContent("");

        // Act & Assert
        InvalidInputException exception = assertThrows(InvalidInputException.class, () -> {
            postService.createPost(postCreateDto, null, null);
        });

        assertEquals("post content cannot be empty", exception.getMessage());
        verify(topicRepository, never()).findByName(any());
    }

    @Test
    void createPost_WithNullContent_ShouldThrowException() {
        // Arrange
        postCreateDto.setContent(null);

        // Act & Assert
        InvalidInputException exception = assertThrows(InvalidInputException.class, () -> {
            postService.createPost(postCreateDto, null, null);
        });

        assertEquals("post content cannot be empty", exception.getMessage());
    }

    @Test
    void createPost_WithWhitespaceContent_ShouldThrowException() {
        // Arrange
        postCreateDto.setContent("   ");

        // Act & Assert
        InvalidInputException exception = assertThrows(InvalidInputException.class, () -> {
            postService.createPost(postCreateDto, null, null);
        });

        assertEquals("post content cannot be empty", exception.getMessage());
    }

    @Test
    void getAllPosts_ShouldReturnPagedPosts() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        List<PostResponseDto> posts = Arrays.asList(postResponseDto);
        Page<PostResponseDto> postPage = new PageImpl<>(posts, pageable, 1);
        
        when(postRepository.findAllProjectedBy(pageable)).thenReturn(postPage);

        // Act
        Page<PostResponseDto> result = postService.getAllPosts(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());
        assertEquals("Test Post", result.getContent().get(0).getTitle());
        
        verify(postRepository).findAllProjectedBy(pageable);
    }

    @Test
    void getPostById_WithValidId_ShouldReturnPost() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        // Act
        Post result = postService.getPostById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testPost.getId(), result.getId());
        assertEquals(testPost.getTitle(), result.getTitle());
        
        verify(postRepository).findById(1L);
    }

    @Test
    void getPostById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.getPostById(999L);
        });

        assertEquals("Post not found with id: 999", exception.getMessage());
        verify(postRepository).findById(999L);
    }

    @Test
    void getPostWithComments_WithValidId_ShouldReturnPostWithComments() {
        // Arrange
        when(postRepository.findProjectedById(1L)).thenReturn(Optional.of(postResponseDto));
        when(commentService.getPostComments(1L)).thenReturn(Arrays.asList());

        // Act
        PostWithCommentsDto result = postService.getPostWithComments(1L);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getPost());
        assertNotNull(result.getComments());
        assertEquals("Test Post", result.getPost().getTitle());
        
        verify(postRepository).findProjectedById(1L);
        verify(commentService).getPostComments(1L);
    }

    @Test
    void deletePost_WithValidId_ShouldDeletePost() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        // Act
        postService.deletePost(1L);

        // Assert
        verify(postRepository).findById(1L);
        verify(postRepository).delete(testPost);
        verify(storageService, never()).deleteFile(any()); // No image URL in test post
    }

    @Test
    void deletePost_WithImageUrl_ShouldDeleteImageAndPost() {
        // Arrange
        testPost.setImageUrl("http://example.com/image.jpg");
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        // Act
        postService.deletePost(1L);

        // Assert
        verify(postRepository).findById(1L);
        verify(storageService).deleteFile("http://example.com/image.jpg");
        verify(postRepository).delete(testPost);
    }

    @Test
    void likePost_WithValidData_ShouldLikePost() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.save(any(Post.class))).thenReturn(testPost);

        // Act
        postService.likePost(1L, 1L);

        // Assert
        verify(postRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(postRepository).save(testPost);
        assertTrue(testPost.getLikedByUsers().contains(testUser));
    }

    @Test
    void likePost_WhenAlreadyLiked_ShouldThrowException() {
        // Arrange
        testPost.getLikedByUsers().add(testUser); // Already liked
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.likePost(1L, 1L);
        });

        assertEquals("Already liked", exception.getMessage());
        verify(postRepository, never()).save(any());
    }

    @Test
    void unlikePost_WithValidData_ShouldUnlikePost() {
        // Arrange
        testPost.getLikedByUsers().add(testUser); // Already liked
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.save(any(Post.class))).thenReturn(testPost);

        // Act
        postService.unlikePost(1L, 1L);

        // Assert
        verify(postRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(postRepository).save(testPost);
        assertFalse(testPost.getLikedByUsers().contains(testUser));
    }

    @Test
    void unlikePost_WhenNotLiked_ShouldThrowException() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.unlikePost(1L, 1L);
        });

        assertEquals("Not liked yet", exception.getMessage());
        verify(postRepository, never()).save(any());
    }
}