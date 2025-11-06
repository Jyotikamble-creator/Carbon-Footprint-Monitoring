'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { createFactor } from '@/lib/factors/api';
import type { CreateFactorRequest } from '@/types/factors/factorstypes';

interface FormData {
  category: string;
  geography: string;
  validOn: string;
  factorValue: string;
  unitIn: string;
  unitOut: string;
  description: string;
}

interface FormErrors {
  category?: string;
  geography?: string;
  factorValue?: string;
  unitIn?: string;
  unitOut?: string;
}

export default function AddEmissionFactorForm() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    category: 'electricity',
    geography: 'US',
    validOn: new Date().toISOString().split('T')[0],
    factorValue: '',
    unitIn: 'kWh',
    unitOut: 'kg CO2e',
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories = [
    'electricity',
    'natural_gas',
    'transportation',
    'waste',
    'water',
    'heating',
    'cooling',
  ];

  const geographies = [
    'US',
    'GB',
    'DE',
    'CA',
    'AU',
    'Global',
  ];

  const inputUnits = [
    'kWh',
    'MWh',
    'GWh',
    'kJ',
    'MJ',
    'GJ',
    'liters',
    'gallons',
    'kg',
    'tonnes',
  ];

  const outputUnits = [
    'kg CO2e',
    'tonnes CO2e',
    'g CO2e',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }

    if (!formData.geography) {
      newErrors.geography = 'Geography is required.';
    }

    if (!formData.unitIn) {
      newErrors.unitIn = 'Input unit is required.';
    }

    if (!formData.unitOut) {
      newErrors.unitOut = 'Output unit is required.';
    }

    const valueNum = parseFloat(formData.factorValue);
    if (isNaN(valueNum) || valueNum <= 0) {
      newErrors.factorValue = 'Factor value must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const factorData: CreateFactorRequest = {
        category: formData.category,
        geography: formData.geography,
        unit_in: formData.unitIn,
        unit_out: formData.unitOut,
        factor_value: parseFloat(formData.factorValue),
        valid_from: formData.validOn,
        // Provide minimal required metadata when not supplied by the form
        vendor: 'unknown',
        method: 'default',
        valid_to: new Date(new Date(formData.validOn).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        gwp_horizon: 100, // Default GWP horizon
        namespace: 'global', // Default namespace
        version: 1, // Default version
      };

      await createFactor(factorData);
      setShowSuccess(true);

      // Reset form
      setFormData({
        category: 'electricity',
        geography: 'US',
        validOn: new Date().toISOString().split('T')[0],
        factorValue: '',
        unitIn: 'kWh',
        unitOut: 'kg CO2e',
        description: '',
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to create factor:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to create emission factor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/factors');
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">
        Add New Emission Factor
      </h1>

      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-6 bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Success!</h3>
              <p className="text-gray-300 text-sm">Emission factor was added successfully.</p>
            </div>
          </div>
          <button
            onClick={handleCloseSuccess}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-white font-medium mb-3">
                Category *
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border ${
                    errors.category ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-800">
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category}</p>
              )}
            </div>

            {/* Geography */}
            <div>
              <label htmlFor="geography" className="block text-white font-medium mb-3">
                Geography *
              </label>
              <div className="relative">
                <select
                  id="geography"
                  name="geography"
                  value={formData.geography}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border ${
                    errors.geography ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer`}
                >
                  {geographies.map((geo) => (
                    <option key={geo} value={geo} className="bg-gray-800">
                      {geo}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.geography && (
                <p className="mt-1 text-sm text-red-400">{errors.geography}</p>
              )}
            </div>

            {/* Input Unit */}
            <div>
              <label htmlFor="unitIn" className="block text-white font-medium mb-3">
                Input Unit *
              </label>
              <div className="relative">
                <select
                  id="unitIn"
                  name="unitIn"
                  value={formData.unitIn}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border ${
                    errors.unitIn ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer`}
                >
                  {inputUnits.map((unit) => (
                    <option key={unit} value={unit} className="bg-gray-800">
                      {unit}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.unitIn && (
                <p className="mt-1 text-sm text-red-400">{errors.unitIn}</p>
              )}
            </div>

            {/* Output Unit */}
            <div>
              <label htmlFor="unitOut" className="block text-white font-medium mb-3">
                Output Unit *
              </label>
              <div className="relative">
                <select
                  id="unitOut"
                  name="unitOut"
                  value={formData.unitOut}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border ${
                    errors.unitOut ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer`}
                >
                  {outputUnits.map((unit) => (
                    <option key={unit} value={unit} className="bg-gray-800">
                      {unit}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.unitOut && (
                <p className="mt-1 text-sm text-red-400">{errors.unitOut}</p>
              )}
            </div>

            {/* Valid On */}
            <div>
              <label htmlFor="validOn" className="block text-white font-medium mb-3">
                Valid From
              </label>
              <input
                type="date"
                id="validOn"
                name="validOn"
                value={formData.validOn}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                style={{ colorScheme: 'dark' }}
              />
              <p className="mt-2 text-sm text-gray-400">
                The date this factor becomes effective.
              </p>
            </div>

            {/* Factor Value */}
            <div>
              <label htmlFor="factorValue" className="block text-white font-medium mb-3">
                Factor Value *
              </label>
              <input
                type="number"
                id="factorValue"
                name="factorValue"
                value={formData.factorValue}
                onChange={handleChange}
                step="0.000001"
                placeholder="0.000000"
                className={`w-full px-4 py-3 bg-gray-700/50 border ${
                  errors.factorValue ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              />
              <p className="mt-2 text-sm text-gray-400">
                Conversion factor from input unit to output unit
              </p>
              {errors.factorValue && (
                <p className="mt-1 text-sm text-red-400">{errors.factorValue}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-white font-medium mb-3">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional description for this emission factor..."
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical"
            />
            <p className="mt-2 text-sm text-gray-400">
              Optional description to help identify this factor's purpose and scope.
            </p>
          </div>

          {/* Error Message */}
          {errors.factorValue && (
            <div className="mb-6 bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{errors.factorValue}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Add Factor
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}