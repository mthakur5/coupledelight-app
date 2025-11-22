export const runtime = 'nodejs';

import dbConnect from '@/lib/db';
import Couple from '@/models/Couple';
import Event from '@/models/Event';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CoupleActions from '@/components/CoupleActions';

interface CoupleDetailData {
  _id: string;
  user1Email: string;
  user2Email: string;
  user1Id: string;
  user2Id: string;
  relationshipStartDate: string;
  anniversaryDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  relationshipDays: number;
  
  // Basic Profile
  coupleName?: string;
  displayName?: string;
  location?: string;
  city?: string;
  state?: string;
  bio?: string;
  
  // Partner Details
  partner1?: {
    name?: string;
    age?: number;
    height?: string;
    weight?: string;
    bodyType?: string;
    ethnicity?: string;
    hairColor?: string;
    eyeColor?: string;
    occupation?: string;
  };
  partner2?: {
    name?: string;
    age?: number;
    height?: string;
    weight?: string;
    bodyType?: string;
    ethnicity?: string;
    hairColor?: string;
    eyeColor?: string;
    occupation?: string;
  };
  
  // Lifestyle Preferences
  lifestyleType?: string[];
  experienceLevel?: string;
  openToMeet?: string[];
  
  // What They're Seeking
  seekingDescription?: string;
  ageRangePreference?: {
    min?: number;
    max?: number;
  };
  
  // Boundaries & Preferences
  boundaries?: string;
  interests?: string[];
  kinks?: string[];
  softLimits?: string[];
  hardLimits?: string[];
  
  // Safety & Health
  stdTestingStatus?: string;
  stdTestDate?: string;
  condomPreference?: string;
  vaccinated?: boolean;
  
  // Availability & Logistics
  travelWillingness?: string;
  hostingCapability?: string;
  meetingFrequency?: string;
  availableDays?: string[];
  availableTime?: string;
  
  // Privacy & Verification
  privacyLevel?: string;
  facePhotosPublic?: boolean;
  verified?: boolean;
  verificationDate?: string;
  verificationMethod?: string;
  socialMediaVerified?: boolean;
  
  // Communication Preferences
  preferredContact?: string[];
  responseTime?: string;
  communicationStyle?: string;
  
  // Photos & Media
  profilePhotoUrl?: string;
  photoGallery?: string[];
  photoCount?: number;
  hasPrivatePhotos?: boolean;
  
  // Additional Info
  relationshipType?: string;
  languages?: string[];
  smoker?: boolean;
  drinker?: string;
  drugs?: string;
  
  // Profile Stats
  profileCompleteness?: number;
  lastActive?: string;
  profileViews?: number;
  
  events: Array<{
    _id: string;
    title: string;
    date: string;
    status: string;
  }>;
  eventCount: number;
}

