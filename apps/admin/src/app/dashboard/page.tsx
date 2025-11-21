export const runtime = 'nodejs';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Types } from 'mongoose';

interface UserData {
  _id: Types.ObjectId;
  email: string;
  role: string;
  provider: string;
  emailVerified: boolean;
  createdAt: Date;
}

async function getDashboardStats() {
  await dbConnect();
  
  const [totalUsers, totalAdmins, recentUsers] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'admin' }),
    User.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    totalUsers,
    totalAdmins,
    recentUsers,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Admins',
      value: stats.totalAdmins,
      icon: '🔐',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Active Sessions',
      value: '12',
      icon: '🔄',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Today\'s Sign-ups',
      value: '3',
      icon: '📈',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`text-4xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentUsers.map((user: UserData) => (
                <tr key={user._id.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.emailVerified ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">✗</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-gray-600 text-sm mb-4">View and manage all registered users</p>
          <a
            href="/dashboard/users"
            className="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            Go to Users →
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-2xl mb-2">💑</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Couples</h3>
          <p className="text-gray-600 text-sm mb-4">See all registered couples and their profiles</p>
          <a
            href="/dashboard/couples"
            className="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            Go to Couples →
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Events</h3>
          <p className="text-gray-600 text-sm mb-4">Monitor and manage couple events</p>
          <a
            href="/dashboard/events"
            className="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            Go to Events →
          </a>
        </div>
      </div>
    </div>
  );
}