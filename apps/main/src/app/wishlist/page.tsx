import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function WishlistPage() {
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
                  href="/wishlist"
                  className="text-purple-600 font-medium"
                >
                  Wishlist
                </Link>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Shop
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            Save your favorite items for later
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Your Wishlist is Empty
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start adding items to your wishlist by clicking the heart icon on products you love
          </p>
          <Link
            href="/shop"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            Browse Products
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">💝</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Save for Later
            </h3>
            <p className="text-gray-600 text-sm">
              Keep track of products you're interested in without committing to buy
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Price Alerts
            </h3>
            <p className="text-gray-600 text-sm">
              Get notified when items on your wishlist go on sale
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Share with Partner
            </h3>
            <p className="text-gray-600 text-sm">
              Share your wishlist with your partner to give them gift ideas
            </p>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Build Your Wishlist
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">1️⃣</span>
              <p className="text-gray-700">
                Browse our collection of products in the Shop section
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">2️⃣</span>
              <p className="text-gray-700">
                Click the heart icon on any product you like
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">3️⃣</span>
              <p className="text-gray-700">
                Return to your wishlist anytime to review and purchase
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}