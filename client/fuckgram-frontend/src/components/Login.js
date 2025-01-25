import React, { useState } from 'react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      alert('Logged in successfully!');
    } catch (err) {
      alert('Login failed!');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
// In the above snippet, we imported the api instance from the services directory. We then created a Login component that has two input fields for email and password and a button to log in. When the button is clicked, we make a POST request to the /auth/login endpoint with the email and password in the request body. If the login is successful, we store the token in localStorage and show an alert. If the login fails, we show an error alert.