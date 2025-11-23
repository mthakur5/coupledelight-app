'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Couple {
  _id: string;
  email: string;
  profile?: {
    coupleName?: string;
    partner1Name?: string;
    partner2Name?: string;
    partner1Age?: number;
    partner2Age?: number;
    city?: string;
    state?: string;
    country?: string;
    bio?: string;
    lifestyleType?: string;
    experienceLevel?: string;
    seekingGender?: string;
    relationshipStatus?: string;
    lookingFor?: string;
    interests?: string[];
    kinks?: string[];
    verified?: boolean;
    profilePicture?: string;
  };
}

interface SearchFilters {
  city: string;
  state: string;
  country: string;
  lifestyleType: string;
  experienceLevel: string;
  seekingGender: string;
  minAge: string;
  maxAge: string;
  relationshipStatus: string;
  lookingFor: string;
  meetingPreference: string;
  verified: string;
  kinks: string;
  interests: string;
  page: number;
  limit: number;
}

export default function SearchCouplesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [couples, setCouples] = useState<Couple[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    state: '',
    country: '',
    lifestyleType: '',
    experienceLevel: '',
    seekingGender: '',
    minAge: '',
    maxAge: '',
    relationshipStatus: '',
    lookingFor: '',
    meetingPreference: '',
    verified: '',
    kinks: '',
    interests: '',
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    // Middleware already protects this route, so just fetch data when component mounts
    searchCouples();
  }, [filters.page]); // Fetch when page changes

  const searchCouples = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/couples/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCouples(data.couples);
        setPagination(data.pagination);
      } else {
        console.error('Failed to search couples');
      }
    } catch (error) {
      console.error('Error searching couples:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCouples();
  };

  const handleClearFilters = () => {
    setFilters({
      city: '',
      state: '',
      country: '',
      lifestyleType: '',
      experienceLevel: '',
      seekingGender: '',
      minAge: '',
      maxAge: '',
      relationshipStatus: '',
      lookingFor: '',
      meetingPreference: '',
      verified: '',
      kinks: '',
      interests: '',
      page: 1,
      limit: 20,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-100 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Simple Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Couples</h1>
          <p className="text-gray-600">Find and connect with other couples</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-600 hover:text-gray-800"
                >
                  {showFilters ? '−' : '+'}
                </button>
              </div>

              <form onSubmit={handleSearch} className={showFilters ? '' : 'hidden lg:block'}>
                {/* Location Filters */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                  <input
                    type="text"
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg mb-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder:text-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg mb-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder:text-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder:text-gray-900"
                  />
                </div>

                {/* Age Range */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Age Range</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAge}
                      onChange={(e) => handleFilterChange('minAge', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder:text-gray-900"
                      min="18"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAge}
                      onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder:text-gray-900"
                      min="18"
                    />
                  </div>
                </div>

                {/* Lifestyle Type */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Lifestyle Type</h3>
                  <select
                    value={filters.lifestyleType}
                    onChange={(e) => handleFilterChange('lifestyleType', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="cuckold">Cuckold</option>
                    <option value="hotwife">Hotwife</option>
                    <option value="stag-vixen">Stag & Vixen</option>
                    <option value="swinger">Swinger</option>
                    <option value="open-relationship">Open Relationship</option>
                    <option value="polyamorous">Polyamorous</option>
                    <option value="exploring">Exploring</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Experience Level</h3>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="newbie">Newbie</option>
                    <option value="curious">Curious</option>
                    <option value="experienced">Experienced</option>
                    <option value="veteran">Veteran</option>
                  </select>
                </div>

                {/* Seeking Gender */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Seeking</h3>
                  <select
                    value={filters.seekingGender}
                    onChange={(e) => handleFilterChange('seekingGender', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="couple">Couple</option>
                    <option value="trans">Trans</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                {/* Relationship Status */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Relationship Status</h3>
                  <select
                    value={filters.relationshipStatus}
                    onChange={(e) => handleFilterChange('relationshipStatus', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="dating">Dating</option>
                    <option value="engaged">Engaged</option>
                    <option value="married">Married</option>
                    <option value="domestic-partnership">Domestic Partnership</option>
                  </select>
                </div>

                {/* Looking For */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Looking For</h3>
                  <select
                    value={filters.lookingFor}
                    onChange={(e) => handleFilterChange('lookingFor', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="couples">Couples</option>
                    <option value="singles">Singles</option>
                    <option value="both">Both</option>
                    <option value="groups">Groups</option>
                    <option value="friends-only">Friends Only</option>
                  </select>
                </div>

                {/* Meeting Preference */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Meeting Preference</h3>
                  <select
                    value={filters.meetingPreference}
                    onChange={(e) => handleFilterChange('meetingPreference', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="online-only">Online Only</option>
                    <option value="in-person">In Person</option>
                    <option value="both">Both</option>
                    <option value="virtual-first">Virtual First</option>
                  </select>
                </div>

                {/* Verified Only */}
                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verified === 'true'}
                      onChange={(e) =>
                        handleFilterChange('verified', e.target.checked ? 'true' : '')
                      }
                      className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Verified Only</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Found {pagination.total} couple{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : couples.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg">No couples found matching your criteria</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {couples.map((couple) => (
                  <div
                    key={couple._id}
                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-4">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0">
                        {couple.profile?.profilePicture ? (
                          <img
                            src={couple.profile.profilePicture}
                            alt={couple.profile?.coupleName || 'Couple'}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {couple.profile?.coupleName?.[0] || 'C'}
                          </div>
                        )}
                      </div>

                      {/* Couple Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                              {couple.profile?.coupleName || 'Couple'}
                              {couple.profile?.verified && (
                                <span className="text-blue-500" title="Verified">
                                  ✓
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600">
                              {couple.profile?.partner1Name && couple.profile?.partner2Name
                                ? `${couple.profile.partner1Name} & ${couple.profile.partner2Name}`
                                : 'Names not specified'}
                            </p>
                          </div>
                          <Link
                            href={`/couples/${couple._id}`}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                          >
                            View Profile
                          </Link>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                          {couple.profile?.city && couple.profile?.state && (
                            <p className="text-gray-600">
                              📍 {couple.profile.city}, {couple.profile.state}
                              {couple.profile.country && `, ${couple.profile.country}`}
                            </p>
                          )}

                          {(couple.profile?.partner1Age || couple.profile?.partner2Age) && (
                            <p className="text-gray-600">
                              👥 Ages: {couple.profile.partner1Age || '?'} &{' '}
                              {couple.profile.partner2Age || '?'}
                            </p>
                          )}

                          {couple.profile?.relationshipStatus && (
                            <p className="text-gray-600">
                              💕 {couple.profile.relationshipStatus.replace(/-/g, ' ')}
                            </p>
                          )}

                          {couple.profile?.lifestyleType && (
                            <p className="text-gray-600">
                              🎭 {couple.profile.lifestyleType.replace(/-/g, ' ')}
                            </p>
                          )}

                          {couple.profile?.experienceLevel && (
                            <p className="text-gray-600">
                              ⭐ {couple.profile.experienceLevel}
                            </p>
                          )}

                          {couple.profile?.bio && (
                            <p className="text-gray-700 mt-3 line-clamp-2">{couple.profile.bio}</p>
                          )}

                          {couple.profile?.interests && couple.profile.interests.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {couple.profile.interests.slice(0, 5).map((interest, index) => (
                                <span
                                  key={index}
                                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs"
                                >
                                  {interest}
                                </span>
                              ))}
                              {couple.profile.interests.length > 5 && (
                                <span className="text-gray-500 text-xs px-3 py-1">
                                  +{couple.profile.interests.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((page) => {
                      const current = pagination.page;
                      return page === 1 || page === pagination.pages || (page >= current - 1 && page <= current + 1);
                    })
                    .map((page, index, array) => (
                      <>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span key={`ellipsis-${page}`} className="px-2 py-2">
                            ...
                          </span>
                        )}
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            pagination.page === page
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                              : 'bg-white/90 backdrop-blur-sm shadow hover:shadow-md'
                          }`}
                        >
                          {page}
                        </button>
                      </>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}