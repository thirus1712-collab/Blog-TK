import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Search, RefreshCw, FileText } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import PostCard from '../components/PostCard';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';
import ConfirmModal from '../components/ConfirmModal';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, searchQuery, refreshTrigger } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters for My Posts
  const [activeRating, setActiveRating] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Delete modal state
  const [deleteTargetPost, setDeleteTargetPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      showToast('Please log in to view your posts', 'info');
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate, showToast]);

  // Fetch logged in user's posts
  const fetchMyPosts = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
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

      const res = await api.get('/posts/mine', { params });
      if (res.data.success) {
        setPosts(res.data.posts);
        setTotalCount(res.data.totalCount);
      }
    } catch (err) {
      console.error('Failed to load my posts', err);
      showToast(err.response?.data?.message || 'Failed to load your posts', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchQuery, selectedDate, activeRating, showToast]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts, refreshTrigger]);

  const handleEdit = (post) => {
    navigate(`/edit-post/${post._id}`);
  };

  const handleDeleteRequest = (post) => {
    setDeleteTargetPost(post);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetPost) return;

    try {
      setIsDeleting(true);
      const res = await api.delete(`/posts/${deleteTargetPost._id}`);
      if (res.data.success) {
        showToast('Post deleted successfully', 'success');
        setPosts((prev) => prev.filter((p) => p._id !== deleteTargetPost._id));
        setTotalCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTargetPost(null);
    }
  };

  const handleResetFilters = () => {
    setActiveRating('all');
    setSelectedDate('');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header with Total Count Badge */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200/60 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Author Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                My Articles
              </h1>
              <p className="text-sm text-slate-500">
                Manage, edit, or remove your published articles.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Total User Posts Count */}
              <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-center">
                <span className="block text-2xl font-extrabold text-slate-900 leading-none">
                  {totalCount}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Total Posts
                </span>
              </div>

              {/* Create New Post button */}
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm shadow-brand-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Article</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter bar for My Posts */}
        <FilterBar
          activeRating={activeRating}
          onSelectRating={setActiveRating}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          showMineToggle={false}
          totalPostsCount={posts.length}
          onResetFilters={handleResetFilters}
        />

        {/* Posts Grid or Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          (searchQuery || selectedDate || activeRating !== 'all') ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-card my-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No matching articles found</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                None of your articles match the current filter or search criteria.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-card my-12">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                You haven't posted anything yet
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Share your insights, tutorials, or stories with the Blog TK community. Your articles will be instantly visible to all visitors.
              </p>
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create your first post</span>
              </Link>
            </div>
          )
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetPost}
        onClose={() => setDeleteTargetPost(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteTargetPost?.title}"? All comments and ratings for this post will also be permanently removed.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        isDanger={true}
      />
    </div>
  );
};

export default MyPostsPage;
