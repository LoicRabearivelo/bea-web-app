import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'gold' | 'olive' | 'salmon' | 'blue';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    gold: 'bg-gold/20 text-dark',
    olive: 'bg-olive/20 text-dark',
    salmon: 'bg-salmon/20 text-dark',
    blue: 'bg-light-blue text-dark',
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
