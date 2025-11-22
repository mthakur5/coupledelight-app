'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileEditForm from '@/components/ProfileEditForm';

interface UserProfile {
  email: string;
  role: string;
  emailVerified: boolean;
  accountStatus: string;
  profile?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (data: unknown) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      setUser(result.user);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw new Error('Failed to save profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  const profile = user.profile || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <nav className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CoupleDelight
                </h1>
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/events" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Events
                </Link>
                <Link href="/shop" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Shop
                </Link>
                <Link href="/profile" className="text-purple-600 font-medium">
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm">{session?.user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {profile.coupleName || 'Your Profile'}
            </h1>
            <p className="text-gray-600 mt-2">
              {profile.lifestyleType ? `${String(profile.lifestyleType).charAt(0).toUpperCase() + String(profile.lifestyleType).slice(1)} Couple` : 'Complete your profile to get started'}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold shadow-lg transition-all"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <ProfileEditForm
              initialData={{ profile: user.profile, preferences: user.preferences }}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lifestyle Type Badge */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Lifestyle Type</p>
                  {profile.lifestyleType ? (
                    <>
                      <h2 className="text-3xl font-bold mt-1">
                        🔥 {String(profile.lifestyleType).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </h2>
                      {profile.experienceLevel && (
                        <p className="mt-2 text-sm opacity-90">
                          Experience: <span className="font-semibold">{String(profile.experienceLevel).charAt(0).toUpperCase() + String(profile.experienceLevel).slice(1)}</span>
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-lg mt-1 opacity-90">⚠️ Not set - Click Edit Profile to add</p>
                  )}
                </div>
                {Boolean(profile.verified) && (
                  <div className="bg-white text-green-600 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Partners Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md border-2 border-pink-200 p-6">
                <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
                  <span>👩</span> Partner 1
                </h3>
                {profile.partner1Name ? (
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Name:</strong> {String(profile.partner1Name)}</p>
                    {Boolean(profile.partner1Age) && <p><strong>Age:</strong> {String(profile.partner1Age)}</p>}
                    {Boolean(profile.partner1BodyType) && <p><strong>Body Type:</strong> {String(profile.partner1BodyType).charAt(0).toUpperCase() + String(profile.partner1BodyType).slice(1)}</p>}
                    {Boolean(profile.partner1Height) && <p><strong>Height:</strong> {String(profile.partner1Height)}</p>}
                    {Boolean(profile.partner1Ethnicity) && <p><strong>Ethnicity:</strong> {String(profile.partner1Ethnicity)}</p>}
                    {Boolean(profile.partner1Measurements) && <p><strong>Measurements:</strong> {String(profile.partner1Measurements)}</p>}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">Partner 1 information not filled - Click Edit to add</p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md border-2 border-blue-200 p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <span>👨</span> Partner 2
                </h3>
                {profile.partner2Name ? (
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Name:</strong> {String(profile.partner2Name)}</p>
                    {Boolean(profile.partner2Age) && <p><strong>Age:</strong> {String(profile.partner2Age)}</p>}
                    {Boolean(profile.partner2BodyType) && <p><strong>Body Type:</strong> {String(profile.partner2BodyType).charAt(0).toUpperCase() + String(profile.partner2BodyType).slice(1)}</p>}
                    {Boolean(profile.partner2Height) && <p><strong>Height:</strong> {String(profile.partner2Height)}</p>}
                    {Boolean(profile.partner2Ethnicity) && <p><strong>Ethnicity:</strong> {String(profile.partner2Ethnicity)}</p>}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">Partner 2 information not filled - Click Edit to add</p>
                )}
              </div>
            </div>

            {/* About Us */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💬 About Us</h3>
              {profile.bio ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{String(profile.bio)}</p>
              ) : (
                <p className="text-gray-900 font-medium">Bio not filled yet. Share your story!</p>
              )}
            </div>

            {/* What We're Seeking */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md border-2 border-purple-200 p-6">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">🎯 What We&apos;re Seeking</h3>
              {profile.seekingGender || profile.seekingAgeRange ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    {Boolean(profile.seekingGender) && (
                      <div>
                        <p className="font-semibold text-purple-700">Looking For:</p>
                        <p className="text-lg">{String(profile.seekingGender).charAt(0).toUpperCase() + String(profile.seekingGender).slice(1)}</p>
                      </div>
                    )}
                    {Boolean(profile.seekingAgeRange) && (
                      <div>
                        <p className="font-semibold text-purple-700">Age Range:</p>
                        <p className="text-lg">
                          {(profile.seekingAgeRange as { min?: number; max?: number }).min || 18} - {(profile.seekingAgeRange as { min?: number; max?: number }).max || 99} years
                        </p>
                      </div>
                    )}
                  </div>
                  {profile.seekingBodyTypes && Array.isArray(profile.seekingBodyTypes) && profile.seekingBodyTypes.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold text-purple-700 mb-2">Preferred Body Types:</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.seekingBodyTypes.map((type, index) => (
                          <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {String(type)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-900 font-medium">Seeking preferences not set. What are you looking for?</p>
              )}
            </div>

            {/* Interests & Kinks */}
            <div className="bg-white rounded-xl shadow-md border-2 border-pink-200 p-6">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">💋 Our Interests</h3>
              {profile.kinks && Array.isArray(profile.kinks) && profile.kinks.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.kinks.map((kink, index) => (
                    <span key={index} className="bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                      {String(kink)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-900 font-medium">No interests added yet. What turns you on?</p>
              )}
            </div>

            {/* Fantasies */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl shadow-md border-2 border-red-200 p-6">
              <h3 className="text-2xl font-bold text-red-700 mb-4">🔥 Our Fantasies</h3>
              {profile.fantasies ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{String(profile.fantasies)}</p>
              ) : (
                <p className="text-gray-900 font-medium">Share your fantasies and desires here...</p>
              )}
            </div>

            {/* Boundaries */}
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-300 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🛡️ Boundaries & Limits</h3>
              {profile.boundaries || (profile.hardLimits && Array.isArray(profile.hardLimits) && profile.hardLimits.length > 0) ? (
                <>
                  {profile.boundaries && (
                    <div className="mb-4">
                      <p className="font-semibold text-gray-700 mb-2">Our Boundaries:</p>
                      <p className="text-gray-600 leading-relaxed">{String(profile.boundaries)}</p>
                    </div>
                  )}
                  {profile.hardLimits && Array.isArray(profile.hardLimits) && profile.hardLimits.length > 0 && (
                    <div>
                      <p className="font-semibold text-red-600 mb-2">Hard Limits:</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.hardLimits.map((limit, index) => (
                          <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                            ❌ {String(limit)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-900 font-medium">Boundaries not set. Let others know your limits!</p>
              )}
            </div>

            {/* Meeting Preferences */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">📍 Meeting Preferences</h3>
              {profile.meetingPreference ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="font-semibold">Meeting Style:</p>
                    <p>{String(profile.meetingPreference).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                  </div>
                  {Boolean(profile.location) && (
                    <div>
                      <p className="font-semibold">Location:</p>
                      <p>{String(profile.location)}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">Can Host:</p>
                    <p>{profile.canHost ? '✅ Yes' : '❌ No'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Willing to Travel:</p>
                    <p>{profile.willingToTravel ? `✅ Yes ${profile.travelDistance ? `(up to ${profile.travelDistance} km)` : ''}` : '❌ No'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-900 font-medium">Meeting preferences not set - Click Edit to add</p>
              )}
            </div>

            {/* Verification & Safety */}
            <div className="bg-green-50 rounded-xl shadow-md border-2 border-green-200 p-6">
              <h3 className="text-2xl font-bold text-green-700 mb-4">✅ Verification & Safety</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Verified:</span>{' '}
                  {profile.verified ? '✅ Yes' : '⚠️ Not Yet'}
                </p>
                <p>
                  <span className="font-semibold">Willing to Verify:</span>{' '}
                  {profile.willingToVerify !== false ? '✅ Yes' : '❌ No'}
                </p>
                <p>
                  <span className="font-semibold">STD Tested:</span>{' '}
                  {profile.stdTested ? `✅ Yes ${profile.stdTestDate ? `(${new Date(String(profile.stdTestDate)).toLocaleDateString()})` : ''}` : '❌ No'}
                </p>
                {Boolean(profile.safetyPreferences) && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="font-semibold mb-2">Safety Requirements:</p>
                    <p className="text-gray-700">{String(profile.safetyPreferences)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Additional Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                <div>
                  <p className="font-semibold">Smoking:</p>
                  <p>{profile.smokingStatus ? String(profile.smokingStatus).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : <span className="text-gray-900">Not specified</span>}</p>
                </div>
                <div>
                  <p className="font-semibold">Drinking:</p>
                  <p>{profile.drinkingStatus ? String(profile.drinkingStatus).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : <span className="text-gray-900">Not specified</span>}</p>
                </div>
                <div>
                  <p className="font-semibold">Drugs:</p>
                  <p>{profile.drugsStatus ? (String(profile.drugsStatus) === 'no' ? 'No' : String(profile.drugsStatus).charAt(0).toUpperCase() + String(profile.drugsStatus).slice(1)) : <span className="text-gray-900">Not specified</span>}</p>
                </div>
              </div>
              {Boolean(profile.idealScenario) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-semibold mb-2">Ideal Scenario:</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{String(profile.idealScenario)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}