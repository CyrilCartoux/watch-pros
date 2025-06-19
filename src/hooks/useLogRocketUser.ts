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
    console.log('userData', userData);
    if (userId && userData?.email) {
      // Fallback: si pas de nom, utiliser l'email comme nom
      const name = userData.name || userData.email;
      const data = { ...userData, name };
      console.log('[LogRocket] identify', userId, data);
      identifyUser(String(userId), data);
    }
  }, [userId, userData]);
}
