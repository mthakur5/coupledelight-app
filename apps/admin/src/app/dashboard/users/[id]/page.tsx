'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserDetail {
  _id: string;
  email: string;
  role: string;
  provider: string;
  emailVerified: boolean;
  accountStatus: string;
  accountStatusNote?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  accountAgeDays: number;
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [note, setNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState<'approve' | 'reject' | 'suspend' | null>(null);

  useEffect(() => {
    fetchUser();
  }, [resolvedParams.id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        const createdDate = new Date(data.createdAt);
        const now = new Date();
        const accountAgeDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        setUser({ ...data, accountAgeDays });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Approve this user?')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${resolvedParams.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'Approved' }),
      });
      
      if (res.ok) {
        fetchUser();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Reject this user?')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${resolvedParams.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'Rejected' }),
      });
      
      if (res.ok) {
        fetchUser();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!confirm('Suspend this user?')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${resolvedParams.id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'Suspended' }),
      });
      
      if (res.ok) {
        fetchUser();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this user?')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${resolvedParams.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.push('/dashboard/users');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h3>
        <Link href="/dashboard/users" className="text-pink-600 hover:text-pink-900">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="hover:text-pink-600">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/users" className="hover:text-pink-600">Users</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{user.email}</span>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.email}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.accountStatus === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : user.accountStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : user.accountStatus === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {user.accountStatus}
              </span>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {user.accountStatus === 'pending' && (
            <>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}
          {user.accountStatus === 'approved' && (
            <button
              onClick={handleSuspend}
              disabled={actionLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              Suspend
            </button>
          )}
          {(user.accountStatus === 'suspended' || user.accountStatus === 'rejected') && (
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">User Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-gray-900 font-medium mt-1">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-gray-900 font-medium mt-1 text-sm">{user._id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-gray-900 font-medium mt-1 capitalize">{user.role}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <p className="text-gray-900 font-medium mt-1 capitalize">{user.provider}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Verification</label>
                  <p className={`font-medium mt-1 ${user.emailVerified ? 'text-green-600' : 'text-gray-500'}`}>
                    {user.emailVerified ? '✅ Verified' : '❌ Not Verified'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Status</label>
                  <p className={`font-medium mt-1 capitalize ${
                    user.accountStatus === 'approved' ? 'text-green-600' :
                    user.accountStatus === 'pending' ? 'text-yellow-600' :
                    user.accountStatus === 'rejected' ? 'text-red-600' :
                    'text-orange-600'
                  }`}>
                    {user.accountStatus}
                  </p>
                </div>
              </div>

              {user.accountStatusNote && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-500">Status Note</label>
                  <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">{user.accountStatusNote}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-500">Joined Date</label>
                  <p className="text-gray-900 font-medium mt-1">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900 font-medium mt-1">
                    {new Date(user.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {user.approvedAt && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-500">Approved Date</label>
                  <p className="text-gray-900 font-medium mt-1">
                    {new Date(user.approvedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Account Age</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.accountAgeDays} days
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Login Method</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{user.provider}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Can Login?</p>
                <p className={`text-lg font-semibold ${
                  user.accountStatus === 'approved' && user.emailVerified ? 'text-green-600' : 'text-red-600'
                }`}>
                  {user.accountStatus === 'approved' && user.emailVerified ? '✅ Yes' : '❌ No'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {showNoteModal === 'approve' ? 'Approve User' :
               showNoteModal === 'reject' ? 'Reject User' : 'Suspend User'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {showNoteModal === 'approve' 
                ? 'User will be approved and email will be automatically verified. They can login immediately after approval.'
                : 'Please provide a reason for this action:'}
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={showNoteModal === 'approve' ? 'Optional note...' : 'Reason (required)...'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowNoteModal(null);
                  setNote('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showNoteModal === 'approve') handleApprove();
                  else if (showNoteModal === 'reject') handleReject();
                  else handleSuspend();
                }}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  showNoteModal === 'approve' 
                    ? 'bg-green-500 hover:bg-green-600'
                    : showNoteModal === 'reject'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                } disabled:opacity-50`}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}