import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Briefcase, Calendar, BookOpen, PlusCircle, LogOut } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { formatDateTime } from '../utils/dateUtils';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, logout, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [postCount, setPostCount] = useState(user?.postCount ?? 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      showToast('Please log in to view your profile', 'info');
      navigate('/login');
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setPostCount(res.data.user.postCount || 0);
        }
      } catch (err) {
        console.error('Failed to load profile stats', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfileData();
    }
  }, [authLoading, isAuthenticated, navigate, showToast]);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse">
        <div className="w-full h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 font-extrabold text-2xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Body */}
          <div className="pt-14 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user?.name}
                </h1>
                <p className="text-sm font-semibold text-brand-600 mt-0.5">
                  {user?.profession}
                </p>
              </div>

              {/* Total Posts Published Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-center self-start sm:self-auto">
                <span className="block text-xl font-extrabold text-slate-900 leading-none">
                  {postCount}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Articles Published
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Email Address</span>
                  <span className="font-semibold text-slate-800">{user?.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Profession / Occupation</span>
                  <span className="font-semibold text-slate-800">{user?.profession}</span>
                </div>
              </div>

              {user?.createdAt && (
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Member Since</span>
                    <span className="font-semibold text-slate-800">{formatDateTime(user.createdAt)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Links & Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/my-posts"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm shadow-brand-500/20 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View My Posts</span>
                </Link>

                <Link
                  to="/create-post"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Write Article</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
