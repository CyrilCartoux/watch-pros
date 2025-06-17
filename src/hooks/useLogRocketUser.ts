"use client";

import { useEffect } from 'react';
import { identifyUser } from '@/utils/logrocket';

interface UserData {
  name?: string;
  email?: string;
  [key: string]: string | number | boolean | undefined;
}

export function useLogRocketUser(userId: string | null, userData?: UserData) {
  useEffect(() => {
    if (userId) {
      // Ensure userId is a string
      const stringUserId = String(userId);
      identifyUser(stringUserId, userData || {});
    }
  }, [userId, userData]);
} 