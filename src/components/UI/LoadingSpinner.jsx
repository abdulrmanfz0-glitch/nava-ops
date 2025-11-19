// src/components/UI/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
    </div>
  );
}
 
