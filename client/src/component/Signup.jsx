import React, { useState } from 'react';
import api from '../service/apiClient';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-dark-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-dark-100 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-dark-400">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-dark-300">
            Start your journey with us today
          </p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dark-input w-full"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark-input w-full"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dark-input w-full"
              required
            />
          </div>
          <div>
            <button
              onClick={handleSignup}
              className="dark-btn dark-btn-primary w-full flex items-center justify-center space-x-2"
            >
              <UserPlus size={20} />
              <span>Sign Up</span>
            </button>
          </div>
          <div className="text-center">
            <span className="text-dark-300">
              Already have an account? 
              <button 
                onClick={() => navigate('/login')}
                className="ml-2 text-dark-300 hover:text-dark-50 transition-colors"
              >
                Log In
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;