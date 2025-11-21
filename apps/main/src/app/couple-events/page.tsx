'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface CoupleEvent {
  _id: string;
  title: string;
  description?: string;
  date: Date;
  category: string;
  status: 'upcoming' | 'completed' | 'planned' | 'cancelled';
  location?: string;
  attendees: number;
  isPublic: boolean;
  maxRegistrations?: number;
  registeredCouples: string[];
}

const categories = [
  { name: 'All', slug: 'all', icon: '🎉' },
  { name: 'Anniversary', slug: 'anniversary', icon: '💕' },
  { name: 'Date', slug: 'date', icon: '🌹' },
  { name: 'Vacation', slug: 'vacation', icon: '✈️' },
  { name: 'Celebration', slug: 'celebration', icon: '🎊' },
  { name: 'Milestone', slug: 'milestone', icon: '🏆' },
  { name: 'Other', slug: 'other', icon: '🎯' },
];

export default function CoupleEventsPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<CoupleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [registering, setRegistering] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status, selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        isPublic: 'true',
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
      });
      
      const response = await fetch(`/api/couple-events?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      setRegistering(eventId);
      const response = await fetch(`/api/couple-events/${eventId}/register`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Successfully registered for the event!');
        fetchEvents(); // Refresh events
      } else {
        alert(data.error || 'Failed to register for event');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for event');
    } finally {
      setRegistering(null);
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      setRegistering(eventId);
      const response = await fetch(`/api/couple-events/${eventId}/register`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Successfully unregistered from the event!');
        fetchEvents(); // Refresh events
      } else {
        alert(data.error || 'Failed to unregister from event');
      }
    } catch (error) {
      console.error('Error unregistering:', error);
      alert('Failed to unregister from event');
    } finally {
      setRegistering(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/">
                <h1 className="text-2xl font-bold text-purple-600">
                  CoupleDelight
                </h1>
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/couple-events"
                  className="text-purple-600 font-medium"
                >
                  Couple Events
                </Link>
                <Link
                  href="/events"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Experiences
                </Link>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Couple Events
          </h1>
          <p className="text-gray-600 mt-2">
            Join public events and connect with other couples
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Filter by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`p-4 rounded-lg shadow-sm border transition-all text-center ${
                  selectedCategory === category.slug
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Events
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Events Available
              </h3>
              <p className="text-gray-600">
                Check back later for exciting couple events!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const spotsLeft = event.maxRegistrations
                  ? event.maxRegistrations - event.registeredCouples.length
                  : null;
                const isFull = spotsLeft !== null && spotsLeft <= 0;

                return (
                  <div
                    key={event._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {event.category}
                          </span>
                        </div>
                        <div className="text-3xl">🎉</div>
                      </div>

                      {event.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <span className="mr-2">📅</span>
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <span className="mr-2">📍</span>
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="mr-2">👥</span>
                          <span>
                            {event.registeredCouples.length} couples registered
                            {spotsLeft !== null && ` • ${spotsLeft} spots left`}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          event.registeredCouples.includes(session?.user?.id || '')
                            ? handleUnregister(event._id)
                            : handleRegister(event._id)
                        }
                        disabled={
                          (isFull && !event.registeredCouples.includes(session?.user?.id || '')) ||
                          registering === event._id
                        }
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          event.registeredCouples.includes(session?.user?.id || '')
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : isFull
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        }`}
                      >
                        {registering === event._id
                          ? 'Processing...'
                          : event.registeredCouples.includes(session?.user?.id || '')
                          ? 'Unregister'
                          : isFull
                          ? 'Event Full'
                          : 'Register Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}