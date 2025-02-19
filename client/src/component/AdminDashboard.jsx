import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  MessageCircle, 
  Tags, 
  Trash2, 
  Shield,
  Users,
  Activity,
  Clock,
  Hexagon,
  AlertCircle
} from 'lucide-react';
import api from '../service/apiClient';

const AdminDashboard = () => {
  // State variables
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data concurrently on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPosts(),
          fetchComments(),
          fetchTopics(),
          fetchUsers()
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Data fetching functions
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
      // Preserve your original structure (topics are in response.data.content)
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

  // Action handlers
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

  // Helper UI components
  const StatCard = ({ title, count, Icon, color }) => (
    <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-zinc-100">{count}</h3>
        </div>
        <div className={`p-3 bg-${color}-900/20 rounded-lg`}>
          <Icon className={`text-${color}-400`} size={24} />
        </div>
      </div>
    </div>
  );

  const TableHeader = ({ children }) => (
    <th className="py-4 px-4 text-left text-zinc-400 font-medium">{children}</th>
  );

  const TableCell = ({ children, className = '' }) => (
    <td className={`py-4 px-4 text-zinc-300 ${className}`}>{children}</td>
  );

  const ActionButton = ({ onClick, icon: Icon, label, variant = 'danger' }) => {
    const variants = {
      danger: 'bg-red-900/20 text-red-400 hover:bg-red-900/40',
      success: 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40'
    };

    return (
      <button 
        onClick={onClick}
        className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all ${variants[variant]}`}
      >
        <Icon size={16} />
        <span>{label}</span>
      </button>
    );
  };

  // Views

  const renderPostsView = () => (
    <div>
      <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center">
        <BookOpen className="mr-3 text-emerald-400" size={24} />
        Posts Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700/50">
              <TableHeader>Title</TableHeader>
              <TableHeader>Author</TableHeader>
              <TableHeader>Created At</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-zinc-700/50 hover:bg-zinc-800/30">
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.authorName}</TableCell>
                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <ActionButton 
                    onClick={() => handleDeletePost(post.id)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCommentsView = () => (
    <div>
      <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center">
        <MessageCircle className="mr-3 text-emerald-400" size={24} />
        Comments Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700/50">
              <TableHeader>Content</TableHeader>
              <TableHeader>Author</TableHeader>
              <TableHeader>Post</TableHeader>
              <TableHeader>Created At</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment.id} className="border-b border-zinc-700/50 hover:bg-zinc-800/30">
                <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                <TableCell>{comment.authorName}</TableCell>
                <TableCell>{comment.postTitle}</TableCell>
                <TableCell>{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <ActionButton 
                    onClick={() => handleDeleteComment(comment.id)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTopicsView = () => (
    <div>
      <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center">
        <Tags className="mr-3 text-emerald-400" size={24} />
        Topics Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700/50">
              <TableHeader>Name</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Post Count</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {topics.map(topic => (
              <tr key={topic.id} className="border-b border-zinc-700/50 hover:bg-zinc-800/30">
                <TableCell>{topic.name}</TableCell>
                <TableCell className="max-w-xs truncate">{topic.description}</TableCell>
                <TableCell>{topic.postCount}</TableCell>
                <TableCell>
                  <ActionButton 
                    onClick={() => handleDeleteTopic(topic.id)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersView = () => (
    <div>
      <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center">
        <Users className="mr-3 text-emerald-400" size={24} />
        User Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          count={users.length} 
          Icon={Users} 
          color="emerald" 
        />
        <StatCard 
          title="Active Users" 
          count={users.filter(u => !u.banned).length} 
          Icon={Activity} 
          color="emerald" 
        />
        <StatCard 
          title="Banned Users" 
          count={users.filter(u => u.banned).length} 
          Icon={AlertCircle} 
          color="red" 
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700/50">
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-zinc-700/50 hover:bg-zinc-800/30">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <select
                    value={user.roles[0]}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className="bg-zinc-800 text-zinc-300 rounded-lg px-3 py-1.5 text-sm border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                  </select>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.banned 
                      ? 'bg-red-900/20 text-red-400'
                      : 'bg-emerald-900/20 text-emerald-400'
                  }`}>
                    {user.banned ? 'Banned' : 'Active'}
                  </span>
                </TableCell>
                <TableCell>
                  <ActionButton 
                    onClick={() => user.banned ? handleUnbanUser(user.id) : handleBanUser(user.id)}
                    icon={user.banned ? Activity : AlertCircle}
                    label={user.banned ? 'Unban' : 'Ban'}
                    variant={user.banned ? 'success' : 'danger'}
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <Hexagon className="text-emerald-400" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-zinc-100">
              Admin Dashboard
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
                flex items-center px-4 py-2 rounded-lg transition-all
                ${activeView === view 
                  ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                }
              `}
            >
              <Icon size={20} className="mr-2" /> {name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
            </div>
          ) : (
            <>
              {activeView === 'posts' && renderPostsView()}
              {activeView === 'comments' && renderCommentsView()}
              {activeView === 'topics' && renderTopicsView()}
              {activeView === 'users' && renderUsersView()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
