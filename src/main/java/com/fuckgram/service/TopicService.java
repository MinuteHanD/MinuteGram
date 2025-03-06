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
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import com.fuckgram.entity.User;
import org.springframework.cache.annotation.Cacheable;
import java.awt.desktop.UserSessionEvent;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;


import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PostRepository postRepository;



    @CacheEvict(value = "topics", allEntries = true)
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

    @Cacheable(value = "topics", key = "'all'")
    public List<Topic> getAllTopicsList() {
        return topicRepository.findAll();
    }

    public Page<Topic> getAllTopics(Pageable pageable) {
        List<Topic> allTopics = getAllTopicsList();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), allTopics.size());
        List<Topic> pagedTopics = allTopics.subList(start, end);
        return new PageImpl<>(pagedTopics, pageable, allTopics.size());
    }

    public Topic getTopicByName(String name){
        return topicRepository.findByName(name)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found: " + name));
    }

    public Page<Post> getTopicPosts(String topicName, Pageable pageable) {
        Topic topic = topicRepository.findByName(topicName)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicName));
        return postRepository.findAllByTopic(topic, pageable);
    }

    public Topic getTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found with id: " + id));
    }
}
