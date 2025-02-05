import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MessageCircle, 
  Tags, 
  Trash2, 
  Shield,
  Users,
  Activity,
  Clock
} from 'lucide-react';
import api from '../service/apiClient';

const AdminDashboard = () => {
  // State management for all features
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState('posts');

  // Initial data fetching
  useEffect(() => {
    fetchPosts();
    fetchComments();
    fetchTopics();
    fetchUsers();
  }, []);

  // Fetch functions for all data types
  const fetchPosts = async () => {
    try {
      const response = await api.get('/admin/posts');
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      alert('Failed to load posts');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get('/admin/comments');
      setComments(response.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      alert('Failed to load comments');
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await api.get('/admin/topics');
      setTopics(response.data.content);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      alert('Failed to load topics');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      alert('Failed to load users');
    }
  };

  // Delete handlers for existing features
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/admin/posts/${postId}`);
      fetchPosts();
      alert('Post deleted successfully');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/admin/comments/${commentId}`);
      fetchComments();
      alert('Comment deleted successfully');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    try {
      await api.delete(`/admin/topics/${topicId}`);
      fetchTopics();
      alert('Topic deleted successfully');
    } catch (err) {
      console.error('Failed to delete topic:', err);
      alert('Failed to delete topic');
    }
  };

  // User management handlers from old version
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.post(`/admin/users/${userId}/role?newRole=${newRole}`);
      fetchUsers();
      alert('Role updated successfully');
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Failed to update role');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/ban`);
      fetchUsers();
      alert('User banned successfully');
    } catch (err) {
      console.error('Failed to ban user:', err);
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/unban`);
      fetchUsers();
      alert('User unbanned successfully');
    } catch (err) {
      console.error('Failed to unban user:', err);
      alert('Failed to unban user');
    }
  };

  // View renderers for existing features
  const renderPostsView = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <BookOpen className="mr-3 text-blue-500" size={24} />
        Posts Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-300/10">
              <th className="py-4 px-4 text-left">Title</th>
              <th className="py-4 px-4 text-left">Author</th>
              <th className="py-4 px-4 text-left">Created At</th>
              <th className="py-4 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-dark-300/10 hover:bg-dark-300/5">
                <td className="py-4 px-4">{post.title}</td>
                <td className="py-4 px-4">{post.author}</td>
                <td className="py-4 px-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-4 flex space-x-2">
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg flex items-center hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCommentsView = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <MessageCircle className="mr-3 text-green-500" size={24} />
        Comments Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-300/10">
              <th className="py-4 px-4 text-left">Content</th>
              <th className="py-4 px-4 text-left">Author</th>
              <th className="py-4 px-4 text-left">Post</th>
              <th className="py-4 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment.id} className="border-b border-dark-300/10 hover:bg-dark-300/5">
                <td className="py-4 px-4 max-w-xs truncate">{comment.content}</td>
                <td className="py-4 px-4">{comment.author}</td>
                <td className="py-4 px-4">{comment.postTitle}</td>
                <td className="py-4 px-4 flex space-x-2">
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg flex items-center hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTopicsView = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Tags className="mr-3 text-purple-500" size={24} />
        Topics Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-300/10">
              <th className="py-4 px-4 text-left">Name</th>
              <th className="py-4 px-4 text-left">Description</th>
              <th className="py-4 px-4 text-left">Post Count</th>
              <th className="py-4 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map(topic => (
              <tr key={topic.id} className="border-b border-dark-300/10 hover:bg-dark-300/5">
                <td className="py-4 px-4">{topic.name}</td>
                <td className="py-4 px-4 max-w-xs truncate">{topic.description}</td>
                <td className="py-4 px-4">{topic.postCount}</td>
                <td className="py-4 px-4 flex space-x-2">
                  <button 
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg flex items-center hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // New users view with stats from old version
  const renderUsersView = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Users className="mr-3 text-orange-500" size={24} />
        User Management
      </h2>

      {/* Stats cards from old version */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          ['Total Users', users.length, 'blue', Users],
          ['Active Users', users.filter(u => !u.banned).length, 'green', Activity],
          ['Banned Users', users.filter(u => u.banned).length, 'red', Clock]
        ].map(([title, count, color, Icon]) => (
          <div key={title} className="bg-dark-200/50 backdrop-blur border-dark-300/10 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400/60 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold">{count}</h3>
              </div>
              <div className={`p-3 bg-${color}-500/10 rounded-lg`}>
                <Icon className={`text-${color}-500`} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-300/10">
              <th className="py-4 px-4 text-left">Name</th>
              <th className="py-4 px-4 text-left">Email</th>
              <th className="py-4 px-4 text-left">Role</th>
              <th className="py-4 px-4 text-left">Status</th>
              <th className="py-4 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-dark-300/10 hover:bg-dark-300/5">
                <td className="py-4 px-4">{user.name}</td>
                <td className="py-4 px-4 text-dark-400/80">{user.email}</td>
                <td className="py-4 px-4">
                  <select
                    value={user.roles[0]}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className="bg-dark-300/20 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.banned ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {user.banned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => user.banned ? handleUnbanUser(user.id) : handleBanUser(user.id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      user.banned 
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                        : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    }`}
                  >
                    {user.banned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600/10 rounded-lg">
              <Shield className="text-red-600" size={28} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Advanced Content Management
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 mb-6">
          {[
            { name: 'Posts', icon: BookOpen, view: 'posts' },
            { name: 'Comments', icon: MessageCircle, view: 'comments' },
            { name: 'Topics', icon: Tags, view: 'topics' },
            { name: 'Users', icon: Users, view: 'users' }
          ].map(({ name, icon: Icon, view }) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`
                flex items-center px-4 py-2 rounded-lg transition 
                ${activeView === view 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'hover:bg-dark-300/20 text-dark-400'
                }
              `}
            >
              <Icon size={20} className="mr-2" /> {name}
            </button>
          ))}
        </div>

        {/* Conditional Rendering of Views */}
        <div className="bg-dark-200/50 backdrop-blur border-dark-300/10 rounded-2xl shadow-xl p-6">
          {activeView === 'posts' && renderPostsView()}
          {activeView === 'comments' && renderCommentsView()}
          {activeView === 'topics' && renderTopicsView()}
          {activeView === 'users' && renderUsersView()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;