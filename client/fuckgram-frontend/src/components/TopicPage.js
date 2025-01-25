import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TopicPage = () => {
  const { topicId } = useParams();
  const [posts, setPosts] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
        const topicResponse = await api.get(`/topics/${topicId}`);
        setTopicName(topicResponse.data.name); // Assuming topicResponse.data contains the topic name
  
        const postsResponse = await api.get(`/topics/${topicId}/posts`);
        setPosts(postsResponse.data.content);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch posts');
    }
  };

  const createPost = async () => {
    try {
      await api.post('/posts', {
        title: newPostTitle,
        content: newPostContent,
        topicName: topicName  // Assuming topicName is in the first post
      });
      alert('Post created successfully!');
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [topicId]);

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <button onClick={() => navigate(`/posts/${post.id}`)}>
              {post.title || 'Untitled Post'}
            </button>
          </li>
        ))}
      </ul>
      {token ? (
        <button onClick={() => setShowForm(!showForm)}>Create New Post</button>
      ) : (
        <button onClick={() => navigate('/login')}>Login to Create Post</button>
      )}
      
      {showForm && (
        <div>
          <h3>Create a New Post</h3>
          <input
            type="text"
            placeholder="Post Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <textarea
            placeholder="Post Content"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button onClick={createPost}>Submit</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TopicPage;
