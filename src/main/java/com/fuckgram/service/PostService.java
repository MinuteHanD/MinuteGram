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
import jakarta.transaction.Transactional;
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

    public PostService(PostRepository postRepository,
                       TopicRepository topicRepository,
                       UserService userService,
                       StorageService storageService) {
        this.postRepository = postRepository;
        this.topicRepository = topicRepository;
        this.userService = userService;
        this.storageService = storageService;
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
}