import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarContext = createContext();

// Storage key for persistence
const STORAGE_KEY = 'restalyze_sidebar_state';

// Default state
const DEFAULT_STATE = {
  isOpen: true,
  isMiniMode: false,
  expandedModules: ['command-center'], // Command Center expanded by default
  favorites: [],
  recentPages: [],
  searchQuery: '',
  searchHistory: []
};

// Maximum items to store
const MAX_RECENT_PAGES = 5;
const MAX_SEARCH_HISTORY = 10;
const MAX_FAVORITES = 8;

export function SidebarProvider({ children }) {
  const location = useLocation();

  // Initialize state from localStorage or defaults
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          searchQuery: '', // Never persist search query
        };
      }
    } catch (error) {
      console.error('Failed to load sidebar state:', error);
    }
    return DEFAULT_STATE;
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToPersist = {
        ...state,
        searchQuery: '', // Don't persist search query
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (error) {
      console.error('Failed to save sidebar state:', error);
    }
  }, [state]);

  // Track page visits in recent pages
  useEffect(() => {
    const currentPath = location.pathname;
    const currentPage = getPageInfo(currentPath);

    if (currentPage) {
      updateRecentPages(currentPage);
    }
  }, [location.pathname]);

  // Helper: Get page info from path
  const getPageInfo = useCallback((path) => {
    const pages = {
      '/': { path: '/', title: 'Dashboard', module: 'command-center', icon: 'LayoutDashboard' },
      '/branches': { path: '/branches', title: 'Branches', module: 'staff-command', icon: 'Building2' },
      '/data-intelligence': { path: '/data-intelligence', title: 'Menu Performance', module: 'intelligence-hub', icon: 'TrendingUp' },
      '/data-management': { path: '/data-management', title: 'Menu Management', module: 'staff-command', icon: 'UtensilsCrossed' },
      '/financial': { path: '/financial', title: 'Financial Reports', module: 'financials', icon: 'DollarSign' },
      '/reports': { path: '/reports', title: 'Reports & Analytics', module: 'intelligence-hub', icon: 'FileText' },
      '/team': { path: '/team', title: 'Team Management', module: 'staff-command', icon: 'Users' },
    };
    return pages[path] || null;
  }, []);

  // Toggle sidebar open/closed
  const toggleSidebar = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      isMiniMode: false // Disable mini mode when toggling
    }));
  }, []);

  // Toggle mini mode (icons only)
  const toggleMiniMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isMiniMode: !prev.isMiniMode,
      isOpen: true // Ensure sidebar is open in mini mode
    }));
  }, []);

  // Toggle module expanded/collapsed
  const toggleModule = useCallback((moduleId) => {
    setState(prev => {
      const isExpanded = prev.expandedModules.includes(moduleId);
      return {
        ...prev,
        expandedModules: isExpanded
          ? prev.expandedModules.filter(id => id !== moduleId)
          : [...prev.expandedModules, moduleId]
      };
    });
  }, []);

  // Check if module is expanded
  const isModuleExpanded = useCallback((moduleId) => {
    return state.expandedModules.includes(moduleId);
  }, [state.expandedModules]);

  // Add to favorites
  const addFavorite = useCallback((path) => {
    setState(prev => {
      // Don't add if already in favorites or max reached
      if (prev.favorites.includes(path) || prev.favorites.length >= MAX_FAVORITES) {
        return prev;
      }
      return {
        ...prev,
        favorites: [...prev.favorites, path]
      };
    });
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback((path) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(fav => fav !== path)
    }));
  }, []);

  // Toggle favorite (add if not present, remove if present)
  const toggleFavorite = useCallback((path) => {
    setState(prev => {
      const isFavorite = prev.favorites.includes(path);
      if (isFavorite) {
        return {
          ...prev,
          favorites: prev.favorites.filter(fav => fav !== path)
        };
      } else if (prev.favorites.length < MAX_FAVORITES) {
        return {
          ...prev,
          favorites: [...prev.favorites, path]
        };
      }
      return prev;
    });
  }, []);

  // Check if path is favorited
  const isFavorite = useCallback((path) => {
    return state.favorites.includes(path);
  }, [state.favorites]);

  // Update recent pages
  const updateRecentPages = useCallback((page) => {
    setState(prev => {
      // Remove if already exists
      const filtered = prev.recentPages.filter(p => p.path !== page.path);

      // Add to beginning with timestamp
      const updated = [
        { ...page, timestamp: Date.now() },
        ...filtered
      ].slice(0, MAX_RECENT_PAGES);

      return {
        ...prev,
        recentPages: updated
      };
    });
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query) => {
    setState(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);

  // Add to search history
  const addToSearchHistory = useCallback((query) => {
    if (!query || query.trim().length === 0) return;

    setState(prev => {
      // Remove if already exists
      const filtered = prev.searchHistory.filter(q => q !== query);

      // Add to beginning
      const updated = [query, ...filtered].slice(0, MAX_SEARCH_HISTORY);

      return {
        ...prev,
        searchHistory: updated
      };
    });
  }, []);

  // Clear search query
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: ''
    }));
  }, []);

  // Clear all recent pages
  const clearRecentPages = useCallback(() => {
    setState(prev => ({
      ...prev,
      recentPages: []
    }));
  }, []);

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchHistory: []
    }));
  }, []);

  // Reset to defaults
  const resetSidebar = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  // Get favorites with page info
  const favoritesWithInfo = useMemo(() => {
    return state.favorites
      .map(path => getPageInfo(path))
      .filter(Boolean); // Remove any null entries
  }, [state.favorites, getPageInfo]);

  // Context value
  const value = useMemo(() => ({
    // State
    isOpen: state.isOpen,
    isMiniMode: state.isMiniMode,
    expandedModules: state.expandedModules,
    favorites: state.favorites,
    recentPages: state.recentPages,
    searchQuery: state.searchQuery,
    searchHistory: state.searchHistory,
    favoritesWithInfo,

    // Methods
    toggleSidebar,
    toggleMiniMode,
    toggleModule,
    isModuleExpanded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    updateRecentPages,
    setSearchQuery,
    addToSearchHistory,
    clearSearch,
    clearRecentPages,
    clearSearchHistory,
    resetSidebar,
    getPageInfo,
  }), [
    state,
    favoritesWithInfo,
    toggleSidebar,
    toggleMiniMode,
    toggleModule,
    isModuleExpanded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    updateRecentPages,
    setSearchQuery,
    addToSearchHistory,
    clearSearch,
    clearRecentPages,
    clearSearchHistory,
    resetSidebar,
    getPageInfo,
  ]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

// Custom hook to use sidebar context
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Export context for advanced usage
export default SidebarContext;
