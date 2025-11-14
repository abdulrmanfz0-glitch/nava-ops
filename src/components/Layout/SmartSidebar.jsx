import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { navigationConfig, searchNavigationItems } from '../../utils/navigationConfig';
import * as Icons from 'lucide-react';

export default function SmartSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const {
    isOpen,
    isMiniMode,
    toggleSidebar,
    toggleMiniMode,
    toggleModule,
    isModuleExpanded,
    toggleFavorite,
    isFavorite,
    favoritesWithInfo,
    recentPages,
    searchQuery,
    setSearchQuery,
    clearSearch,
  } = useSidebar();

  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchNavigationItems(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Clear search on route change
  useEffect(() => {
    clearSearch();
  }, [location.pathname, clearSearch]);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('sidebar-search')?.focus();
      }
      if (e.key === 'Escape' && searchFocused) {
        clearSearch();
        document.getElementById('sidebar-search')?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused, clearSearch]);

  const renderIcon = (iconName, className = 'w-5 h-5') => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  const isActivePath = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out z-40 ${
        isMiniMode ? 'w-20' : 'w-72'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {!isMiniMode && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              R
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Restalyze
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Legendary Edition</p>
            </div>
          </div>
        )}
        {isMiniMode && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg mx-auto">
            R
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Search Bar */}
        {!isMiniMode && (
          <div className="p-4 space-y-3">
            <div className="relative">
              <input
                id="sidebar-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search navigation..."
                className="w-full px-4 py-2 pl-10 pr-10 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              )}
              <div className="absolute right-12 top-2.5 text-xs text-gray-400 hidden lg:block">
                ⌘K
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && searchFocused && (
              <div className="absolute left-4 right-4 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 animate-fadeInUp">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={result.path}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    {renderIcon(result.icon, 'w-5 h-5 text-gray-400')}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {result.module?.title}
                      </div>
                    </div>
                    {result.comingSoon && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!isMiniMode && (favoritesWithInfo.length > 0 || recentPages.length > 0) && (
          <div className="px-4 pb-4 space-y-3">
            {/* Favorites */}
            {favoritesWithInfo.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Favorites
                  </h3>
                  <Icons.Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </div>
                <div className="space-y-1">
                  {favoritesWithInfo.map((page) => (
                    <Link
                      key={page.path}
                      to={page.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
                        isActivePath(page.path, true)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {renderIcon(page.icon, 'w-4 h-4')}
                      <span className="flex-1 truncate">{page.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Pages */}
            {recentPages.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent
                  </h3>
                  <Icons.Clock className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="space-y-1">
                  {recentPages.slice(0, 3).map((page) => (
                    <Link
                      key={page.path}
                      to={page.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
                        isActivePath(page.path, true)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {renderIcon(page.icon, 'w-4 h-4')}
                      <span className="flex-1 truncate">{page.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Modules */}
        <nav className="px-3 pb-4 space-y-2">
          {navigationConfig.map((module) => {
            const isExpanded = isModuleExpanded(module.id);
            const hasActiveItem = module.items.some(item => isActivePath(item.path, item.exact));

            return (
              <div key={module.id} className="space-y-1">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group ${
                    hasActiveItem
                      ? 'bg-gradient-to-r ' + module.gradient + ' text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {renderIcon(module.icon, `w-5 h-5 ${hasActiveItem ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`)}
                    {!isMiniMode && (
                      <span className="font-semibold text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                        {module.title}
                      </span>
                    )}
                  </div>
                  {!isMiniMode && (
                    <Icons.ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      } ${hasActiveItem ? 'text-white' : 'text-gray-400'}`}
                    />
                  )}
                </button>

                {/* Module Items */}
                {isExpanded && !isMiniMode && (
                  <div className="ml-4 space-y-0.5 animate-fadeInUp">
                    {module.items.map((item) => {
                      const isActive = isActivePath(item.path, item.exact);

                      return (
                        <div key={item.id} className="relative group/item">
                          <Link
                            to={item.comingSoon ? '#' : item.path}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium border-l-2 border-blue-600'
                                : item.comingSoon
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                            onClick={(e) => item.comingSoon && e.preventDefault()}
                          >
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              {renderIcon(item.icon, 'w-4 h-4 flex-shrink-0')}
                              <span className="truncate">{item.title}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                              {item.comingSoon && (
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                                  Soon
                                </span>
                              )}
                              {!item.comingSoon && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(item.path);
                                  }}
                                  className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                >
                                  <Icons.Star
                                    className={`w-3.5 h-3.5 ${
                                      isFavorite(item.path)
                                        ? 'text-amber-500 fill-amber-500'
                                        : 'text-gray-400'
                                    }`}
                                  />
                                </button>
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {!isMiniMode ? (
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.user_metadata?.full_name || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.user_metadata?.role || 'Manager'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleMiniMode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Toggle mini mode"
              >
                <Icons.ChevronsLeft className="w-4 h-4" />
              </button>
              <Link
                to="/settings"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Settings"
              >
                <Icons.Settings className="w-4 h-4" />
              </Link>
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Sign out"
              >
                <Icons.LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            <button
              onClick={toggleMiniMode}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Expand sidebar"
            >
              <Icons.ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
