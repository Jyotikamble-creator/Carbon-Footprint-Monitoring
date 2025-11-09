"use client";

import { useState } from 'react';
import { KpiCard } from '../../components/ui/KpiCard';
import { EmissionChart } from '../../components/ui/EmissionChart';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';
import { FormField, FormSelect, FormTextarea, FormCheckbox } from '../../components/ui/FormComponents';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';
import { useToast } from '../../components/ui/Toast';
import { TrendingUp, Users, Leaf, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock data for demonstration
const mockKpiData: any[] = [];

const mockTableData: any[] = [];

const mockChartData: any[] = [];

export default function ComponentsDemoPage() {
  const { success, error, warning, info } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form validation example
  const {
    getFieldProps,
    handleSubmit,
    isSubmitting,
    resetForm
  } = useFormValidation({
    facilityName: { value: '', rules: validationRules.required },
    email: { value: '', rules: validationRules.email },
    emissions: { value: '', rules: validationRules.positiveNumber },
    description: { value: '', rules: { maxLength: 500 } },
    isActive: { value: true, rules: validationRules.required }
  });

  const handleFormSubmit = async (values: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    success('Facility Created', 'The facility has been successfully created');
    resetForm();
  };

  const handleDeleteItem = (item: any) => {
    setSelectedItem(item);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    // Simulate delete operation
    success('Item Deleted', `${selectedItem.name} has been deleted`);
    setShowConfirmDialog(false);
    setSelectedItem(null);
  };

  const tableColumns = [
    { key: 'name', header: 'Facility Name', sortable: true },
    { key: 'emissions', header: 'Emissions (tons)', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => info('Edit', `Editing ${row.name}`)}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteItem(row)}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Components Demo</h1>
            <p className="text-gray-400 mt-2">
              Showcase of all advanced UI components
            </p>
          </div>
          <button
            onClick={() => success('Demo', 'This is a success toast!')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Test Toast
          </button>
        </div>

        {/* KPI Cards */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">KPI Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockKpiData.length > 0 ? (
              mockKpiData.map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  subtitle={kpi.unit}
                  trend={kpi.trend.isPositive ? 'up' : 'down'}
                  trendValue={`${kpi.trend.value}%`}
                  color={kpi.color}
                  loading={index === 2} // Demo loading state
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">
                No KPI data available. This section demonstrates KPI card components.
              </div>
            )}
          </div>
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Emission Chart</h2>
          <div className="bg-gray-900 rounded-lg p-6">
          <EmissionChart
            title="Monthly Emissions vs Target"
            height={300}
          >
            {/* This would be a Recharts component in real usage */}
            <div className="flex items-center justify-center h-full text-gray-400">
              Chart component would go here
            </div>
          </EmissionChart>
          </div>
        </section>

        {/* Data Table */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Data Table</h2>
          {mockTableData.length > 0 ? (
            <DataTable
              data={mockTableData}
              columns={tableColumns}
              searchable
              sortable
              pagination
              pageSize={3}
              exportable
            />
          ) : (
            <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-400">
              No table data available. This section demonstrates data table components.
            </div>
          )}
        </section>

        {/* Form Components */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Form Components</h2>
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(handleFormSubmit);
            }} className="space-y-6">
              <FormField
                label="Facility Name"
                name="facilityName"
                placeholder="Enter facility name"
                {...getFieldProps('facilityName')}
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
                {...getFieldProps('email')}
              />

              <FormField
                label="Emissions (tons CO₂e)"
                name="emissions"
                type="number"
                placeholder="Enter emissions amount"
                {...getFieldProps('emissions')}
              />

              <FormSelect
                label="Facility Type"
                name="facilityType"
                {...getFieldProps('facilityType')}
                placeholder="Select facility type"
                options={[
                  { value: 'office', label: 'Office Building' },
                  { value: 'manufacturing', label: 'Manufacturing Plant' },
                  { value: 'warehouse', label: 'Warehouse' },
                  { value: 'retail', label: 'Retail Store' },
                  { value: 'datacenter', label: 'Data Center' }
                ]}
              />

              <FormTextarea
                label="Description"
                name="description"
                placeholder="Enter facility description (optional)"
                rows={3}
                {...getFieldProps('description')}
              />

              <FormCheckbox
                label="Mark as active facility"
                name="isActive"
                checked={getFieldProps('isActive').value}
                {...getFieldProps('isActive')}
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? 'Creating...' : 'Create Facility'}
                </button>
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Toast Examples */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Toast Examples</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => success('Success!', 'Operation completed successfully')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Success Toast
            </button>
            <button
              onClick={() => error('Error!', 'Something went wrong')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Error Toast
            </button>
            <button
              onClick={() => warning('Warning!', 'Please review this action')}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              Warning Toast
            </button>
            <button
              onClick={() => info('Info', 'Here is some information')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Info Toast
            </button>
          </div>
        </section>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Item"
          message={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </ProtectedRoute>
  );
}