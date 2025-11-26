import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  Users,
  Building2,
  CreditCard,
  Bell,
  Sparkles,
  ChefHat,
  TrendingUp,
  Brain,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Search,
  Zap,
  ShieldCheck,
} from 'lucide-react';

/**
 * ModernSidebar - Futuristic navigation sidebar
 * Features: Glassmorphism, smooth animations, collapsible groups, active indicators
 */
const ModernSidebar = ({
  isOpen = true,
  onToggle,
  isDarkMode = true,
  onThemeToggle,
  user = {},
  onLogout,
  hasPermission = () => true, // Default: show all items if no permission check
}) => {
  const location = useLocation();
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation items structure
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      badge: 'New',
      badgeColor: 'cyan',
    },
    {
      id: 'branches',
      label: 'Branches',
      icon: Building2,
      path: '/branches',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      children: [
        { label: 'Report Hub', path: '/report-hub', icon: FileText },
        { label: 'Analytics', path: '/reports', icon: TrendingUp },
        { label: 'Executive', path: '/executive', icon: Sparkles },
      ],
    },
    {
      id: 'intelligence',
      label: 'AI Intelligence',
      icon: Brain,
      path: '/intelligence',
      badge: 'AI',
      badgeColor: 'purple',
    },
    {
      id: 'menu',
      label: 'Menu Intelligence',
      icon: ChefHat,
      path: '/menu-intelligence',
    },
    {
      id: 'refunds',
      label: 'Refund Defense Center',
      icon: ShieldCheck,
      path: '/refunds',
      permissions: ['reports:view'],
      badge: 'New',
      badgeColor: 'orange',
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      path: '/team',
    },
    {
      id: 'financial',
      label: 'Financial',
      icon: CreditCard,
      children: [
        { label: 'Overview', path: '/financial', icon: TrendingUp },
        { label: 'Intelligence', path: '/financial-intelligence', icon: Brain },
        { label: 'Performance', path: '/financial-performance', icon: BarChart3 },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      path: '/notifications',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  // Filter nav items based on search and permissions
  const filteredItems = navItems.filter(item => {
    // Check permissions first
    if (item.permissions && !hasPermission(item.permissions)) {
      return false;
    }

    // Then apply search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (item.label.toLowerCase().includes(query)) return true;
    if (item.children) {
      return item.children.some(child =>
        child.label.toLowerCase().includes(query)
      );
    }
    return false;
  });

  // Toggle group expansion
  const toggleGroup = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  // Animation variants
  const sidebarVariants = {
    open: {
      width: 280,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    closed: {
      width: 80,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  // Badge colors
  const badgeColors = {
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <motion.aside
      className={`
        fixed top-0 left-0 h-screen z-50
        bg-gray-950/95 backdrop-blur-2xl
        border-r border-white/[0.06]
        flex flex-col
        shadow-[4px_0_24px_rgba(0,0,0,0.3)]
      `}
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      initial="open"
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">NAVA</h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Operations</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className={`
              w-9 h-9 rounded-lg
              bg-white/[0.05] hover:bg-white/[0.1]
              border border-white/[0.08]
              flex items-center justify-center
              text-gray-400 hover:text-white
              transition-all duration-200
              ${!isOpen ? 'mx-auto' : ''}
            `}
            onClick={onToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2.5
                  bg-white/[0.03] rounded-xl
                  border border-white/[0.08]
                  text-sm text-white placeholder:text-gray-500
                  focus:outline-none focus:border-cyan-500/50
                  focus:ring-2 focus:ring-cyan-500/20
                  transition-all duration-200
                "
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <ul className="space-y-1">
          {filteredItems.map((item, index) => (
            <li key={item.id}>
              {item.children ? (
                // Group with children
                <div>
                  <motion.button
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5
                      rounded-xl text-gray-400
                      hover:bg-white/[0.05] hover:text-white
                      transition-all duration-200
                      ${expandedGroup === item.id ? 'bg-white/[0.05] text-white' : ''}
                    `}
                    onClick={() => toggleGroup(item.id)}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          className="flex-1 text-left text-sm font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isOpen && (
                      <motion.div
                        animate={{ rotate: expandedGroup === item.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Children */}
                  <AnimatePresence>
                    {expandedGroup === item.id && isOpen && (
                      <motion.ul
                        className="mt-1 ml-4 pl-4 border-l border-white/[0.08] space-y-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2
                                rounded-lg text-sm
                                transition-all duration-200
                                ${isActive
                                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-l-2 border-cyan-400'
                                  : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
                                }
                              `}
                            >
                              <child.icon className="w-4 h-4" />
                              <span>{child.label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Single item
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5
                    rounded-xl
                    transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                      : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        className={`
                          w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                          ${isActive
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30'
                            : 'bg-white/[0.05]'
                          }
                        `}
                        whileHover={{ scale: 1.05 }}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                      </motion.div>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.span
                            className="flex-1 text-sm font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {item.badge && isOpen && (
                        <span className={`
                          px-2 py-0.5 rounded-full text-[10px] font-semibold
                          border ${badgeColors[item.badgeColor]}
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/[0.06] space-y-4">
        {/* Theme Toggle */}
        <motion.button
          className="
            w-full flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl
            bg-white/[0.03] hover:bg-white/[0.06]
            border border-white/[0.08]
            text-gray-400 hover:text-white
            transition-all duration-200
          "
          onClick={onThemeToggle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4" />
              {isOpen && <span className="text-sm">Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              {isOpen && <span className="text-sm">Dark Mode</span>}
            </>
          )}
        </motion.button>

        {/* User Profile */}
        {isOpen && (
          <motion.div
            className="
              flex items-center gap-3 p-3
              bg-white/[0.03] rounded-xl
              border border-white/[0.08]
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role || 'Administrator'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default ModernSidebar;
