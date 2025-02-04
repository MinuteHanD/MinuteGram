import React, { useState } from 'react';
import api from '../service/apiClient';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);

      
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRoles', JSON.stringify(response.data.roles));
        localStorage.setItem('userEmail', response.data.email);
        console.log('Token stored:', response.data.token);
        
        navigate('/');
      } else {
        console.error('No token received in response');
        alert('Login failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        alert(`Login failed: ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        alert('Login failed: No response from server');
      } else {
        console.error('Error setting up request:', err.message);
        alert(`Login failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-dark-100 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-dark-400">Welcome Back</h2>
          <p className="mt-2 text-sm text-dark-300">Sign in to continue</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-200 text-dark-400 px-4 py-2 rounded-lg border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-200 text-dark-400 px-4 py-2 rounded-lg border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all"
              required
            />
          </div>
          <button onClick={handleLogin} className="dark-btn dark-btn-primary w-full flex items-center justify-center">
            <LogIn size={20} />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;