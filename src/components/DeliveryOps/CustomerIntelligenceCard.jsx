import React from 'react';
import { User, TrendingUp, TrendingDown, AlertTriangle, Star, Shield } from 'lucide-react';
import { FraudScoreBadge, FraudScoreBar } from './FraudScoreGauge';

/**
 * Customer Intelligence Card
 * Displays comprehensive customer profile and behavior analysis
 */
const CustomerIntelligenceCard = ({ customer, onClick }) => {
  const getCustomerTypeConfig = (type) => {
    const configs = {
      fraud_suspect: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        label: '🚨 Fraud Suspect'
      },
      repeat_offender: {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        label: '⚠️ Repeat Offender'
      },
      high_value: {
        icon: Star,
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        label: '⭐ High Value'
      },
      sensitive: {
        icon: Shield,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        label: '🔔 Sensitive'
      },
      angry: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        label: '😤 Frustrated'
      },
      normal: {
        icon: User,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        label: '👤 Normal'
      }
    };

    return configs[type] || configs.normal;
  };

  const config = getCustomerTypeConfig(customer.customer_type);
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${config.bgColor} rounded-lg`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {customer.customer_name || customer.customer_id}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {customer.platform_name} • ID: {customer.customer_id}
            </p>
          </div>
        </div>
        <FraudScoreBadge score={customer.fraud_score} />
      </div>

      {/* Customer Type Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
          {config.label}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {customer.total_orders}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Orders</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">
            {customer.total_refund_requests}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Refunds</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${
            customer.refund_rate > 30 ? 'text-red-600' :
            customer.refund_rate > 15 ? 'text-orange-600' :
            'text-green-600'
          }`}>
            {customer.refund_rate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Rate</div>
        </div>
      </div>

      {/* Fraud Score Bar */}
      <FraudScoreBar score={customer.fraud_score} showLabel={false} />

      {/* Financial Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Lifetime Value:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {customer.lifetime_value_score?.toFixed(2)} SAR
          </span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-600 dark:text-gray-400">Trust Score:</span>
          <span className={`font-semibold ${
            customer.trust_score >= 80 ? 'text-green-600' :
            customer.trust_score >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {customer.trust_score}/100
          </span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Recommended Action:
        </div>
        <div className={`text-xs font-medium ${
          customer.recommended_action === 'reject' ? 'text-red-600' :
          customer.recommended_action === 'investigate' ? 'text-orange-600' :
          'text-green-600'
        }`}>
          {customer.recommended_action === 'reject' ? '❌ Reject Claims' :
           customer.recommended_action === 'investigate' ? '🔍 Investigate' :
           '✅ Standard Review'}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Objection Level: <span className="font-medium">{customer.recommended_objection_level}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Customer List View - Compact table version
 */
export const CustomerListItem = ({ customer, onClick }) => {
  const getTypeColor = (type) => {
    const colors = {
      fraud_suspect: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      repeat_offender: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
      high_value: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      sensitive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
      normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
    };
    return colors[type] || colors.normal;
  };

  return (
    <tr
      onClick={onClick}
      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-200 dark:border-gray-700"
    >
      <td className="px-4 py-3">
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {customer.customer_name}
          </div>
          <div className="text-xs text-gray-500">
            {customer.customer_id}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(customer.customer_type)}`}>
          {customer.customer_type.replace('_', ' ')}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="font-medium">{customer.total_orders}</div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="font-medium text-orange-600">{customer.total_refund_requests}</div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className={`font-medium ${
          customer.refund_rate > 30 ? 'text-red-600' :
          customer.refund_rate > 15 ? 'text-orange-600' :
          'text-green-600'
        }`}>
          {customer.refund_rate.toFixed(1)}%
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <FraudScoreBadge score={customer.fraud_score} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-medium text-gray-900 dark:text-white">
          {customer.lifetime_value_score?.toFixed(0)} SAR
        </div>
      </td>
    </tr>
  );
};

export default CustomerIntelligenceCard;
