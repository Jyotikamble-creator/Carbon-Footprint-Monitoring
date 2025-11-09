"use client";
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageLayout } from '@/components/layout/PageLayout';
import { Users, UserPlus, Mail, Shield, Eye, EyeOff, Edit2, Trash2, Search, AlertCircle, Loader2 } from 'lucide-react';
import { useUsers, useCreateUser } from '@/lib/tenants/hooks';
import type { TenantUser, CreateUserRequest } from '@/types/tenants/tenantstypes';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    email: '',
    password: '',
    role: 'viewer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: users = [], isLoading, isError, error: usersError } = useUsers();
  const createUserMutation = useCreateUser();

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'analyst': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newUser.email || !newUser.password) {
      setError('Email and password are required');
      return;
    }

    createUserMutation.mutate(newUser, {
      onSuccess: () => {
        setShowAddModal(false);
        setNewUser({ email: '', password: '', role: 'viewer' });
        setError(null);
      },
      onError: (err: Error) => {
        console.error('Failed to create user:', err);
        setError(err.message || 'Failed to create user');
      }
    });
  };

  return (
    <ProtectedRoute>
      <PageLayout
        title="User Management"
        description="Manage team members and their access permissions"
        icon={Users}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-gray-900 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        }
      >

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by email or role..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/40 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Error Display */}
            {(isError || error) && (
              <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <p className="text-red-400 font-medium">Error</p>
                  <p className="text-red-300 text-sm">{usersError?.message || error}</p>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50 bg-gray-800/50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center">
                        <div className="flex items-center justify-center gap-3 text-gray-400">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Loading users...
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        {searchQuery ? "No users found matching your search." : "No users available. Add one to get started."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user: TenantUser, index: number) => (
                      <tr
                        key={user.id}
                        className={`border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors ${
                          index === filteredUsers.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                              <Mail className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{user.email}</div>
                              <div className="text-gray-400 text-sm">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            user.is_active 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => console.log('Edit user:', user.id)}
                              className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                              title="Edit User"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => console.log('Delete user:', user.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && !isLoading && !isError && (
                <div className="p-8 text-center text-gray-400">
                  No users found matching your search criteria.
                </div>
              )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Add New User</h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddUser} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="user@company.com"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Enter secure password (min 8 chars)"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          setError(null);
                        }}
                        className="flex-1 px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
                        disabled={createUserMutation.isPending}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createUserMutation.isPending}
                        className="flex-1 px-4 py-3 bg-emerald-500 text-gray-900 rounded-lg hover:bg-emerald-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {createUserMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Add User'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
      </PageLayout>
    </ProtectedRoute>
  );
}