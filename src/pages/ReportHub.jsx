// NAVA OPS - Report Hub (REBUILT with NAVA UI)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotification } from '@/contexts/NotificationContext';
import {
  ModernCard,
  NeoButton,
  SectionTitle,
  StatBadge,
  KPIWidget,
} from '@/components/nava-ui';
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  Eye,
  ArrowRight,
} from 'lucide-react';

export default function ReportHub() {
  const { addNotification } = useNotification();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Report categories data (unchanged)
  const reportCategories = [
    {
      id: 'financial',
      title: 'Financial Reports',
      description: 'Revenue, expenses, and profit analysis',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      reports: [
        { name: 'Revenue Analysis', type: 'financial', period: 'monthly' },
        { name: 'Expense Report', type: 'financial', period: 'monthly' },
        { name: 'Profit & Loss', type: 'financial', period: 'quarterly' }
      ]
    },
    {
      id: 'sales',
      title: 'Sales Reports',
      description: 'Orders, transactions, and sales trends',
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
      reports: [
        { name: 'Daily Sales', type: 'sales', period: 'daily' },
        { name: 'Product Performance', type: 'sales', period: 'monthly' },
        { name: 'Sales by Branch', type: 'sales', period: 'monthly' }
      ]
    },
    {
      id: 'performance',
      title: 'Performance Reports',
      description: 'KPIs, metrics, and analytics',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      reports: [
        { name: 'Branch Performance', type: 'performance', period: 'monthly' },
        { name: 'Employee Performance', type: 'performance', period: 'monthly' },
        { name: 'Customer Satisfaction', type: 'performance', period: 'quarterly' }
      ]
    },
    {
      id: 'operations',
      title: 'Operations Reports',
      description: 'Inventory, logistics, and efficiency',
      icon: Activity,
      color: 'from-orange-500 to-red-600',
      reports: [
        { name: 'Inventory Status', type: 'operations', period: 'weekly' },
        { name: 'Order Fulfillment', type: 'operations', period: 'daily' },
        { name: 'Operational Efficiency', type: 'operations', period: 'monthly' }
      ]
    }
  ];

  // Event handlers (unchanged)
  const handleGenerateReport = (report) => {
    addNotification({
      title: 'Generating Report',
      message: `${report.name} is being generated...`,
      type: 'info'
    });
  };

  const handleDownloadReport = (report) => {
    addNotification({
      title: 'Downloading Report',
      message: `${report.name} is being downloaded...`,
      type: 'success'
    });
  };

  const user = {
    name: 'Ahmed',
    email: 'ahmed@nava.com',
    role: 'Administrator',
  };

  const stats = [
    { label: 'Total Reports', value: 24, icon: FileText },
    { label: 'Generated Today', value: 8, icon: Activity },
    { label: 'Scheduled', value: 5, icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E14]">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 bg-gradient-mesh-cyber opacity-50 pointer-events-none -z-10" />

      {/* Main Content */}
      <main className="space-y-8">
        {/* Page Header */}
        <SectionTitle
          title="Report Hub"
          subtitle="Generate and download comprehensive business reports"
          icon={BarChart3}
          accent="primary"
          action={
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
              <NeoButton variant="primary" size="md" icon={Download} iconPosition="left">
                Export All
              </NeoButton>
            </div>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <KPIWidget
              key={stat.label}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor="text-cyan-400"
              variant="glass"
            />
          ))}
        </div>

        {/* Report Categories */}
        <div className="space-y-8">
          {reportCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              {/* Category Section */}
              <SectionTitle
                title={category.title}
                subtitle={category.description}
                icon={category.icon}
                size="md"
                accent="primary"
              />

              {/* Report Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {category.reports.map((report, reportIndex) => (
                  <motion.div
                    key={reportIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.1) + (reportIndex * 0.05) }}
                  >
                    <ModernCard variant="glass" hoverable className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <StatBadge
                          value={report.period}
                          variant="primary"
                          size="sm"
                        />
                      </div>

                      <h3 className="text-base font-semibold text-white mb-2">
                        {report.name}
                      </h3>
                      <p className="text-sm text-white/50 mb-4">
                        Last generated: 2 hours ago
                      </p>

                      <div className="flex gap-2">
                        <NeoButton
                          variant="primary"
                          size="sm"
                          icon={Eye}
                          iconPosition="left"
                          onClick={() => handleGenerateReport(report)}
                          className="flex-1"
                        >
                          View
                        </NeoButton>
                        <NeoButton
                          variant="ghost"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDownloadReport(report)}
                        />
                      </div>
                    </ModernCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-12">
          <SectionTitle
            title="Quick Actions"
            subtitle="Shortcuts for common tasks"
            icon={Activity}
            size="md"
            accent="secondary"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Schedule Report */}
            <motion.button
              className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 rounded-2xl border border-cyan-500/30 transition-all group text-left"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-base font-semibold text-white mb-2">Schedule Report</h3>
              <p className="text-sm text-white/60 mb-4">
                Set up automatic report generation
              </p>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
                <span>Configure</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

            {/* Custom Report */}
            <motion.button
              className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-2xl border border-purple-500/30 transition-all group text-left"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-base font-semibold text-white mb-2">Custom Report</h3>
              <p className="text-sm text-white/60 mb-4">
                Create a custom report template
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-3 transition-all">
                <span>Create</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

            {/* Report History */}
            <motion.button
              className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 rounded-2xl border border-emerald-500/30 transition-all group text-left"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-base font-semibold text-white mb-2">Report History</h3>
              <p className="text-sm text-white/60 mb-4">
                View all generated reports
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium group-hover:gap-3 transition-all">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
