import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Edit3, Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';
import RatingStars from './RatingStars';

const PostCard = ({
  post,
  showActions = false,
  onEdit = null,
  onDelete = null
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/posts/${post._id}`);
  };

  // Preview snippet helper (limit to ~120 characters)
  const getPreviewText = (text) => {
    if (!text) return '';
    return text.length > 120 ? `${text.slice(0, 120).trim()}...` : text;
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-soft-hover transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={post.image?.thumbnail || '/placeholder.png'}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Edited badge if updated */}
        {post.isEdited && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-600 shadow-sm border border-slate-200/50">
            Edited
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatDateTime(post.createdAt)}</span>
          </div>

          {/* Post Title */}
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
            {post.title}
          </h2>

          {/* Text Preview */}
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {getPreviewText(post.content)}
          </p>
        </div>

        <div>
          {/* Author info */}
          <div className="flex items-center gap-2 mb-4 pt-3 border-t border-slate-100">
            <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 font-bold text-xs shrink-0">
              {post.author?.name ? post.author.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {post.author?.name || 'Anonymous Author'}
              </p>
              {post.author?.profession && (
                <p className="text-[11px] text-slate-500 truncate">
                  {post.author.profession}
                </p>
              )}
            </div>
          </div>

          {/* Card Footer: Rating in Bottom-Left */}
          <div className="flex items-center justify-between pt-1">
            {/* Rating in bottom-left corner */}
            <div className="flex items-center bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <RatingStars
                rating={post.averageRating}
                count={post.ratingCount}
                size="sm"
              />
            </div>

            {/* Direct Edit / Delete buttons if My Posts view */}
            {showActions ? (
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onEdit && onEdit(post)}
                  className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  title="Edit post"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(post)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="text-xs font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Read full &rarr;
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
