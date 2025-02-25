import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, User, Settings, LogOut, LogIn, UserPlus, Shield, Bell, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          className="flex items-center space-x-2 text-red-400 hover:bg-zinc-800 w-full px-4 py-2 transition-colors rounded-lg"
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
          className="flex items-center space-x-2 text-blue-400 hover:bg-zinc-800 w-full px-4 py-2 transition-colors rounded-lg"
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
          ? 'bg-zinc-900/95 backdrop-blur-lg border-b border-zinc-800' 
          : 'bg-zinc-900/90 backdrop-blur-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 group"
          >
            <div >
              <img
                  src="/Logo2.png"
                  alt="Custom Icon"
                  className="w-12 h-12"
                />
            </div>
            <span className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              Home
            </span>
          </button>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-white hover:text-indigo-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {token && (
              <>
                <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors relative group">
                  <Bell className="h-5 w-5 text-zinc-400 group-hover:text-indigo-400" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full transform transition-transform group-hover:scale-125" />
                </button>
                
                <div className="h-6 w-px bg-zinc-800" />
              </>
            )}

            {token ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-zinc-800 hover:bg-zinc-700 rounded-lg px-4 py-2 transition-all duration-200 flex items-center space-x-2"
                >
                  <div className="h-7 w-7 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-zinc-100">{user?.name || 'User'}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 backdrop-blur-lg">
                    {renderDashboardButton()}
                    
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2 text-indigo-400" />
                      Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2 text-zinc-400" />
                      Settings
                    </button>
                    
                    <div className="border-t border-zinc-800 my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-zinc-800 transition-colors"
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
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-zinc-900 border-t border-zinc-800`}>
        <div className="px-4 py-3 space-y-2">
          {token ? (
            <>
              <div className="flex items-center space-x-3 px-2 py-3 border-b border-zinc-800">
                <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-zinc-100 font-medium">{user?.name || 'User'}</span>
              </div>
              
              {renderDashboardButton()}
              
              <button
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors rounded-lg"
              >
                <User className="w-4 h-4 mr-2 text-indigo-400" />
                Profile
              </button>
              
              <button
                onClick={() => {
                  navigate('/settings');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors rounded-lg"
              >
                <Settings className="w-4 h-4 mr-2 text-zinc-400" />
                Settings
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-zinc-800 transition-colors rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 py-2">
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;