// NAVA OPS - Menu Intelligence
// Strategic menu performance analysis & optimization recommendations

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import DateRangePicker from '@/components/UI/DateRangePicker';
import BCGMatrixChart from '@/components/MenuIntelligence/BCGMatrixChart';
import ProfitabilityAnalysisChart from '@/components/MenuIntelligence/ProfitabilityAnalysisChart';
import AIRecommendationsPanel from '@/components/MenuIntelligence/AIRecommendationsPanel';
import {
  Sidebar,
  TopNavbar,
  ModernCard,
  KPIWidget,
  SectionTitle,
  StatBadge,
  InfoBlock,
  NeoButton
} from '@/components/nava-ui';
import {
  UtensilsCrossed,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Lightbulb,
  Star,
  AlertTriangle,
  Package,
  BarChart3,
  CheckCircle
} from 'lucide-react';

export default function MenuIntelligence() {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState({
    items: [],
    totalRevenue: 0,
    totalOrders: 0,
    avgMargin: 0
  });

  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  });

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const days = Math.ceil((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24));

      const overview = await api.analytics.getDashboardOverview(null, days);

      // Generate menu items with performance metrics
      const menuItems = [
        {
          id: 1,
          name: 'Classic Burger',
          category: 'Burgers',
          orders: 1250,
          revenue: 31250,
          cost: 18750,
          margin: 0.40,
          popularity: 0.28,
          profitability: 0.40,
          trend: '+15%',
          classification: 'Star',
          image: '🍔'
        },
        {
          id: 2,
          name: 'Margherita Pizza',
          category: 'Pizza',
          orders: 900,
          revenue: 22500,
          cost: 15750,
          margin: 0.30,
          popularity: 0.20,
          profitability: 0.30,
          trend: '+8%',
          classification: 'Plow Horse',
          image: '🍕'
        },
        {
          id: 3,
          name: 'Caesar Salad',
          category: 'Salads',
          orders: 450,
          revenue: 13500,
          cost: 6750,
          margin: 0.50,
          popularity: 0.10,
          profitability: 0.50,
          trend: '-5%',
          classification: 'Puzzle',
          image: '🥗'
        },
        {
          id: 4,
          name: 'Fettuccine Alfredo',
          category: 'Pasta',
          orders: 320,
          revenue: 9600,
          cost: 6720,
          margin: 0.30,
          popularity: 0.07,
          profitability: 0.30,
          trend: '-12%',
          classification: 'Dog',
          image: '🍝'
        },
        {
          id: 5,
          name: 'BBQ Ribs',
          category: 'Grills',
          orders: 1100,
          revenue: 38500,
          cost: 19250,
          margin: 0.50,
          popularity: 0.25,
          profitability: 0.50,
          trend: '+22%',
          classification: 'Star',
          image: '🍖'
        },
        {
          id: 6,
          name: 'Fish & Chips',
          category: 'Seafood',
          orders: 850,
          revenue: 21250,
          cost: 14875,
          margin: 0.30,
          popularity: 0.19,
          profitability: 0.30,
          trend: '+5%',
          classification: 'Plow Horse',
          image: '🐟'
        },
        {
          id: 7,
          name: 'Lobster Thermidor',
          category: 'Seafood',
          orders: 180,
          revenue: 10800,
          cost: 5400,
          margin: 0.50,
          popularity: 0.04,
          profitability: 0.50,
          trend: '-3%',
          classification: 'Puzzle',
          image: '🦞'
        },
        {
          id: 8,
          name: 'Chicken Wings',
          category: 'Appetizers',
          orders: 1350,
          revenue: 20250,
          cost: 12150,
          margin: 0.40,
          popularity: 0.30,
          profitability: 0.40,
          trend: '+18%',
          classification: 'Star',
          image: '🍗'
        }
      ];

      setMenuData({
        items: menuItems,
        totalRevenue: menuItems.reduce((sum, item) => sum + item.revenue, 0),
        totalOrders: menuItems.reduce((sum, item) => sum + item.orders, 0),
        avgMargin: menuItems.reduce((sum, item) => sum + item.margin, 0) / menuItems.length
      });

    } catch (error) {
      console.error('Error fetching menu data:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to load menu intelligence data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, [dateRange]);

  // Classify items into BCG matrix categories
  const getClassification = (item) => {
    const avgPopularity = 0.20;
    const avgProfitability = 0.40;

    if (item.popularity > avgPopularity && item.profitability > avgProfitability) {
      return { type: 'Star', color: 'green', icon: Star, recommendation: 'Maintain quality and promote heavily' };
    } else if (item.popularity > avgPopularity && item.profitability <= avgProfitability) {
      return { type: 'Plow Horse', color: 'blue', icon: TrendingUp, recommendation: 'Increase prices or reduce costs' };
    } else if (item.popularity <= avgPopularity && item.profitability > avgProfitability) {
      return { type: 'Puzzle', color: 'yellow', icon: AlertTriangle, recommendation: 'Increase marketing and visibility' };
    } else {
      return { type: 'Dog', color: 'red', icon: TrendingDown, recommendation: 'Consider removing or replacing' };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0E1A]">
      {/* Sidebar */}
      <Sidebar defaultCollapsed={false} />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[280px] transition-all duration-300">
        {/* Top Navbar */}
        <TopNavbar
          user={{ name: 'Admin User', email: 'admin@navaops.com' }}
          notificationCount={3}
        />

        {/* Page Content */}
        <div className="p-6 space-y-6 mt-20">
          {/* Header */}
          <SectionTitle
            title="Menu Intelligence"
            subtitle="Strategic menu performance analysis & optimization recommendations"
            icon={UtensilsCrossed}
            accent="cyan"
          />

          {/* Date Range Picker */}
          <ModernCard variant="glass" className="p-4">
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={setDateRange}
            />
          </ModernCard>

          {/* Performance Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ModernCard variant="glass" glow glowColor="cyan">
              <KPIWidget
                title="Total Revenue"
                value={menuData.totalRevenue}
                prefix="SAR "
                icon={DollarSign}
                iconColor="text-green-400"
                animated
              />
            </ModernCard>
            <ModernCard variant="glass" glow glowColor="teal">
              <KPIWidget
                title="Total Orders"
                value={menuData.totalOrders}
                icon={Package}
                iconColor="text-blue-400"
                animated
              />
            </ModernCard>
            <ModernCard variant="glass" glow glowColor="purple">
              <KPIWidget
                title="Avg Profit Margin"
                value={(menuData.avgMargin * 100).toFixed(1)}
                suffix="%"
                icon={Target}
                iconColor="text-purple-400"
                animated
              />
            </ModernCard>
            <ModernCard variant="glass" glow glowColor="cyan">
              <KPIWidget
                title="Menu Items"
                value={menuData.items.length}
                icon={UtensilsCrossed}
                iconColor="text-orange-400"
                animated
              />
            </ModernCard>
          </div>

          {/* BCG Category Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stars */}
            <ModernCard variant="gradient" className="bg-gradient-to-br from-green-500/20 via-green-600/10 to-transparent border-green-500/30">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-green-300">Stars</span>
                  <Star className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {menuData.items.filter(item => getClassification(item).type === 'Star').length}
                </div>
                <div className="text-sm text-green-200">High profit & popularity</div>
              </div>
            </ModernCard>

            {/* Plow Horses */}
            <ModernCard variant="gradient" className="bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-300">Plow Horses</span>
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {menuData.items.filter(item => getClassification(item).type === 'Plow Horse').length}
                </div>
                <div className="text-sm text-blue-200">Popular but low margin</div>
              </div>
            </ModernCard>

            {/* Puzzles */}
            <ModernCard variant="gradient" className="bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-transparent border-yellow-500/30">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-yellow-300">Puzzles</span>
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {menuData.items.filter(item => getClassification(item).type === 'Puzzle').length}
                </div>
                <div className="text-sm text-yellow-200">High profit, low popularity</div>
              </div>
            </ModernCard>

            {/* Dogs */}
            <ModernCard variant="gradient" className="bg-gradient-to-br from-red-500/20 via-red-600/10 to-transparent border-red-500/30">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-red-300">Dogs</span>
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {menuData.items.filter(item => getClassification(item).type === 'Dog').length}
                </div>
                <div className="text-sm text-red-200">Low profit & popularity</div>
              </div>
            </ModernCard>
          </div>

          {/* AI Recommendations Panel */}
          <AIRecommendationsPanel menuItems={menuData.items} />

          {/* BCG Matrix Visualization */}
          <BCGMatrixChart menuItems={menuData.items} />

          {/* Profitability Analysis Chart */}
          <ProfitabilityAnalysisChart menuItems={menuData.items} />

          {/* Menu Performance Matrix Table */}
          <ModernCard variant="glass">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Menu Performance Matrix
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Margin
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Trend
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Classification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-500/20 border-t-cyan-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : menuData.items.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                        No menu items found
                      </td>
                    </tr>
                  ) : (
                    menuData.items.map((item) => {
                      const classification = getClassification(item);
                      const ClassIcon = classification.icon;

                      return (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.image}</span>
                              <span className="font-medium text-white">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-white">
                            {item.orders.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-white">
                            SAR {item.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-white">
                            {(item.margin * 100).toFixed(0)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <span className={`font-medium ${item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                              {item.trend}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatBadge
                              label={classification.type}
                              variant={
                                classification.color === 'green' ? 'success' :
                                classification.color === 'blue' ? 'info' :
                                classification.color === 'yellow' ? 'warning' :
                                'danger'
                              }
                              glow
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {classification.recommendation}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </ModernCard>

          {/* Menu Engineering Matrix Legend */}
          <ModernCard variant="glass">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Menu Engineering Matrix Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoBlock
                  variant="success"
                  title="Stars"
                  message="High profitability and high popularity. These are your best performers - promote them heavily and maintain consistent quality."
                />
                <InfoBlock
                  variant="info"
                  title="Plow Horses"
                  message="High popularity but low profitability. Consider increasing prices slightly or reducing portion costs to improve margins."
                />
                <InfoBlock
                  variant="warning"
                  title="Puzzles"
                  message="High profitability but low popularity. Increase marketing efforts, improve placement on menu, or bundle with popular items."
                />
                <InfoBlock
                  variant="danger"
                  title="Dogs"
                  message="Low profitability and low popularity. Consider removing from menu or completely redesigning the dish."
                />
              </div>
            </div>
          </ModernCard>

          {/* Strategic Recommendations */}
          <ModernCard variant="glass">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Strategic Recommendations
              </h3>
              <div className="space-y-4">
                <ModernCard variant="glass" className="bg-green-500/10 border-green-500/30">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⭐</span>
                      <div className="flex-1">
                        <div className="font-semibold text-green-400 mb-2">Stars - Promote Heavily</div>
                        <div className="text-sm text-gray-300">
                          High popularity & profitability. Feature prominently on menu, marketing materials, and digital channels. These are your winning items.
                        </div>
                      </div>
                    </div>
                  </div>
                </ModernCard>

                <ModernCard variant="glass" className="bg-blue-500/10 border-blue-500/30">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🧩</span>
                      <div className="flex-1">
                        <div className="font-semibold text-blue-400 mb-2">Puzzles - Increase Visibility</div>
                        <div className="text-sm text-gray-300">
                          High profit but low popularity. Boost marketing, improve positioning on menu, train staff to recommend these items, or consider price adjustments.
                        </div>
                      </div>
                    </div>
                  </div>
                </ModernCard>

                <ModernCard variant="glass" className="bg-yellow-500/10 border-yellow-500/30">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🐴</span>
                      <div className="flex-1">
                        <div className="font-semibold text-yellow-400 mb-2">Plow Horses - Optimize Costs</div>
                        <div className="text-sm text-gray-300">
                          Popular but lower profit. Focus on cost reduction through better sourcing, portion control, or consider modest price increases without affecting volume.
                        </div>
                      </div>
                    </div>
                  </div>
                </ModernCard>

                <ModernCard variant="glass" className="bg-red-500/10 border-red-500/30">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🐕</span>
                      <div className="flex-1">
                        <div className="font-semibold text-red-400 mb-2">Dogs - Consider Removal</div>
                        <div className="text-sm text-gray-300">
                          Low popularity & profit. Evaluate if these items serve a strategic purpose. If not, consider removing them to simplify operations and reduce inventory costs.
                        </div>
                      </div>
                    </div>
                  </div>
                </ModernCard>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}
