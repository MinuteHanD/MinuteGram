// AuthContext.js - REWRITTEN

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Renamed to authLoading to be clear this is ONLY for checking the user auth.
  const [authLoading, setAuthLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    // This effect should run EXACTLY ONCE when the application is first mounted.
    // It should have NO dependencies. The 'navigate' dependency you had was incorrect
    // and could cause this to re-run unexpectedly.
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // This is now the ONLY place in the entire app that should call '/users/current'.
          const response = await api.get('/users/current');
          setUser({
            ...response.data,
            // Pre-calculate these booleans for convenience elsewhere.
            isAdmin: response.data.roles.includes('ADMIN'),
            isModerator: response.data.roles.includes('MODERATOR')
          });
        } catch (error) {
          // If the token is invalid or expired, clean up and treat as logged out.
          console.warn("Auth token validation failed - user will be logged out", error.response?.status);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      // We are done checking authentication, so the app can now render.
      setAuthLoading(false);
    };

    checkAuthStatus();
  }, []); // <-- CRITICAL: Empty dependency array ensures this runs only once.

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    // When logging in, we already have the user data. No need to fetch again.
    setUser({
        ...userData,
        isAdmin: userData.roles.includes('ADMIN'),
        isModerator: userData.roles.includes('MODERATOR')
    });
    // Use setTimeout to ensure state update is processed before navigation
    setTimeout(() => {
      navigate('/');
    }, 0);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Navigate to login after state is cleared to ensure a clean redirect.
    navigate('/login');
  };

  // Memoize the context value to prevent unnecessary re-renders in consumer components.
  const value = React.useMemo(() => ({
    user,
    // Use a clearer name for the consumer. 'loading' is too generic.
    isAuthLoading: authLoading, 
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isModerator: user?.isModerator || false
  }), [user, authLoading]);

  // Don't render children until we know if the user is logged in or not.
  // This prevents flickering and content jumping.
  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};