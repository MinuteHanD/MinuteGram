import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { FileText, Plus, MessageSquare, ChevronRight } from 'lucide-react';

const TopicPage = () => {
  const { topicId } = useParams();
  const [posts, setPosts] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Existing logic remains unchanged
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
    <div className="min-h-screen bg-gradient-to-b from-dark-100 to-dark-200">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-dark-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-dark-300/10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-dark-300/10 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-dark-300" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-dark-400 to-dark-300 bg-clip-text text-transparent">
                {topicName} Posts
              </h2>
            </div>
            {token && (
              <button 
                onClick={() => setShowForm(!showForm)} 
                className="bg-dark-300 text-dark-50 px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-dark-300/20 flex items-center space-x-3"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Post</span>
              </button>
            )}
          </div>

          {posts.length > 0 ? (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li 
                  key={post.id} 
                  className="group bg-dark-200/50 hover:bg-dark-300/20 transition-all duration-300 rounded-xl border border-dark-300/10 hover:border-dark-300/30 shadow-lg hover:shadow-xl"
                >
                  <button 
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="w-full text-left p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <MessageSquare className="w-5 h-5 text-dark-300/50" />
                      <span className="text-lg font-medium text-dark-400 group-hover:text-dark-300 transition-colors">
                        {post.title || 'Untitled Post'}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-300 group-hover:translate-x-2 transition-all duration-300" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="bg-dark-300/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-dark-300/50" />
              </div>
              <p className="text-2xl font-bold text-dark-400">No posts here yet</p>
              <p className="text-dark-300">Be the first to start a discussion</p>
            </div>
          )}
        </div>

        {token && showForm && (
          <div className="bg-dark-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-dark-300/10 space-y-6">
            <h3 className="text-2xl font-bold text-dark-400">Create New Post</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full bg-dark-100/50 text-dark-400 px-6 py-3 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300 placeholder:text-dark-400/50"
              />
              <textarea
                placeholder="Post Content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-dark-100/50 text-dark-400 px-6 py-4 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300 h-48 placeholder:text-dark-400/50 resize-none"
              />
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={createPost} 
                className="bg-dark-300 text-dark-50 px-8 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-dark-300/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newPostTitle.trim() || !newPostContent.trim()}
              >
                Create Post
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                className="bg-dark-200 text-dark-400 px-8 py-3 rounded-xl hover:bg-dark-300/20 transition-all duration-300 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!token && (
          <div className="text-center bg-dark-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-dark-300/10">
            <button 
              onClick={() => navigate('/login')} 
              className="bg-dark-300 text-dark-50 px-8 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-dark-300/20 flex items-center space-x-3 mx-auto"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Login to Create Post</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicPage;