import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, X, ArrowLeft, Send } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      showToast('Please log in to create a post', 'info');
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate, showToast]);

  // Pre-fill author's email
  useEffect(() => {
    if (user?.email && !contactEmail) {
      setContactEmail(user.email);
    }
  }, [user, contactEmail]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Only JPG, JPEG, PNG, and WEBP images are supported.'
      }));
      return;
    }

    // Validate size (5MB max)
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Post content is required';
    if (!contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!contactPhone.trim()) newErrors.contactPhone = 'Contact phone number is required';
    if (!imageFile) newErrors.image = 'An image is required for the article cover';

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (contactEmail && !emailRegex.test(contactEmail)) {
      newErrors.contactEmail = 'Please provide a valid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please correct the errors in the form', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('contactEmail', contactEmail.trim());
      formData.append('contactPhone', contactPhone.trim());
      formData.append('image', imageFile);

      const res = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        showToast('Article published successfully!', 'success');
        navigate(`/posts/${res.data.post._id}`);
      }
    } catch (err) {
      console.error('Create post failed', err);
      showToast(err.response?.data?.message || 'Failed to publish post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Return</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-10">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create New Article
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Publish your ideas to the entire Blog TK community. Formatted images will be automatically optimized.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="postTitle" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="postTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep Dive into Reactive Microservices with Node.js"
                className={`w-full px-4 py-3 text-sm bg-slate-50 border rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                  errors.title ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                }`}
                required
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1.5">{errors.title}</p>}
            </div>

            {/* Image Upload Area with Preview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Cover Image <span className="text-rose-500">*</span>
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-72 bg-slate-900">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-72 object-cover object-center"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-xl shadow-md transition-all"
                    title="Remove image"
                  >
                    <X className="w-5 h-5 text-rose-600" />
                  </button>
                </div>
              ) : (
                <label className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  errors.image ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-brand-400 bg-slate-50/50 hover:bg-brand-50/20'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-600 mb-3 shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click or drag image to upload
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accepts JPG, PNG, WEBP up to 5 MB
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.image && <p className="text-xs text-rose-500 mt-1.5">{errors.image}</p>}
            </div>

            {/* Post Content */}
            <div>
              <label htmlFor="postContent" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Article Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="postContent"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article markdown or formatted paragraphs here..."
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
                <label htmlFor="contactEmail" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="author@example.com"
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
                <label htmlFor="contactPhone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
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
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing Article...' : 'Publish Article'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
