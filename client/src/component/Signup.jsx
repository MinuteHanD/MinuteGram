import React, { useState } from 'react';
import api from '../service/apiClient';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

 
  const handleSignup = async () => {
    try {
      const response = await api.post('/auth/signup', {
        email: email,
        password: password,
        name: name
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert(`Signup failed: ${err.response?.data?.message || 'Unknown error occurred'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-100 to-dark-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-dark-100/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-dark-300/10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-dark-400 to-dark-300 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-dark-300/80">Join our community today</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-dark-300/50" />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-100/50 text-dark-400 pl-12 pr-4 py-3 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300 placeholder:text-dark-400/50"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-dark-300/50" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-100/50 text-dark-400 pl-12 pr-4 py-3 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300 placeholder:text-dark-400/50"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-dark-300/50" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-100/50 text-dark-400 pl-12 pr-4 py-3 rounded-xl border border-dark-300/30 focus:ring-2 focus:ring-dark-300 transition-all duration-300 placeholder:text-dark-400/50"
                  required
                />
              </div>
            </div>

            <button 
              onClick={handleSignup}
              className="w-full bg-dark-300 text-dark-50 px-8 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-dark-300/20 flex items-center justify-center space-x-3"
            >
              <UserPlus className="h-5 w-5" />
              <span className="font-medium">Create Account</span>
            </button>

            <div className="text-center">
              <button 
                onClick={() => navigate('/login')}
                className="text-dark-300 hover:text-dark-400 transition-colors duration-300"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;