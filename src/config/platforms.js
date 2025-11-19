// src/config/platforms.js - Delivery Platform Configuration
/**
 * Comprehensive configuration for all supported delivery platforms
 * Extracted from Restalyze v11.0.0 Platinum Edition
 *
 * Each platform includes:
 * - Unique ID
 * - Display name
 * - Commission rate (as decimal)
 * - Brand color
 * - Icon/logo path
 */

export const SUPPORTED_PLATFORMS = [
  {
    id: 'hungerstation',
    name: 'HungerStation',
    nameAr: 'هنقرستيشن',
    commission: 0.22, // 22%
    color: '#FF6B35',
    icon: '/platforms/hungerstation.svg',
    enabled: true,
    features: {
      realTimeTracking: true,
      analytics: true,
      menuManagement: true
    }
  },
  {
    id: 'jahez',
    name: 'Jahez',
    nameAr: 'جاهز',
    commission: 0.20, // 20%
    color: '#00A859',
    icon: '/platforms/jahez.svg',
    enabled: true,
    features: {
      realTimeTracking: true,
      analytics: true,
      menuManagement: true
    }
  },
  {
    id: 'talabat',
    name: 'Talabat',
    nameAr: 'طلبات',
    commission: 0.18, // 18%
    color: '#FF2E00',
    icon: '/platforms/talabat.svg',
    enabled: true,
    features: {
      realTimeTracking: true,
      analytics: true,
      menuManagement: true
    }
  },
  {
    id: 'mrsool',
    name: 'Mrsool',
    nameAr: 'مرسول',
    commission: 0.25, // 25%
    color: '#00B2A9',
    icon: '/platforms/mrsool.svg',
    enabled: true,
    features: {
      realTimeTracking: true,
      analytics: false,
      menuManagement: false
    }
  },
  {
    id: 'careem',
    name: 'Careem',
    nameAr: 'كريم',
    commission: 0.23, // 23%
    color: '#00AEEF',
    icon: '/platforms/careem.svg',
    enabled: true,
    features: {
      realTimeTracking: true,
      analytics: true,
      menuManagement: true
    }
  },
  {
    id: 'toyou',
    name: 'ToYou',
    nameAr: 'تو يو',
    commission: 0.19, // 19%
    color: '#8B5CF6',
    icon: '/platforms/toyou.svg',
    enabled: true,
    features: {
      realTimeTracking: false,
      analytics: true,
      menuManagement: true
    }
  },
  {
    id: 'keta',
    name: 'KETA',
    nameAr: 'كيتا',
    commission: 0.21, // 21%
    color: '#F59E0B',
    icon: '/platforms/keta.svg',
    enabled: true,
    features: {
      realTimeTracking: true,
      analytics: true,
      menuManagement: false
    }
  }
];

/**
 * Get platform by ID
 * @param {string} platformId - Platform unique identifier
 * @returns {object|null} Platform configuration or null if not found
 */
export const getPlatformById = (platformId) => {
  return SUPPORTED_PLATFORMS.find(p => p.id === platformId) || null;
};

/**
 * Get all enabled platforms
 * @returns {Array} Array of enabled platforms
 */
export const getEnabledPlatforms = () => {
  return SUPPORTED_PLATFORMS.filter(p => p.enabled);
};

/**
 * Calculate commission for a platform
 * @param {string} platformId - Platform ID
 * @param {number} amount - Transaction amount
 * @returns {number} Commission amount
 */
export const calculatePlatformCommission = (platformId, amount) => {
  const platform = getPlatformById(platformId);
  if (!platform) return 0;
  return amount * platform.commission;
};

/**
 * Calculate net revenue after commission
 * @param {string} platformId - Platform ID
 * @param {number} grossAmount - Gross transaction amount
 * @param {number} expenses - Optional additional expenses
 * @returns {number} Net revenue
 */
export const calculateNetRevenue = (platformId, grossAmount, expenses = 0) => {
  const commission = calculatePlatformCommission(platformId, grossAmount);
  return grossAmount - commission - expenses;
};

/**
 * Get platform commission rate as percentage
 * @param {string} platformId - Platform ID
 * @returns {number} Commission rate as percentage (e.g., 22 for 22%)
 */
export const getPlatformCommissionPercent = (platformId) => {
  const platform = getPlatformById(platformId);
  if (!platform) return 0;
  return platform.commission * 100;
};

/**
 * Get platform color with opacity
 * @param {string} platformId - Platform ID
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} RGBA color string
 */
