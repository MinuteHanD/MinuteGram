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
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final TopicRepository topicRepository;
    private final UserService userService;

    public PostService(PostRepository postRepository,
                       TopicRepository topicRepository,
                       UserService userService) {
        this.postRepository = postRepository;
        this.topicRepository = topicRepository;
        this.userService = userService;
    }

    private Post createPostEntity(PostCreateDto postDto, Topic topic, User currentUser) {
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setUser(currentUser);
        post.setTopic(topic);
        return post;
    }


    public PostResponseDto createPost(PostCreateDto postDto) {

        validatePostInput(postDto);

        Topic topic = topicRepository.findByName(postDto.getTopicName())
                .orElseThrow(() -> new TopicNotFoundException(postDto.getTopicName()));

        User currentUser = userService.getCurrentUser();

        Post post = createPostEntity(postDto, topic, currentUser);
        Post savedPost = postRepository.save(post);

        return PostResponseDto.fromEntity(savedPost);
    }

    private void validatePostInput(PostCreateDto postDto){
        if (postDto.getContent() == null || postDto.getContent().trim().isEmpty()){
            throw new InvalidInputException("post content canot be empty");
        }


    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    public Post getPostById(Long id){
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }
}
