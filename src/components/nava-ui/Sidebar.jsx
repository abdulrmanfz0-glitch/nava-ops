import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
  Menu as MenuIcon,
} from 'lucide-react';
import theme from '../../styles/navaUITheme';

/**
 * Sidebar - Modern collapsible sidebar with glass effects
 *
 * @param {boolean} defaultCollapsed - Start in collapsed state
 * @param {array} customMenuItems - Custom menu items
 */
const Sidebar = ({ defaultCollapsed = false, customMenuItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Default menu items
  const defaultMenuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      badge: null,
    },
    {
      label: 'Reports',
      icon: FileText,
      path: '/reports',
      badge: null,
    },
    {
      label: 'Menu Intelligence',
      icon: Brain,
      path: '/menu-intelligence',
      badge: 'AI',
    },
    {
      label: 'Financial',
      icon: BarChart3,
      path: '/financial-performance',
      badge: null,
    },
    {
      label: 'Team',
      icon: Users,
      path: '/team',
      badge: null,
    },
    {
      label: 'Branches',
      icon: Building2,
      path: '/branches',
      badge: null,
    },
    {
      label: 'AI Intelligence',
      icon: Sparkles,
      path: '/intelligence',
      badge: 'New',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      badge: null,
    },
  ];

  const menuItems = customMenuItems || defaultMenuItems;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-screen z-40 flex flex-col"
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '280px',
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Glass background */}
        <div
          className="absolute inset-0 backdrop-blur-2xl border-r"
          style={{
            background: theme.glass.dark.strong.background,
            borderColor: theme.colors.dark.border.default,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full py-6">
          {/* Logo section */}
          <div className="px-6 mb-8 flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <span className="text-white font-bold text-xl">N</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">NAVA</h1>
                    <p className="text-xs text-white/50">Ops Platform</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isCollapsed && (
              <motion.div
                className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-bold text-xl">N</span>
              </motion.div>
            )}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group relative flex items-center gap-3
                  px-3 py-3 rounded-xl
                  transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && !isCollapsed && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className="w-5 h-5" />
                    </motion.div>

                    {/* Label */}
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.div
                          className="flex-1 flex items-center justify-between"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="font-medium">{item.label}</span>

                          {/* Badge */}
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-400/20 text-cyan-400 rounded-full border border-cyan-400/30">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-cyan-400/20 text-cyan-400 rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Toggle button */}
          <div className="px-3 pt-4 mt-4 border-t border-white/10">
            <motion.button
              onClick={toggleSidebar}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl
                text-white/60 hover:text-white hover:bg-white/5
                transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium flex-1 text-left">Collapse</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-y-0 right-0 w-px opacity-50"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0, 196, 255, 0.5), transparent)',
            }}
          />
        </div>
      </motion.aside>

      {/* Spacer to prevent content overlap */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '280px',
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </>
  );
};

export default Sidebar;
