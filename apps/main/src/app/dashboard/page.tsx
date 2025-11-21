import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  className="text-purple-600 font-medium"
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
                  href="/my-orders"
                  className="text-gray-600 hover:text-purple-600"
                >
                  My Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Wishlist
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm">
                {session.user?.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here is what is happening in your relationship space
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Shop
              </h3>
              <span className="text-3xl">🛍️</span>
            </div>
            <p className="text-sm mb-4 opacity-90">Browse our exclusive collection</p>
            <Link
              href="/shop"
              className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium inline-block hover:bg-gray-100 transition-colors"
            >
              Browse Products →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h3>
              <span className="text-3xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">0</p>
            <p className="text-gray-600 text-sm">No events scheduled</p>
            <Link
              href="/events"
              className="text-purple-600 text-sm font-medium mt-4 inline-block hover:text-purple-700"
            >
              Create Event →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                My Orders
              </h3>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">0</p>
            <p className="text-gray-600 text-sm">No recent orders</p>
            <Link
              href="/my-orders"
              className="text-purple-600 text-sm font-medium mt-4 inline-block hover:text-purple-700"
            >
              View Orders →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Wishlist Items
              </h3>
              <span className="text-3xl">🎁</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">0</p>
            <p className="text-gray-600 text-sm">No items in wishlist</p>
            <Link
              href="/wishlist"
              className="text-purple-600 text-sm font-medium mt-4 inline-block hover:text-purple-700"
            >
              Add Item →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Posts
              </h3>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">0</p>
            <p className="text-gray-600 text-sm">No posts yet</p>
            <Link
              href="/feed"
              className="text-purple-600 text-sm font-medium mt-4 inline-block hover:text-purple-700"
            >
              Create Post →
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Getting Started
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Account Created
                </h3>
                <p className="text-gray-600 text-sm">
                  You have successfully created your account!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Connect with Partner
                </h3>
                <p className="text-gray-600 text-sm">
                  Invite your partner to join and start sharing
                </p>
                <button className="text-purple-600 text-sm font-medium mt-2 hover:text-purple-700">
                  Send Invite →
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Complete Profile
                </h3>
                <p className="text-gray-600 text-sm">
                  Add more details to personalize your experience
                </p>
                <Link
                  href="/profile"
                  className="text-purple-600 text-sm font-medium mt-2 inline-block hover:text-purple-700"
                >
                  Update Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}