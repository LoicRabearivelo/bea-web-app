import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = true }: CardProps) {
  return (
    <div
      className={`bg-white/80 border border-light-blue rounded-xl shadow-sm p-4 sm:p-6 transition-all duration-200 ${hover ? 'hover:shadow-md' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
