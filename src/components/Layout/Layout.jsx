import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ModernSidebar from '../UltraModern/ModernSidebar';
import ModernHeader from '../UltraModern/ModernHeader';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Add your theme toggle logic here
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap = {
      '/': 'Dashboard',
      '/dashboard-v2': 'Dashboard V2',
      '/restaurants': 'Restaurants',
      '/branches': 'Branches',
      '/reports': 'Reports',
      '/report-hub': 'Report Hub',
      '/team': 'Team Management',
      '/financial': 'Financial Reports',
      '/financial-intelligence': 'Financial Intelligence',
      '/financial-performance': 'Financial Performance',
      '/menu-intelligence': 'Menu Intelligence',
      '/intelligence': 'AI Intelligence',
      '/executive': 'Executive Dashboard',
      '/executive-hq': 'Executive HQ',
      '/notifications': 'Notifications',
      '/settings': 'Settings',
      '/subscriptions': 'Subscriptions',
      '/billing': 'Billing',
      '/smart-features': 'Smart Features',
      '/ultra-dashboard': 'Ultra Modern Dashboard',
    };
    return titleMap[path] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Modern Sidebar */}
      <ModernSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        user={{
          name: user?.email?.split('@')[0] || 'User',
          email: user?.email || 'user@example.com',
          role: user?.role || 'Administrator',
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? '280px' : '80px',
        }}
      >
        {/* Modern Header */}
        <ModernHeader
          title={getPageTitle()}
          subtitle={`Welcome back, ${user?.email?.split('@')[0] || 'User'}`}
          user={{
            name: user?.email?.split('@')[0] || 'User',
            email: user?.email || 'user@example.com',
            role: user?.role || 'Administrator',
          }}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          notifications={[]}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
