import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom'; // Add this

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Add this

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', { email }); // Log login attempt
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data); // Log the response
      
      // Store the token properly
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token); // Verify token storage
        
        // Navigate to home page after successful login
        navigate('/');
      } else {
        console.error('No token received in response');
        alert('Login failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err); // Detailed error logging
      
      // More detailed error feedback
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
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
        />
      </div>
      <button 
        onClick={handleLogin}
        style={{ padding: '5px 10px' }}
      >
        Login
      </button>
    </div>
  );
};

export default Login;