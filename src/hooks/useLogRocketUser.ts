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
    if (userId && userData?.email) {
      // Fallback: si pas de nom, utiliser l'email comme nom
      const name = userData.name || userData.email;
      const data = { ...userData, name };
      identifyUser(String(userId), data);
    }
  }, [userId, userData]);
}
