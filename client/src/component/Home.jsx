import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { Shield, Plus, MessageSquare, X, Search, Settings, Bell, Bookmark, TrendingUp } from 'lucide-react';
import { useAuth } from './AuthContext';

const Home = () => {
  // States
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

  // API calls 
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

  const renderTopicCard = (topic) => (
    <div
      key={topic.id}
      onClick={() => navigate(`/topics/${topic.id}`)}
      className="group cursor-pointer"
    >
      <div className="bg-black/30 backdrop-blur-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-500/10 p-2.5 rounded-lg">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">
                {topic.name}
              </h3>
              <p className="text-sm text-gray-400">
                Created by {topic.creatorName || 'Anonymous'}
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {topic.description || 'No description provided'}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <MessageSquare className="w-4 h-4" />
              <span>{topic.postCount || 0} posts</span>
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0" />
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16 bg-black/20 backdrop-blur-lg rounded-xl border border-emerald-900/30">
      <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <MessageSquare className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-200 mb-3">No topics found</h3>
      <p className="text-gray-400 max-w-md mx-auto mb-8">
        {searchQuery 
          ? 'Try adjusting your search terms'
          : 'Be the first to create a topic and start the conversation'}
      </p>
      {token && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Topic</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0F16] bg-opacity-98">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/10 via-gray-900/5 to-gray-900/10" />
      
      {/* Subtle dot pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.15] bg-repeat" />
      
      <main className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-4">
              Welcome to MinuteGram
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cum Back soon.....
            </p>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 rounded-xl border border-emerald-900/30 focus:outline-none focus:border-emerald-500 text-gray-100 placeholder-gray-500"
              />
            </div>
            {token && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Topic</span>
              </button>
            )}
          </div>

          {/* Topics Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-black/20 h-48 rounded-xl" />
              ))}
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTopics.map(renderTopicCard)}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </main>

      {/* Create Topic Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full bg-black/30 border border-emerald-900/30 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  placeholder="Enter topic name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  className="w-full bg-black/30 border border-emerald-900/30 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none h-32"
                  placeholder="Enter topic description"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTopic}
                  disabled={!newTopicName.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
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