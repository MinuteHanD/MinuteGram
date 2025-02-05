import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../service/apiClient';  

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); 

  const fetchUserRole = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUserRoles([]);
      setAuthLoading(false);
      return;
    }

    try {
      const response = await api.get('/users/current');
      const roles = response.data.roles || [];

      setIsAuthenticated(true);
      setUserRoles(roles);
      localStorage.setItem('userRoles', JSON.stringify(roles));  
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setIsAuthenticated(false);
      setUserRoles([]);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  const hasRole = (role) => userRoles.includes(role);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    setIsAuthenticated(false);
    setUserRoles([]);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRoles, 
      hasRole,
      logout,
      authLoading  
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
