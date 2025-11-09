// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AccountInformation from '@/components/profile/AccountInformation';
import ComprehensiveSettings from '@/components/profile/ComprehensiveSettings';
import { ProfileData } from '@/types/auth/profile';
import { me } from '@/app/api/auth/me/route';
import { useToast } from '@/components/ui/Toast';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await me();
        setProfileData({
          email: userData.email,
          organization: userData.org.name,
          currentRole: userData.role,
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        showError('Failed to load profile', 'Please try again later');
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [showError]);

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-5xl font-bold mb-12">My Profile</h1>

        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading profile...</div>
        ) : profileData ? (
          <>
            <AccountInformation data={profileData} />
            <ComprehensiveSettings />
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Failed to load profile data. Please try refreshing the page.
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}