export const getPlatformColorWithOpacity = (platformId, opacity = 1) => {
  const platform = getPlatformById(platformId);
  if (!platform) return `rgba(0, 0, 0, ${opacity})`;

  // Convert hex to RGB
  const hex = platform.color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get platforms sorted by commission (ascending)
 * @returns {Array} Sorted platforms array
 */
export const getPlatformsByCommission = () => {
  return [...SUPPORTED_PLATFORMS].sort((a, b) => a.commission - b.commission);
};

/**
 * Platform statistics calculator
 * @param {Array} orders - Array of orders with platformId and amount
 * @returns {object} Platform-wise statistics
 */
export const calculatePlatformStatistics = (orders) => {
  const stats = {};

  SUPPORTED_PLATFORMS.forEach(platform => {
    const platformOrders = orders.filter(order => order.platformId === platform.id);
    const totalGMV = platformOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const totalCommission = calculatePlatformCommission(platform.id, totalGMV);
    const netRevenue = totalGMV - totalCommission;

    stats[platform.id] = {
      platformName: platform.name,
      platformNameAr: platform.nameAr,
      color: platform.color,
      orderCount: platformOrders.length,
      totalGMV,
      totalCommission,
      netRevenue,
      commissionRate: platform.commission,
      avgOrderValue: platformOrders.length > 0 ? totalGMV / platformOrders.length : 0,
      profitMargin: totalGMV > 0 ? (netRevenue / totalGMV) * 100 : 0
    };
  });

  return stats;
};

/**
 * Find best performing platform
 * @param {object} platformStats - Platform statistics object
 * @param {string} metric - Metric to compare ('netRevenue', 'orderCount', 'profitMargin')
 * @returns {object|null} Best performing platform
 */
export const getBestPerformingPlatform = (platformStats, metric = 'netRevenue') => {
  const platforms = Object.values(platformStats);
  if (platforms.length === 0) return null;

  return platforms.reduce((best, current) => {
    return current[metric] > best[metric] ? current : best;
  });
};

/**
 * Restaurant types configuration
 */
export const RESTAURANT_TYPES = [
  { value: 'burgers', label: 'Burgers', labelAr: 'برجر' },
  { value: 'pizza', label: 'Pizza', labelAr: 'بيتزا' },
  { value: 'shawarma', label: 'Shawarma', labelAr: 'شاورما' },
  { value: 'seafood', label: 'Seafood', labelAr: 'مأكولات بحرية' },
  { value: 'coffee', label: 'Coffee Shop', labelAr: 'مقهى' },
  { value: 'fine_dining', label: 'Fine Dining', labelAr: 'مطعم فاخر' },
  { value: 'fast_food', label: 'Fast Food', labelAr: 'وجبات سريعة' },
  { value: 'cafe', label: 'Cafe', labelAr: 'كافيه' },
  { value: 'bakery', label: 'Bakery', labelAr: 'مخبز' },
  { value: 'desserts', label: 'Desserts', labelAr: 'حلويات' },
  { value: 'healthy', label: 'Healthy Food', labelAr: 'طعام صحي' },
  { value: 'arabic', label: 'Arabic Cuisine', labelAr: 'مطبخ عربي' },
  { value: 'asian', label: 'Asian Cuisine', labelAr: 'مطبخ آسيوي' },
  { value: 'international', label: 'International', labelAr: 'عالمي' }
];

/**
 * Saudi cities configuration
 */
export const SAUDI_CITIES = [
  { value: 'riyadh', label: 'Riyadh', labelAr: 'الرياض', region: 'central' },
  { value: 'jeddah', label: 'Jeddah', labelAr: 'جدة', region: 'western' },
  { value: 'mecca', label: 'Mecca', labelAr: 'مكة', region: 'western' },
  { value: 'medina', label: 'Medina', labelAr: 'المدينة', region: 'western' },
  { value: 'dammam', label: 'Dammam', labelAr: 'الدمام', region: 'eastern' },
  { value: 'khobar', label: 'Khobar', labelAr: 'الخبر', region: 'eastern' },
  { value: 'dhahran', label: 'Dhahran', labelAr: 'الظهران', region: 'eastern' },
  { value: 'abha', label: 'Abha', labelAr: 'أبها', region: 'southern' },
  { value: 'tabuk', label: 'Tabuk', labelAr: 'تبوك', region: 'northern' },
  { value: 'buraidah', label: 'Buraidah', labelAr: 'بريدة', region: 'central' },
  { value: 'khamis_mushait', label: 'Khamis Mushait', labelAr: 'خميس مشيط', region: 'southern' },
  { value: 'hail', label: 'Hail', labelAr: 'حائل', region: 'northern' },
  { value: 'najran', label: 'Najran', labelAr: 'نجران', region: 'southern' },
  { value: 'jazan', label: 'Jazan', labelAr: 'جازان', region: 'southern' },
  { value: 'yanbu', label: 'Yanbu', labelAr: 'ينبع', region: 'western' },
  { value: 'taif', label: 'Taif', labelAr: 'الطائف', region: 'western' }
];

export default {
  SUPPORTED_PLATFORMS,
  getPlatformById,
  getEnabledPlatforms,
  calculatePlatformCommission,
  calculateNetRevenue,
  getPlatformCommissionPercent,
  getPlatformColorWithOpacity,
  getPlatformsByCommission,
  calculatePlatformStatistics,
  getBestPerformingPlatform,
  RESTAURANT_TYPES,
  SAUDI_CITIES
};
