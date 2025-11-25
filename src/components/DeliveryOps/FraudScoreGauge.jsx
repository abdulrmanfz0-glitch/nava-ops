import React from 'react';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';

/**
 * Fraud Score Gauge Component
 * Visualizes fraud score with color-coded gauge
 */
const FraudScoreGauge = ({ score, size = 'medium', showLabel = true }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine color and status based on score
  let color, bgColor, textColor, Icon, status, recommendation;

  if (normalizedScore >= 80) {
    color = '#dc2626'; // red-600
    bgColor = 'bg-red-100 dark:bg-red-900/30';
    textColor = 'text-red-600 dark:text-red-400';
    Icon = AlertTriangle;
    status = 'CRITICAL';
    recommendation = 'Reject & Investigate';
  } else if (normalizedScore >= 60) {
    color = '#ea580c'; // orange-600
    bgColor = 'bg-orange-100 dark:bg-orange-900/30';
    textColor = 'text-orange-600 dark:text-orange-400';
    Icon = AlertTriangle;
    status = 'HIGH RISK';
    recommendation = 'Dispute Recommended';
  } else if (normalizedScore >= 40) {
    color = '#ca8a04'; // yellow-600
    bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
    textColor = 'text-yellow-600 dark:text-yellow-400';
    Icon = Shield;
    status = 'MEDIUM';
    recommendation = 'Review Carefully';
  } else {
    color = '#16a34a'; // green-600
    bgColor = 'bg-green-100 dark:bg-green-900/30';
    textColor = 'text-green-600 dark:text-green-400';
    Icon = CheckCircle;
    status = 'LOW RISK';
    recommendation = 'Standard Review';
  }

  // Size configurations
  const sizes = {
    small: { gauge: 80, stroke: 8, fontSize: 'text-lg' },
    medium: { gauge: 120, stroke: 12, fontSize: 'text-2xl' },
    large: { gauge: 160, stroke: 16, fontSize: 'text-4xl' }
  };

  const config = sizes[size] || sizes.medium;
  const radius = (config.gauge - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Gauge */}
      <div className="relative" style={{ width: config.gauge, height: config.gauge }}>
        <svg width={config.gauge} height={config.gauge} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={config.gauge / 2}
            cy={config.gauge / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={config.gauge / 2}
            cy={config.gauge / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-6 h-6 mb-1" style={{ color }} />
          <span className={`font-bold ${config.fontSize}`} style={{ color }}>
            {Math.round(normalizedScore)}
          </span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>

      {/* Labels */}
      {showLabel && (
        <div className="text-center space-y-1">
          <div className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-bold`}>
            {status}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Mini Fraud Score Badge - Compact version
 */
export const FraudScoreBadge = ({ score }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));

  let className;
  if (normalizedScore >= 80) {
    className = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
  } else if (normalizedScore >= 60) {
    className = 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
  } else if (normalizedScore >= 40) {
    className = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
  } else {
    className = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <span className="mr-1">⚠️</span>
      {Math.round(normalizedScore)}
    </span>
  );
};

/**
 * Fraud Score Progress Bar - Linear version
 */
export const FraudScoreBar = ({ score, showLabel = true }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));

  let color, bgColor, status;
  if (normalizedScore >= 80) {
    color = 'bg-red-600';
    bgColor = 'bg-red-100 dark:bg-red-900/30';
    status = 'CRITICAL';
  } else if (normalizedScore >= 60) {
    color = 'bg-orange-600';
    bgColor = 'bg-orange-100 dark:bg-orange-900/30';
    status = 'HIGH';
  } else if (normalizedScore >= 40) {
    color = 'bg-yellow-600';
    bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
    status = 'MEDIUM';
  } else {
    color = 'bg-green-600';
    bgColor = 'bg-green-100 dark:bg-green-900/30';
    status = 'LOW';
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Fraud Risk: {status}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {Math.round(normalizedScore)}/100
          </span>
        </div>
      )}
      <div className={`w-full h-3 ${bgColor} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
};

export default FraudScoreGauge;
