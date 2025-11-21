import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyBookingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
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
                  href="/events"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Events
                </Link>
                <Link
                  href="/my-bookings"
                  className="text-purple-600 font-medium"
                >
                  My Bookings
                </Link>
                <Link
                  href="/wishlist"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Wishlist
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
            My Bookings
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage your event bookings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button className="border-b-2 border-purple-600 text-purple-600 font-medium pb-4">
              Upcoming
            </button>
            <button className="text-gray-600 hover:text-purple-600 pb-4">
              Past
            </button>
            <button className="text-gray-600 hover:text-purple-600 pb-4">
              Cancelled
            </button>
          </nav>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            No Bookings Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven&apos;t booked any events yet. Start exploring amazing experiences for you and your partner!
          </p>
          <Link
            href="/events"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            Browse Events
          </Link>
        </div>

        {/* Booking Benefits */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Instant Confirmation
            </h3>
            <p className="text-gray-600 text-sm">
              Receive booking confirmation via email immediately after booking
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Easy Management
            </h3>
            <p className="text-gray-600 text-sm">
              View, modify, or cancel your bookings anytime from your dashboard
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Smart Reminders
            </h3>
            <p className="text-gray-600 text-sm">
              Get reminded about your upcoming events so you never miss out
            </p>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            📋 Cancellation Policy
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Free cancellation up to 48 hours before the event</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Full refund for cancellations made 48+ hours in advance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">⚠</span>
              <span>Cancellations within 24-48 hours: 50% refund</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-1">✗</span>
              <span>No refund for cancellations within 24 hours or no-shows</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}