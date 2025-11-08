"use client";

import { useState, useEffect, ReactNode } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  children
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        {children ? (
          <div className="relative">
            {children}
          </div>
        ) : (
          <>
            <input
              id={name}
              name={name}
              type={inputType}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                error && touched
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            />

            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </>
        )}

        {(error && touched) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>

      {(error && touched) && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  className?: string;
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  placeholder,
  options,
  className = ''
}: FormSelectProps) {
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none ${
            error && touched
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="bg-gray-800"
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {(error && touched) && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>

      {(error && touched) && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  disabled = false,
  rows = 3,
  className = ''
}: FormTextareaProps) {
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-vertical ${
            error && touched
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        />

        {(error && touched) && (
          <div className="absolute right-3 top-3 flex items-center">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>

      {(error && touched) && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  error,
  required = false,
  disabled = false,
  className = ''
}: FormCheckboxProps) {
  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-emerald-500 focus:ring-2 text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div className="min-w-0 flex-1">
        <label htmlFor={name} className="text-sm text-gray-300 cursor-pointer">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {error && (
          <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

interface FormRadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  className?: string;
}

export function FormRadioGroup({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  options,
  className = ''
}: FormRadioGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled || option.disabled}
              className="w-4 h-4 bg-gray-800 border-gray-700 focus:ring-emerald-500 focus:ring-2 text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="text-sm text-gray-300 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}