import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { FileText, Plus } from 'lucide-react';

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
      setTopicName(topicResponse.data.name);

      const postsResponse = await api.get(`/topics/${topicId}/posts`);
      setPosts(postsResponse.data.content);
    } catch (err) {
      alert('Failed to fetch posts');
    }
  };

  const createPost = async () => {
    try {
      await api.post('/posts', {
        title: newPostTitle,
        content: newPostContent,
        topicName: topicName  
      });
      alert('Post created successfully!');
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      alert('Failed to create post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [topicId]);

  return (
    <div className="max-w-2xl mx-auto bg-dark-50 p-6 space-y-6">
      <div className="bg-dark-100 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-dark-300" />
            <h2 className="text-2xl font-bold text-dark-400">{topicName} Posts</h2>
          </div>
          {token && (
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="dark-btn dark-btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Post</span>
            </button>
          )}
        </div>

        {posts.length > 0 ? (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li 
                key={post.id} 
                className="bg-dark-200 rounded-lg hover:bg-dark-300/20 transition-colors"
              >
                <button 
                  onClick={() => navigate(`/posts/${post.id}`)}
                  className="w-full text-left p-4 flex justify-between items-center"
                >
                  <span className="text-dark-400 font-medium">{post.title || 'Untitled Post'}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark-400 font-bold text-xl">No posts here yet.</p>
            <p className="text-dark-400 font-bold text-lg mt-2">Be the first to start a discussion</p>
          </div>
        )}
      </div>

      {token && showForm && (
        <div className="bg-dark-100 rounded-xl p-6 shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-dark-400">Create New Post</h3>
          <input
            type="text"
            placeholder="Post Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full bg-dark-200 text-dark-400 px-4 py-2 rounded-lg border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all"
          />
          <textarea
            placeholder="Post Content"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full bg-dark-200 text-dark-400 px-4 py-2 rounded-lg border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all h-32"
          />
          <div className="flex space-x-4">
            <button 
              onClick={createPost} 
              className="dark-btn dark-btn-primary"
              disabled={!newPostTitle.trim() || !newPostContent.trim()}
            >
              Create Post
            </button>
            <button 
              onClick={() => setShowForm(false)} 
              className="dark-btn dark-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!token && (
        <div className="text-center">
          <button 
            onClick={() => navigate('/login')} 
            className="dark-btn dark-btn-secondary"
          >
            Login to Create Post
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicPage;