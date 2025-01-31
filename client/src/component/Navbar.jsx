import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Home, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
   
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-dark-100 shadow-lg backdrop-blur-sm bg-opacity-80 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-2 text-dark-400 hover:text-dark-300 transition-colors px-3 py-2 rounded-lg hover:bg-dark-200"
            >
              <Home size={20} />
              <span className="font-medium">Home </span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-dark-400 hover:text-dark-300 hover:bg-dark-200 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {token ? (
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-dark-300 text-dark-50 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 text-dark-400 hover:text-dark-300 px-4 py-2 rounded-lg hover:bg-dark-200 transition-colors"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex items-center space-x-2 bg-dark-300 text-dark-50 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <UserPlus size={20} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;