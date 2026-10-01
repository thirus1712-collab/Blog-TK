import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PenTool, Search, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';

const HomePage = () => {
  const { user, isAuthenticated, searchQuery, refreshTrigger } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [activeRating, setActiveRating] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [isMineOnly, setIsMineOnly] = useState(false);

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchQuery && searchQuery.trim() !== '') {
        params.search = searchQuery.trim();
      }
      if (selectedDate) {
        params.date = selectedDate;
      }
      if (activeRating && activeRating !== 'all') {
        params.rating = activeRating;
      }
      if (isMineOnly && isAuthenticated) {
        params.mine = 'true';
      }

      const res = await api.get('/posts', { params });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error('Failed to load posts', err);
      setError(err.response?.data?.message || 'Could not load posts. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDate, activeRating, isMineOnly, isAuthenticated]);

  // Refetch when filters or refreshTrigger change
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshTrigger]);

  const handleResetFilters = () => {
    setActiveRating('all');
    setSelectedDate('');
    setIsMineOnly(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-[#f8fafc] border-b border-slate-200/60 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl" />
          <div className="absolute top-10 -left-20 w-80 h-80 bg-indigo-300/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 shadow-xs text-xs font-bold text-brand-700 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Welcome to Blog TK Editorial</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Where ideas take flight, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              curated for curious minds.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Read in-depth technical analysis, design frameworks, and architectural wisdom from independent makers and builders around the globe.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 hover:shadow-lg transition-all"
            >
              <PenTool className="w-4 h-4" />
              <span>Start Writing Today</span>
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-colors"
            >
              <span>Explore Our Mission</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content & Post Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Active Search Notification Banner */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between p-3.5 bg-brand-50/70 border border-brand-200/80 rounded-xl text-xs sm:text-sm text-brand-900 font-medium">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-600" />
              <span>
                Showing search results for: <span className="font-bold">"{searchQuery}"</span>
              </span>
            </div>
            <button
              onClick={() => handleResetFilters()}
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          activeRating={activeRating}
          onSelectRating={setActiveRating}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          showMineToggle={true}
          isMineOnly={isMineOnly}
          onToggleMine={() => setIsMineOnly((prev) => !prev)}
          totalPostsCount={posts.length}
          onResetFilters={handleResetFilters}
        />

        {/* Error State */}
        {error && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-800 my-8">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-rose-300 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Posts Grid or Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          /* Friendly Empty State */
          (searchQuery || selectedDate || activeRating !== 'all' || isMineOnly) ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-card my-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No posts found</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                We couldn't find any articles matching your search query or filter combination. Try adjusting your filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-card my-12">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                No posts yet. Be the first to publish!
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Welcome to Blog TK. There are no articles published yet. Share your engineering craft or design insights with the community.
              </p>
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all"
              >
                <PenTool className="w-4 h-4" />
                <span>Create Post</span>
              </Link>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default HomePage;
