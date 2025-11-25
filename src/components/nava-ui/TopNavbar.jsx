import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Command,
} from 'lucide-react';
import theme from '../../styles/navaUITheme';

/**
 * TopNavbar - Modern top navigation bar with glass effects
 *
 * @param {object} user - User object { name, email, avatar }
 * @param {number} notificationCount - Number of unread notifications
 * @param {function} onNotificationsClick - Notifications click handler
 * @param {function} onSearchClick - Search click handler
 * @param {function} onProfileClick - Profile click handler
 * @param {function} onLogout - Logout handler
 * @param {boolean} darkMode - Dark mode state
 * @param {function} onToggleDarkMode - Dark mode toggle handler
 */
const TopNavbar = ({
  user = { name: 'User', email: 'user@nava.com', avatar: null },
  notificationCount = 0,
  onNotificationsClick,
  onSearchClick,
  onProfileClick,
  onLogout,
  darkMode = true,
  onToggleDarkMode,
  className = '',
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <motion.header
      className={`sticky top-0 z-30 ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glass background */}
      <div
        className="backdrop-blur-2xl border-b"
        style={{
          background: theme.glass.dark.medium.background,
          borderColor: theme.colors.dark.border.default,
        }}
      >
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          {/* Left section - Search */}
          <div className="flex-1 max-w-xl">
            <motion.button
              onClick={onSearchClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Search className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
              <span className="text-white/40 text-sm group-hover:text-white/60 transition-colors">
                Search anything...
              </span>
              <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                <Command className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/40 font-medium">K</span>
              </div>
            </motion.button>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            {onToggleDarkMode && (
              <motion.button
                onClick={onToggleDarkMode}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>
            )}

            {/* Notifications */}
            <motion.button
              onClick={onNotificationsClick}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#0A0E14]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile dropdown */}
            <div className="relative">
              <motion.button
                onClick={toggleProfile}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-cyan-500/30">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* User info */}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white leading-tight">{user.name}</p>
                  <p className="text-xs text-white/50 leading-tight">{user.email}</p>
                </div>

                {/* Dropdown icon */}
                <motion.div
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-white/40" />
                </motion.div>
              </motion.button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      className="fixed inset-0 z-40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsProfileOpen(false)}
                    />

                    {/* Menu */}
                    <motion.div
                      className="absolute right-0 mt-2 w-64 backdrop-blur-2xl rounded-xl border shadow-2xl z-50 overflow-hidden"
                      style={{
                        background: theme.glass.dark.strong.background,
                        borderColor: theme.colors.dark.border.default,
                      }}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* User info section */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-white/50">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-2">
                        <motion.button
                          onClick={() => {
                            onProfileClick?.();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </motion.button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-white/10 py-2">
                        <motion.button
                          onClick={() => {
                            onLogout?.();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </motion.header>
  );
};

export default TopNavbar;
