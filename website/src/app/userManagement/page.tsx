// app/user-management/page.tsx
 'use client';

import { useState } from 'react';
import UserTable from '@/ui/userManagement/Table';
import SearchBar from '@/ui/userManagement/SearchBar';
import { User } from '@/types/auth/user';
import DashboardHeader from '@/components/dashboard/Header';

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Eleanor Vance',
      email: 'eleanor@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 days ago',
    },
    {
      id: '2',
      name: 'Marcus Holloway',
      email: 'marcus@example.com',
      role: 'Member',
      status: 'Active',
      lastActive: '5 hours ago',
    },
    {
      id: '3',
      name: 'Clara Oswald',
      email: 'clara@example.com',
      role: 'Viewer',
      status: 'Pending',
      lastActive: 'N/A',
    },
    {
      id: '4',
      name: 'James Sullivan',
      email: 'james@example.com',
      role: 'Member',
      status: 'Inactive',
      lastActive: '1 month ago',
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a1a1a] text-white">
      <DashboardHeader />
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
        <UserTable users={filteredUsers} totalUsers={32} />
      </div>
    </div>
  );
}