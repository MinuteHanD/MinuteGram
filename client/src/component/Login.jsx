import React, { useState } from 'react';
import api from '../service/apiClient';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Hexagon } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(null);
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await api.post('/auth/login', formData);
      
      if (!data.token) {
        throw new Error('No token received');
      }

      
      const authData = {
        token: data.token,
        roles: data.roles,
        email: data.email
      };
      
      Object.entries(authData).forEach(([key, value]) => {
        localStorage.setItem(key === 'roles' ? 'userRoles' : key === 'email' ? 'userEmail' : key, 
          typeof value === 'object' ? JSON.stringify(value) : value
        );
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
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
            Welcome back
          </h2>
          <p className="text-zinc-400">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
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
            <LogIn className="w-5 h-5" />
            <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => navigate('/signup')}
            className="text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            Need an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;