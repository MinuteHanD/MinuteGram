import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MessageCircle, 
  Tags, 
  Trash2, 
  Eye, 
  Edit2, 
  AlertCircle 
} from 'lucide-react';
import api from '../service/apiClient';

const AdminDashboard = () => {
  // State for different sections
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [topics, setTopics] = useState([]);

  // Active view state
  const [activeView, setActiveView] = useState('posts');

  // Fetch data on component mount
  useEffect(() => {
    fetchPosts();
    fetchComments();
    fetchTopics();
  }, []);

  // Fetch functions
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
      // Use .content to extract the array of topics from the Page object
      setTopics(response.data.content);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      alert('Failed to load topics');
    }
  };

  // Delete handlers
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

  // Render functions for different views
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600/10 rounded-lg">
              <AlertCircle className="text-red-600" size={28} />
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
            { name: 'Topics', icon: Tags, view: 'topics' }
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;