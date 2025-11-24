// NAVA OPS - Settings (Ultra Modern UI)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import ModernPageWrapper, {
  ModernPageHeader,
  ModernSection,
  ModernButton,
  ModernInput,
  ModernBadge
} from '@/components/UltraModern/ModernPageWrapper';
import GlassCard from '@/components/UltraModern/GlassCard';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Database,
  Moon,
  Sun,
  Mail,
  Lock,
  Check
} from 'lucide-react';

export default function Settings() {
  const { userProfile } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const handleSave = () => {
    addNotification({
      title: 'Success',
      message: 'Settings saved successfully',
      type: 'success'
    });
  };

  return (
    <ModernPageWrapper>
      <ModernPageHeader
        title="Settings"
        subtitle="Manage your account preferences and system configuration"
        icon={SettingsIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3
                      rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white border border-cyan-500/30'
                        : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                      }
                    `}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && <ProfileSettings onSave={handleSave} userProfile={userProfile} />}
          {activeTab === 'notifications' && <NotificationSettings onSave={handleSave} />}
          {activeTab === 'appearance' && <AppearanceSettings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onSave={handleSave} />}
          {activeTab === 'security' && <SecuritySettings onSave={handleSave} />}
          {activeTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </ModernPageWrapper>
  );
}

// Profile Settings Component
function ProfileSettings({ onSave, userProfile }) {
  const [formData, setFormData] = useState({
    fullName: userProfile?.full_name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    company: userProfile?.company || '',
    bio: ''
  });

  return (
    <ModernSection title="Profile Information" icon={User}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModernInput
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Enter your full name"
          />
          <ModernInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
            icon={Mail}
          />
          <ModernInput
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter your phone"
          />
          <ModernInput
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Enter company name"
          />
        </div>

        <div className="flex justify-end">
          <ModernButton variant="primary" onClick={onSave}>
            Save Changes
          </ModernButton>
        </div>
      </div>
    </ModernSection>
  );
}

// Notification Settings Component
function NotificationSettings({ onSave }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    orderAlerts: true,
    inventoryAlerts: true
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const notificationOptions = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
    { key: 'weeklyReport', label: 'Weekly Reports', description: 'Get weekly performance summaries' },
    { key: 'orderAlerts', label: 'Order Alerts', description: 'Get notified about new orders' },
    { key: 'inventoryAlerts', label: 'Inventory Alerts', description: 'Get notified about low stock' }
  ];

  return (
    <ModernSection title="Notification Preferences" icon={Bell}>
      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors"
          >
            <div>
              <h3 className="text-sm font-medium text-white mb-1">{option.label}</h3>
              <p className="text-xs text-gray-400">{option.description}</p>
            </div>
            <button
              onClick={() => toggleSetting(option.key)}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${settings[option.key] ? 'bg-cyan-500' : 'bg-gray-700'}
              `}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                animate={{ left: settings[option.key] ? 28 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <ModernButton variant="primary" onClick={onSave}>
            Save Preferences
          </ModernButton>
        </div>
      </div>
    </ModernSection>
  );
}

// Appearance Settings Component
function AppearanceSettings({ isDarkMode, setIsDarkMode, onSave }) {
  return (
    <ModernSection title="Appearance" icon={Palette}>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-white mb-4">Theme</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => setIsDarkMode(true)}
              className={`
                p-6 rounded-xl border-2 transition-all
                ${isDarkMode
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Moon className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-sm font-medium text-white">Dark Mode</p>
              {isDarkMode && (
                <div className="mt-2 flex items-center justify-center">
                  <ModernBadge variant="primary" size="sm">
                    <Check className="w-3 h-3" />
                    Active
                  </ModernBadge>
                </div>
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsDarkMode(false)}
              className={`
                p-6 rounded-xl border-2 transition-all
                ${!isDarkMode
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sun className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-sm font-medium text-white">Light Mode</p>
              {!isDarkMode && (
                <div className="mt-2 flex items-center justify-center">
                  <ModernBadge variant="primary" size="sm">
                    <Check className="w-3 h-3" />
                    Active
                  </ModernBadge>
                </div>
              )}
            </motion.button>
          </div>
        </div>

        <div className="flex justify-end">
          <ModernButton variant="primary" onClick={onSave}>
            Save Appearance
          </ModernButton>
        </div>
      </div>
    </ModernSection>
  );
}

// Security Settings Component
function SecuritySettings({ onSave }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  return (
    <ModernSection title="Security Settings" icon={Shield}>
      <div className="space-y-6">
        <div className="space-y-4">
          <ModernInput
            label="Current Password"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            placeholder="Enter current password"
            icon={Lock}
          />
          <ModernInput
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="Enter new password"
            icon={Lock}
          />
          <ModernInput
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
            icon={Lock}
          />
        </div>

        <div className="flex justify-end">
          <ModernButton variant="primary" onClick={onSave}>
            Update Password
          </ModernButton>
        </div>
      </div>
    </ModernSection>
  );
}

// Billing Settings Component
function BillingSettings() {
  return (
    <ModernSection title="Billing & Subscription" icon={CreditCard}>
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional Plan</h3>
              <p className="text-gray-400 text-sm mb-4">
                Access to all features and unlimited team members
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">$99</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>
            <ModernBadge variant="success">Active</ModernBadge>
          </div>
        </div>

        <div className="flex gap-4">
          <ModernButton variant="primary">Upgrade Plan</ModernButton>
          <ModernButton variant="secondary">Manage Subscription</ModernButton>
        </div>
      </div>
    </ModernSection>
  );
}
