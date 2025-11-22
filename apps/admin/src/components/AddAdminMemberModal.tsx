'use client';

import { useState } from 'react';

export default function AddAdminMemberModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminRole: 'supervisor',
    permissions: {
      manageUsers: false,
      manageProducts: false,
      manageOrders: false,
      manageEvents: false,
      manageCouples: false,
      manageBookings: false,
      viewReports: false,
      manageAdminTeam: false,
    },
  });

  const handleRoleChange = (role: string) => {
    // Update default permissions based on role
    let defaultPermissions = {
      manageUsers: false,
      manageProducts: false,
      manageOrders: false,
      manageEvents: false,
      manageCouples: false,
      manageBookings: false,
      viewReports: false,
      manageAdminTeam: false,
    };
    
    if (role === 'super_admin') {
      defaultPermissions = {
        manageUsers: true,
        manageProducts: true,
        manageOrders: true,
        manageEvents: true,
        manageCouples: true,
        manageBookings: true,
        viewReports: true,
        manageAdminTeam: true,
      };
    } else if (role === 'manager') {
      defaultPermissions = {
        manageUsers: true,
        manageProducts: true,
        manageOrders: true,
        manageEvents: true,
        manageCouples: true,
        manageBookings: true,
        viewReports: true,
        manageAdminTeam: false,
      };
    } else if (role === 'supervisor') {
      defaultPermissions = {
        manageUsers: false,
        manageProducts: true,
        manageOrders: true,
        manageEvents: true,
        manageCouples: false,
        manageBookings: true,
        viewReports: true,
        manageAdminTeam: false,
      };
    }
    
    setFormData(prev => ({ ...prev, adminRole: role, permissions: defaultPermissions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add admin member');
      }

      setSuccess('Admin member added successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission as keyof typeof prev.permissions],
      },
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-md"
      >
        + Add Admin Member
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add New Admin Member</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              minLength={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          {/* Admin Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Role *
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                style={{ borderColor: formData.adminRole === 'super_admin' ? '#9333ea' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="adminRole"
                  value="super_admin"
                  checked={formData.adminRole === 'super_admin'}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👑</span>
                    <span className="font-semibold text-purple-900">Super Admin</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Full access to all features including admin team management
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                style={{ borderColor: formData.adminRole === 'manager' ? '#3b82f6' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="adminRole"
                  value="manager"
                  checked={formData.adminRole === 'manager'}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨‍💼</span>
                    <span className="font-semibold text-blue-900">Manager</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Can manage users, products, orders, events, couples, and bookings
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
                style={{ borderColor: formData.adminRole === 'supervisor' ? '#10b981' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="adminRole"
                  value="supervisor"
                  checked={formData.adminRole === 'supervisor'}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨‍🏫</span>
                    <span className="font-semibold text-green-900">Supervisor</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Can manage products, orders, events, and bookings
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Custom Permissions (Override defaults)
            </label>
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
              {Object.entries(formData.permissions).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handlePermissionToggle(key)}
                    className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Admin Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}