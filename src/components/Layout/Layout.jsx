import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  FileText,
  Users,
  DollarSign,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Building2,
  BarChart3
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: Home,
      permission: 'dashboard:view'
    },
    {
      name: 'Restaurants',
      path: '/restaurants',
      icon: Building2,
      permission: 'restaurants:view'
    },
    {
      name: 'Report Hub',
      path: '/report-hub',
      icon: BarChart3,
      permission: 'reports:view',
      badge: 'New'
    },
    {
      name: 'Team',
      path: '/team',
      icon: Users,
      permission: 'team:view'
    },
    {
      name: 'Financial',
      path: '/financial',
      icon: DollarSign,
      permission: 'financial:view'
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      permission: null
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      permission: 'settings:manage'
    }
  ];

  const filteredNavigation = navigationItems.filter(
    item => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-900 border-r border-gray-700 w-64`}
      
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6 px-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">NAVA</h1>
                <p className="text-xs text-gray-400">Operations Platform</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border-l-4 border-green-400'
                      : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'
                  }`}
                
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-green-500 text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-gray-400">{user?.role || 'viewer'}</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 glass-card rounded-lg shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"

                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-gray-900 bg-opacity-80 backdrop-blur-lg border-b border-gray-700">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-5"
            
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              {/* Notifications Badge */}
              <Link
                to="/notifications"
                className="relative text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-5"
              
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
