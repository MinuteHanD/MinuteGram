import React, { useState } from 'react';
import api from '../service/apiClient';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Hexagon, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
 
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Left Panel - Branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-zinc-900 to-zinc-800 border-r border-zinc-800 p-8 flex flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="bg-teal-500/10 p-2 rounded-lg">
            <Hexagon className="w-6 h-6 text-teal-400" />
          </div>
          <span className="text-xl font-bold text-white">MinuteGram</span>
        </div>
        
        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">
            Join the<br />
            <span className="text-teal-400">conversation</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8">
            Create an account to participate in discussions, share your thoughts, and connect with others.
          </p>
          
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-teal-500/10 p-2 rounded-full mt-1">
                <User className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Community-driven platform</h3>
                <p className="text-zinc-400 text-sm">Join thousands of users sharing knowledge and experiences.</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="text-zinc-400 hover:text-teal-400 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </button>
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
            <p className="text-zinc-400">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-zinc-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-zinc-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-zinc-500"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500">At least 8 characters recommended</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <UserPlus className="w-5 h-5" />
              <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;