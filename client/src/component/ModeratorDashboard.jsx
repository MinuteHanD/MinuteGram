import React, { useState, useEffect } from 'react';
import api from '../service/apiClient';
import { Shield, Trash2, Ban, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';

const ModeratorDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    posts: true,
    comments: true,
    users: true
  });
  const [errors, setErrors] = useState({
    posts: null,
    comments: null,
    users: null
  });

  const fetchData = async (endpoint, setter, loadingKey) => {
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      setErrors(prev => ({ ...prev, [loadingKey]: null }));
      
      const response = await api.get(`/moderation/${endpoint}`);
      setter(response.data);
    } catch (err) {
      console.error(`Failed to fetch ${endpoint}:`, err);
      setErrors(prev => ({ 
        ...prev, 
        [loadingKey]: err.response?.data || 'Failed to load data'
      }));
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const fetchAll = () => {
    fetchData('posts', setPosts, 'posts');
    fetchData('comments', setComments, 'comments');
    fetchData('users', setUsers, 'users');
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/moderation/posts/${postId}`);
      fetchData('posts', setPosts, 'posts');
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/moderation/comments/${commentId}`);
      fetchData('comments', setComments, 'comments');
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await api.post(`/moderation/users/${userId}/ban`);
      fetchData('users', setUsers, 'users');
    } catch (err) {
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.post(`/moderation/users/${userId}/unban`);
      fetchData('users', setUsers, 'users');
    } catch (err) {
      alert('Failed to unban user');
    }
  };

  const renderSection = (title, data, renderItem, loading, error) => (
    <section className="bg-dark-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-dark-300/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-dark-400">{title}</h2>
        {loading && <Loader2 className="animate-spin text-dark-300" />}
      </div>
      
      {error && (
        <div className="flex items-center text-red-600 space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <ul className="space-y-4">
          {data.length > 0 ? (
            data.map(renderItem)
          ) : (
            <li className="text-dark-300 italic">No items found</li>
          )}
        </ul>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-100 to-dark-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center space-x-4 mb-8">
          <Shield className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-dark-400">Moderator Dashboard</h1>
        </div>

        {renderSection(
          'Posts Management', 
          posts, 
          (post) => (
            <li 
              key={post.id} 
              className="flex justify-between items-center bg-dark-200/50 p-4 rounded-xl"
            >
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-gray-400">By {post.author?.username || 'Unknown'}</p>
              </div>
              <button 
                onClick={() => handleDeletePost(post.id)}
                className="text-red-600 hover:bg-red-100 p-2 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ),
          loading.posts,
          errors.posts
        )}

        {renderSection(
          'Comments Management',
          comments,
          (comment) => (
            <li 
              key={comment.id} 
              className="flex justify-between items-center bg-dark-200/50 p-4 rounded-xl"
            >
              <div>
                <p className="font-medium">{comment.content}</p>
                <p className="text-sm text-gray-400">By {comment.author?.username || 'Unknown'}</p>
              </div>
              <button 
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-600 hover:bg-red-100 p-2 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ),
          loading.comments,
          errors.comments
        )}

        {renderSection(
          'User Management',
          users,
          (user) => (
            <li 
              key={user.id} 
              className="flex justify-between items-center bg-dark-200/50 p-4 rounded-xl"
            >
              <div>
                <h3 className="font-medium">{user.username}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className={`text-sm ${user.banned ? 'text-red-600' : 'text-green-600'}`}>
                  {user.banned ? 'Banned' : 'Active'}
                </p>
              </div>
              {user.banned ? (
                <button 
                  onClick={() => handleUnbanUser(user.id)}
                  className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                >
                  <UserCheck className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => handleBanUser(user.id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded-full"
                >
                  <Ban className="w-5 h-5" />
                </button>
              )}
            </li>
          ),
          loading.users,
          errors.users
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;