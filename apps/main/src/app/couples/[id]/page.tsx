'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface CoupleProfile {
  _id: string;
  email: string;
  accountStatus: string;
  profile?: {
    coupleName?: string;
    partner1Name?: string;
    partner2Name?: string;
    partner1Age?: number;
    partner2Age?: number;
    partner1Gender?: string;
    partner2Gender?: string;
    partner1Height?: string;
    partner2Height?: string;
    partner1BodyType?: string;
    partner2BodyType?: string;
    partner1Ethnicity?: string;
    partner2Ethnicity?: string;
    profilePicture?: string;
    coverPhoto?: string;
    city?: string;
    state?: string;
    country?: string;
    location?: string;
    bio?: string;
    interests?: string[];
    hobbies?: string[];
    relationshipStatus?: string;
    relationshipStartDate?: string;
    anniversaryDate?: string;
    lifestyleType?: string;
    experienceLevel?: string;
    seekingGender?: string;
    seekingAgeRange?: {
      min?: number;
      max?: number;
    };
    seekingBodyTypes?: string[];
    kinks?: string[];
    fantasies?: string;
    whatWeEnjoy?: string;
    turnOns?: string[];
    turnOffs?: string[];
    meetingPreference?: string;
    willingToTravel?: boolean;
    canHost?: boolean;
    verified?: boolean;
    lookingFor?: string;
    socialLinks?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
}

