'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserActionsProps {
  userId: string;
  userEmail: string;
  accountStatus: string;
}

export default function UserActions({ userId, userEmail, accountStatus }: UserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm(`Approve ${userEmail}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'Approved' }),
      });
      
      if (res.ok) {
        // Force immediate page refresh
        router.refresh();
        // Small delay then refresh again to ensure update
        setTimeout(() => router.refresh(), 500);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm(`Reject ${userEmail}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'Rejected' }),
      });
      
      if (res.ok) {
        // Force immediate page refresh
        router.refresh();
        // Small delay then refresh again to ensure update
        setTimeout(() => router.refresh(), 500);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!confirm(`Suspend ${userEmail}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'Suspended' }),
      });
      
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${userEmail}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Always show View icon */}
      <a
        href={`/dashboard/users/${userId}`}
        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
        title="View Details"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </a>
      
      {/* Only show approve/reject for pending users */}
      {accountStatus === 'pending' && (
        <>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50"
            title="Approve"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
            title="Reject"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}