import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { Shield, ChevronRight, Plus, FileText, MessageSquare, X, Search, Settings, Bell } from 'lucide-react';
import { useAuth } from './AuthContext';

const Home = () => {
  // States remain the same as previous version
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const { user } = useAuth();

  // API functions remain the same
  const fetchUserRole = async () => {
    if (token) {
      try {
        const response = await api.get('/users/current');
        setUserRole(response.data.roles);
      } catch (err) {
        console.error('Failed to fetch user role:', err);
      }
    }
  };

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/topics');
      setTopics(response.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTopic = async () => {
    if (!newTopicName.trim()) return;
    
    try {
      await api.post('/topics', {
        name: newTopicName,
        description: newTopicDescription
      });
      setShowForm(false);
      setNewTopicName('');
      setNewTopicDescription('');
      fetchTopics();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchUserRole();
  }, []);

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-b border-emerald-900/30 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Auth Navigation */}
        <div className="h-12 flex items-center justify-end border-b border-emerald-900/20">
          {token ? (
            <nav className="flex items-center space-x-6">
              <span className="text-emerald-400">
                Welcome, {user?.name || 'User'}
              </span>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.reload();
                }}
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Logout
              </button>
            </nav>
          ) : (
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg transition-colors text-sm"
              >
                Sign Up
              </button>
            </nav>
          )}
        </div>
  
        {/* Main Header Content */}
        <div className="h-16 flex items-center justify-between">
          <div className="flex-1 flex items-center justify-start">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-black/20 rounded-lg border border-emerald-800/50 focus:outline-none focus:border-emerald-500 text-gray-100"
              />
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              MinuteGram
            </h1>
          </div>
  
          <div className="flex-1 flex items-center justify-end space-x-4">
            <button className="p-2 hover:bg-emerald-900/20 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-emerald-400" />
            </button>
            <button className="p-2 hover:bg-emerald-900/20 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-emerald-400" />
            </button>
            {user && (
              <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  const renderDashboardButton = () => {
    if (!user) return null;

    const buttonProps = user.isAdmin ? {
      onClick: () => navigate('/admin'),
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      text: 'Admin Dashboard'
    } : hasRole('MODERATOR') ? {
      onClick: () => navigate('/moderation'),
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      text: 'Moderator Dashboard'
    } : null;

    if (!buttonProps) return null;

    return (
      <button
        onClick={buttonProps.onClick}
        className="bg-black/20 hover:bg-black/30 backdrop-blur-lg border border-emerald-900/30 hover:border-emerald-800 rounded-lg px-6 py-3 transition-all duration-200 group flex items-center space-x-3"
      >
        <div className="bg-black/30 p-2 rounded-lg group-hover:bg-emerald-500/10">
          {buttonProps.icon}
        </div>
        <span className="font-medium text-gray-100 group-hover:text-emerald-400 transition-colors">
          {buttonProps.text}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      
      
      <main className="relative max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            {renderDashboardButton()}
            <div className="bg-black/20 backdrop-blur-lg rounded-lg p-4 border border-emerald-900/30">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Topics</span>
                  <span className="text-emerald-400 font-medium">{topics.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Your Topics</span>
                  <span className="text-emerald-400 font-medium">
                    {topics.filter(t => t.userId === user?.id).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-100">Community Topics</h1>
              {token && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Topic</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-black/20 h-32 rounded-lg" />
                ))}
              </div>
            ) : filteredTopics.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => navigate(`/topics/${topic.id}`)}
                    className="bg-black/20 hover:bg-black/30 backdrop-blur-lg border border-emerald-900/30 hover:border-emerald-800 rounded-lg p-4 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-black/30 p-2 rounded-lg group-hover:bg-emerald-500/10 mt-1">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-100 group-hover:text-emerald-400 transition-colors truncate">
                          {topic.name}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                          {topic.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/20 backdrop-blur-lg rounded-lg border border-emerald-900/30">
                <MessageSquare className="w-12 h-12 text-emerald-600/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No topics found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search' : 'Be the first to create a topic'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Topic Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-emerald-900/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-100">Create New Topic</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full bg-black/30 border border-emerald-900/30 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  placeholder="Enter topic name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  className="w-full bg-black/30 border border-emerald-900/30 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none h-32"
                  placeholder="Enter topic description"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTopic}
                  disabled={!newTopicName.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Create Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;