import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, User, Settings, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
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

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
      isScrolled ? 'bg-zinc-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 group"
          >
            <div className="bg-zinc-800/50 p-2 rounded-lg group-hover:bg-emerald-500/10 transition-all duration-200 relative overflow-hidden">
              <Hexagon className="w-5 h-5 text-emerald-400 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <span className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              MinuteGram
            </span>
          </button>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-zinc-800/50 hover:bg-zinc-800 backdrop-blur-lg border border-zinc-700 hover:border-zinc-600 rounded-lg px-4 py-2 transition-all duration-200 flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-zinc-100">Account</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 backdrop-blur-lg">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-zinc-100 hover:bg-zinc-700/50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2 text-emerald-400" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-zinc-100 hover:bg-zinc-700/50 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2 text-zinc-400" />
                      Settings
                    </button>
                    <div className="border-t border-zinc-700 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-zinc-700/50 transition-colors"
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
                  className="bg-zinc-800/50 hover:bg-zinc-800 backdrop-blur-lg border border-zinc-700 hover:border-zinc-600 text-zinc-100 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-zinc-100 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
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