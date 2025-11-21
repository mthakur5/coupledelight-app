'use client';

import { useState, useEffect } from 'react';
import CreateEventModal from '@/components/CreateEventModal';

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: Date;
  category: string;
  status: 'upcoming' | 'completed' | 'planned' | 'cancelled';
  location?: string;
  isPublic: boolean;
  maxRegistrations: number;
  registeredCouples: Array<{
    _id: string;
    user1Id: { email: string; name?: string };
    user2Id: { email: string; name?: string };
  }>;
}

interface Stats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  plannedEvents: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    plannedEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        
        // Calculate stats
        setStats({
          totalEvents: data.length,
          upcomingEvents: data.filter((e: Event) => e.status === 'upcoming').length,
          completedEvents: data.filter((e: Event) => e.status === 'completed').length,
          plannedEvents: data.filter((e: Event) => e.status === 'planned').length,
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = () => {
    fetchEvents(); // Refresh the events list
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage couple events</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          + Create Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingEvents}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedEvents}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planned</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.plannedEvents}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Yet</h3>
            <p className="text-gray-600 mb-4">Create your first event to get started</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => {
                    const registeredCount = event.registeredCouples?.length || 0;
                    const spotsLeft = event.maxRegistrations - registeredCount;
                    
                    return (
                      <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              🎉
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-500">ID: {event._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{registeredCount} couples registered</div>
                            {event.registeredCouples && event.registeredCouples.length > 0 ? (
                              <div className="mt-1 space-y-1">
                                {event.registeredCouples.slice(0, 3).map((couple) => (
                                  <div key={couple._id} className="text-xs text-gray-600">
                                    • {couple.user1Id?.email?.split('@')[0] || 'User'} & {couple.user2Id?.email?.split('@')[0] || 'User'}
                                  </div>
                                ))}
                                {event.registeredCouples.length > 3 && (
                                  <div className="text-xs text-gray-500 italic">
                                    +{event.registeredCouples.length - 3} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500 mt-1">No registrations yet</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              event.status === 'upcoming'
                                ? 'bg-yellow-100 text-yellow-800'
                                : event.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registeredCount} / {event.maxRegistrations}
                          {spotsLeft > 0 && (
                            <div className="text-xs text-green-600 mt-1">{spotsLeft} spots left</div>
                          )}
                          {spotsLeft === 0 && (
                            <div className="text-xs text-red-600 mt-1">Full</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-pink-600 hover:text-pink-900 mr-4">View</button>
                          <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{events.length}</span> of{' '}
                  <span className="font-medium">{events.length}</span> results
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

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEventCreated}
      />
    </div>
  );
}