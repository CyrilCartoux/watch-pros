"use client";

import { useEffect } from 'react';
import { initLogRocket } from '@/utils/logrocket';
import { useLogRocketUser } from '@/hooks/useLogRocketUser';
import { useAuth } from '@/contexts/AuthContext';

export default function LogRocketProvider() {
  const { user } = useAuth();

  useEffect(() => {
    initLogRocket();
  }, []);

  // Identify user when they are logged in
  useLogRocketUser(
    user?.id || null,
    user ? {
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      email: user.email,
      // Add any other user data you want to track
      // For example:
      // plan: user.user_metadata?.plan,
      // credits: user.user_metadata?.credits,
    } : undefined
  );

  return null;
} 