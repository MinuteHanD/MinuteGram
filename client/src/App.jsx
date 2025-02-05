import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Login from './component/Login';
import Signup from './component/Signup';
import TopicPage from './component/TopicPage';
import PostDetail from './component/PostDetail';
import Navbar from './component/Navbar';
import { AuthProvider } from './component/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
import AdminDashboard from './component/AdminDashboard';

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <Router>
      <AuthProvider>
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          <Navbar 
            darkMode={darkMode} 
            toggleDarkMode={() => setDarkMode(!darkMode)} 
          />
          <div className="pt-16 container mx-auto px-4 sm:px-6 lg:px-8"> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/topics/:topicId" element={<TopicPage />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;