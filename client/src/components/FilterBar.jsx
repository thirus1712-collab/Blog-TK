import React from 'react';
import { Calendar, X, Star, UserCheck, Layers, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FilterBar = ({
  activeRating = 'all',
  onSelectRating,
  selectedDate = '',
  onSelectDate,
  showMineToggle = false,
  isMineOnly = false,
  onToggleMine,
  totalPostsCount = null,
  onResetFilters
}) => {
  const { isAuthenticated } = useAuth();

  const ratingOptions = [
    { label: 'All Posts', value: 'all', icon: Layers },
    { label: '5 Stars', value: '5', stars: 5 },
    { label: '4 Stars', value: '4', stars: 4 },
    { label: '3 Stars', value: '3', stars: 3 },
    { label: '2 Stars', value: '2', stars: 2 },
    { label: '1 Star', value: '1', stars: 1 }
  ];

  const hasActiveFilters =
    activeRating !== 'all' || selectedDate !== '' || isMineOnly;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-4 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Rating & Mine Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mine Toggle Chip (Visible only when logged in) */}
          {showMineToggle && isAuthenticated && (
            <button
              type="button"
              onClick={onToggleMine}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                isMineOnly
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mine</span>
            </button>
          )}

          {/* Rating filter chips */}
          {ratingOptions.map((opt) => {
            const isSelected = !isMineOnly && activeRating === opt.value;
            const IconComponent = opt.icon;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (isMineOnly && onToggleMine) {
                    onToggleMine(); // switch off mine filter if picking general rating
                  }
                  onSelectRating(opt.value);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {IconComponent ? (
                  <IconComponent className="w-3.5 h-3.5" />
                ) : (
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                )}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Date Picker & Reset */}
        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="pl-9 pr-8 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
              title="Filter posts by publication date"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => onSelectDate('')}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear date filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reset All Filters button if active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Result Count indicator */}
          {totalPostsCount !== null && (
            <div className="text-xs font-medium text-slate-500 pl-2 border-l border-slate-200">
              <span className="font-bold text-slate-900">{totalPostsCount}</span> {totalPostsCount === 1 ? 'post' : 'posts'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