export default function CoupleProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const coupleId = params?.id as string;

  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Middleware already protects this route, so just fetch data when ready
    if (status === 'authenticated' && coupleId) {
      fetchCoupleProfile();
    }
  }, [status, coupleId]);

  const fetchCoupleProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/couples/${coupleId}`);
      if (response.ok) {
        const data = await response.json();
        setCouple(data.couple);
      } else {
        setError('Failed to load couple profile');
      }
    } catch (err) {
      setError('Error loading couple profile');
      console.error('Error fetching couple:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !couple) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Couple not found'}</p>
            <Link
              href="/search-couples"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/search-couples"
          className="text-pink-600 hover:text-pink-700 flex items-center gap-2 mb-6"
        >
          <span>←</span> Back to Search
        </Link>

        {/* Cover Photo */}
        {couple.profile?.coverPhoto && (
          <div className="w-full h-64 rounded-xl overflow-hidden mb-6">
            <img
              src={couple.profile.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                {couple.profile?.profilePicture ? (
                  <img
                    src={couple.profile.profilePicture}
                    alt={couple.profile?.coupleName || 'Couple'}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {couple.profile?.coupleName?.[0] || 'C'}
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                  {couple.profile?.coupleName || 'Couple'}
                  {couple.profile?.verified && (
                    <span className="text-blue-500 text-xl" title="Verified">
                      ✓
                    </span>
                  )}
                </h1>
                {couple.profile?.partner1Name && couple.profile?.partner2Name && (
                  <p className="text-gray-600 mt-1">
                    {couple.profile.partner1Name} & {couple.profile.partner2Name}
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 text-sm">
                {couple.profile?.city && couple.profile?.state && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">📍</span>
                    <span className="text-gray-700">
                      {couple.profile.city}, {couple.profile.state}
                      {couple.profile.country && `, ${couple.profile.country}`}
                    </span>
                  </div>
                )}

                {(couple.profile?.partner1Age || couple.profile?.partner2Age) && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">👥</span>
                    <span className="text-gray-700">
                      Ages: {couple.profile.partner1Age || '?'} & {couple.profile.partner2Age || '?'}
                    </span>
                  </div>
                )}

                {couple.profile?.relationshipStatus && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">💕</span>
                    <span className="text-gray-700">
                      {couple.profile.relationshipStatus.replace(/-/g, ' ')}
                    </span>
                  </div>
                )}

                {couple.profile?.lifestyleType && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">🎭</span>
                    <span className="text-gray-700">
                      {couple.profile.lifestyleType.replace(/-/g, ' ')}
                    </span>
                  </div>
                )}

                {couple.profile?.experienceLevel && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">⭐</span>
                    <span className="text-gray-700 capitalize">
                      {couple.profile.experienceLevel}
                    </span>
                  </div>
                )}

                {couple.profile?.lookingFor && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">🔍</span>
                    <span className="text-gray-700 capitalize">
                      Looking for: {couple.profile.lookingFor.replace(/-/g, ' ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <button className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium">
                Send Message
              </button>

              {/* Social Links */}
              {couple.profile?.socialLinks && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 mb-3">Social Links</h3>
                  <div className="space-y-2">
                    {couple.profile.socialLinks.instagram && (
                      <a
                        href={couple.profile.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                      >
                        📷 Instagram
                      </a>
                    )}
                    {couple.profile.socialLinks.facebook && (
                      <a
                        href={couple.profile.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        📘 Facebook
                      </a>
                    )}
                    {couple.profile.socialLinks.twitter && (
                      <a
                        href={couple.profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
                      >
                        🐦 Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Us */}
            {couple.profile?.bio && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
                <p className="text-gray-700 whitespace-pre-line">{couple.profile.bio}</p>
              </div>
            )}

            {/* Partner Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Partner Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Partner 1 */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {couple.profile?.partner1Name || 'Partner 1'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {couple.profile?.partner1Age && (
                      <p className="text-gray-700">Age: {couple.profile.partner1Age}</p>
                    )}
                    {couple.profile?.partner1Gender && (
                      <p className="text-gray-700 capitalize">Gender: {couple.profile.partner1Gender}</p>
                    )}
                    {couple.profile?.partner1Height && (
                      <p className="text-gray-700">Height: {couple.profile.partner1Height}</p>
                    )}
                    {couple.profile?.partner1BodyType && (
                      <p className="text-gray-700 capitalize">Body Type: {couple.profile.partner1BodyType}</p>
                    )}
                    {couple.profile?.partner1Ethnicity && (
                      <p className="text-gray-700">Ethnicity: {couple.profile.partner1Ethnicity}</p>
                    )}
                  </div>
                </div>

                {/* Partner 2 */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {couple.profile?.partner2Name || 'Partner 2'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {couple.profile?.partner2Age && (
                      <p className="text-gray-700">Age: {couple.profile.partner2Age}</p>
                    )}
                    {couple.profile?.partner2Gender && (
                      <p className="text-gray-700 capitalize">Gender: {couple.profile.partner2Gender}</p>
                    )}
                    {couple.profile?.partner2Height && (
                      <p className="text-gray-700">Height: {couple.profile.partner2Height}</p>
                    )}
                    {couple.profile?.partner2BodyType && (
                      <p className="text-gray-700 capitalize">Body Type: {couple.profile.partner2BodyType}</p>
                    )}
                    {couple.profile?.partner2Ethnicity && (
                      <p className="text-gray-700">Ethnicity: {couple.profile.partner2Ethnicity}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* What We're Looking For */}
            {couple.profile?.seekingGender && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What We&apos;re Looking For</h2>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-medium">Seeking:</span>{' '}
                    <span className="capitalize">{couple.profile.seekingGender}</span>
                  </p>
                  {couple.profile.seekingAgeRange?.min && couple.profile.seekingAgeRange?.max && (
                    <p className="text-gray-700">
                      <span className="font-medium">Age Range:</span>{' '}
                      {couple.profile.seekingAgeRange.min} - {couple.profile.seekingAgeRange.max}
                    </p>
                  )}
                  {couple.profile.seekingBodyTypes && couple.profile.seekingBodyTypes.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Body Types:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {couple.profile.seekingBodyTypes.map((type, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm capitalize"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interests & Hobbies */}
            {(couple.profile?.interests && couple.profile.interests.length > 0) ||
            (couple.profile?.hobbies && couple.profile.hobbies.length > 0) ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Interests & Hobbies</h2>
                <div className="space-y-4">
                  {couple.profile.interests && couple.profile.interests.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {couple.profile.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {couple.profile.hobbies && couple.profile.hobbies.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Hobbies</h3>
                      <div className="flex flex-wrap gap-2">
                        {couple.profile.hobbies.map((hobby, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                          >
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* What We Enjoy */}
            {couple.profile?.whatWeEnjoy && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What We Enjoy</h2>
                <p className="text-gray-700 whitespace-pre-line">{couple.profile.whatWeEnjoy}</p>
              </div>
            )}

            {/* Kinks & Interests */}
            {couple.profile?.kinks && couple.profile.kinks.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Lifestyle Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {couple.profile.kinks.map((kink, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                    >
                      {kink}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Turn Ons & Turn Offs */}
            {((couple.profile?.turnOns && couple.profile.turnOns.length > 0) ||
              (couple.profile?.turnOffs && couple.profile.turnOffs.length > 0)) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {couple.profile.turnOns && couple.profile.turnOns.length > 0 && (
                    <div>
                      <h3 className="font-medium text-green-700 mb-2">Turn Ons</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {couple.profile.turnOns.map((item, index) => (
                          <li key={index} className="text-gray-700 text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {couple.profile.turnOffs && couple.profile.turnOffs.length > 0 && (
                    <div>
                      <h3 className="font-medium text-red-700 mb-2">Turn Offs</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {couple.profile.turnOffs.map((item, index) => (
                          <li key={index} className="text-gray-700 text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Meeting Preferences */}
            {(couple.profile?.meetingPreference ||
              couple.profile?.willingToTravel !== undefined ||
              couple.profile?.canHost !== undefined) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Meeting Preferences</h2>
                <div className="space-y-2 text-gray-700">
                  {couple.profile.meetingPreference && (
                    <p>
                      <span className="font-medium">Preference:</span>{' '}
                      <span className="capitalize">{couple.profile.meetingPreference.replace(/-/g, ' ')}</span>
                    </p>
                  )}
                  {couple.profile.willingToTravel !== undefined && (
                    <p>
                      <span className="font-medium">Willing to Travel:</span>{' '}
                      {couple.profile.willingToTravel ? 'Yes' : 'No'}
                    </p>
                  )}
                  {couple.profile.canHost !== undefined && (
                    <p>
                      <span className="font-medium">Can Host:</span>{' '}
                      {couple.profile.canHost ? 'Yes' : 'No'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}