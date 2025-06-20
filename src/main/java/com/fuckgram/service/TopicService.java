package com.fuckgram.service;

import com.fuckgram.dto.TopicCreateDto;
import com.fuckgram.dto.TopicDto;
import com.fuckgram.entity.Post;
import com.fuckgram.entity.Topic;
import com.fuckgram.entity.User;
import com.fuckgram.exception.TopicAlreadyExistsException;
import com.fuckgram.exception.TopicNotFoundException;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;

// WRONG IMPORT: import jakarta.transaction.Transactional;
// CORRECT IMPORT for readOnly attribute:
import org.springframework.transaction.annotation.Transactional; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
        if (topicRepository.existsByName(topicDto.getName())) {
            throw new TopicAlreadyExistsException("Topic with this name already exists");
        }
        Topic topic = new Topic();
        topic.setName(topicDto.getName());
        topic.setDescription(topicDto.getDescription());
        topic.setCreator(currentUser);
        return topicRepository.save(topic);
    }

    @Transactional(readOnly = true)
    public Page<TopicDto> getAllTopics(Pageable pageable) {
        return topicRepository.findAllProjected(pageable);
    }

    public Topic getTopicByName(String name) {
        return topicRepository.findByName(name)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found: " + name));
    }

    // Modified to take ID for consistency with controller
    @Transactional(readOnly = true)
    public Page<Post> getTopicPosts(Long topicId, Pageable pageable) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicId));
        return postRepository.findAllByTopic(topic, pageable);
    }

    // This fetches the raw entity, which is okay for single-item updates/logic.
    public Topic getTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found with id: " + id));
    }
    
    // --- NEW METHOD FOR THE OPTIMIZED CONTROLLER ---
    // This fetches a single topic as a DTO, preventing any N+1 issues.
    // NOTE: You will need to add the corresponding `findProjectedById` query to your TopicRepository.
    @Transactional(readOnly = true)
    public TopicDto getTopicDtoById(Long id) {
        return topicRepository.findProjectedById(id)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found with id: " + id));
    }
}