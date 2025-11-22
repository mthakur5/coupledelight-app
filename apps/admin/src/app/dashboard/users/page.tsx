export const runtime = 'nodejs';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import Link from 'next/link';
import UsersTable from '@/components/UsersTable';

interface UserData {
  _id: string;
  email: string;
  role: string;
  provider: string;
  emailVerified: boolean;
  accountStatus: string;
  accountStatusNote?: string;
  createdAt: string;
}

interface UserDocument {
  _id: unknown;
  email: string;
  role: string;
  provider: string;
  emailVerified: boolean;
  accountStatus: string;
  accountStatusNote?: string;
  createdAt: Date;
}

async function getAllUsers(): Promise<UserData[]> {
  await dbConnect();
  // Only get regular users (exclude admin team members)
  const users = await User.find({ role: 'user' }).sort({ createdAt: -1 }).lean() as UserDocument[];
  
  // Serialize data for client components
  return users.map((user: UserDocument) => ({
    _id: String(user._id),
    email: user.email,
    role: user.role,
    provider: user.provider,
    emailVerified: user.emailVerified,
    accountStatus: user.accountStatus || 'pending',
    accountStatusNote: user.accountStatusNote,
    createdAt: user.createdAt.toISOString(),
  }));
}

export default async function UsersPage() {
  const users = await getAllUsers();

  // Calculate stats
  const totalUsers = users.length;
  const pendingUsers = users.filter(u => u.accountStatus === 'pending').length;
  const approvedUsers = users.filter(u => u.accountStatus === 'approved').length;
  const rejectedUsers = users.filter(u => u.accountStatus === 'rejected').length;
  const suspendedUsers = users.filter(u => u.accountStatus === 'suspended').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage regular users (Admin team managed separately)</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin-team"
            className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
          >
            👨‍💼 Manage Admin Team →
          </Link>
          <div className="text-sm text-gray-600">
            Total Users: <span className="font-semibold text-gray-900">{totalUsers}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingUsers}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{approvedUsers}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{rejectedUsers}</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{suspendedUsers}</p>
            </div>
            <div className="text-3xl">🚫</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="search"
            placeholder="Search by email..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="">All Account Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="">All Providers</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
      </div>

      {/* Users Table with Realtime Updates */}
      <UsersTable users={users} />
    </div>
  );
}