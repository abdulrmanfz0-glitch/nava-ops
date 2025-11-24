// src/components/UI/LoadingSpinner.jsx - Ultra Modern Loading Component
import React from 'react';

export default function LoadingSpinner({ size = 'md', text = '', className = '' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
    xl: 'w-20 h-20 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-gray-700 border-t-cyan-500 rounded-full animate-spin`}></div>
        <div className={`${sizeClasses[size]} absolute top-0 left-0 border-gray-800 border-b-blue-500 rounded-full animate-spin-reverse opacity-50`}></div>
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}
