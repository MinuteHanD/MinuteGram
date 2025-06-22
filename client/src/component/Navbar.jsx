// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, Bell, User, Settings, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const links = [
  { name: 'Home', to: '/' },
  { name: 'Explore', to: '/explore' },
  { name: 'About', to: '/about' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin, isModerator } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const renderDashboard = () => {
    if (!isAuthenticated) return null;
    if (isAdmin) return { name: 'Admin', to: '/admin', icon: Shield };
    if (isModerator) return { name: 'Mod', to: '/moderation', icon: Shield };
    return null;
  };

  const dash = renderDashboard();

  return (
    <header
      className={`fixed w-full top-0 z-50 transition ${
        scrolled ? 'backdrop-blur-xl bg-white/10' : 'backdrop-blur-md bg-white/5'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand as plain text */}
        <h1
          onClick={() => navigate('/')}
          className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300 cursor-pointer"
        >
          Minutegram
        </h1>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-8">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => navigate(l.to)}
              className="relative text-white hover:text-teal-300 transition"
            >
              {l.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-300 transition-all group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Auth / Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button className="p-2 hover:text-teal-300 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative group">
                <button className="px-3 py-1 bg-white/10 rounded-full flex items-center space-x-2 hover:bg-white/20 transition">
                  <span className="font-semibold text-white">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                <div className="absolute right-0 mt-2 w-40 bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  {dash && (
                    <button
                      onClick={() => navigate(dash.to)}
                      className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center space-x-2"
                    >
                      <dash.icon className="w-4 h-4 text-cyan-300" />
                      <span className="text-white">{dash.name}</span>
                    </button>
                  )}
                  <button
                    onClick={() => { navigate('/settings'); }}
                    className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4 text-cyan-300" />
                    <span className="text-white">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Logout</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-1 text-white hover:text-teal-300 transition"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="flex items-center space-x-1 text-white hover:text-teal-300 transition"
              >
                <UserPlus className="w-5 h-5" />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/10 backdrop-blur-xl px-6 py-4 space-y-4">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => { navigate(l.to); setOpen(false); }}
              className="block w-full text-left text-white py-2 hover:text-teal-300 transition"
            >
              {l.name}
            </button>
          ))}

          <div className="border-t border-white/20"></div>

          {isAuthenticated ? (
            <>
              {dash && (
                <button
                  onClick={() => { navigate(dash.to); setOpen(false); }}
                  className="flex items-center w-full space-x-2 text-white py-2 hover:text-teal-300 transition"
                >
                  <dash.icon className="w-5 h-5" />
                  <span>{dash.name}</span>
                </button>
              )}
              <button
                onClick={() => { navigate('/settings'); setOpen(false); }}
                className="flex items-center w-full space-x-2 text-white py-2 hover:text-teal-300 transition"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-2 text-red-400 py-2 hover:bg-red-500/10 rounded transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('/login'); setOpen(false); }}
                className="flex items-center w-full space-x-2 text-white py-2 hover:text-teal-300 transition"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
              <button
                onClick={() => { navigate('/signup'); setOpen(false); }}
                className="flex items-center w-full space-x-2 text-white py-2 hover:text-teal-300 transition"
              >
                <UserPlus className="w-5 h-5" />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
