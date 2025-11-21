import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

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
                  className="text-gray-600 hover:text-purple-600"
                >
                  Wishlist
                </Link>
                <Link
                  href="/profile"
                  className="text-purple-600 font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm">
                {session.user?.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="bg-gray-50 px-4 py-2 rounded-md text-gray-900">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="bg-gray-50 px-4 py-2 rounded-md text-gray-900">
                {(user as any)?.role === "admin" ? "Admin" : "User"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Verified
              </label>
              <div className="bg-gray-50 px-4 py-2 rounded-md text-gray-900">
                {(user as any)?.emailVerified ? (
                  <span className="text-green-600 font-medium">✓ Verified</span>
                ) : (
                  <span className="text-amber-600 font-medium">
                    ⚠ Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personal Details
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Feature coming soon: Add your name, bio, profile picture, and more
          </p>
          <button
            disabled
            className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
          >
            Edit Profile (Coming Soon)
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Partner Connection
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Connect with your partner to share events, wishlists, and more
          </p>
          <button
            disabled
            className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
          >
            Invite Partner (Coming Soon)
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Receive updates about events and activities
                </p>
              </div>
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed text-sm"
              >
                Coming Soon
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <h3 className="font-medium text-gray-900">
                  Privacy Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Control who can see your profile and posts
                </p>
              </div>
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed text-sm"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-red-50 rounded-lg border border-red-200 p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">
            Danger Zone
          </h2>
          <p className="text-red-700 text-sm mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            disabled
            className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
          >
            Delete Account (Coming Soon)
          </button>
        </div>
      </main>
    </div>
  );
}