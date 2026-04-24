import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`p-6 rounded-xl glass border border-khaki-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
