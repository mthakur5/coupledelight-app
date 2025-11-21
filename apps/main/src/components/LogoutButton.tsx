'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = async () => {
    // Trigger storage event for other tabs to detect logout
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('logout-event', Date.now().toString());
      window.localStorage.removeItem('logout-event');
    }
    
    // Sign out and redirect to home
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
    >
      Sign Out
    </button>
  );
}