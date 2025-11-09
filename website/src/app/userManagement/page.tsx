// app/user-management/page.tsx
 'use client';

import { useState, useEffect } from 'react';
import UserTable from '@/ui/userManagement/Table';
import SearchBar from '@/ui/userManagement/SearchBar';
import { User } from '@/types/auth/user';
import { fetchUsers } from '@/app/api/tenants/fetchUser/route';
import { useToast } from '@/components/ui/Toast';
import type { TenantUser } from '@/types/tenants/tenantstypes';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const tenantUsers = await fetchUsers();
        // Convert TenantUser to User format
        const convertedUsers: User[] = tenantUsers.map((tenantUser: TenantUser) => ({
          id: tenantUser.id.toString(),
          name: tenantUser.email.split('@')[0], // Use email prefix as name
          email: tenantUser.email,
          role: tenantUser.role as 'Admin' | 'Member' | 'Viewer',
          status: tenantUser.is_active ? 'Active' : 'Inactive',
          lastActive: 'N/A', // API doesn't provide this info
        }));
        setUsers(convertedUsers);
      } catch (err) {
        console.error('Failed to load users:', err);
        showError('Failed to load users', 'Please try again later');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [showError]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">User Management</h1>
            <p className="text-gray-400">
              Invite, manage roles, and view activity for all users in your organization.
            </p>
          </div>
          <button className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <span className="text-xl">+</span>
            Invite User
          </button>
        </div>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading users...</div>
        ) : (
          <UserTable users={filteredUsers} totalUsers={users.length} />
        )}
      </div>
    </ProtectedRoute>
  );
}