import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { Shield, ChevronRight, Plus, FileText, MessageSquare, X } from 'lucide-react';
import { useAuth } from './AuthContext';

const Home = () => {
  
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const { user } = useAuth();

  
  const fetchUserRole = async () => {
    if (token) {
      try {
        const response = await api.get('/users/current');
        const roles = response.data.roles;
        setUserRole(roles);
      } catch (err) {
        console.error('Failed to fetch user role:', err);
      }
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await api.get('/topics');
      setTopics(response.data.content);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch topics');
    }
  };

  const createTopic = async () => {
    try {
      await api.post('/topics', { name: newTopicName, description: newTopicDescription });
      alert('Topic created successfully!');
      setShowForm(false);
      setNewTopicName('');
      setNewTopicDescription('');
      fetchTopics();
    } catch (err) {
      console.error(err);
      alert('Failed to create topic');
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchUserRole();
  }, []);

  const hasRole = (roleToCheck) => {
    return userRole?.includes(roleToCheck);
  };

  const renderDashboardButton = () => {
    if (!user) return null;

    if (user.isAdmin) {
      return (
        <button
          onClick={() => navigate('/admin')}
          className="bg-zinc-800/50 hover:bg-zinc-800 backdrop-blur-lg border border-zinc-700 hover:border-zinc-600 rounded-lg px-6 py-3 transition-all duration-200 group flex items-center space-x-3"
        >
          <div className="bg-zinc-900/50 p-2 rounded-lg group-hover:bg-red-500/10">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <span className="font-medium text-zinc-100 group-hover:text-red-400 transition-colors">
            Admin Dashboard
          </span>
        </button>
      );
    }

    if (hasRole('MODERATOR')) {
      return (
        <button
          onClick={() => navigate('/moderation')}
          className="bg-zinc-800/50 hover:bg-zinc-800 backdrop-blur-lg border border-zinc-700 hover:border-zinc-600 rounded-lg px-6 py-3 transition-all duration-200 group flex items-center space-x-3"
        >
          <div className="bg-zinc-900/50 p-2 rounded-lg group-hover:bg-blue-500/10">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-medium text-zinc-100 group-hover:text-blue-400 transition-colors">
            Moderator Dashboard
          </span>
        </button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Auth & Dashboard Section */}
        <div className="mb-12 flex items-center justify-between">
          {renderDashboardButton()}
        </div>

        {/* Hero Section with Logo - NEW ADDITION */}
        <div className="relative mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
            <div className="flex flex-col items-center md:items-start space-y-6 max-w-2xl">
              <div className="relative w-48 h-48 md:w-64 md:h-64 bg-zinc-800/50 rounded-full p-4 backdrop-blur-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-300 group">
                <img 
                  src="/minutegram-logo1.png" 
                  alt="MinuteGram Logo"
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-pulse"></div>
                <div className="absolute inset-[-10px] rounded-full border border-zinc-600/30 animate-spin-slow"></div>
              </div>
              <h1 className="text-5xl font-bold text-zinc-100 text-center md:text-left">
                MinuteGram
              </h1>
              <p className="text-xl text-zinc-400 text-center md:text-left">
                Share your moments, one minute at a time
              </p>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-zinc-800 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-4xl font-bold text-zinc-100">
                Community Topics
              </h1>
            </div>
            {token && (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-emerald-600 hover:bg-emerald-500 text-zinc-100 px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create Topic</span>
              </button>
            )}
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => navigate(`/topics/${topic.id}`)}
                className="w-full bg-zinc-800/50 hover:bg-zinc-800 backdrop-blur-lg border border-zinc-700 hover:border-zinc-600 rounded-xl p-6 transition-all duration-200 group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-zinc-900/50 p-2 rounded-lg group-hover:bg-emerald-500/10">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-zinc-100 group-hover:text-emerald-400 transition-colors">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {topic.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-20 bg-zinc-800/50 backdrop-blur-lg rounded-xl border border-zinc-700">
              <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">No topics yet</h3>
              <p className="text-zinc-500">Be the first to create a topic</p>
            </div>
          )}
        </div>

        {/* Create Topic Form */}
        {token && showForm && (
          <div className="mt-8 bg-zinc-800/50 backdrop-blur-lg rounded-xl p-6 border border-zinc-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-zinc-100">Create New Topic</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Topic Name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
              <textarea
                placeholder="Topic Description"
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none h-32"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTopic}
                  disabled={!newTopicName.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-zinc-100 px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Create Topic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;