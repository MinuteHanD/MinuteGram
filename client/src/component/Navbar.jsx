import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Sun, 
  Home, 
  LogOut, 
  LogIn, 
  UserPlus, 
  User,
  Settings 
} from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [dropdownOpen, setDropdownOpen] = useState(false);
   
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-dark-100 via-dark-100 to-dark-200 shadow-2xl backdrop-blur-lg bg-opacity-90 z-50 border-b border-dark-300/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-full shadow-md group-hover:scale-105 transition-transform items-center space-x-4">
              <Home size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              MinuteGram
            </span>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-dark-400 hover:text-dark-300 hover:bg-dark-200/50 rounded-full transition-all group"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="group-hover:rotate-12 transition-transform" />
              ) : (
                <Moon size={20} className="group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Authentication Buttons */}
            {token ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 px-4 py-2 rounded-full hover:from-red-500/20 hover:to-red-600/20 transition-all"
                >
                  <User size={18} />
                  <span className="font-medium">Profile</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-200 border border-dark-300/20 rounded-xl shadow-2xl py-2 z-50">
                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-dark-300/10 transition-colors"
                    >
                      <User size={16} className="mr-3" />
                      My Profile
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/settings');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-dark-300/10 transition-colors"
                    >
                      <Settings size={16} className="mr-3" />
                      Settings
                    </button>
                    <div className="border-t border-dark-300/20 my-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 text-dark-400 hover:text-dark-300 px-4 py-2 rounded-full hover:bg-dark-200/50 transition-all"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                >
                  <UserPlus size={18} />
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