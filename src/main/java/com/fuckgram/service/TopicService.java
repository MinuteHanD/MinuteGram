package com.fuckgram.service;

import com.fuckgram.dto.PostResponseDto;
import com.fuckgram.dto.TopicCreateDto;
import com.fuckgram.dto.TopicDto;
import com.fuckgram.dto.TopicWithPostsDto;
import com.fuckgram.entity.Topic;
import com.fuckgram.entity.User;
import com.fuckgram.exception.TopicAlreadyExistsException;
import com.fuckgram.exception.TopicNotFoundException;
import com.fuckgram.repository.PostRepository;
import com.fuckgram.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    
    @Transactional(readOnly = true)
    public TopicWithPostsDto getTopicWithPosts(Long topicId, Pageable pageable) {
        // Step 1: Get the topic DTO
        TopicDto topicDto = topicRepository.findProjectedById(topicId)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found with id: " + topicId));
        
        // Step 2: Get the posts for that topic
        // We need the Topic *entity* for the repository query
        Topic topicEntity = topicRepository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found with id: " + topicId));
        Page<PostResponseDto> postsPage = postRepository.findAllProjectedByTopic(topicEntity, pageable);

        // Step 3: Combine and return
        return new TopicWithPostsDto(topicDto, postsPage);
    }

    @Transactional(readOnly = true)
    public TopicDto getTopicDtoById(Long id) {
        return topicRepository.findProjectedById(id)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found with id: " + id));
    }
    
    // This is kept for backwards compatibility or other uses, but the new endpoint is better.
    @Transactional(readOnly = true)
    public Page<PostResponseDto> getTopicPosts(Long topicId, Pageable pageable) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicId));
        return postRepository.findAllProjectedByTopic(topic, pageable);
    }
}
