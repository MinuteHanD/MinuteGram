import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Posts from './components/Posts';
import TopicPage from './components/TopicPage';
import PostDetails from './components/PostDetails';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Add Navbar here */}
      <div style={{ marginTop: '60px' }}> {/* Prevent content from overlapping the navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/topics/:topicId" element={<TopicPage />} />
          <Route path="/posts/:postId" element={<PostDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
