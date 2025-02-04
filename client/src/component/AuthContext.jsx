import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication on component mount
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    console.log('User roles:', userRoles);

    
    if (token) {
      setIsAuthenticated(true);
      setUserRoles(roles);
    }
  }, []);

  const hasRole = (role) => {
    console.log("Checking role:", role, "against:", userRoles);
    return userRoles.includes(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserRoles([]);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRoles, 
      hasRole,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);