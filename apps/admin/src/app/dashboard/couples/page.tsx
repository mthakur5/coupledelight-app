export const runtime = 'nodejs';

import dbConnect from '@/lib/db';
import Couple from '@/models/Couple';
import User from '@/models/User';
import Event from '@/models/Event';
import Link from 'next/link';
import { Types } from 'mongoose';

interface PopulatedCouple {
  _id: Types.ObjectId;
  user1Id: { email: string; _id: Types.ObjectId };
  user2Id: { email: string; _id: Types.ObjectId };
  relationshipStartDate: Date;
  status: string;
  createdAt: Date;
  eventCount: number;
}

async function getCouplesData() {
  await dbConnect();
  
  const couples = await Couple.find()
    .populate('user1Id', 'email')
    .populate('user2Id', 'email')
    .sort({ createdAt: -1 })
    .lean();

  // Get event counts for each couple
  const couplesWithEventCounts = await Promise.all(
    couples.map(async (couple) => {
      const eventCount = await Event.countDocuments({ coupleId: couple._id });
      return { ...couple, eventCount };
    })
  );

  const totalCouples = couples.length;
  const activeCouples = couples.filter((c) => c.status === 'active').length;
  const totalEvents = await Event.countDocuments();
  
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthCouples = couples.filter(
    (c) => new Date(c.createdAt) >= firstDayOfMonth
  ).length;

  return {
    couples: couplesWithEventCounts,
    stats: {
      totalCouples,
      activeCouples,
      totalEvents,
      thisMonthCouples,
    },
  };
}

export default async function CouplesPage() {
  const { couples, stats } = await getCouplesData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Couples Management</h1>
          <p className="text-gray-600 mt-2">View and manage all registered couples</p>
        </div>
        <div className="text-sm text-gray-600">
          Total Couples: <span className="font-semibold text-gray-900">{stats.totalCouples}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Couples</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCouples}</p>
            </div>
            <div className="text-4xl">💑</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Couples</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCouples}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEvents}</p>
            </div>
            <div className="text-4xl">🎉</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.thisMonthCouples}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
      </div>

      {/* Couples Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {couples.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💑</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Couples Yet</h3>
            <p className="text-gray-600">Couples will appear here once users start pairing up</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Couple
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Relationship Since
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {couples.map((couple) => (
                    <tr key={couple._id.toString()} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {couple.user1Id?.email?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {couple.user1Id?.email || 'Unknown'} & {couple.user2Id?.email || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">ID: {couple._id.toString().slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(couple.relationshipStartDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            couple.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {couple.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {couple.eventCount} events
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/dashboard/couples/${couple._id.toString()}`} className="text-pink-600 hover:text-pink-900 mr-4">
                          View
                        </Link>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{couples.length}</span> of{' '}
                  <span className="font-medium">{couples.length}</span> results
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}