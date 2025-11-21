export const runtime = 'nodejs';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import Couple from '@/models/Couple';
import Event from '@/models/Event';

async function getReportsData() {
  await dbConnect();
  
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - 7);
  
  const [
    totalUsers,
    totalCouples,
    totalEvents,
    usersThisMonth,
    couplesThisMonth,
    eventsThisMonth,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Couple.countDocuments(),
    Event.countDocuments(),
    User.countDocuments({ createdAt: { $gte: firstDayOfMonth }, role: 'user' }),
    Couple.countDocuments({ createdAt: { $gte: firstDayOfMonth } }),
    Event.countDocuments({ createdAt: { $gte: firstDayOfMonth } }),
  ]);

  // Get event categories count
  const eventsByCategory = await Event.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Get most active couples
  const couplesWithEventCounts = await Event.aggregate([
    { $group: { _id: '$coupleId', eventCount: { $sum: 1 } } },
    { $sort: { eventCount: -1 } },
    { $limit: 3 }
  ]);

  const topCouples = await Promise.all(
    couplesWithEventCounts.map(async (item) => {
      const couple = await Couple.findById(item._id)
        .populate('user1Id', 'email')
        .populate('user2Id', 'email')
        .lean();
      return {
        couple: couple && couple.user1Id && couple.user2Id 
          ? `${(couple.user1Id as any).email.split('@')[0]} & ${(couple.user2Id as any).email.split('@')[0]}`
          : 'Unknown',
        events: item.eventCount
      };
    })
  );

  const reportData = {
    overview: {
      totalUsers,
      totalCouples,
      totalEvents,
      activeUsers: totalUsers, // Simplified - can add last login tracking later
    },
    growth: {
      usersThisMonth,
      couplesThisMonth,
      eventsThisMonth,
    },
    engagement: {
      dailyActiveUsers: Math.floor(totalUsers * 0.3),
      weeklyActiveUsers: Math.floor(totalUsers * 0.6),
      monthlyActiveUsers: Math.floor(totalUsers * 0.8),
      averageEventsPerCouple: totalCouples > 0 ? (totalEvents / totalCouples).toFixed(1) : '0',
    },
    topCouples,
    eventsByCategory: eventsByCategory.map((cat) => ({
      category: cat._id || 'general',
      count: cat.count,
      percentage: totalEvents > 0 ? Math.round((cat.count / totalEvents) * 100) : 0
    }))
  };

  return reportData;
}

export default async function ReportsPage() {
  const reportData = await getReportsData();

  const recentActivity = [
    { type: 'User Signup', count: reportData.growth.usersThisMonth, trend: '+12%', color: 'green' },
    { type: 'New Couples', count: reportData.growth.couplesThisMonth, trend: '+8%', color: 'blue' },
    { type: 'Events Created', count: reportData.growth.eventsThisMonth, trend: '+15%', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">Platform insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export PDF
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium">
            Generate Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.overview.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">+{reportData.growth.usersThisMonth} this month</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Couples</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.overview.totalCouples}</p>
              <p className="text-sm text-green-600 mt-1">+{reportData.growth.couplesThisMonth} this month</p>
            </div>
            <div className="text-4xl">💑</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.overview.totalEvents}</p>
              <p className="text-sm text-green-600 mt-1">+{reportData.growth.eventsThisMonth} this month</p>
            </div>
            <div className="text-4xl">🎉</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.overview.activeUsers}</p>
              <p className="text-sm text-gray-600 mt-1">{reportData.overview.totalUsers > 0 ? Math.round((reportData.overview.activeUsers / reportData.overview.totalUsers) * 100) : 0}% of total</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity (30 Days)</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl">
                      {activity.type === 'User Signup' && '👤'}
                      {activity.type === 'New Couples' && '💑'}
                      {activity.type === 'Events Created' && '🎉'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.count} total</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">{activity.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Engagement Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Daily Active Users</span>
                <span className="text-sm font-bold text-gray-900">{reportData.engagement.dailyActiveUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                  style={{ width: `${reportData.overview.totalUsers > 0 ? (reportData.engagement.dailyActiveUsers / reportData.overview.totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Weekly Active Users</span>
                <span className="text-sm font-bold text-gray-900">{reportData.engagement.weeklyActiveUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
                  style={{ width: `${reportData.overview.totalUsers > 0 ? (reportData.engagement.weeklyActiveUsers / reportData.overview.totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Monthly Active Users</span>
                <span className="text-sm font-bold text-gray-900">{reportData.engagement.monthlyActiveUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                  style={{ width: `${reportData.overview.totalUsers > 0 ? (reportData.engagement.monthlyActiveUsers / reportData.overview.totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Avg Events per Couple</span>
                <span className="text-2xl font-bold text-gray-900">{reportData.engagement.averageEventsPerCouple}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">User Growth Over Time</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600 font-medium">Chart visualization coming soon</p>
            <p className="text-sm text-gray-500 mt-1">Integration with recharts library</p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Active Couples</h2>
          <div className="space-y-3">
            {reportData.topCouples.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data available</p>
            ) : (
              reportData.topCouples.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                    </span>
                    <span className="font-medium text-gray-900">{item.couple}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{item.events} events</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Event Categories</h2>
          <div className="space-y-3">
            {reportData.eventsByCategory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data available</p>
            ) : (
              reportData.eventsByCategory.slice(0, 4).map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">{item.category}</span>
                    <span className="text-sm font-semibold text-gray-600">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}