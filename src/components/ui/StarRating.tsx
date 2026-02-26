import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  note: number;
  max?: number;
  size?: number;
}

export default function StarRating({ note, max = 5, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(note) ? 'text-gold fill-gold' : 'text-light-blue'}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-dark">{note.toFixed(1)}</span>
    </div>
  );
}
