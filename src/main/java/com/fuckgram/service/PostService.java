package com.fuckgram.service;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.User;
import com.fuckgram.repository.PostRepository;
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

    public Post createPost(Post post, String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
