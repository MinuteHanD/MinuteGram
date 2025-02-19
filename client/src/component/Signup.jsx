import React, { useState } from 'react';
import api from '../service/apiClient';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Hexagon } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
      {/* Logo Header */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="bg-zinc-800/50 p-2 rounded-lg">
          <Hexagon className="w-6 h-6 text-emerald-400" />
        </div>
        <span className="text-xl font-bold text-zinc-100">
          MinuteGram
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-zinc-800/50 backdrop-blur-lg border border-zinc-700 rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-100">
            Create your account
          </h2>
          <p className="text-zinc-400">
            Join the MinuteGram community
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 text-zinc-100 pl-10 pr-4 py-2 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-500"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 text-zinc-100 pl-10 pr-4 py-2 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 text-zinc-100 pl-10 pr-4 py-2 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-500"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-100 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-5 h-5" />
            <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;