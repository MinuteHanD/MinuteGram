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
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer 
} from 'recharts';
import api from '../service/apiClient';

const AdminDashboard = () => {
  
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [overTimeData, setOverTimeData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '', onConfirm: null });
  
  const [posts, setPosts] = useState([]);
  const [postsPage, setPostsPage] = useState(0);
  const [postsTotalPages, setPostsTotalPages] = useState(0);
  const [postsSearch, setPostsSearch] = useState('');
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [commentsSearch, setCommentsSearch] = useState('');
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  
  const [topics, setTopics] = useState([]);
  const [topicsPage, setTopicsPage] = useState(0);
  const [topicsTotalPages, setTopicsTotalPages] = useState(0);
  const [topicsSearch, setTopicsSearch] = useState('');
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(0);
  const [usersTotalPages, setUsersTotalPages] = useState(0);
  const [usersSearch, setUsersSearch] = useState('');
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

 
  useEffect(() => {
    fetchStats();
    fetchOverTimeData();
    fetchRolesData();
  }, []);

  useEffect(() => {
    if (activeView === 'posts') fetchPosts(postsPage, 10, postsSearch);
    if (activeView === 'comments') fetchComments(commentsPage, 10, commentsSearch);
    if (activeView === 'topics') fetchTopics(topicsPage, 10, topicsSearch);
    if (activeView === 'users') fetchUsers(usersPage, 10, usersSearch);
  }, [activeView, postsPage, postsSearch, commentsPage, commentsSearch, topicsPage, topicsSearch, usersPage, usersSearch]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchOverTimeData = async () => {
    try {
      const response = await api.get('/admin/posts/over-time');
      setOverTimeData(response.data);
    } catch (err) {
      console.error('Failed to fetch over time data:', err);
    }
  };

  const fetchRolesData = async () => {
    try {
      const response = await api.get('/admin/users/roles-distribution');
      const data = Object.entries(response.data).map(([role, count]) => ({ name: role, value: count }));
      setRolesData(data);
    } catch (err) {
      console.error('Failed to fetch roles distribution:', err);
    }
  };

  const fetchPosts = async (page = 0, size = 10, search = '') => {
    setIsPostsLoading(true);
    setPostsError(null);
    try {
      const response = await api.get('/admin/posts', { params: { page, size, search } });
      setPosts(response.data.content);
      setPostsTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPostsError('Failed to load posts');
    } finally {
      setIsPostsLoading(false);
    }
  };

  const fetchComments = async (page = 0, size = 10, search = '') => {
    setIsCommentsLoading(true);
    setCommentsError(null);
    try {
      const response = await api.get('/admin/comments', { params: { page, size, search } });
      setComments(response.data.content);
      setCommentsTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setCommentsError('Failed to load comments');
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const fetchTopics = async (page = 0, size = 10, search = '') => {
    setIsTopicsLoading(true);
    setTopicsError(null);
    try {
      const response = await api.get('/admin/topics', { params: { page, size, search } });
      setTopics(response.data.content);
      setTopicsTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      setTopicsError('Failed to load topics');
    } finally {
      setIsTopicsLoading(false);
    }
  };

  const fetchUsers = async (page = 0, size = 10, search = '') => {
    setIsUsersLoading(true);
    setUsersError(null);
    try {
      const response = await api.get('/admin/users', { params: { page, size, search } });
      setUsers(response.data.content);
      setUsersTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsersError('Failed to load users');
    } finally {
      setIsUsersLoading(false);
    }
  };

  
  const showConfirmDialog = (message, onConfirm) => {
    console.log('showConfirmDialog called with:', message);
    setConfirmDialog({ show: true, message, onConfirm });
  };

  const handleDeletePost = async (postId) => {
    console.log('handleDeletePost called with postId:', postId);
    showConfirmDialog('Are you sure you want to delete this post?', async () => {
      try {
        await api.delete(`/admin/posts/${postId}`);
        fetchPosts(postsPage, 10, postsSearch);
        alert('Post deleted successfully');
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post');
      }
    });
  };

  const handleDeleteComment = async (commentId) => {
    showConfirmDialog('Are you sure you want to delete this comment?', async () => {
      try {
        await api.delete(`/admin/comments/${commentId}`);
        fetchComments(commentsPage, 10, commentsSearch);
        alert('Comment deleted successfully');
      } catch (err) {
        console.error('Failed to delete comment:', err);
        alert('Failed to delete comment');
      }
    });
  };

  const handleDeleteTopic = async (topicId) => {
    showConfirmDialog('Are you sure you want to delete this topic?', async () => {
      try {
        await api.delete(`/admin/topics/${topicId}`);
        fetchTopics(topicsPage, 10, topicsSearch);
        alert('Topic deleted successfully');
      } catch (err) {
        console.error('Failed to delete topic:', err);
        alert('Failed to delete topic');
      }
    });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.post(`/admin/users/${userId}/role?newRole=${newRole}`);
      fetchUsers(usersPage, 10, usersSearch);
      alert('Role updated successfully');
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Failed to update role');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/ban`);
      fetchUsers(usersPage, 10, usersSearch);
      alert('User banned successfully');
    } catch (err) {
      console.error('Failed to ban user:', err);
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/unban`);
      fetchUsers(usersPage, 10, usersSearch);
      alert('User unbanned successfully');
    } catch (err) {
      console.error('Failed to unban user:', err);
      alert('Failed to unban user');
    }
  };

  
  const StatCard = ({ title, count, Icon, color }) => (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white">{count}</h3>
        </div>
        <div className={`p-3 bg-teal-500/10 rounded-lg`}>
          <Icon className={`text-teal-400`} size={28} />
        </div>
      </div>
    </div>
  );

  const TableHeader = ({ children }) => (
    <th className="py-4 px-6 text-left text-zinc-400 font-semibold text-sm uppercase tracking-wide">{children}</th>
  );

  const TableCell = ({ children, className = '' }) => (
    <td className={`py-4 px-6 text-zinc-300 text-sm ${className}`}>{children}</td>
  );

  const ActionButton = ({ onClick, icon: Icon, label, variant = 'danger' }) => {
    const variants = {
      danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
      success: 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20'
    };

    return (
      <button 
        onClick={onClick}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium ${variants[variant]}`}
      >
        <Icon size={16} />
        <span>{label}</span>
      </button>
    );
  };

  
  const renderDashboardView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
        <Shield className="mr-3 text-teal-400" size={28} /> Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Posts" count={stats.totalPosts || 0} Icon={BookOpen} color="teal" />
        <StatCard title="Total Comments" count={stats.totalComments || 0} Icon={MessageCircle} color="teal" />
        <StatCard title="Total Topics" count={stats.totalTopics || 0} Icon={Tags} color="teal" />
        <StatCard title="Total Users" count={stats.totalUsers || 0} Icon={Users} color="teal" />
        <StatCard title="Active Users" count={stats.activeUsers || 0} Icon={Activity} color="teal" />
        <StatCard title="Banned Users" count={stats.bannedUsers || 0} Icon={AlertCircle} color="teal" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Activity Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={overTimeData}>
              <Line type="monotone" dataKey="postCount" stroke="#2dd4bf" name="Posts" strokeWidth={2} />
              <Line type="monotone" dataKey="commentCount" stroke="#5eead4" name="Comments" strokeWidth={2} />
              <CartesianGrid stroke="#1f2937" strokeDasharray="5 5" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ color: '#e5e7eb' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">User Roles Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={rolesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {rolesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#2dd4bf', '#5eead4', '#99f6e4'][index % 3]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPostsView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
        <BookOpen className="mr-3 text-teal-400" size={28} /> Posts Management
      </h2>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search posts by title..."
            value={postsSearch}
            onChange={(e) => setPostsSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 rounded-lg border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>
      </div>
      {postsError ? (
        <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{postsError}</div>
      ) : isPostsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-400" />
        </div>
      ) : (
        <>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Author</TableHeader>
                  <TableHeader>Created At</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-all">
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
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPostsPage(prev => Math.max(prev - 1, 0))}
              disabled={postsPage === 0}
              className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 hover:text-teal-400 disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-zinc-400">Page {postsPage + 1} of {postsTotalPages}</span>
            <button
              onClick={() => setPostsPage(prev => prev + 1)}
              disabled={postsPage >= postsTotalPages - 1}
              className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 hover:text-teal-400 disabled:opacity-50 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderCommentsView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
        <MessageCircle className="mr-3 text-teal-400" size={28} /> Comments Management
      </h2>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search comments by content..."
            value={commentsSearch}
            onChange={(e) => setCommentsSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 rounded-lg border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>
      </div>
      {commentsError ? (
        <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{commentsError}</div>
      ) : isCommentsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-400" />
        </div>
      ) : (
        <>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <TableHeader>Content</TableHeader>
                  <TableHeader>Author</TableHeader>
                  <TableHeader>Post</TableHeader>
                  <TableHeader>Created At</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {comments.map(comment => (
                  <tr key={comment.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-all">
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
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCommentsPage(prev => Math.max(prev - 1, 0))}
              disabled={commentsPage === 0}
              className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 hover:text-teal-400 disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-zinc-400">Page {commentsPage + 1} of {commentsTotalPages}</span>
            <button
              onClick={() => setCommentsPage(prev => prev + 1)}
              disabled={commentsPage >= commentsTotalPages - 1}
              className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 hover:text-teal-400 disabled:opacity-50 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderTopicsView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
        <Tags className="mr-3 text-teal-400" size={28} /> Topics Management
      </h2>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search topics by name..."
            value={topicsSearch}
            onChange={(e) => setTopicsSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 rounded-lg border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>
      </div>
      {topicsError ? (
        <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{topicsError}</div>
      ) : isTopicsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-400" />
        </div>
      ) : (
        <>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Post Count</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {topics.map(topic => (
                  <tr key={topic.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-all">
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
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setTopicsPage(prev => Math.max(prev - 1, 0))}
              disabled={topicsPage === 0}
              className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 hover:text-teal-400 disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-zinc-400">Page {topicsPage + 1} of {topicsTotalPages}</span>
            <button
              onClick={() => setTopicsPage(prev => prev + 1)}
              disabled={topicsPage >= topicsTotalPages - 1}
              className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 hover:text-teal-400 disabled:opacity-50 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderUsersView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
        <Users className="mr-3 text-teal-400" size={28} /> User Management
      </h2>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={usersSearch}
            onChange={(e) => setUsersSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 rounded-lg border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>
      </div>
      {usersError ? (
        <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{usersError}</div>
      ) : isUsersLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-400" />
        </div>
      ) : (
        <>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-all">
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <select
                        value={user.roles[0]}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        className="bg-zinc-900 text-zinc-300 rounded-lg px-3 py-2 text-sm border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all"
                      >
                        <option value="USER">User</option>
                        <option value="MODERATOR">Moderator</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.banned 
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-teal-500/10 text-teal-400'
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
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setUsersPage(prev => Math.max(prev - 1, 0))}
              disabled={usersPage === 0}
              className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 hover:text-teal-400 disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-zinc-400">Page {usersPage + 1} of {usersTotalPages}</span>
            <button
              onClick={() => setUsersPage(prev => prev + 1)}
              disabled={usersPage >= usersTotalPages - 1}
              className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400 hover:text-teal-400 disabled:opacity-50 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Main render (redesigned)
  return (
    <div className="min-h-screen bg-zinc-950 pt-16 pb-12">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-900/5 via-zinc-900/5 to-zinc-900/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500/10 p-3 rounded-xl border border-teal-500/20">
              <Hexagon className="text-teal-400" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Admin Dashboard
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { name: 'Dashboard', icon: Shield, view: 'dashboard' },
              { name: 'Posts', icon: BookOpen, view: 'posts' },
              { name: 'Comments', icon: MessageCircle, view: 'comments' },
              { name: 'Topics', icon: Tags, view: 'topics' },
              { name: 'Users', icon: Users, view: 'users' }
            ].map(({ name, icon: Icon, view }) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 text-sm font-medium whitespace-nowrap
                  ${activeView === view 
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' 
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-teal-400'
                  }
                `}
              >
                <Icon size={20} /> {name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-8 shadow-xl shadow-black/20">
          {activeView === 'dashboard' && renderDashboardView()}
          {activeView === 'posts' && renderPostsView()}
          {activeView === 'comments' && renderCommentsView()}
          {activeView === 'topics' && renderTopicsView()}
          {activeView === 'users' && renderUsersView()}
        </div>

        {/* Custom Confirmation Dialog */}
        {console.log('confirmDialog state:', confirmDialog)}
        {confirmDialog.show && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Confirm Action</h3>
              <p className="text-zinc-300 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDialog({ show: false, message: '', onConfirm: null })}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog({ show: false, message: '', onConfirm: null });
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;