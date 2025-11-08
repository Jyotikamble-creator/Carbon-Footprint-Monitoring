"use client";

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../components/ui/Toast';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  numeric?: boolean;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface FieldConfig {
  value: any;
  rules?: ValidationRule;
  touched?: boolean;
}

export interface FormState {
  [key: string]: FieldConfig;
}

export interface FormErrors {
  [key: string]: string;
}

export function useFormValidation(initialState: FormState = {}) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error: showErrorToast } = useToast();

  const validateField = useCallback((name: string, value: any, rules?: ValidationRule): string | null => {
    if (!rules) return null;

    // Required validation
    if (rules.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const stringValue = String(value);

    // Length validations
    if (rules.minLength && stringValue.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`;
    }

    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      return 'Invalid format';
    }

    // Email validation
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(stringValue)) {
        return 'Please enter a valid email address';
      }
    }

    // URL validation
    if (rules.url) {
      try {
        new URL(stringValue);
      } catch {
        return 'Please enter a valid URL';
      }
    }

    // Numeric validation
    if (rules.numeric) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return 'Please enter a valid number';
      }

      if (rules.min !== undefined && numValue < rules.min) {
        return `Value must be at least ${rules.min}`;
      }

      if (rules.max !== undefined && numValue > rules.max) {
        return `Value must be at most ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    Object.entries(formState).forEach(([name, config]) => {
      const fieldError = validateField(name, config.value, config.rules);
      if (fieldError) {
        newErrors[name] = fieldError;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [formState, validateField]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        touched: true
      }
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldTouched = useCallback((name: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true
      }
    }));

    // Validate field on blur
    const config = formState[name];
    if (config) {
      const fieldError = validateField(name, config.value, config.rules);
      if (fieldError) {
        setErrors(prev => ({ ...prev, [name]: fieldError }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  }, [formState, validateField]);

  const resetForm = useCallback((newInitialState?: FormState) => {
    setFormState(newInitialState || initialState);
    setErrors({});
    setIsSubmitting(false);
  }, [initialState]);

  const handleSubmit = useCallback(async (
    onSubmit: (values: Record<string, any>) => Promise<void> | void,
    options: {
      showValidationErrors?: boolean;
      resetOnSuccess?: boolean;
    } = {}
  ) => {
    const { showValidationErrors = true, resetOnSuccess = false } = options;

    if (!validateForm()) {
      if (showValidationErrors) {
        showErrorToast('Validation Error', 'Please check the form for errors');
      }
      return false;
    }

    setIsSubmitting(true);

    try {
      const values = Object.fromEntries(
        Object.entries(formState).map(([key, config]) => [key, config.value])
      );

      await onSubmit(values);

      if (resetOnSuccess) {
        resetForm();
      }

      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      showErrorToast('Submission Error', 'An error occurred while submitting the form');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, validateForm, showErrorToast, resetForm]);

  // Auto-validate fields when they change
  useEffect(() => {
    Object.entries(formState).forEach(([name, config]) => {
      if (config.touched && config.rules) {
        const fieldError = validateField(name, config.value, config.rules);
        setErrors(prev => {
          const newErrors = { ...prev };
          if (fieldError) {
            newErrors[name] = fieldError;
          } else {
            delete newErrors[name];
          }
          return newErrors;
        });
      }
    });
  }, [formState, validateField]);

  return {
    // State
    formState,
    errors,
    isSubmitting,
    isValid: Object.keys(errors).length === 0,

    // Actions
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    handleSubmit,

    // Utilities
    getFieldProps: (name: string) => ({
      value: formState[name]?.value || '',
      onChange: (value: any) => setFieldValue(name, value),
      onBlur: () => setFieldTouched(name),
      error: errors[name],
      touched: formState[name]?.touched || false
    })
  };
}

// Common validation rules
export const validationRules = {
  required: { required: true },
  email: { required: true, email: true },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
      return null;
    }
  },
  url: { required: true, url: true },
  positiveNumber: { required: true, numeric: true, min: 0 },
  percentage: { required: true, numeric: true, min: 0, max: 100 }
} as const;