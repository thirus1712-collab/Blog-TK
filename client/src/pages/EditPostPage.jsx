import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, X, ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [existingImage, setExistingImage] = useState(null);

  // New optional image replacement
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [fetching, setFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch post data to pre-fill
  const fetchPost = useCallback(async () => {
    try {
      setFetching(true);
      const res = await api.get(`/posts/${id}`);
      if (res.data.success) {
        const post = res.data.post;

        // Check ownership
        if (user && post.author && (post.author._id !== user._id && post.author !== user._id)) {
          showToast('Unauthorized: You can only edit your own posts.', 'error');
          navigate(`/posts/${id}`);
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setContactEmail(post.contactEmail);
        setContactPhone(post.contactPhone);
        setExistingImage(post.image?.detail || post.image?.thumbnail);
      }
    } catch (err) {
      console.error('Failed to load post for editing', err);
      showToast('Could not load post details', 'error');
      navigate('/');
    } finally {
      setFetching(false);
    }
  }, [id, navigate, showToast, user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      showToast('Please log in to edit a post', 'info');
      navigate('/login');
      return;
    }
    if (user) {
      fetchPost();
    }
  }, [authLoading, isAuthenticated, user, fetchPost, navigate, showToast]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Only JPG, JPEG, PNG, and WEBP images are supported.'
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'Image size cannot exceed 5 MB.'
      }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Post content is required';
    if (!contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!contactPhone.trim()) newErrors.contactPhone = 'Contact phone number is required';

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (contactEmail && !emailRegex.test(contactEmail)) {
      newErrors.contactEmail = 'Please provide a valid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix validation errors', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('contactEmail', contactEmail.trim());
      formData.append('contactPhone', contactPhone.trim());

      // Image is optional on edit
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        showToast('Article updated successfully!', 'success');
        navigate(`/posts/${id}`);
      }
    } catch (err) {
      console.error('Update post failed', err);
      showToast(err.response?.data?.message || 'Failed to update post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(`/posts/${id}`)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & View Post</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-10">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Article
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update your article content or contact information. Cover image replacement is optional.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="editPostTitle" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="editPostTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 text-sm bg-slate-50 border rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                  errors.title ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                }`}
                required
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1.5">{errors.title}</p>}
            </div>

            {/* Current or New Image */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Cover Image (Optional to change)
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-72 bg-slate-900 mb-3">
                  <img
                    src={imagePreview}
                    alt="New preview"
                    className="w-full h-72 object-cover object-center"
                  />
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-xl shadow-md transition-all"
                    title="Cancel new image"
                  >
                    <X className="w-5 h-5 text-rose-600" />
                  </button>
                </div>
              ) : existingImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-72 bg-slate-900 mb-3">
                  <img
                    src={existingImage}
                    alt="Current cover"
                    className="w-full h-72 object-cover object-center"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white">
                    Current Cover Image
                  </div>
                </div>
              ) : null}

              <label className="border border-dashed border-slate-300 rounded-2xl p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-semibold text-slate-700">
                  {existingImage ? 'Upload different cover image (optional)' : 'Upload cover image'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {errors.image && <p className="text-xs text-rose-500 mt-1.5">{errors.image}</p>}
            </div>

            {/* Post Content */}
            <div>
              <label htmlFor="editPostContent" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Article Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="editPostContent"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full px-4 py-3 text-sm bg-slate-50 border rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all resize-y ${
                  errors.content ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                }`}
                required
              />
              {errors.content && <p className="text-xs text-rose-500 mt-1.5">{errors.content}</p>}
            </div>

            {/* Contact Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="editContactEmail" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="editContactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                    errors.contactEmail ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                  }`}
                  required
                />
                {errors.contactEmail && (
                  <p className="text-xs text-rose-500 mt-1.5">{errors.contactEmail}</p>
                )}
              </div>

              <div>
                <label htmlFor="editContactPhone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="editContactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                    errors.contactPhone ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                  }`}
                  required
                />
                {errors.contactPhone && (
                  <p className="text-xs text-rose-500 mt-1.5">{errors.contactPhone}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
