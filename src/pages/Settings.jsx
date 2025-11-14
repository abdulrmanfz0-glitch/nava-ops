// src/pages/Settings.jsx
import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
          </div>
          <p className="text-gray-400 text-sm">Update your personal information and preferences</p>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <p className="text-gray-400 text-sm">Manage notification preferences and alerts</p>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
          <p className="text-gray-400 text-sm">Update security settings and password</p>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Data Management</h3>
          </div>
          <p className="text-gray-400 text-sm">Export or delete your data</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
