import React, { useState, useEffect } from 'react';
import api from '../service/apiClient';
import { 
  Shield, 
  Trash2, 
  Ban, 
  UserCheck, 
  BookOpen, 
  MessageCircle, 
  Users, 
  AlertTriangle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Hexagon 
} from 'lucide-react';

const ModeratorDashboard = () => {
  const [activeView, setActiveView] = useState('posts');
  
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
  
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(0);
  const [usersTotalPages, setUsersTotalPages] = useState(0);
  const [usersSearch, setUsersSearch] = useState('');
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    if (activeView === 'posts') fetchPosts(postsPage, 10, postsSearch);
    if (activeView === 'comments') fetchComments(commentsPage, 10, commentsSearch);
    if (activeView === 'users') fetchUsers(usersPage, 10, usersSearch);
  }, [activeView, postsPage, postsSearch, commentsPage, commentsSearch, usersPage, usersSearch]);

  const fetchPosts = async (page = 0, size = 10, search = '') => {
    setIsPostsLoading(true);
    setPostsError(null);
    try {
      const response = await api.get('/moderation/posts', { params: { page, size, search } });
      setPosts(response.data.content || response.data);
      setPostsTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPostsError(err.response?.data || 'Failed to load posts');
    } finally {
      setIsPostsLoading(false);
    }
  };

  const fetchComments = async (page = 0, size = 10, search = '') => {
    setIsCommentsLoading(true);
    setCommentsError(null);
    try {
      const response = await api.get('/moderation/comments', { params: { page, size, search } });
      console.log('Comments API Response:', response.data); // Debugging
      setComments(response.data.content || response.data);
      setCommentsTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setCommentsError(err.response?.data || 'Failed to load comments');
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const fetchUsers = async (page = 0, size = 10, search = '') => {
    setIsUsersLoading(true);
    setUsersError(null);
    try {
      const response = await api.get('/moderation/users', { params: { page, size, search } });
      setUsers(response.data.content || response.data);
      setUsersTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsersError(err.response?.data || 'Failed to load users');
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/moderation/posts/${postId}`);
      fetchPosts(postsPage, 10, postsSearch);
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/moderation/comments/${commentId}`);
      fetchComments(commentsPage, 10, commentsSearch);
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await api.post(`/moderation/users/${userId}/ban`);
      fetchUsers(usersPage, 10, usersSearch);
    } catch (err) {
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.post(`/moderation/users/${userId}/unban`);
      fetchUsers(usersPage, 10, usersSearch);
    } catch (err) {
      alert('Failed to unban user');
    }
  };

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
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-all">
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.author?.username || 'Unknown'}</TableCell>
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
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {comments.map(comment => (
                  <tr key={comment.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-all">
                    <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                    <TableCell>{comment.authorName || comment.author?.username || 'Unknown'}</TableCell> {/* Adjusted */}
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
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-all">
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
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
                        icon={user.banned ? UserCheck : Ban}
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

  return (
    <div className="min-h-screen bg-zinc-950 pt-16 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-teal-900/5 via-zinc-900/5 to-zinc-900/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500/10 p-3 rounded-xl border border-teal-500/20">
              <Hexagon className="text-teal-400" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Moderator Dashboard
            </h1>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { name: 'Posts', icon: BookOpen, view: 'posts' },
              { name: 'Comments', icon: MessageCircle, view: 'comments' },
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

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-8 shadow-xl shadow-black/20">
          {activeView === 'posts' && renderPostsView()}
          {activeView === 'comments' && renderCommentsView()}
          {activeView === 'users' && renderUsersView()}
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;