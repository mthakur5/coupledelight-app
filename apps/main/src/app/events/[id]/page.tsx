import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/events"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            ← Back to Events
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Image Placeholder */}
              <div className="w-full h-96 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎭</div>
                  <p className="text-xl font-semibold">Event Image</p>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                      Romantic
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Sample Romantic Dinner Experience
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        ⭐ 4.8 (24 reviews)
                      </span>
                      <span>•</span>
                      <span>2-3 hours</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <div className="font-semibold text-gray-900">Location</div>
                      <div className="text-gray-600">Sample Restaurant, Mumbai</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <div className="font-semibold text-gray-900">Price</div>
                      <div className="text-gray-600">₹2,500 per person</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    About This Experience
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Enjoy a romantic evening with your partner at our exclusive dining experience. 
                    This carefully curated event includes a 5-course meal, live music, and a stunning 
                    ambiance perfect for celebrating your special moments together.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Our expert chefs will prepare an exquisite menu featuring local and international 
                    cuisines, while you enjoy panoramic views and personalized service throughout the evening.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    What&apos;s Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-600">✓</span>
                      <span>5-course gourmet dinner</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-600">✓</span>
                      <span>Welcome drinks</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-600">✓</span>
                      <span>Live music entertainment</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-600">✓</span>
                      <span>Complimentary photography</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-600">✓</span>
                      <span>Private seating arrangement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ₹2,500
                </div>
                <div className="text-gray-600 text-sm">per person</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                    <option>9:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>2 people</option>
                    <option>3 people</option>
                    <option>4 people</option>
                  </select>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors font-medium mb-3">
                Book Now
              </button>

              <p className="text-center text-gray-600 text-sm">
                Free cancellation up to 48 hours before
              </p>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Quick Info
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>Duration: 2-3 hours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>👥</span>
                    <span>Max 4 people</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📱</span>
                    <span>Instant confirmation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🔄</span>
                    <span>Free cancellation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}