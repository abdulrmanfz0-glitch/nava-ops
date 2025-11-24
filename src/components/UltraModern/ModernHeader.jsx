import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Calendar,
  Sun,
  Moon,
  Command,
  LogOut,
  HelpCircle,
  Plus,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

/**
 * ModernHeader - Futuristic header with search, notifications, and user menu
 * Features: Spotlight search, notification center, animated interactions
 */
const ModernHeader = ({
  title,
  subtitle,
  user = {},
  isDarkMode = true,
  onThemeToggle,
  notifications = [],
  onSearch,
  breadcrumbs = [],
  onLogout,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Default notifications
  const defaultNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Order completed',
      message: 'Order #1234 has been successfully delivered',
      time: '2 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low inventory alert',
      message: 'Fresh salmon stock is running low',
      time: '15 min ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'New report available',
      message: 'Your weekly analytics report is ready',
      time: '1 hour ago',
      read: true,
    },
  ];

  const displayNotifications = notifications.length ? notifications : defaultNotifications;
  const unreadCount = displayNotifications.filter(n => !n.read).length;

  // Notification type icons
  const notificationIcons = {
    success: { icon: CheckCircle, color: 'text-emerald-400' },
    warning: { icon: AlertTriangle, color: 'text-amber-400' },
    info: { icon: Info, color: 'text-blue-400' },
    error: { icon: AlertTriangle, color: 'text-red-400' },
  };

  // Quick actions for spotlight search
  const quickActions = [
    { label: 'New Order', icon: Plus, shortcut: 'N' },
    { label: 'View Reports', icon: Calendar, shortcut: 'R' },
    { label: 'Settings', icon: Settings, shortcut: 'S' },
    { label: 'Help', icon: HelpCircle, shortcut: 'H' },
  ];

  return (
    <>
      <header className="
        sticky top-0 z-40
        px-8 py-4
        bg-gray-950/80 backdrop-blur-2xl
        border-b border-white/[0.06]
      ">
        <div className="flex items-center justify-between">
          {/* Left Section - Title & Breadcrumbs */}
          <div className="flex-1">
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    <a href={crumb.href} className="hover:text-gray-300 transition-colors">
                      {crumb.label}
                    </a>
                  </span>
                ))}
              </nav>
            )}
            <div className="flex items-center gap-4">
              <div>
                <motion.h1
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {title || 'Dashboard'}
                </motion.h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <motion.button
              className="
                flex items-center gap-3 px-4 py-2.5
                bg-white/[0.03] hover:bg-white/[0.06]
                border border-white/[0.08] rounded-xl
                text-gray-400 hover:text-white
                transition-all duration-200
                w-64
              "
              onClick={() => setIsSearchOpen(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left text-sm">Search...</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] text-xs">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </motion.button>

            {/* Date Display */}
            <div className="
              hidden md:flex items-center gap-2 px-4 py-2.5
              bg-white/[0.03] border border-white/[0.08] rounded-xl
            ">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Theme Toggle */}
            <motion.button
              className="
                p-2.5 rounded-xl
                bg-white/[0.03] hover:bg-white/[0.06]
                border border-white/[0.08]
                text-gray-400 hover:text-white
                transition-all duration-200
              "
              onClick={onThemeToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                className="
                  relative p-2.5 rounded-xl
                  bg-white/[0.03] hover:bg-white/[0.06]
                  border border-white/[0.08]
                  text-gray-400 hover:text-white
                  transition-all duration-200
                "
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span
                    className="
                      absolute -top-1 -right-1 w-5 h-5
                      bg-red-500 rounded-full
                      flex items-center justify-center
                      text-[10px] font-bold text-white
                    "
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    className="
                      absolute top-full right-0 mt-2 w-80
                      bg-gray-900/95 backdrop-blur-2xl
                      border border-white/[0.1] rounded-2xl
                      shadow-2xl overflow-hidden
                    "
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      <button className="text-xs text-cyan-400 hover:text-cyan-300">
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {displayNotifications.map((notification) => {
                        const config = notificationIcons[notification.type] || notificationIcons.info;
                        const Icon = config.icon;

                        return (
                          <div
                            key={notification.id}
                            className={`
                              px-4 py-3 hover:bg-white/[0.03]
                              border-b border-white/[0.04]
                              transition-colors cursor-pointer
                              ${!notification.read ? 'bg-white/[0.02]' : ''}
                            `}
                          >
                            <div className="flex gap-3">
                              <div className={`mt-0.5 ${config.color}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="px-4 py-3 border-t border-white/[0.08]">
                      <button className="w-full text-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <motion.button
                className="
                  flex items-center gap-3 px-3 py-2
                  bg-white/[0.03] hover:bg-white/[0.06]
                  border border-white/[0.08] rounded-xl
                  transition-all duration-200
                "
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    className="
                      absolute top-full right-0 mt-2 w-56
                      bg-gray-900/95 backdrop-blur-2xl
                      border border-white/[0.1] rounded-2xl
                      shadow-2xl overflow-hidden
                    "
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-3 border-b border-white/[0.08]">
                      <p className="text-sm font-medium text-white">{user?.email || 'user@example.com'}</p>
                    </div>

                    <div className="py-2">
                      {[
                        { icon: User, label: 'Profile' },
                        { icon: Settings, label: 'Settings' },
                        { icon: HelpCircle, label: 'Help & Support' },
                      ].map((item, index) => (
                        <button
                          key={index}
                          className="
                            w-full flex items-center gap-3 px-4 py-2.5
                            text-sm text-gray-300 hover:text-white
                            hover:bg-white/[0.05]
                            transition-colors
                          "
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-white/[0.08] py-2">
                      <button
                        onClick={onLogout}
                        className="
                          w-full flex items-center gap-3 px-4 py-2.5
                          text-sm text-red-400 hover:text-red-300
                          hover:bg-red-500/10
                          transition-colors
                        "
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Spotlight Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Search Modal */}
            <motion.div
              className="
                relative w-full max-w-xl
                bg-gray-900/95 backdrop-blur-2xl
                border border-white/[0.1] rounded-2xl
                shadow-2xl overflow-hidden
              "
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.08]">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    flex-1 bg-transparent
                    text-white placeholder:text-gray-500
                    text-lg outline-none
                  "
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </p>
                <div className="space-y-1">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      className="
                        w-full flex items-center justify-between px-4 py-3
                        rounded-xl hover:bg-white/[0.05]
                        transition-colors
                      "
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                          <action.icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-300">{action.label}</span>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-white/[0.05] text-xs text-gray-500">
                        {action.shortcut}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Press ESC to close</span>
                  <div className="flex items-center gap-2">
                    <span>Navigate with</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.05]">↑</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.05]">↓</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernHeader;
