import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, User, Settings, LogOut, LogIn, UserPlus, Shield, Bell } from 'lucide-react';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderDashboardButton = () => {
    if (!user) return null;

    if (user.isAdmin) {
      return (
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center space-x-2 text-red-400 hover:bg-black/20 w-full px-4 py-2 transition-colors rounded-lg"
        >
          <Shield className="w-4 h-4" />
          <span>Admin Dashboard</span>
        </button>
      );
    }

    if (user.roles?.includes('MODERATOR')) {
      return (
        <button
          onClick={() => navigate('/moderation')}
          className="flex items-center space-x-2 text-blue-400 hover:bg-black/20 w-full px-4 py-2 transition-colors rounded-lg"
        >
          <Shield className="w-4 h-4" />
          <span>Mod Dashboard</span>
        </button>
      );
    }

    return null;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-[#0A0F16]/95 backdrop-blur-lg border-b border-emerald-900/20' 
          : 'bg-[#0A0F16]/80 backdrop-blur-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 group"
          >
            <div className="bg-black/20 p-2 rounded-lg group-hover:bg-emerald-500/10 transition-all duration-200">
              <Hexagon className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-gray-100 group-hover:text-emerald-400 transition-colors">
              MinuteGram
            </span>
          </button>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {token && (
              <>
                <button className="p-2 hover:bg-black/20 rounded-lg transition-colors relative group">
                  <Bell className="h-5 w-5 text-emerald-400" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform transition-transform group-hover:scale-125" />
                </button>
                
                <div className="h-6 w-px bg-emerald-900/20" />
              </>
            )}

            {token ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-black/20 hover:bg-black/30 rounded-lg px-4 py-2 transition-all duration-200 flex items-center space-x-2"
                >
                  <div className="h-6 w-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-emerald-400">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-gray-100">{user?.name || 'User'}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0A0F16] border border-emerald-900/20 rounded-lg shadow-xl py-1 backdrop-blur-lg">
                    {renderDashboardButton()}
                    
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-100 hover:bg-black/20 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2 text-emerald-400" />
                      Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-100 hover:bg-black/20 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2 text-gray-400" />
                      Settings
                    </button>
                    
                    <div className="border-t border-emerald-900/20 my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-black/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-black/20 hover:bg-black/30 text-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
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