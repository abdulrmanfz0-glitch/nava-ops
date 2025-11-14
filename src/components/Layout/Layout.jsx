// src/components/Layout/Layout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import {
  Bell, Menu, X, ChevronRight
} from 'lucide-react';
import SmartSidebar from './SmartSidebar';
import { getBreadcrumbs } from '../../utils/navigationConfig';

// Feature flag for Smart Sidebar (set to true to enable new sidebar)
const USE_SMART_SIDEBAR = true;

export default function Layout({ children }) {
  const { user, userProfile, logout } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Get sidebar state from context
  const { isOpen, isMiniMode, toggleSidebar } = useSidebar();

  // Calculate left padding based on sidebar state
  const getMainPadding = () => {
    if (!USE_SMART_SIDEBAR) return 'lg:pl-64';
    if (!isOpen) return 'lg:pl-0';
    if (isMiniMode) return 'lg:pl-20';
    return 'lg:pl-72';
  };

  // Get breadcrumbs for current path
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Smart Sidebar */}
      {USE_SMART_SIDEBAR && <SmartSidebar />}

      {/* Main content */}
      <div className={`transition-all duration-300 ${getMainPadding()}`}>
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Left section - Menu toggle and Breadcrumbs */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {USE_SMART_SIDEBAR && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Toggle sidebar"
                >
                  <Menu size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              )}

              {/* Breadcrumbs */}
              {USE_SMART_SIDEBAR && breadcrumbs.length > 1 && (
                <nav className="hidden md:flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                      {crumb.path ? (
                        <Link
                          to={crumb.path}
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                        >
                          {crumb.title}
                        </Link>
                      ) : (
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {crumb.title}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>

            {/* Right section - Notifications */}
            <div className="flex items-center gap-2">
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Notifications"
              >
                <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
