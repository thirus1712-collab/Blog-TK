import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating = 0,
  count = 0,
  size = 'md',
  interactive = false,
  onRate = null,
  userRating = null,
  showCount = true
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const currentDisplay = hoverRating || userRating || rating || 0;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = currentDisplay >= starIndex;
          const isHalf = !isFilled && currentDisplay >= starIndex - 0.5;

          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(starIndex)}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${
                interactive
                  ? 'cursor-pointer transform hover:scale-125 transition-transform duration-150 p-0.5 focus:outline-none'
                  : 'cursor-default'
              }`}
              title={interactive ? `Rate ${starIndex} star${starIndex > 1 ? 's' : ''}` : undefined}
            >
              <Star
                className={`${starSizes[size] || starSizes.md} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-300'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
        <span>{rating > 0 ? rating.toFixed(1) : 'No ratings yet'}</span>
        {showCount && count > 0 && (
          <span className="text-slate-400 font-normal">({count})</span>
        )}
      </div>
    </div>
  );
};

export default RatingStars;
