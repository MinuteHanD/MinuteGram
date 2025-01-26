import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Topics = () => {
  const [topics, setTopics] = useState([]);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/topics');
      setTopics(response.data.content); // If using pagination
    } catch (err) {
      alert('Failed to fetch topics');
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      await api.delete(`/topics/${topicId}`);
      alert('Topic deleted successfully');
      setTopics(topics.filter(topic => topic.id !== topicId));
    } catch (err) {
      alert('Failed to delete topic');
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div>
      <h2>Topics</h2>
      <ul>
        {topics.map(topic => (
          <li key={topic.id}>
            <strong>{topic.name}</strong> - {topic.description}
            <button onClick={() => deleteTopic(topic.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Topics;
