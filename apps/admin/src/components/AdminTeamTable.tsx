'use client';

import { useState } from 'react';

interface AdminMember {
  _id: string;
  email: string;
  adminRole: string;
  permissions: {
    manageUsers: boolean;
    manageProducts: boolean;
    manageOrders: boolean;
    manageEvents: boolean;
    manageCouples: boolean;
    manageBookings: boolean;
    viewReports: boolean;
    manageAdminTeam: boolean;
  };
  accountStatus: string;
  createdAt: string;
  addedBy?: {
    email: string;
  };
}

interface Props {
  adminTeam: AdminMember[];
  currentUserId: string;
}

export default function AdminTeamTable({ adminTeam, currentUserId }: Props) {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminMember | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<AdminMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            👑 Super Admin
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            👨‍💼 Manager
          </span>
        );
      case 'supervisor':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            👨‍🏫 Supervisor
          </span>
        );
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this admin member?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin-team/${adminId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete admin member');
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      alert(error || 'Failed to delete admin member');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (admin: AdminMember) => {
    setEditingAdmin({ ...admin });
  };

  const handleRoleChange = (role: string) => {
    if (!editingAdmin) return;

    // Set default permissions based on role
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

    setEditingAdmin({
      ...editingAdmin,
      adminRole: role,
      permissions: defaultPermissions,
    });
  };

  const handlePermissionToggle = (permission: string) => {
    if (!editingAdmin) return;

    setEditingAdmin({
      ...editingAdmin,
      permissions: {
        ...editingAdmin.permissions,
        [permission]: !editingAdmin.permissions[permission as keyof typeof editingAdmin.permissions],
      },
    });
  };

  const handleSaveEdit = async () => {
    if (!editingAdmin) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin-team/${editingAdmin._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminRole: editingAdmin.adminRole,
          permissions: editingAdmin.permissions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update admin member');
      }

      alert('Admin role and permissions updated successfully!');
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      alert(error || 'Failed to update admin member');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionsCount = (permissions: AdminMember['permissions']) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adminTeam.map((admin) => (
              <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {admin.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{admin.email}</div>
                      {admin._id === currentUserId && (
                        <span className="text-xs text-pink-600 font-medium">You</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(admin.adminRole)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedAdmin(admin)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {getPermissionsCount(admin.permissions)}/8 permissions
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {admin.addedBy?.email || 'System'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {admin._id !== currentUserId ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRole(admin)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Permissions Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Permissions Details</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedAdmin.email}</p>
              </div>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-700">Role:</span>
                {getRoleBadge(selectedAdmin.adminRole)}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(selectedAdmin.permissions).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                      value
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-2xl">
                      {value ? '✅' : '❌'}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${
                        value ? 'text-green-900' : 'text-gray-500'
                      }`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t px-6 py-4">
              <button
                onClick={() => setSelectedAdmin(null)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Admin Role</h2>
                <p className="text-sm text-gray-600 mt-1">{editingAdmin.email}</p>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Role
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
                    style={{ borderColor: editingAdmin.adminRole === 'super_admin' ? '#9333ea' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="adminRole"
                      value="super_admin"
                      checked={editingAdmin.adminRole === 'super_admin'}
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
                    style={{ borderColor: editingAdmin.adminRole === 'manager' ? '#3b82f6' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="adminRole"
                      value="manager"
                      checked={editingAdmin.adminRole === 'manager'}
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
                    style={{ borderColor: editingAdmin.adminRole === 'supervisor' ? '#10b981' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="adminRole"
                      value="supervisor"
                      checked={editingAdmin.adminRole === 'supervisor'}
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
                  {Object.entries(editingAdmin.permissions).map(([key, value]) => (
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
            </div>

            <div className="border-t px-6 py-4 flex gap-3">
              <button
                onClick={() => setEditingAdmin(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}