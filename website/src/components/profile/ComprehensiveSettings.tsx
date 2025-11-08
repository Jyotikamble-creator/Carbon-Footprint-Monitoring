'use client';

import { useState } from 'react';
import { Lock, Bell, User, Shield, Save, Eye, EyeOff } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingsSection({ title, description, icon, children }: SettingsSectionProps) {
  return (
    <div className="bg-[#1a3333] rounded-2xl border border-[#2a4444] p-8 mb-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ComprehensiveSettings() {
  const [activeTab, setActiveTab] = useState<'password' | 'notifications' | 'account'>('password');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyReports: true,
    systemUpdates: true,
    dataProcessing: false,
    securityAlerts: true
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark'
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      // TODO: Implement actual password change API call
      console.log('Changing password...', passwordData);
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError('Failed to change password. Please try again.');
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleAccountSettingChange = (field: string, value: string) => {
    setAccountSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveNotifications = async () => {
    try {
      // TODO: Implement actual notifications save API call
      console.log('Saving notifications...', notifications);
      alert('Notification settings saved successfully!');
    } catch (error) {
      alert('Failed to save notification settings.');
    }
  };

  const saveAccountSettings = async () => {
    try {
      // TODO: Implement actual account settings save API call
      console.log('Saving account settings...', accountSettings);
      alert('Account settings saved successfully!');
    } catch (error) {
      alert('Failed to save account settings.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Manage your account preferences and security settings.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-[#1a3333] p-1 rounded-xl border border-[#2a4444]">
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'password'
              ? 'bg-[#2dd4bf] text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4 inline mr-2" />
          Password
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'bg-[#2dd4bf] text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'account'
              ? 'bg-[#2dd4bf] text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Account
        </button>
      </div>

      {/* Password Change Tab */}
      {activeTab === 'password' && (
        <SettingsSection
          title="Change Password"
          description="Update your password to keep your account secure."
          icon={<Lock className="w-6 h-6 text-[#2dd4bf]" />}
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {passwordError && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                <p className="text-red-400 text-sm">{passwordError}</p>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
                <p className="text-green-400 text-sm">{passwordSuccess}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d1f1f] border border-[#2a4444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d1f1f] border border-[#2a4444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d1f1f] border border-[#2a4444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                Change Password
              </button>
            </div>
          </form>
        </SettingsSection>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <SettingsSection
          title="Notification Preferences"
          description="Choose how you want to be notified about important updates and activities."
          icon={<Bell className="w-6 h-6 text-[#2dd4bf]" />}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#0d1f1f] rounded-lg border border-[#2a4444]">
              <div>
                <h4 className="text-white font-medium">Email Alerts</h4>
                <p className="text-gray-400 text-sm">Receive email notifications for important activities</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2dd4bf]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0d1f1f] rounded-lg border border-[#2a4444]">
              <div>
                <h4 className="text-white font-medium">Push Notifications</h4>
                <p className="text-gray-400 text-sm">Receive push notifications in your browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2dd4bf]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0d1f1f] rounded-lg border border-[#2a4444]">
              <div>
                <h4 className="text-white font-medium">Weekly Reports</h4>
                <p className="text-gray-400 text-sm">Receive weekly carbon footprint summary reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.weeklyReports}
                  onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2dd4bf]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0d1f1f] rounded-lg border border-[#2a4444]">
              <div>
                <h4 className="text-white font-medium">System Updates</h4>
                <p className="text-gray-400 text-sm">Get notified about system maintenance and updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.systemUpdates}
                  onChange={(e) => handleNotificationChange('systemUpdates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2dd4bf]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0d1f1f] rounded-lg border border-[#2a4444]">
              <div>
                <h4 className="text-white font-medium">Data Processing Alerts</h4>
                <p className="text-gray-400 text-sm">Notifications when data processing is complete</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.dataProcessing}
                  onChange={(e) => handleNotificationChange('dataProcessing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2dd4bf]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0d1f1f] rounded-lg border border-[#2a4444]">
              <div>
                <h4 className="text-white font-medium">Security Alerts</h4>
                <p className="text-gray-400 text-sm">Important security notifications and login alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.securityAlerts}
                  onChange={(e) => handleNotificationChange('securityAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2dd4bf]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2dd4bf]"></div>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveNotifications}
                className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Preferences
              </button>
            </div>
          </div>
        </SettingsSection>
      )}

      {/* Account Settings Tab */}
      {activeTab === 'account' && (
        <SettingsSection
          title="Account Preferences"
          description="Customize your account settings and preferences."
          icon={<User className="w-6 h-6 text-[#2dd4bf]" />}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={accountSettings.language}
                onChange={(e) => handleAccountSettingChange('language', e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1f1f] border border-[#2a4444] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={accountSettings.timezone}
                onChange={(e) => handleAccountSettingChange('timezone', e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1f1f] border border-[#2a4444] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date Format
              </label>
              <select
                value={accountSettings.dateFormat}
                onChange={(e) => handleAccountSettingChange('dateFormat', e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1f1f] border border-[#2a4444] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={accountSettings.theme}
                onChange={(e) => handleAccountSettingChange('theme', e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1f1f] border border-[#2a4444] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveAccountSettings}
                className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Settings
              </button>
            </div>
          </div>
        </SettingsSection>
      )}
    </div>
  );
}