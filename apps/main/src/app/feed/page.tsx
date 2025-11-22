import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function FeedPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <button className="w-full text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                    Share something with your partner...
                  </button>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <span className="text-xl">📷</span>
                  <span className="text-sm font-medium">Photo</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <span className="text-xl">🎉</span>
                  <span className="text-sm font-medium">Event</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <span className="text-xl">💝</span>
                  <span className="text-sm font-medium">Milestone</span>
                </button>
              </div>
            </div>

            {/* Empty Feed State */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Welcome to Your Feed!
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Connect with other couples, share your experiences, and discover inspiring stories. Start by creating your first post!
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium">
                Create Your First Post
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🔥 Trending Topics
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-sm font-semibold text-gray-900">
                    #DateNightIdeas
                  </div>
                  <div className="text-xs text-gray-600">
                    125 posts
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-sm font-semibold text-gray-900">
                    #CoupleGoals
                  </div>
                  <div className="text-xs text-gray-600">
                    89 posts
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-sm font-semibold text-gray-900">
                    #Anniversary
                  </div>
                  <div className="text-xs text-gray-600">
                    67 posts
                  </div>
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                💡 Suggestions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/events"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-semibold text-gray-900">
                    📅 Explore Events
                  </div>
                  <div className="text-xs text-gray-600">
                    Discover amazing date ideas
                  </div>
                </Link>
                <Link
                  href="/shop"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-semibold text-gray-900">
                    🛍️ Browse Products
                  </div>
                  <div className="text-xs text-gray-600">
                    Find perfect gifts
                  </div>
                </Link>
                <Link
                  href="/profile"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-semibold text-gray-900">
                    👤 Complete Profile
                  </div>
                  <div className="text-xs text-gray-600">
                    Add more details
                  </div>
                </Link>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                📋 Community Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Be respectful and kind</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Share positive experiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Respect privacy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Report inappropriate content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}