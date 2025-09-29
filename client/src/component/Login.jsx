import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';
// CRITICAL: You must import and use the context's functions.
import { useAuth } from './AuthContext'; 
import { LogIn, Mail, Lock, Hexagon, ArrowLeft, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Get the MASTER login function from the context. This is the only way.
  const { login } = useAuth(); 

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
      // 1. Call the login API. This part was correct.
      const response = await api.post('/auth/login', formData);
      const { token, ...userData } = response.data;

      if (!token || !userData) {
        throw new Error('Invalid response from server during login.');
      }

      // 2. THIS IS THE FIX.
      //    We call the one true 'login' function from our AuthContext.
      //    It handles setting the user state AND saving the token to localStorage.
      //    The AuthContext login function will handle navigation, so we don't need to navigate here.
      login(userData, token);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Authentication failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ALL YOUR JSX IS FINE. I AM COPYING IT VERBATIM. ---
  // The only thing that changes is the logic in the handleLogin function.
  
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
          <h1 className="text-4xl font-bold text-white mb-6">Welcome<br /><span className="text-teal-400">back</span></h1>
          <p className="text-zinc-400 text-lg mb-8">Sign in to your account to continue your discussions and engage with the community.</p>
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-teal-500/10 p-2 rounded-full mt-1"><LogIn className="w-5 h-5 text-teal-400" /></div>
              <div>
                <h3 className="text-white font-medium mb-2">Secure access</h3>
                <p className="text-zinc-400 text-sm">Your data is encrypted and never shared with third parties.</p>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-teal-400 transition-colors flex items-center space-x-2"><ArrowLeft className="w-4 h-4" /><span>Back to home</span></button>
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
            <p className="text-zinc-400">Don't have an account?{' '}<button onClick={() => navigate('/signup')} className="text-teal-400 hover:text-teal-300 transition-colors font-medium">Create account</button></p>
          </div>
          {error && (<div className="mb-6 bg-red-900/20 border border-red-800/30 rounded-lg p-4 flex items-start space-x-3"><AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /><p className="text-red-400 text-sm">{error}</p></div>)}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" /><input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-zinc-500" required /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><label className="block text-sm font-medium text-zinc-300">Password</label><button type="button" className="text-xs text-teal-400 hover:text-teal-300">Forgot password?</button></div>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" /><input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-zinc-500" required /></div>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-teal-600 hover:bg-teal-500 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"><LogIn className="w-5 h-5" /><span>{isLoading ? 'Signing in...' : 'Sign in'}</span></button>
          </form>
          <div className="mt-8 text-center"><p className="text-zinc-500 text-sm">By signing in, you agree to our Terms of Service and Privacy Policy</p></div>
        </div>
      </div>
    </div>
  );
};

export default Login;