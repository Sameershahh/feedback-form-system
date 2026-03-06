'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  onChange: (rating: number) => void;
  required?: boolean;
  label?: string;
}

export function RatingStars({ value, onChange, required = false, label = 'Rating' }: RatingStarsProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-black">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="focus:outline-none transition-transform hover:scale-110"
            aria-label={`Rate ${rating} out of 5`}
          >
            <Star
              size={28}
              className={`transition-colors ${
                rating <= value
                  ? 'fill-[#A6F4C5] text-[#A6F4C5]'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
