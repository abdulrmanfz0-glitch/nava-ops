// src/pages/NotificationsCenter.jsx
import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationsCenter = () => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Revenue Milestone',
      message: 'You have reached SAR 250K in monthly revenue!',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Platform Commission Alert',
      message: 'Platform fees are 10% of revenue. Consider promoting direct channels.',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New Report Available',
      message: 'Monthly performance report is ready for review.',
      time: '1 day ago',
      read: true
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-gray-400">Stay updated with your latest alerts and updates</p>
      </div>

      <div className="space-y-3">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-4 ${
              !notification.read ? 'border-green-500 border-l-4' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{getIcon(notification.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-white">{notification.title}</h3>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </div>
                <p className="text-gray-400 text-sm">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsCenter;
