import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchTopics = async () => {
    try {
      const response = await api.get('/topics'); 
      setTopics(response.data.content);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch topics');
    }
  };

  

  const createTopic = async () => {
    try {
      await api.post('/topics', { name: newTopicName, description: newTopicDescription });
      alert('Topic created successfully!');
      setShowForm(false);
      fetchTopics(); 
    } catch (err) {
      console.error(err);
      alert('Failed to create topic');
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);


  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/topics');
        console.log('Connection successful:', response.data);
      } catch (error) {
        console.error('Connection error:', error);
        
        // Additional error details for debugging
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      <header>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/signup')}>Signup</button>
      </header>
      <h2>Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <button onClick={() => navigate(`/topics/${topic.id}`)}>
              {topic.name}
            </button>
          </li>
        ))}
      </ul>
      {token ? (
        <button onClick={() => setShowForm(!showForm)}>Create New Topic</button>
      ) : (
        <button onClick={() => navigate('/login')}>Login to Create Topic</button>
      )}
      
      {showForm && (
        <div>
          <h3>Create a New Topic</h3>
          <input
            type="text"
            placeholder="Topic Name"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={newTopicDescription}
            onChange={(e) => setNewTopicDescription(e.target.value)}
          />
          <button onClick={createTopic}>Submit</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Home;
