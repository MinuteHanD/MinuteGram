package com.fuckgram.service;

import com.fuckgram.dto.PostCreateDto;
import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import com.fuckgram.entity.User;
import com.fuckgram.exception.InvalidInputException;
import com.fuckgram.exception.TopicNotFoundException;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import com.fuckgram.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final TopicRepository topicRepository;
    private final UserService userService;
    private final StorageService storageService;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository,
                       TopicRepository topicRepository,
                       UserService userService,
                       StorageService storageService,
                       UserRepository userRepository) {
        this.postRepository = postRepository;
        this.topicRepository = topicRepository;
        this.userService = userService;
        this.storageService = storageService;
        this.userRepository = userRepository;
    }

    private Post createPostEntity(PostCreateDto postDto, String imageUrl, String mediaType, Topic topic, User currentUser) {
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setImageUrl(imageUrl);
        post.setMediaType(mediaType);
        post.setUser(currentUser);
        post.setTopic(topic);
        return post;
    }

    public PostResponseDto createPost(PostCreateDto postDto, String imageUrl) {
        validatePostInput(postDto);

        Topic topic = topicRepository.findByName(postDto.getTopicName())
                .orElseThrow(() -> new TopicNotFoundException(postDto.getTopicName()));

        User currentUser = userService.getCurrentUser();

        String mediaType = null;
        Post post = createPostEntity(postDto, imageUrl, mediaType, topic, currentUser);
        Post savedPost = postRepository.save(post);

        return PostResponseDto.fromEntity(savedPost);
    }

    private void validatePostInput(PostCreateDto postDto) {
        if (postDto.getContent() == null || postDto.getContent().trim().isEmpty()) {
            throw new InvalidInputException("post content cannot be empty");
        }
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    
    public void deletePost(Long postId) {
        Post post = getPostById(postId);
        if (post.getImageUrl() != null) {
            storageService.deleteFile(post.getImageUrl());
        }
        postRepository.delete(post);
    }

    public void likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (post.getLikedByUsers().contains(user)) {
            throw new RuntimeException("Already liked");
        }
        post.getLikedByUsers().add(user);
        postRepository.save(post);
    }

    public void unlikePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!post.getLikedByUsers().contains(user)) {
            throw new RuntimeException("Not liked yet");
        }
        post.getLikedByUsers().remove(user);
        postRepository.save(post);
    }
}