async function getCoupleById(id: string): Promise<CoupleDetailData | null> {
  await dbConnect();
  
  const couple = await Couple.findById(id)
    .populate('user1Id', 'email')
    .populate('user2Id', 'email')
    .lean();

  if (!couple) {
    return null;
  }

  // Get couple's events
  const events = await Event.find({ coupleId: id })
    .sort({ date: -1 })
    .limit(10)
    .lean();

  const eventCount = await Event.countDocuments({ coupleId: id });

  const now = new Date();
  const relationshipStartDate = new Date(couple.relationshipStartDate);
  const relationshipDays = Math.floor((now.getTime() - relationshipStartDate.getTime()) / (1000 * 60 * 60 * 24));

  const user1 = couple.user1Id as { _id?: unknown; email?: string } | undefined;
  const user2 = couple.user2Id as { _id?: unknown; email?: string } | undefined;

  return {
    _id: String(couple._id),
    user1Email: user1?.email || 'Unknown',
    user2Email: user2?.email || 'Unknown',
    user1Id: String(user1?._id || ''),
    user2Id: String(user2?._id || ''),
    relationshipStartDate: couple.relationshipStartDate.toISOString(),
    anniversaryDate: couple.anniversaryDate?.toISOString(),
    status: couple.status,
    createdAt: couple.createdAt.toISOString(),
    updatedAt: couple.updatedAt.toISOString(),
    relationshipDays,
    
    // Basic Profile
    coupleName: couple.coupleName,
    displayName: couple.displayName,
    location: couple.location,
    city: couple.city,
    state: couple.state,
    bio: couple.bio,
    
    // Partner Details
    partner1: couple.partner1,
    partner2: couple.partner2,
    
    // Lifestyle Preferences
    lifestyleType: couple.lifestyleType,
    experienceLevel: couple.experienceLevel,
    openToMeet: couple.openToMeet,
    
    // What They're Seeking
    seekingDescription: couple.seekingDescription,
    ageRangePreference: couple.ageRangePreference,
    
    // Boundaries & Preferences
    boundaries: couple.boundaries,
    interests: couple.interests,
    kinks: couple.kinks,
    softLimits: couple.softLimits,
    hardLimits: couple.hardLimits,
    
    // Safety & Health
    stdTestingStatus: couple.stdTestingStatus,
    stdTestDate: couple.stdTestDate?.toISOString(),
    condomPreference: couple.condomPreference,
    vaccinated: couple.vaccinated,
    
    // Availability & Logistics
    travelWillingness: couple.travelWillingness,
    hostingCapability: couple.hostingCapability,
    meetingFrequency: couple.meetingFrequency,
    availableDays: couple.availableDays,
    availableTime: couple.availableTime,
    
    // Privacy & Verification
    privacyLevel: couple.privacyLevel,
    facePhotosPublic: couple.facePhotosPublic,
    verified: couple.verified,
    verificationDate: couple.verificationDate?.toISOString(),
    verificationMethod: couple.verificationMethod,
    socialMediaVerified: couple.socialMediaVerified,
    
    // Communication Preferences
    preferredContact: couple.preferredContact,
    responseTime: couple.responseTime,
    communicationStyle: couple.communicationStyle,
    
    // Photos & Media
    profilePhotoUrl: couple.profilePhotoUrl,
    photoGallery: couple.photoGallery,
    photoCount: couple.photoCount,
    hasPrivatePhotos: couple.hasPrivatePhotos,
    
    // Additional Info
    relationshipType: couple.relationshipType,
    languages: couple.languages,
    smoker: couple.smoker,
    drinker: couple.drinker,
    drugs: couple.drugs,
    
    // Profile Stats
    profileCompleteness: couple.profileCompleteness,
    lastActive: couple.lastActive?.toISOString(),
    profileViews: couple.profileViews,
    
    events: events.map((event: { _id: unknown; title: string; date: Date; status: string }) => ({
      _id: String(event._id),
      title: event.title,
      date: event.date.toISOString(),
      status: event.status,
    })),
    eventCount,
  };
}

