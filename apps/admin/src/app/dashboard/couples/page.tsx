export const runtime = 'nodejs';

import dbConnect from '@/lib/db';
import Couple from '@/models/Couple';
import User from '@/models/User';
import Event from '@/models/Event';
import Link from 'next/link';

interface CoupleProfile {
  coupleName?: string;
  partner1Name?: string;
  partner1Age?: number;
  partner2Name?: string;
  partner2Age?: number;
  location?: string;
  bio?: string;
  interests?: string;
  lookingFor?: string;
}

interface SerializedCouple {
  _id: string;
  user1Email: string;
  user2Email: string;
  user1Id: string;
  user2Id: string;
  relationshipStartDate: string;
  anniversaryDate?: string;
  status: string;
  createdAt: string;
  eventCount: number;
  relationshipDays: number;
  profile?: CoupleProfile;
}

interface CoupleData {
  _id: unknown;
  user1Id?: { _id?: unknown; email?: string; profile?: CoupleProfile };
  user2Id?: { _id?: unknown; email?: string; profile?: CoupleProfile };
  relationshipStartDate: Date;
  anniversaryDate?: Date;
  status: string;
  createdAt: Date;
}

async function getCouplesData() {
  await dbConnect();
  
  const couples = await Couple.find()
    .populate('user1Id', 'email profile')
    .populate('user2Id', 'email profile')
    .sort({ createdAt: -1 })
    .lean() as CoupleData[];

  // Get event counts and serialize data
  const now = new Date();
  const serializedCouples: SerializedCouple[] = await Promise.all(
    couples.map(async (couple: CoupleData) => {
      const eventCount = await Event.countDocuments({ coupleId: couple._id });
      const relationshipStartDate = new Date(couple.relationshipStartDate);
      const relationshipDays = Math.floor((now.getTime() - relationshipStartDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Extract profile from user1Id (assuming couple profile is stored there)
      const profile = couple.user1Id?.profile || couple.user2Id?.profile;
      
      return {
        _id: String(couple._id),
        user1Email: couple.user1Id?.email || 'Unknown',
        user2Email: couple.user2Id?.email || 'Unknown',
        user1Id: String(couple.user1Id?._id || ''),
        user2Id: String(couple.user2Id?._id || ''),
        relationshipStartDate: couple.relationshipStartDate.toISOString(),
        anniversaryDate: couple.anniversaryDate?.toISOString(),
        status: couple.status,
        createdAt: couple.createdAt.toISOString(),
        eventCount,
        relationshipDays,
        profile: profile ? {
          coupleName: profile.coupleName,
          partner1Name: profile.partner1Name,
          partner1Age: profile.partner1Age,
          partner2Name: profile.partner2Name,
          partner2Age: profile.partner2Age,
          location: profile.location,
          bio: profile.bio,
          interests: profile.interests,
          lookingFor: profile.lookingFor,
        } : undefined,
      };
    })
  );

  const totalCouples = serializedCouples.length;
  const activeCouples = serializedCouples.filter((c) => c.status === 'active').length;
  const totalEvents = await Event.countDocuments();
  
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthCouples = serializedCouples.filter(
    (c) => new Date(c.createdAt) >= firstDayOfMonth
  ).length;

  return {
    couples: serializedCouples,
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
          <p className="text-gray-600 mt-2">View and manage all registered couples with detailed profiling</p>
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
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeCouples}</p>
              <p className="text-xs text-gray-500 mt-1">Currently engaging</p>
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
              <p className="text-xs text-gray-500 mt-1">New couples</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="search"
            placeholder="Search by couple name or email..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="">All Locations</option>
            {Array.from(new Set(couples.filter(c => c.profile?.location).map(c => c.profile!.location))).map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
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
                      Couple Profile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Relationship
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {couples.map((couple) => (
                    <tr key={couple._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg relative">
                            {couple.profile?.coupleName?.charAt(0).toUpperCase() || couple.user1Email.charAt(0).toUpperCase()}
                            {couple.status === 'active' && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">
                              {couple.profile?.coupleName || `${couple.user1Email.split('@')[0]} & ${couple.user2Email.split('@')[0]}`}
                            </div>
                            {couple.profile?.partner1Name && couple.profile?.partner2Name && (
                              <div className="text-sm text-gray-600">
                                {couple.profile.partner1Name} ({couple.profile.partner1Age}) & {couple.profile.partner2Name} ({couple.profile.partner2Age})
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              {couple.user1Email} & {couple.user2Email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {couple.profile?.location ? (
                          <div className="flex items-center text-sm text-gray-900">
                            <span className="mr-1">📍</span>
                            {couple.profile.location}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(couple.relationshipStartDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {couple.relationshipDays} days together
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            couple.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : couple.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {couple.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{couple.eventCount} events</div>
                        {couple.profile?.lookingFor && (
                          <div className="text-xs text-gray-500">
                            Looking for: {couple.profile.lookingFor}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/dashboard/couples/${couple._id}`} className="text-pink-600 hover:text-pink-900 mr-4">
                          View Profile
                        </Link>
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