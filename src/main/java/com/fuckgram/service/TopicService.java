package com.fuckgram.service;

import com.fuckgram.dto.TopicCreateDto;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import com.fuckgram.exception.TopicAlreadyExistsException;
import com.fuckgram.exception.TopicNotFoundException;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import com.fuckgram.entity.User;

import java.awt.desktop.UserSessionEvent;
import java.awt.print.Pageable;
import java.time.LocalDateTime;

@Service
@Transactional
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PostRepository postRepository;




    public Topic createTopic(TopicCreateDto topicDto) {
        User currentUser = userService.getCurrentUser();

        if (topicRepository.existsByName(topicDto.getName())){
            throw new TopicAlreadyExistsException("Topic with this name already exists");

        }

        Topic topic = new Topic();
        topic.setName(topicDto.getName());
        topic.setDescription(topicDto.getDescription());
        topic.setCreator(currentUser);

        return topicRepository.save(topic);
    }

    public Page<Topic> getAllTopics(Pageable pageable){
        return topicRepository.findAll(pageable);
    }

    public Topic getTopicByName(String name){
        return topicRepository.findByName(name)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found: " + name));
    }

    public Page<Post> getTopicPosts(String topicName, Pageable pageable) {
        Topic topic = topicRepository.findByName(topicName)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicName));
        return postRepository.findAllByTopic(topic, (SpringDataWebProperties.Pageable) pageable);
    }

}
