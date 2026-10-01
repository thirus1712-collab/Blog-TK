import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Mail,
  Phone,
  Edit3,
  Trash2,
  MessageSquare,
  Send,
  ArrowLeft,
  Clock,
  CheckCircle,
  Share2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { formatDateTime } from '../utils/dateUtils';
import RatingStars from '../components/RatingStars';
import ConfirmModal from '../components/ConfirmModal';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(false);

  // New comment state
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load post details & comments
  const fetchPostDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [postRes, commentsRes] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get(`/posts/${id}/comments`)
      ]);

      if (postRes.data.success) {
        setPost(postRes.data.post);
        setUserRating(postRes.data.userRating);
      }
      if (commentsRes.data.success) {
        setComments(commentsRes.data.comments);
      }
    } catch (err) {
      console.error('Failed to load post details', err);
      showToast(err.response?.data?.message || 'Article not found', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, showToast]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  // Handle star rating
  const handleRate = async (starValue) => {
    if (!isAuthenticated) {
      showToast('Please log in to rate this post', 'info');
      navigate('/login');
      return;
    }

    try {
      setSubmittingRating(true);
      const res = await api.post(`/posts/${id}/rate`, { value: starValue });
      if (res.data.success) {
        setUserRating(starValue);
        setPost((prev) => ({
          ...prev,
          averageRating: res.data.averageRating,
          ratingCount: res.data.ratingCount
        }));
        showToast(`You rated this article ${starValue} star${starValue > 1 ? 's' : ''}!`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit rating', 'error');
    } finally {
      setSubmittingRating(false);
    }
  };

  // Handle comment submit
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to add a comment', 'info');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/posts/${id}/comments`, { text: newComment });
      if (res.data.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setNewComment('');
        showToast('Comment posted successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const res = await api.delete(`/posts/${id}`);
      if (res.data.success) {
        showToast('Post deleted successfully', 'success');
        navigate('/my-posts');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if current logged-in user is author
  const isAuthor =
    user &&
    post &&
    post.author &&
    (post.author._id === user._id || post.author === user._id);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="w-24 h-6 bg-slate-200 rounded mb-8" />
        <div className="w-full h-96 bg-slate-200 rounded-3xl mb-8" />
        <div className="w-3/4 h-10 bg-slate-200 rounded mb-4" />
        <div className="w-1/2 h-6 bg-slate-200 rounded mb-8" />
        <div className="space-y-3">
          <div className="w-full h-4 bg-slate-100 rounded" />
          <div className="w-full h-4 bg-slate-100 rounded" />
          <div className="w-5/6 h-4 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation & Actions Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Author Edit & Delete buttons */}
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
              >
                <Edit3 className="w-4 h-4 text-brand-600" />
                <span>Edit Post</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Hero Image Container (Responsive, maintains aspect ratio, max 1200w) */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-soft border border-slate-200/80 bg-slate-900 mb-8 max-h-[550px] flex items-center justify-center">
          <img
            src={post.image?.detail || post.image?.thumbnail}
            alt={post.title}
            className="w-full h-auto max-h-[550px] object-cover object-center"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Post Metadata: Date, Edited timestamp, and Rating */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 text-xs sm:text-sm text-slate-500">
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Published: {formatDateTime(post.createdAt)}</span>
            </span>

            {post.isEdited && (
              <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-semibold text-xs border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span>Edited {post.editedAt ? formatDateTime(post.editedAt) : ''}</span>
              </span>
            )}
          </div>

          {/* Average Rating indicator */}
          <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <RatingStars
              rating={post.averageRating}
              count={post.ratingCount}
              size="sm"
            />
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] my-6">
          {post.title}
        </h1>

        {/* Author & Contact Info Card (Visibly displayed) */}
        <div className="bg-gradient-to-r from-slate-50 to-brand-50/40 rounded-2xl border border-slate-200 p-5 sm:p-6 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {post.author?.name || 'Anonymous Author'}
                </p>
                <p className="text-xs text-brand-700 font-semibold">
                  {post.author?.profession || 'Contributing Creator'}
                </p>
              </div>
            </div>

            {/* Author Contact details saved with post */}
            <div className="flex flex-col sm:items-end gap-1.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/80 text-xs text-slate-600">
              <div className="inline-flex items-center gap-2 font-medium">
                <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <a href={`mailto:${post.contactEmail}`} className="hover:text-brand-600 hover:underline">
                  {post.contactEmail}
                </a>
              </div>
              <div className="inline-flex items-center gap-2 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <a href={`tel:${post.contactPhone}`} className="hover:text-emerald-700 hover:underline">
                  {post.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Post Full Content Body */}
        <div className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line mb-14 font-normal">
          {post.content}
        </div>

        {/* Interactive Rating Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card mb-12 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            How would you rate this article?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
            Your rating helps other readers discover the highest quality insights. Each user can rate once and update their rating anytime.
          </p>

          <div className="flex flex-col items-center justify-center gap-2">
            <RatingStars
              rating={post.averageRating}
              count={post.ratingCount}
              size="lg"
              interactive={true}
              userRating={userRating}
              onRate={handleRate}
              showCount={false}
            />

            {userRating && (
              <p className="text-xs font-semibold text-brand-600 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                You rated this post {userRating} of 5 stars (click any star to update)
              </p>
            )}

            {!isAuthenticated && (
              <p className="text-xs text-slate-400 mt-2">
                <Link to="/login" className="text-brand-600 font-semibold hover:underline">
                  Log in
                </Link>{' '}
                to leave your rating.
              </p>
            )}
          </div>
        </section>

        {/* Comments Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              <h3 className="text-xl font-bold text-slate-900">
                Discussion ({comments.length})
              </h3>
            </div>
          </div>

          {/* Add Comment Box */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-10">
              <label htmlFor="commentText" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Leave a Thought
              </label>
              <textarea
                id="commentText"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your perspective, feedback, or ask a question..."
                className="w-full p-4 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y"
                required
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center mb-8">
              <p className="text-sm text-slate-600 mb-3">
                Want to join the conversation? Log in to leave a comment.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Log In to Comment
              </Link>
            </div>
          )}

          {/* Comments List (Newest first) */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block leading-tight">
                          {comment.user?.name || 'Anonymous User'}
                        </span>
                        {comment.user?.profession && (
                          <span className="text-[11px] text-slate-500">
                            {comment.user.profession}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed pl-10.5 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Article"
        message="Are you sure you want to permanently delete this post? This will remove all associated ratings and comments. This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
        isDanger={true}
      />
    </article>
  );
};

export default PostDetailPage;
