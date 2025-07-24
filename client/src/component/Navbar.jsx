import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogIn, UserPlus, User, LogOut, Shield, Settings, Sun, Moon, Menu, X } from 'lucide-react';

const NavLink = ({ to, children }) => (
  <Link to={to} className="px-3 py-2 rounded-md text-sm font-medium text-base-content hover:bg-base-200 hover:text-primary-content transition-colors">
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link to={to} onClick={onClick} className="block px-3 py-2 rounded-md text-base font-medium text-base-content hover:bg-base-200 hover:text-primary-content">
    {children}
  </Link>
);

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { isAuthenticated, user, logout, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin) return { to: '/admin', label: 'Admin Panel' };
    if (isModerator) return { to: '/moderation', label: 'Moderator Panel' };
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-base-200/80 backdrop-blur-lg border-b border-base-300' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-primary">
              MinuteGram
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/">Home</NavLink>
                {dashboardLink && <NavLink to={dashboardLink.to}>{dashboardLink.label}</NavLink>}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button onClick={toggleDarkMode} className="p-1 rounded-full text-base-content hover:text-primary-content hover:bg-base-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-primary">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {isAuthenticated ? (
                <div className="ml-3 relative">
                  <div>
                    <button onClick={() => setIsOpen(!isOpen)} className="max-w-xs bg-base-200 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-primary" id="user-menu" aria-haspopup="true">
                      <span className="sr-only">Open user menu</span>
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  </div>
                  {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-base-200 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-2 border-b border-base-300">
                        <p className="text-sm text-base-content">Signed in as</p>
                        <p className="text-sm font-medium text-primary-content truncate">{user?.name}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-base-content hover:bg-base-300"><User size={16} className="mr-2"/>Profile</Link>
                      <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-error hover:bg-base-300"><LogOut size={16} className="mr-2"/>Sign out</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-base-content hover:bg-base-200">
                    <LogIn className="inline-block w-4 h-4 mr-1" />
                    Login
                  </Link>
                  <Link to="/signup" className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-content hover:bg-primary-focus">
                    <UserPlus className="inline-block w-4 h-4 mr-1" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="bg-base-200 inline-flex items-center justify-center p-2 rounded-md text-base-content hover:text-primary-content hover:bg-base-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-primary">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
            {dashboardLink && <MobileNavLink to={dashboardLink.to} onClick={() => setIsOpen(false)}>{dashboardLink.label}</MobileNavLink>}
          </div>
          <div className="pt-4 pb-3 border-t border-base-300">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <div className="flex items-center px-3 mb-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-primary-content">{user?.name}</div>
                    <div className="text-sm font-medium leading-none text-base-content">{user?.email}</div>
                  </div>
                </div>
                <MobileNavLink to="/profile" onClick={() => setIsOpen(false)}>
                  <User size={16} className="inline-block mr-2"/>Your Profile
                </MobileNavLink>
                <button onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-error hover:bg-base-200">
                  <LogOut size={16} className="inline-block mr-2"/>Sign out
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>
                  <LogIn className="inline-block w-4 h-4 mr-1" />
                  Login
                </MobileNavLink>
                <MobileNavLink to="/signup" onClick={() => setIsOpen(false)}>
                  <UserPlus className="inline-block w-4 h-4 mr-1" />
                  Sign Up
                </MobileNavLink>
              </div>
            )}
             <div className="mt-3 px-2">
                <button onClick={toggleDarkMode} className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-base-content hover:bg-base-200">
                  <span>Toggle Theme</span>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
