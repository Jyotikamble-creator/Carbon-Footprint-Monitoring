"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 max-w-sm";

    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-900/90 border-green-700 text-green-100`;
      case 'error':
        return `${baseStyles} bg-red-900/90 border-red-700 text-red-100`;
      case 'warning':
        return `${baseStyles} bg-yellow-900/90 border-yellow-700 text-yellow-100`;
      case 'info':
        return `${baseStyles} bg-blue-900/90 border-blue-700 text-blue-100`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold leading-tight">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-sm opacity-90 mt-1 leading-relaxed">
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="text-sm font-medium underline hover:no-underline mt-2 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 rounded-md hover:bg-black/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Hook for form validation with toast integration
export function useFormValidation() {
  const { error } = useToast();

  const validateField = useCallback((value: string, rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  }) => {
    if (rules.required && !value.trim()) {
      return 'This field is required';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return null;
  }, []);

  const validateForm = useCallback((fields: Record<string, {
    value: string;
    rules: Parameters<typeof validateField>[1];
  }>) => {
    const errors: Record<string, string> = {};
    let hasErrors = false;

    Object.entries(fields).forEach(([fieldName, { value, rules }]) => {
      const fieldError = validateField(value, rules);
      if (fieldError) {
        errors[fieldName] = fieldError;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      error('Validation Error', 'Please check the form for errors');
    }

    return { errors, isValid: !hasErrors };
  }, [validateField, error]);

  return { validateField, validateForm };
}