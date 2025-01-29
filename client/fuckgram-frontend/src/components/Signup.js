import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Log the request payload for debugging
      console.log('Sending signup request with data:', {
        email,
        password: '***', // Hide password in logs
        name
      });

      // Make sure the request body matches exactly what your backend expects
      const response = await api.post('/auth/signup', {
        email: email,
        password: password,
        name: name
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Signup successful:', response.data);
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Detailed signup error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });

      // More user-friendly error message
      if (err.response?.status === 401) {
        alert('Signup failed: Authentication error. Please check if the service is available.');
      } else {
        alert(`Signup failed: ${err.response?.data?.message || 'Unknown error occurred'}`);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign Up</h2>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
      </div>
      <button
        onClick={handleSignup}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Sign Up
      </button>
    </div>
  );
};

export default Signup;