// src/components/UI/SkeletonLoader.jsx
/**
 * Comprehensive Skeleton Loader Component Library
 * Provides loading placeholders for better UX
 */

import React from 'react';

// Base Skeleton Component
export const Skeleton = ({ className = '', width, height, circle = false, animation = 'pulse' }) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const style = {
    width: width || '100%',
    height: height || '1rem',
    borderRadius: circle ? '50%' : '0.375rem'
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
};

// Text Line Skeleton
export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '60%' : '100%'}
          height="0.875rem"
        />
      ))}
    </div>
  );
};

// Card Skeleton
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
        <Skeleton circle width="48px" height="48px" />
        <div className="flex-1">
          <Skeleton width="40%" height="1rem" className="mb-2" />
          <Skeleton width="60%" height="0.75rem" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

// Table Row Skeleton
export const SkeletonTableRow = ({ columns = 4 }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton height="1rem" />
        </td>
      ))}
    </tr>
  );
};

// Complete Table Skeleton
export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
      {/* Table Header Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex px-6 py-3 space-x-4 rtl:space-x-reverse">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="flex-1">
              <Skeleton width="70%" height="0.875rem" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Body Skeleton */}
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Dashboard Stat Card Skeleton
export const SkeletonStatCard = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="50%" height="1rem" />
        <Skeleton circle width="40px" height="40px" />
      </div>
      <Skeleton width="70%" height="2rem" className="mb-2" />
      <Skeleton width="40%" height="0.875rem" />
    </div>
  );
};

// Chart Skeleton
export const SkeletonChart = ({ height = '300px', className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <Skeleton width="40%" height="1.25rem" className="mb-6" />
      <div className="flex items-end justify-between space-x-2 rtl:space-x-reverse" style={{ height }}>
        {Array.from({ length: 12 }).map((_, index) => {
          const randomHeight = Math.floor(Math.random() * 80) + 20;
          return (
            <div key={index} className="flex-1 flex flex-col justify-end">
              <Skeleton height={`${randomHeight}%`} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} width="20px" height="0.75rem" />
        ))}
      </div>
    </div>
  );
};

// List Item Skeleton
export const SkeletonListItem = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-4 rtl:space-x-reverse p-4 ${className}`}>
      <Skeleton circle width="40px" height="40px" />
      <div className="flex-1">
        <Skeleton width="60%" height="1rem" className="mb-2" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
      <Skeleton width="80px" height="2rem" />
    </div>
  );
};

// Form Skeleton
export const SkeletonForm = ({ fields = 4, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index}>
          <Skeleton width="30%" height="1rem" className="mb-2" />
          <Skeleton width="100%" height="2.5rem" />
        </div>
      ))}
      <div className="flex space-x-4 rtl:space-x-reverse">
        <Skeleton width="120px" height="2.5rem" />
        <Skeleton width="120px" height="2.5rem" />
      </div>
    </div>
  );
};

// Avatar Skeleton
export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: '32px',
    md: '48px',
    lg: '64px',
    xl: '96px'
  };

  return (
    <Skeleton
      circle
      width={sizes[size]}
      height={sizes[size]}
      className={className}
    />
  );
};

// Page Header Skeleton
export const SkeletonPageHeader = ({ className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <Skeleton width="40%" height="2rem" className="mb-2" />
      <Skeleton width="60%" height="1rem" />
    </div>
  );
};

// Dashboard Grid Skeleton
export const SkeletonDashboard = () => {
  return (
    <div className="space-y-6">
      <SkeletonPageHeader />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      {/* Table */}
      <SkeletonTable rows={8} columns={5} />
    </div>
  );
};

// Shimmer animation CSS (add to your global CSS or use Tailwind config)
export const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
    background: linear-gradient(
      to right,
      #f0f0f0 0%,
      #e0e0e0 20%,
      #f0f0f0 40%,
      #f0f0f0 100%
    );
    background-size: 1000px 100%;
  }

  .dark .animate-shimmer {
    background: linear-gradient(
      to right,
      #374151 0%,
      #4b5563 20%,
      #374151 40%,
      #374151 100%
    );
    background-size: 1000px 100%;
  }
`;

export default {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonTableRow,
  SkeletonStatCard,
  SkeletonChart,
  SkeletonListItem,
  SkeletonForm,
  SkeletonAvatar,
  SkeletonPageHeader,
  SkeletonDashboard
};
