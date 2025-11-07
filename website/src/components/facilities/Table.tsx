'use client';

import { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFacilities } from '@/lib/facilities/hooks';
import type { Facility } from '@/types/tenants/tenantstypes';

interface FacilitiesTableProps {
  searchQuery: string;
}

export default function FacilitiesTable({ searchQuery }: FacilitiesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: facilities = [], isLoading, isError, error } = useFacilities();

  const filteredFacilities = facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFacilities.length / 10);

  const handleEdit = (id: number) => {
    console.log('Edit facility:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete facility:', id);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden">
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading facilities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
          <p className="text-red-400">Failed to load facilities</p>
        </div>
      </div>
    );
  }

  if (filteredFacilities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 p-8 text-center">
          <p className="text-gray-400">No facilities found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50 bg-gray-800/50">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Facility Name
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Country
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Grid Region
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFacilities.map((facility, index) => (
              <tr
                key={facility.id}
                className={`border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors ${
                  index === filteredFacilities.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="py-4 px-6 text-white font-medium">
                  {facility.name}
                </td>
                <td className="py-4 px-6 text-gray-400">{facility.country || '-'}</td>
                <td className="py-4 px-6 text-gray-400">{facility.grid_region || '-'}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(facility.id)}
                      className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(facility.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => handlePageChange(1)}
          className={`min-w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
            currentPage === 1
              ? 'bg-emerald-500 text-white'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          1
        </button>

        <button
          onClick={() => handlePageChange(2)}
          className={`min-w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
            currentPage === 2
              ? 'bg-emerald-500 text-white'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          2
        </button>

        <button
          onClick={() => handlePageChange(3)}
          className={`min-w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
            currentPage === 3
              ? 'bg-emerald-500 text-white'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          3
        </button>

        <span className="text-gray-400 px-2">...</span>

        <button
          onClick={() => handlePageChange(10)}
          className={`min-w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
            currentPage === 10
              ? 'bg-emerald-500 text-white'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          10
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}