import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Login from './component/Login';
import Signup from './component/Signup';
import TopicPage from './component/TopicPage';
import PostDetail from './component/PostDetail';
import CreatePost from './component/CreatePost';
import Navbar from './component/Navbar';
import { AuthProvider } from './component/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
import AdminDashboard from './component/AdminDashboard';
import ModeratorDashboard from './component/ModeratorDashboard';
import ProfilePage from './component/ProfilePage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-base-100">
          <Navbar />
          <main className="pt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/topics/:topicId" element={<TopicPage />} />
                <Route path="/posts/new" element={<CreatePost />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/moderation"
                  element={
                    <ProtectedRoute moderatorOnly={true}>
                      <ModeratorDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
