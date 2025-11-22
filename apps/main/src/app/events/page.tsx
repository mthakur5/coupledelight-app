import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const categories = [
  { name: "All", slug: "all", icon: "🎉" },
  { name: "Restaurant", slug: "restaurant", icon: "🍽️" },
  { name: "Adventure", slug: "adventure", icon: "🏔️" },
  { name: "Romantic", slug: "romantic", icon: "💕" },
  { name: "Entertainment", slug: "entertainment", icon: "🎭" },
  { name: "Spa", slug: "spa", icon: "💆" },
  { name: "Outdoor", slug: "outdoor", icon: "🌳" },
  { name: "Cultural", slug: "cultural", icon: "🎨" },
];

export default async function EventsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Discover Amazing Experiences
          </h1>
          <p className="text-gray-600 mt-2">
            Find the perfect date ideas and activities for you and your partner
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/events?category=${category.slug}`}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Events
            </h2>
            <Link
              href="/events?featured=true"
              className="text-purple-600 font-medium hover:text-purple-700"
            >
              View All →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">🎪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Events will be added soon. Check back later for amazing experiences!
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Mumbai", "Delhi", "Bangalore"].map((city) => (
              <Link
                key={city}
                href={`/events?city=${city}`}
                className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {city}
                </h3>
                <p className="text-white/90 text-sm">
                  Explore events in {city}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                1. Browse Events
              </h3>
              <p className="text-gray-600 text-sm">
                Explore curated experiences by category, location, or price
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                2. Book Your Spot
              </h3>
              <p className="text-gray-600 text-sm">
                Select your preferred date and time, then confirm your booking
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3. Create Memories
              </h3>
              <p className="text-gray-600 text-sm">
                Enjoy your experience and share your moments with your partner
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}