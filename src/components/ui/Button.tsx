import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-dark hover:bg-light-blue',
  };
  
  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };
  
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