export default async function CoupleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const couple = await getCoupleById(id);

  if (!couple) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="hover:text-pink-600">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/couples" className="hover:text-pink-600">Couples</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {couple.coupleName || couple.displayName || 'Couple Profile'}
        </span>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-3xl relative">
              {couple.coupleName?.charAt(0).toUpperCase() || couple.user1Email.charAt(0).toUpperCase()}
              {couple.verified && (
                <span className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-xs">✓</span>
              )}
              {couple.status === 'active' && !couple.verified && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {couple.coupleName || couple.displayName || `${couple.user1Email.split('@')[0]} & ${couple.user2Email.split('@')[0]}`}
              </h1>
              <p className="mt-1 opacity-90">
                {couple.partner1?.name && couple.partner2?.name 
                  ? `${couple.partner1.name} & ${couple.partner2.name}`
                  : `${couple.user1Email} & ${couple.user2Email}`
                }
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  couple.status === 'active'
                    ? 'bg-green-500/20 text-white border border-white/30'
                    : couple.status === 'pending'
                    ? 'bg-yellow-500/20 text-white border border-white/30'
                    : 'bg-gray-500/20 text-white border border-white/30'
                }`}>
                  {couple.status.toUpperCase()}
                </span>
                {couple.location && (
                  <span className="text-sm opacity-90">📍 {couple.location}</span>
                )}
                {couple.profileCompleteness && (
                  <span className="text-sm opacity-90">📊 {couple.profileCompleteness}% Complete</span>
                )}
              </div>
            </div>
          </div>
          <CoupleActions couple={{
            _id: couple._id,
            coupleName: couple.coupleName,
            displayName: couple.displayName,
            location: couple.location,
            city: couple.city,
            state: couple.state,
            bio: couple.bio,
            status: couple.status,
            relationshipStartDate: couple.relationshipStartDate,
            anniversaryDate: couple.anniversaryDate,
            partner1: couple.partner1,
            partner2: couple.partner2,
          }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bio Section */}
          {couple.bio && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>✍️</span> About Us
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{couple.bio}</p>
            </div>
          )}

          {/* Partner Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span>👫</span> Partner Details
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Partner 1 */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  👤 Partner 1
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{couple.partner1?.name || 'Not set'}</span></div>
                  <div><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-900">{couple.user1Email}</span></div>
                  {couple.partner1?.age && <div><span className="font-medium text-gray-600">Age:</span> <span className="text-gray-900">{couple.partner1.age} years</span></div>}
                  {couple.partner1?.height && <div><span className="font-medium text-gray-600">Height:</span> <span className="text-gray-900">{couple.partner1.height}</span></div>}
                  {couple.partner1?.weight && <div><span className="font-medium text-gray-600">Weight:</span> <span className="text-gray-900">{couple.partner1.weight}</span></div>}
                  {couple.partner1?.bodyType && <div><span className="font-medium text-gray-600">Body Type:</span> <span className="text-gray-900">{couple.partner1.bodyType}</span></div>}
                  {couple.partner1?.ethnicity && <div><span className="font-medium text-gray-600">Ethnicity:</span> <span className="text-gray-900">{couple.partner1.ethnicity}</span></div>}
                  {couple.partner1?.hairColor && <div><span className="font-medium text-gray-600">Hair:</span> <span className="text-gray-900">{couple.partner1.hairColor}</span></div>}
                  {couple.partner1?.eyeColor && <div><span className="font-medium text-gray-600">Eyes:</span> <span className="text-gray-900">{couple.partner1.eyeColor}</span></div>}
                  {couple.partner1?.occupation && <div><span className="font-medium text-gray-600">Occupation:</span> <span className="text-gray-900">{couple.partner1.occupation}</span></div>}
                </div>
              </div>

              {/* Partner 2 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  👤 Partner 2
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{couple.partner2?.name || 'Not set'}</span></div>
                  <div><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-900">{couple.user2Email}</span></div>
                  {couple.partner2?.age && <div><span className="font-medium text-gray-600">Age:</span> <span className="text-gray-900">{couple.partner2.age} years</span></div>}
                  {couple.partner2?.height && <div><span className="font-medium text-gray-600">Height:</span> <span className="text-gray-900">{couple.partner2.height}</span></div>}
                  {couple.partner2?.weight && <div><span className="font-medium text-gray-600">Weight:</span> <span className="text-gray-900">{couple.partner2.weight}</span></div>}
                  {couple.partner2?.bodyType && <div><span className="font-medium text-gray-600">Body Type:</span> <span className="text-gray-900">{couple.partner2.bodyType}</span></div>}
                  {couple.partner2?.ethnicity && <div><span className="font-medium text-gray-600">Ethnicity:</span> <span className="text-gray-900">{couple.partner2.ethnicity}</span></div>}
                  {couple.partner2?.hairColor && <div><span className="font-medium text-gray-600">Hair:</span> <span className="text-gray-900">{couple.partner2.hairColor}</span></div>}
                  {couple.partner2?.eyeColor && <div><span className="font-medium text-gray-600">Eyes:</span> <span className="text-gray-900">{couple.partner2.eyeColor}</span></div>}
                  {couple.partner2?.occupation && <div><span className="font-medium text-gray-600">Occupation:</span> <span className="text-gray-900">{couple.partner2.occupation}</span></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Lifestyle Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>💕</span> Lifestyle Preferences
            </h2>
            
            <div className="space-y-4">
              {couple.lifestyleType && couple.lifestyleType.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Lifestyle Type</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {couple.lifestyleType.map((type, idx) => (
                      <span key={idx} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                        {type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {couple.experienceLevel && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience Level</label>
                  <p className="text-gray-900 mt-1 capitalize">{couple.experienceLevel.replace(/_/g, ' ')}</p>
                </div>
              )}
              
              {couple.openToMeet && couple.openToMeet.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Open to Meet</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {couple.openToMeet.map((type, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* What They're Seeking */}
          {(couple.seekingDescription || couple.ageRangePreference) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔍</span> What They&apos;re Seeking
              </h2>
              
              <div className="space-y-4">
                {couple.seekingDescription && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900 mt-1 leading-relaxed whitespace-pre-line">{couple.seekingDescription}</p>
                  </div>
                )}
                
                {couple.ageRangePreference && (couple.ageRangePreference.min || couple.ageRangePreference.max) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age Range Preference</label>
                    <p className="text-gray-900 mt-1">
                      {couple.ageRangePreference.min || 'Any'} - {couple.ageRangePreference.max || 'Any'} years
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Boundaries & Preferences */}
          {(couple.boundaries || couple.interests || couple.kinks || couple.softLimits || couple.hardLimits) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🛡️</span> Boundaries & Preferences
              </h2>
              
              <div className="space-y-4">
                {couple.boundaries && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Boundaries</label>
                    <p className="text-gray-900 mt-1 leading-relaxed whitespace-pre-line">{couple.boundaries}</p>
                  </div>
                )}
                
                {couple.interests && couple.interests.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Interests</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {couple.interests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {couple.kinks && couple.kinks.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Kinks & Turn-ons</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {couple.kinks.map((kink, idx) => (
                        <span key={idx} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          {kink}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {couple.softLimits && couple.softLimits.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Soft Limits</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {couple.softLimits.map((limit, idx) => (
                        <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          {limit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {couple.hardLimits && couple.hardLimits.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hard Limits (No-Go)</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {couple.hardLimits.map((limit, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {limit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Safety & Health */}
          {(couple.stdTestingStatus || couple.condomPreference || couple.vaccinated !== undefined) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🏥</span> Safety & Health
              </h2>
              
              <div className="space-y-3">
                {couple.stdTestingStatus && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">STD Testing Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      couple.stdTestingStatus === 'recent' ? 'bg-green-100 text-green-700' :
                      couple.stdTestingStatus === 'willing' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {couple.stdTestingStatus.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                )}
                
                {couple.stdTestDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last STD Test</span>
                    <span className="text-sm text-gray-900">
                      {new Date(couple.stdTestDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                
                {couple.condomPreference && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Condom Preference</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.condomPreference.replace(/_/g, ' ')}</span>
                  </div>
                )}
                
                {couple.vaccinated !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">COVID Vaccinated</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      couple.vaccinated ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {couple.vaccinated ? 'YES' : 'NO'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Availability & Logistics */}
          {(couple.travelWillingness || couple.hostingCapability || couple.meetingFrequency || couple.availableDays || couple.availableTime) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📅</span> Availability & Logistics
              </h2>
              
              <div className="space-y-3">
                {couple.travelWillingness && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Travel Willingness</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.travelWillingness.replace(/_/g, ' ')}</span>
                  </div>
                )}
                
                {couple.hostingCapability && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hosting Capability</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.hostingCapability.replace(/_/g, ' ')}</span>
                  </div>
                )}
                
                {couple.meetingFrequency && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Meeting Frequency</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.meetingFrequency}</span>
                  </div>
                )}
                
                {couple.availableTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Available Time</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.availableTime}</span>
                  </div>
                )}
                
                {couple.availableDays && couple.availableDays.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Available Days</label>
                    <div className="flex flex-wrap gap-2">
                      {couple.availableDays.map((day, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm capitalize">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Communication Preferences */}
          {(couple.preferredContact || couple.responseTime || couple.communicationStyle) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>💬</span> Communication Preferences
              </h2>
              
              <div className="space-y-3">
                {couple.preferredContact && couple.preferredContact.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Preferred Contact Methods</label>
                    <div className="flex flex-wrap gap-2">
                      {couple.preferredContact.map((method, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm capitalize">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {couple.responseTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.responseTime.replace(/_/g, ' ')}</span>
                  </div>
                )}
                
                {couple.communicationStyle && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communication Style</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.communicationStyle}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(couple.relationshipType || couple.languages || couple.smoker !== undefined || couple.drinker || couple.drugs) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>ℹ️</span> Additional Information
              </h2>
              
              <div className="space-y-3">
                {couple.relationshipType && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Relationship Type</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.relationshipType}</span>
                  </div>
                )}
                
                {couple.languages && couple.languages.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Languages</label>
                    <div className="flex flex-wrap gap-2">
                      {couple.languages.map((lang, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {couple.smoker !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Smoker</span>
                    <span className="text-sm text-gray-900">{couple.smoker ? 'Yes' : 'No'}</span>
                  </div>
                )}
                
                {couple.drinker && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Drinker</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.drinker}</span>
                  </div>
                )}
                
                {couple.drugs && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Drugs</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.drugs.replace(/_/g, ' ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>🎉</span> Recent Events
              </span>
              <span className="text-sm font-normal text-gray-600">
                {couple.eventCount} total events
              </span>
            </h2>
            
            {couple.events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events yet
              </div>
            ) : (
              <div className="space-y-3">
                {couple.events.map((event) => (
                  <div key={event._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="text-2xl">🎊</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800'
                        : event.status === 'ongoing'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Relationship Duration</p>
                <p className="text-2xl font-bold text-pink-600">
                  {couple.relationshipDays} days
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Since {new Date(couple.relationshipStartDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              
              {couple.profileCompleteness !== undefined && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Profile Completeness</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all"
                      style={{ width: `${couple.profileCompleteness}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{couple.profileCompleteness}%</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Events Attended</p>
                <p className="text-2xl font-bold text-purple-600">{couple.eventCount}</p>
              </div>

              {couple.profileViews !== undefined && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Profile Views</p>
                  <p className="text-2xl font-bold text-blue-600">{couple.profileViews}</p>
                </div>
              )}

              {couple.anniversaryDate && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Anniversary</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(couple.anniversaryDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {couple.lastActive && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Last Active</p>
                  <p className="text-sm text-gray-900">
                    {new Date(couple.lastActive).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          {(couple.verified || couple.verificationMethod || couple.socialMediaVerified) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>✓</span> Verification
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Verified</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    couple.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {couple.verified ? 'VERIFIED' : 'NOT VERIFIED'}
                  </span>
                </div>
                
                {couple.verificationDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verified On</span>
                    <span className="text-sm text-gray-900">
                      {new Date(couple.verificationDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                
                {couple.verificationMethod && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Method</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.verificationMethod.replace(/_/g, ' ')}</span>
                  </div>
                )}
                
                {couple.socialMediaVerified !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Social Media</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      couple.socialMediaVerified ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {couple.socialMediaVerified ? 'VERIFIED' : 'NOT VERIFIED'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {(couple.privacyLevel || couple.facePhotosPublic !== undefined) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔒</span> Privacy
              </h2>
              <div className="space-y-3">
                {couple.privacyLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Privacy Level</span>
                    <span className="text-sm text-gray-900 capitalize">{couple.privacyLevel.replace(/_/g, ' ')}</span>
                  </div>
                )}
                
                {couple.facePhotosPublic !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Face Photos Public</span>
                    <span className="text-sm text-gray-900">{couple.facePhotosPublic ? 'Yes' : 'No'}</span>
                  </div>
                )}
                
                {couple.photoCount !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Photos</span>
                    <span className="text-sm text-gray-900">{couple.photoCount}</span>
                  </div>
                )}
                
                {couple.hasPrivatePhotos !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Private Photos</span>
                    <span className="text-sm text-gray-900">{couple.hasPrivatePhotos ? 'Yes' : 'No'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
            <div className="space-y-2">
              <Link 
                href={`/dashboard/users/${couple.user1Id}`}
                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 block"
              >
                <span>👤</span> View Partner 1 Profile
              </Link>
              <Link 
                href={`/dashboard/users/${couple.user2Id}`}
                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 block"
              >
                <span>👤</span> View Partner 2 Profile
              </Link>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                <span>✏️</span> Edit Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                <span>✓</span> {couple.verified ? 'Unverify' : 'Verify'} Couple
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                <span>📧</span> Send Email
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                <span>🔔</span> Send Notification
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors flex items-center gap-2">
                <span>⏸️</span> Change Status
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                <span>🗑️</span> Delete Couple
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">📝</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Last Profile Update</p>
                  <p className="text-xs text-gray-500">
                    {new Date(couple.updatedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">💑</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Couple Created</p>
                  <p className="text-xs text-gray-500">
                    {new Date(couple.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}