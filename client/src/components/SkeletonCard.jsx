import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden flex flex-col h-full animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="w-full h-48 bg-slate-200" />

      {/* Content placeholder */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Date line */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-24 h-4 bg-slate-200 rounded" />
            <div className="w-16 h-4 bg-slate-200 rounded" />
          </div>

          {/* Title */}
          <div className="w-full h-6 bg-slate-200 rounded mb-2" />
          <div className="w-3/4 h-6 bg-slate-200 rounded mb-4" />

          {/* Preview lines */}
          <div className="w-full h-3.5 bg-slate-100 rounded mb-1.5" />
          <div className="w-5/6 h-3.5 bg-slate-100 rounded mb-1.5" />
          <div className="w-4/6 h-3.5 bg-slate-100 rounded mb-4" />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="w-24 h-4 bg-slate-200 rounded" />
          <div className="w-20 h-4 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
