"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after 5 seconds for non-error notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Listen for real-time updates and create notifications
  useEffect(() => {
    const handleRealtimeUpdate = (event: CustomEvent) => {
      const { type, data } = event.detail;

      switch (type) {
        case 'data_uploaded':
          addNotification({
            type: 'success',
            title: 'Data Upload Complete',
            message: `Successfully processed ${data.events_created} events and calculated ${data.emissions_created} emissions.`,
          });
          break;

        case 'emissions_calculated':
          addNotification({
            type: 'info',
            title: 'Emissions Calculated',
            message: `New emissions data has been calculated for ${data.facility_count} facilities.`,
          });
          break;

        case 'report_generated':
          addNotification({
            type: 'success',
            title: 'Report Generated',
            message: `Your ${data.format.toUpperCase()} report for ${data.date_range} is ready for download.`,
            action: {
              label: 'Download',
              onClick: () => {
                // Trigger download
                const link = document.createElement('a');
                link.href = data.download_url;
                link.download = data.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }
          });
          break;

        case 'system_maintenance':
          addNotification({
            type: 'warning',
            title: 'System Maintenance',
            message: 'Scheduled maintenance will begin in 30 minutes. Some features may be temporarily unavailable.',
          });
          break;

        case 'error':
          addNotification({
            type: 'error',
            title: 'System Error',
            message: data.message || 'An unexpected error occurred. Please try again.',
          });
          break;
      }
    };

    window.addEventListener('realtime-update', handleRealtimeUpdate as EventListener);

    return () => {
      window.removeEventListener('realtime-update', handleRealtimeUpdate as EventListener);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/50';
      case 'error':
        return 'border-red-500/50';
      case 'warning':
        return 'border-yellow-500/50';
      case 'info':
      default:
        return 'border-blue-500/50';
    }
  };

  return (
    <div
      className={`bg-gray-800/95 backdrop-blur-sm border-l-4 ${getBorderColor(notification.type)} rounded-r-lg p-4 shadow-lg max-w-md animate-in slide-in-from-right-2 duration-300`}
    >
      <div className="flex items-start gap-3">
        {getIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm">{notification.title}</h4>
          <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="text-gray-400 hover:text-white transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const { notifications, removeNotification, clearAll } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {/* Notification Bell */}
      <div className="relative">
        <button
          className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-full p-3 text-gray-300 hover:text-white transition-colors"
          onClick={() => {
            // Toggle notification panel (could be expanded in the future)
          }}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.slice(0, 5).map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
          {notifications.length > 5 && (
            <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-center">
              <span className="text-gray-400 text-sm">
                +{notifications.length - 5} more notifications
              </span>
            </div>
          )}
        </div>
      )}

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <button
          onClick={clearAll}
          className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}