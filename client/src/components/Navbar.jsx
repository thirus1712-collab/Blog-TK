import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  RotateCw,
  PlusCircle,
  ChevronDown,
  User,
  BookOpen,
  LogOut,
  Menu,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    logout,
    searchQuery,
    setSearchQuery,
    triggerRefresh
  } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    triggerRefresh();
    showToast('Latest posts refreshed', 'info', 2000);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/' && location.pathname !== '/my-posts') {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* 1. Left: Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Blog <span className="text-brand-600">TK</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest -mt-1 hidden sm:block">
                Open Publishing
              </span>
            </div>
          </Link>

          {/* 2. Center: Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md mx-2 sm:mx-4 relative"
          >
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title or keyword..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* 3. Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'text-brand-600 bg-brand-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/about'
                  ? 'text-brand-600 bg-brand-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About Us
            </Link>

            {isAuthenticated && (
              <Link
                to="/my-posts"
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname === '/my-posts'
                    ? 'text-brand-600 bg-brand-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                My Posts
              </Link>
            )}
          </div>

          {/* 4. Action Buttons (Refresh + Create Post + User Menu) */}
          <div className="flex items-center gap-2">
            {/* Refresh Icon Button */}
            <button
              type="button"
              onClick={handleRefreshClick}
              className={`p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-slate-200/80 ${
                isRefreshing ? 'rotate-180 text-brand-600 bg-brand-50' : ''
              }`}
              title="Refresh latest posts"
              aria-label="Refresh posts"
            >
              <RotateCw className={`w-4 h-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Create Post Button */}
            <Link
              to="/create-post"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm shadow-brand-500/20 hover:shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Post</span>
            </Link>

            {/* User Dropdown or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors border border-slate-200/60"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-semibold text-slate-800 max-w-[100px] truncate hidden md:inline">
                    {user?.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in divide-y divide-slate-100">
                    <div className="px-4 py-2.5">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50/70 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/my-posts"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50/70 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>My Posts</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Collapsed Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 px-2 space-y-1 animate-fade-in bg-white">
            <Link
              to="/"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              About Us
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-posts"
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  My Posts
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  My Profile
                </Link>
                <Link
                  to="/create-post"
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-brand-600 hover:bg-brand-50"
                >
                  + Create New Post
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="text-center w-full py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center w-full py-2 text-sm font-semibold text-white bg-brand-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
