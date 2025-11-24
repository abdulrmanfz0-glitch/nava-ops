import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  ChefHat,
  TrendingUp,
  MessageSquare,
  Bell,
} from 'lucide-react';
import GlassCard from './GlassCard';

/**
 * ActivityFeed - Real-time activity feed with staggered animations
 * Features: Icon badges, timestamps, status indicators, hover effects
 */
const ActivityFeed = ({
  title = 'Recent Activity',
  activities = [],
  maxItems = 6,
  showViewAll = true,
  onViewAll,
  delay = 0,
  className = '',
}) => {
  // Activity type configurations
  const activityTypes = {
    order: {
      icon: ShoppingCart,
      color: 'from-emerald-500 to-teal-400',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
    user: {
      icon: Users,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    payment: {
      icon: CreditCard,
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
    },
    alert: {
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-400',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400',
    },
    success: {
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-400',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
    menu: {
      icon: ChefHat,
      color: 'from-orange-500 to-amber-400',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400',
    },
    analytics: {
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-400',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
    },
    message: {
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-400',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
    },
    notification: {
      icon: Bell,
      color: 'from-indigo-500 to-purple-400',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
    },
  };

  // Sample activities if none provided
  const defaultActivities = [
    {
      id: 1,
      type: 'order',
      title: 'New order received',
      description: 'Order #1234 - Grilled Salmon',
      timestamp: '2 min ago',
      amount: '$45.00',
    },
    {
      id: 2,
      type: 'user',
      title: 'New customer registered',
      description: 'John Smith joined NAVA',
      timestamp: '5 min ago',
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment processed',
      description: 'Invoice #789 paid',
      timestamp: '12 min ago',
      amount: '$234.50',
    },
    {
      id: 4,
      type: 'menu',
      title: 'Menu item updated',
      description: 'Truffle Pasta price changed',
      timestamp: '25 min ago',
    },
    {
      id: 5,
      type: 'analytics',
      title: 'Daily report ready',
      description: 'View your performance summary',
      timestamp: '1 hour ago',
    },
    {
      id: 6,
      type: 'alert',
      title: 'Low stock warning',
      description: 'Fresh Lobster running low',
      timestamp: '2 hours ago',
    },
  ];

  const displayActivities = activities.length ? activities : defaultActivities;
  const visibleActivities = displayActivities.slice(0, maxItems);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay + 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <GlassCard className={className} padding="none" delay={delay}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10 rounded-xl
            bg-gradient-to-br from-cyan-500 to-blue-600
            flex items-center justify-center
            shadow-lg shadow-cyan-500/20
          ">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-500">{visibleActivities.length} recent activities</p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-emerald-400">Live</span>
        </div>
      </div>

      {/* Activity List */}
      <motion.div
        className="divide-y divide-white/[0.04]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {visibleActivities.map((activity, index) => {
          const config = activityTypes[activity.type] || activityTypes.notification;
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              className="
                px-6 py-4
                hover:bg-white/[0.02]
                transition-colors duration-200
                cursor-pointer
                group
              "
              variants={itemVariants}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <motion.div
                  className={`
                    w-10 h-10 rounded-xl flex-shrink-0
                    bg-gradient-to-br ${config.color}
                    flex items-center justify-center
                    shadow-lg
                  `}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {activity.description}
                      </p>
                    </div>

                    {activity.amount && (
                      <span className="text-sm font-semibold text-white whitespace-nowrap">
                        {activity.amount}
                      </span>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                </div>

                {/* Arrow on hover */}
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                >
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Button */}
      {showViewAll && (
        <div className="px-6 py-4 border-t border-white/[0.06]">
          <motion.button
            className="
              w-full py-2.5 rounded-xl
              bg-white/[0.03] hover:bg-white/[0.06]
              border border-white/[0.08] hover:border-cyan-500/30
              text-sm font-medium text-gray-400 hover:text-cyan-400
              transition-all duration-200
              flex items-center justify-center gap-2
            "
            onClick={onViewAll}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            View All Activities
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </GlassCard>
  );
};

export default ActivityFeed;
