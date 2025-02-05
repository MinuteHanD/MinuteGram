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
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
        >
          <Shield size={20} />
          <span>Admin Dashboard</span>
        </button>
      );
    }

    if (hasRole('MODERATOR')) {
      return (
        <button
          onClick={() => navigate('/moderator-dashboard')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Shield size={20} />
          <span>Moderator Dashboard</span>
        </button>
      );
    }

    return null;
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {!token && (
        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => navigate('/login')} 
            className="bg-dark-200 text-dark-400 px-6 py-3 rounded-lg hover:bg-dark-300 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="bg-dark-300 text-dark-50 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Signup
          </button>
        </div>
      )}

      {renderDashboardButton()}

      <div className="bg-dark-100 rounded-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-dark-400">Community Topics</h2>
          {token && (
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="bg-dark-300 text-dark-50 p-2 rounded-full hover:opacity-90 transition-opacity"
            >
              <Plus />
            </button>
          )}
        </div>

        <ul className="space-y-3">
          {topics.map((topic) => (
            <li 
              key={topic.id} 
              className="group flex items-center justify-between bg-dark-200 hover:bg-dark-300/20 transition-all duration-300 rounded-lg p-4 cursor-pointer"
              onClick={() => navigate(`/topics/${topic.id}`)}
            >
              <div>
                <h3 className="text-lg font-semibold text-dark-400 group-hover:text-dark-300 transition-colors">
                  {topic.name}
                </h3>
                <p className="text-gray-400 text-sm">{topic.description || 'No description'}</p>
              </div>
              <ChevronRight className="text-dark-300 group-hover:translate-x-1 transition-transform" />
            </li>
          ))}
        </ul>
      </div>

      {token && showForm && (
        <div className="bg-dark-200 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-semibold text-dark-400">Create New Topic</h3>
          <input
            type="text"
            placeholder="Topic Name"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            className="w-full bg-dark-100 text-dark-400 px-4 py-2 rounded-lg border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all"
          />
          <textarea
            placeholder="Topic Description"
            value={newTopicDescription}
            onChange={(e) => setNewTopicDescription(e.target.value)}
            className="w-full bg-dark-100 text-dark-400 px-4 py-2 rounded-lg border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all h-24"
          />
          <div className="flex space-x-4">
            <button 
              onClick={createTopic} 
              className="bg-dark-300 text-dark-50 px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Create
            </button>
            <button 
              onClick={() => setShowForm(false)} 
              className="bg-dark-200 text-dark-400 px-6 py-2 rounded-lg hover:bg-dark-300/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;