import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { Shield, Plus, MessageSquare, X, Search, Settings, Bell, Bookmark, TrendingUp, Clock, Users, Code, Star, ChevronRight } from 'lucide-react';
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
  const [activeFilter, setActiveFilter] = useState('all');

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
      <div className="bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 border border-zinc-800 hover:border-indigo-500/30">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/10 p-2 rounded">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs text-zinc-500 flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  Created by {topic.creatorName || 'Anonymous'}
                </p>
              </div>
            </div>
            <div className="bg-zinc-800 px-2 py-1 rounded text-xs font-medium text-indigo-300">
              {topic.postCount || 0} posts
            </div>
          </div>
          <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
            {topic.description || 'No description provided'}
          </p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center text-zinc-500">
                <Clock className="w-3 h-3 mr-1" />
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <span className="text-indigo-400 flex items-center group-hover:underline">
              View topic <ChevronRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16 bg-zinc-900 rounded-lg border border-zinc-800">
      <div className="bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <MessageSquare className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">No topics found</h3>
      <p className="text-zinc-400 max-w-md mx-auto mb-8">
        {searchQuery 
          ? 'Try adjusting your search terms'
          : 'Be the first to create a topic and start the conversation'}
      </p>
      {token && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Topic</span>
        </button>
      )}
    </div>
  );

  const renderTopicSkeleton = () => (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-zinc-800 rounded animate-pulse"></div>
        <div>
          <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-4 w-full bg-zinc-800 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse mb-4"></div>
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse"></div>
      </div>
    </div>
  );

  const filterButtons = [
    { id: 'all', label: 'All Topics', icon: MessageSquare },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'new', label: 'Newest', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/5 via-zinc-900/5 to-zinc-900/5" />
      
      {/* Subtle dot pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat" />
      
      <main className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-12 relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
            <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between">
              <div className="mb-6 lg:mb-0 lg:mr-8 text-left max-w-xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  Welcome to <span className="text-indigo-400">Minutegram</span>
                </h1>
                <p className="text-zinc-400 text-lg mb-6">
                  Desperate need for a job -- Amritanshu
                </p>
                {!token && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => navigate('/signup')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      Join the community
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      Sign in
                    </button>
                  </div>
                )}
              </div>
              <div className="hidden lg:block w-64 h-64 relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-indigo-600 rounded-full opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/public/Logo2.png"
                  alt="Custom Icon"
                  //className="w-20 h-20"
                />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 rounded-lg border border-zinc-800 focus:outline-none focus:border-indigo-500 text-white placeholder-zinc-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                  {filterButtons.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          activeFilter === filter.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
                {token && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white h-full px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">New Topic</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  {renderTopicSkeleton()}
                </div>
              ))}
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div onClick={(e) => e.stopPropagation()} className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Topic</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-zinc-400 hover:text-white transition-colors rounded-full p-1 hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  placeholder="Enter topic name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none h-32"
                  placeholder="Enter topic description"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTopic}
                  disabled={!newTopicName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
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