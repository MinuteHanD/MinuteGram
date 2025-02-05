import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
import { Shield, ChevronRight, Plus } from 'lucide-react';

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);

  // Existing logic remains unchanged...
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
    if (!token || !userRole) return null;

    if (hasRole('ADMIN')) {
      return (
        <button
          onClick={() => navigate('/admin')}
          className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-3 hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-600/20"
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Admin Dashboard</span>
        </button>
      );
    }

    if (hasRole('MODERATOR')) {
      return (
        <button
          onClick={() => navigate('/moderator-dashboard')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-3 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-600/20"
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Moderator Dashboard</span>
        </button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-100 to-dark-200">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Auth Buttons */}
        {!token && (
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => navigate('/login')} 
              className="bg-dark-200 text-dark-400 px-8 py-3 rounded-lg hover:bg-dark-300 transition-all duration-300 shadow-lg hover:shadow-dark-300/20"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="bg-dark-300 text-dark-50 px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-dark-300/20"
            >
              Signup
            </button>
          </div>
        )}

        {renderDashboardButton()}

        {/* Main Content */}
        <div className="bg-dark-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-dark-300/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-dark-400 bg-gradient-to-r from-dark-400 to-dark-300 bg-clip-text text-transparent">
              Community Topics
            </h2>
            {token && (
              <button 
                onClick={() => setShowForm(!showForm)} 
                className="bg-dark-300 text-dark-50 p-3 rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-dark-300/20 hover:scale-105"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>

          <ul className="space-y-4">
            {topics.map((topic) => (
              <li 
                key={topic.id} 
                className="group bg-dark-200/50 hover:bg-dark-300/20 transition-all duration-300 rounded-xl p-6 cursor-pointer border border-dark-300/10 hover:border-dark-300/30 shadow-lg hover:shadow-xl"
                onClick={() => navigate(`/topics/${topic.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-dark-400 group-hover:text-dark-300 transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {topic.description || 'No description'}
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-dark-300 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Create Topic Form */}
        {token && showForm && (
          <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-2xl border border-dark-300/10">
            <h3 className="text-2xl font-bold text-dark-400">Create New Topic</h3>
            <input
              type="text"
              placeholder="Topic Name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="w-full bg-dark-100/50 text-dark-400 px-6 py-3 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300 placeholder:text-dark-400/50"
            />
            <textarea
              placeholder="Topic Description"
              value={newTopicDescription}
              onChange={(e) => setNewTopicDescription(e.target.value)}
              className="w-full bg-dark-100/50 text-dark-400 px-6 py-4 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300 h-32 placeholder:text-dark-400/50 resize-none"
            />
            <div className="flex space-x-4">
              <button 
                onClick={createTopic} 
                className="bg-dark-300 text-dark-50 px-8 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-dark-300/20"
              >
                Create
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                className="bg-dark-200 text-dark-400 px-8 py-3 rounded-xl hover:bg-dark-300/20 transition-all duration-300 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;