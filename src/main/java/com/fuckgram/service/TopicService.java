package com.fuckgram.service;

import com.fuckgram.entity.Topic;
import com.fuckgram.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    public Topic createTopic(Topic topic){
        if (topic.getName() == null || topic.getName().isEmpty()){
            throw new RuntimeException("Topic name cannot be null or empty");
        }

        if (topicRepository.findByName(topic.getName()).isEmpty()){
            throw new RuntimeException("Topic name already exists");
        }

        topic.setCreatedAt(LocalDateTime.now());
        return topicRepository.save(topic);



    }
}
