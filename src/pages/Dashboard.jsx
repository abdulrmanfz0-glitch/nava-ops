// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { userProfile } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {userProfile?.full_name || 'User'}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Quick Stats
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Dashboard content will appear here
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Recent Activity
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Activity feed will appear here
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            System Status
          </h3>
          <p className="text-green-600 dark:text-green-400">
            ✓ All systems operational
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          🎉 The frontend is now working! You can start building your dashboard here.
        </p>
      </div>
    </div>
  );
}
