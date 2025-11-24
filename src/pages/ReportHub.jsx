// NAVA OPS - Report Hub (Ultra Modern UI)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/services/api';
import ModernPageWrapper, {
  ModernPageHeader,
  ModernSection,
  ModernButton,
  ModernBadge
} from '@/components/UltraModern/ModernPageWrapper';
import GlassCard from '@/components/UltraModern/GlassCard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
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
  ArrowRight
} from 'lucide-react';

export default function ReportHub() {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

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

  const stats = [
    {
      label: 'Total Reports',
      value: '24',
      icon: FileText,
      change: 12
    },
    {
      label: 'Generated Today',
      value: '8',
      icon: Activity
    },
    {
      label: 'Scheduled',
      value: '5',
      icon: Calendar
    }
  ];

  return (
    <ModernPageWrapper>
      <ModernPageHeader
        title="Report Hub"
        subtitle="Generate and download comprehensive business reports"
        icon={BarChart3}
        stats={stats}
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-500/50"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            <ModernButton variant="primary" icon={Download}>
              Export All
            </ModernButton>
          </div>
        }
      />

      <div className="space-y-6">
        {reportCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <ModernSection
              title={category.title}
              subtitle={category.description}
              icon={category.icon}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.reports.map((report, reportIndex) => (
                  <motion.div
                    key={reportIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.1) + (reportIndex * 0.05) }}
                  >
                    <GlassCard hover className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <ModernBadge variant="primary" size="sm">
                          {report.period}
                        </ModernBadge>
                      </div>

                      <h3 className="text-base font-semibold text-white mb-2">
                        {report.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Last generated: 2 hours ago
                      </p>

                      <div className="flex gap-2">
                        <ModernButton
                          variant="primary"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleGenerateReport(report)}
                          className="flex-1"
                        >
                          View
                        </ModernButton>
                        <ModernButton
                          variant="secondary"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDownloadReport(report)}
                        >
                          Download
                        </ModernButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </ModernSection>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <ModernSection title="Quick Actions" icon={Activity}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 rounded-xl border border-cyan-500/30 transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-base font-semibold text-white mb-2">Schedule Report</h3>
            <p className="text-sm text-gray-400 mb-4">
              Set up automatic report generation
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
              <span>Configure</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          <motion.button
            className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl border border-purple-500/30 transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-base font-semibold text-white mb-2">Custom Report</h3>
            <p className="text-sm text-gray-400 mb-4">
              Create a custom report template
            </p>
            <div className="flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-3 transition-all">
              <span>Create</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          <motion.button
            className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 rounded-xl border border-emerald-500/30 transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-base font-semibold text-white mb-2">Report History</h3>
            <p className="text-sm text-gray-400 mb-4">
              View all generated reports
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium group-hover:gap-3 transition-all">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </ModernSection>
    </ModernPageWrapper>
  );
}
