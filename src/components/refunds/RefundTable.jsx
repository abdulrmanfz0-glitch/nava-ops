import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign
} from 'lucide-react';
import ModernCard from '../nava-ui/ModernCard';
import NeoButton from '../nava-ui/NeoButton';

/**
 * RefundTable - Display refunds in a filterable table
 */
const RefundTable = ({ refunds = [], onRefundClick, onFilterChange, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', icon: Clock, label: 'قيد المراجعة' },
      approved: { bg: 'bg-green-500/20', text: 'text-green-300', icon: CheckCircle, label: 'مقبول' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-300', icon: XCircle, label: 'مرفوض' },
      disputed: { bg: 'bg-purple-500/20', text: 'text-purple-300', icon: AlertCircle, label: 'معترض' },
      resolved: { bg: 'bg-blue-500/20', text: 'text-blue-300', icon: CheckCircle, label: 'محلول' },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${badge.bg} ${badge.text} text-sm font-medium`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  // Platform badge
  const getPlatformBadge = (platform) => {
    const colors = {
      jahez: 'from-orange-500 to-red-500',
      hungerstation: 'from-purple-500 to-pink-500',
      marsool: 'from-blue-500 to-cyan-500',
      talabat: 'from-red-500 to-orange-500',
      careem: 'from-green-500 to-teal-500',
    };

    const gradient = colors[platform?.toLowerCase()] || 'from-gray-500 to-gray-600';

    return (
      <span className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${gradient} text-white text-sm font-medium`}>
        {platform || 'Unknown'}
      </span>
    );
  };

  // Filter refunds
  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = refund.platform_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || refund.platform_name?.toLowerCase() === platformFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // Sort refunds
  const sortedRefunds = [...filteredRefunds].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.refund_request_time || b.created_at) - new Date(a.refund_request_time || a.created_at);
      case 'amount':
        return (b.refund_amount || 0) - (a.refund_amount || 0);
      case 'platform':
        return (a.platform_name || '').localeCompare(b.platform_name || '');
      default:
        return 0;
    }
  });

  // Get unique platforms
  const platforms = [...new Set(refunds.map(r => r.platform_name).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="بحث برقم الطلب أو اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
        >
          <option value="all">جميع الحالات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="disputed">معترض</option>
          <option value="approved">مقبول</option>
          <option value="rejected">مرفوض</option>
          <option value="resolved">محلول</option>
        </select>

        {/* Platform Filter */}
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
        >
          <option value="all">جميع المنصات</option>
          {platforms.map(platform => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
        >
          <option value="date">الأحدث</option>
          <option value="amount">المبلغ</option>
          <option value="platform">المنصة</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModernCard variant="glass" className="p-4">
          <div className="text-white/60 text-sm mb-1">إجمالي الريفندات</div>
          <div className="text-2xl font-bold text-white">{sortedRefunds.length}</div>
        </ModernCard>
        <ModernCard variant="glass" className="p-4">
          <div className="text-white/60 text-sm mb-1">إجمالي المبلغ</div>
          <div className="text-2xl font-bold text-white flex items-center gap-1">
            <DollarSign className="w-5 h-5" />
            {sortedRefunds.reduce((sum, r) => sum + (r.refund_amount || 0), 0).toFixed(2)}
          </div>
        </ModernCard>
        <ModernCard variant="glass" className="p-4">
          <div className="text-white/60 text-sm mb-1">قيد المراجعة</div>
          <div className="text-2xl font-bold text-yellow-400">
            {sortedRefunds.filter(r => r.status === 'pending').length}
          </div>
        </ModernCard>
        <ModernCard variant="glass" className="p-4">
          <div className="text-white/60 text-sm mb-1">معترض</div>
          <div className="text-2xl font-bold text-purple-400">
            {sortedRefunds.filter(r => r.status === 'disputed').length}
          </div>
        </ModernCard>
      </div>

      {/* Table */}
      <ModernCard variant="glass" className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
          </div>
        ) : sortedRefunds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-16 h-16 text-white/20 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد ريفندات</h3>
            <p className="text-white/60">لم يتم العثور على أي ريفندات تطابق الفلاتر المحددة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/80">رقم الطلب</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/80">المنصة</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/80">المبلغ</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/80">السبب</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/80">التاريخ</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/80">الحالة</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/80">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {sortedRefunds.map((refund, index) => (
                  <motion.tr
                    key={refund.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => onRefundClick && onRefundClick(refund)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-cyan-400">{refund.platform_order_id}</div>
                      {refund.customer_name && (
                        <div className="text-sm text-white/60 mt-1">{refund.customer_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getPlatformBadge(refund.platform_name)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white font-semibold">
                        <DollarSign className="w-4 h-4" />
                        {refund.refund_amount?.toFixed(2) || '0.00'}
                        <span className="text-white/60 text-sm ml-1">{refund.currency || 'SAR'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/80 text-sm">{refund.refund_reason || refund.reason_code || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/80 text-sm">
                        {new Date(refund.refund_request_time || refund.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(refund.status)}
                    </td>
                    <td className="px-6 py-4">
                      <NeoButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRefundClick && onRefundClick(refund);
                        }}
                      >
                        عرض التفاصيل
                      </NeoButton>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ModernCard>
    </div>
  );
};

export default RefundTable;
