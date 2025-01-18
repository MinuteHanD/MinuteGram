package com.fuckgram.service;
import com.fuckgram.dto.PostCreateDto;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import com.fuckgram.entity.User;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import com.fuckgram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserService userService;

    public Post createPost(PostCreateDto postDto, String topicname){
        Topic topic = topicRepository.findByName(topicname)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicname));
        User currentUser = userService.getCurrentUser();
        Post post = new Post();
        post.setContent(postDto.getContent());
        post.setTitle(postDto.getTitle());
        post.setUser(currentUser);
        post.setTopic(topic);

        return postRepository.save(post);

    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
