'use client';

import { useState } from 'react';

interface ProfileData {
  profile?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
}

interface ProfileEditFormProps {
  initialData: ProfileData;
  onSave: (data: ProfileData) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileEditForm({ initialData, onSave, onCancel }: ProfileEditFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        [field]: value,
      },
    });
  };

  const updateArrayField = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    updateProfile(field, items);
  };

  const getProfileValue = (field: string): unknown => {
    return formData.profile?.[field];
  };

  const getArrayValue = (field: string): string => {
    const value = getProfileValue(field);
    return Array.isArray(value) ? value.join(', ') : '';
  };

  const tabs = [
    { id: 'basic', label: '👥 Basic Info', emoji: '👥' },
    { id: 'lifestyle', label: '🔥 Lifestyle', emoji: '🔥' },
    { id: 'physical', label: '💪 Physical Stats', emoji: '💪' },
    { id: 'seeking', label: '🎯 What We Seek', emoji: '🎯' },
    { id: 'interests', label: '💋 Our Interests', emoji: '💋' },
    { id: 'boundaries', label: '🛡️ Boundaries', emoji: '🛡️' },
    { id: 'meeting', label: '📍 Meeting Prefs', emoji: '📍' },
    { id: 'safety', label: '✅ Safety', emoji: '✅' },
    { id: 'additional', label: '📝 Additional', emoji: '📝' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">👥 Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Couple Name / Username *
            </label>
            <input
              type="text"
              value={getProfileValue('coupleName') as string || ''}
              onChange={(e) => updateProfile('coupleName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., HotwifeCouple, CuckoldPair"
            />
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <h4 className="font-semibold text-pink-900 mb-3">Partner 1 (Usually Female/Hotwife)</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={getProfileValue('partner1Name') as string || ''}
                  onChange={(e) => updateProfile('partner1Name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Her name or nickname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  min="18"
                  value={getProfileValue('partner1Age') as number || ''}
                  onChange={(e) => updateProfile('partner1Age', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={getProfileValue('partner1Gender') as string || ''}
                  onChange={(e) => updateProfile('partner1Gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Partner 2 (Usually Male/Cuckold)</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={getProfileValue('partner2Name') as string || ''}
                  onChange={(e) => updateProfile('partner2Name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="His name or nickname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  min="18"
                  value={getProfileValue('partner2Age') as number || ''}
                  onChange={(e) => updateProfile('partner2Age', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={getProfileValue('partner2Gender') as string || ''}
                  onChange={(e) => updateProfile('partner2Gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location (City/State)</label>
            <input
              type="text"
              value={getProfileValue('location') as string || ''}
              onChange={(e) => updateProfile('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Mumbai, Delhi NCR"
            />
          </div>
        </div>
      )}

      {/* Lifestyle Tab */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">🔥 Lifestyle & Experience</h3>
          
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              What Best Describes Your Lifestyle? *
            </label>
            <select
              value={getProfileValue('lifestyleType') as string || ''}
              onChange={(e) => updateProfile('lifestyleType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg font-medium"
            >
              <option value="">Select Your Lifestyle</option>
              <option value="cuckold">🎭 Cuckold Couple</option>
              <option value="hotwife">🔥 Hotwife/Stag</option>
              <option value="stag-vixen">💑 Stag & Vixen</option>
              <option value="swinger">💫 Swingers</option>
              <option value="open-relationship">💕 Open Relationship</option>
              <option value="polyamorous">🌈 Polyamorous</option>
              <option value="exploring">🔍 Just Exploring</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level *
            </label>
            <select
              value={getProfileValue('experienceLevel') as string || ''}
              onChange={(e) => updateProfile('experienceLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select Experience</option>
              <option value="newbie">🌱 Newbie (Just Starting)</option>
              <option value="curious">🤔 Curious (Exploring the idea)</option>
              <option value="experienced">⭐ Experienced (Active in lifestyle)</option>
              <option value="veteran">👑 Veteran (Years of experience)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Us (Bio) - Tell your story!
            </label>
            <textarea
              value={getProfileValue('bio') as string || ''}
              onChange={(e) => updateProfile('bio', e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Share your journey into the lifestyle, what excites you both, what you're looking for..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {((getProfileValue('bio') as string) || '').length}/1000 characters
            </p>
          </div>
        </div>
      )}

      {/* Physical Attributes Tab */}
      {activeTab === 'physical' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">💪 Physical Attributes</h3>
          <p className="text-sm text-gray-600">Physical details help others know what to expect</p>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <h4 className="font-semibold text-pink-900 mb-3">Partner 1 Physical Stats</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  type="text"
                  value={getProfileValue('partner1Height') as string || ''}
                  onChange={(e) => updateProfile('partner1Height', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., 5'6&quot;, 165cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  value={getProfileValue('partner1Weight') as string || ''}
                  onChange={(e) => updateProfile('partner1Weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., 120 lbs, 55 kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                <select
                  value={getProfileValue('partner1BodyType') as string || ''}
                  onChange={(e) => updateProfile('partner1BodyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select</option>
                  <option value="slim">Slim</option>
                  <option value="athletic">Athletic</option>
                  <option value="average">Average</option>
                  <option value="curvy">Curvy</option>
                  <option value="plus-size">Plus Size</option>
                  <option value="muscular">Muscular</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Measurements (Optional)</label>
                <input
                  type="text"
                  value={getProfileValue('partner1Measurements') as string || ''}
                  onChange={(e) => updateProfile('partner1Measurements', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., 34-26-36"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                <input
                  type="text"
                  value={getProfileValue('partner1Ethnicity') as string || ''}
                  onChange={(e) => updateProfile('partner1Ethnicity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., Indian, Mixed, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hair Color</label>
                <input
                  type="text"
                  value={getProfileValue('partner1HairColor') as string || ''}
                  onChange={(e) => updateProfile('partner1HairColor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., Black, Brown"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Partner 2 Physical Stats</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  type="text"
                  value={getProfileValue('partner2Height') as string || ''}
                  onChange={(e) => updateProfile('partner2Height', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., 5'10&quot;, 178cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  value={getProfileValue('partner2Weight') as string || ''}
                  onChange={(e) => updateProfile('partner2Weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., 170 lbs, 75 kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                <select
                  value={getProfileValue('partner2BodyType') as string || ''}
                  onChange={(e) => updateProfile('partner2BodyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select</option>
                  <option value="slim">Slim</option>
                  <option value="athletic">Athletic</option>
                  <option value="average">Average</option>
                  <option value="dad-bod">Dad Bod</option>
                  <option value="stocky">Stocky</option>
                  <option value="muscular">Muscular</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                <input
                  type="text"
                  value={getProfileValue('partner2Ethnicity') as string || ''}
                  onChange={(e) => updateProfile('partner2Ethnicity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g., Indian, Mixed, etc."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What We're Seeking Tab */}
      {activeTab === 'seeking' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">🎯 What We&apos;re Seeking</h3>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Looking For (Gender) *
            </label>
            <select
              value={getProfileValue('seekingGender') as string || ''}
              onChange={(e) => updateProfile('seekingGender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
            >
              <option value="">Select</option>
              <option value="male">🚹 Male (Bull/Playmate)</option>
              <option value="female">🚺 Female</option>
              <option value="couple">👫 Couple</option>
              <option value="trans">🏳️‍⚧️ Trans</option>
              <option value="any">✨ Any/Open</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range We&apos;re Seeking</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Age</label>
                <input
                  type="number"
                  min="18"
                  value={(getProfileValue('seekingAgeRange') as {min?: number})?.min || ''}
                  onChange={(e) => updateProfile('seekingAgeRange', {
                    ...(getProfileValue('seekingAgeRange') as object || {}),
                    min: parseInt(e.target.value) || 18
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Age</label>
                <input
                  type="number"
                  min="18"
                  value={(getProfileValue('seekingAgeRange') as {max?: number})?.max || ''}
                  onChange={(e) => updateProfile('seekingAgeRange', {
                    ...(getProfileValue('seekingAgeRange') as object || {}),
                    max: parseInt(e.target.value) || 99
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="45"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Body Types (comma-separated)
            </label>
            <input
              type="text"
              value={getArrayValue('seekingBodyTypes')}
              onChange={(e) => updateArrayField('seekingBodyTypes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Athletic, Muscular, Average"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Ethnicities (comma-separated, optional)
            </label>
            <input
              type="text"
              value={getArrayValue('seekingEthnicities')}
              onChange={(e) => updateArrayField('seekingEthnicities', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Any, Indian, African, etc."
            />
          </div>
        </div>
      )}

      {/* Our Interests Tab */}
      {activeTab === 'interests' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">💋 Our Interests & Desires</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kinks & Interests (comma-separated)
            </label>
            <input
              type="text"
              value={getArrayValue('kinks')}
              onChange={(e) => updateArrayField('kinks', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Cuckolding, Hotwifing, Threesomes, Watching, etc."
            />
            <p className="text-xs text-gray-500 mt-1">Be specific about what turns you on</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Our Fantasies (Be descriptive!)
            </label>
            <textarea
              value={getProfileValue('fantasies') as string || ''}
              onChange={(e) => updateProfile('fantasies', e.target.value)}
              rows={4}
              maxLength={2000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Describe your fantasies, what scenarios excite you both, what you dream about..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {((getProfileValue('fantasies') as string) || '').length}/2000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What We Enjoy
            </label>
            <textarea
              value={getProfileValue('whatWeEnjoy') as string || ''}
              onChange={(e) => updateProfile('whatWeEnjoy', e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="What activities do you both enjoy? What's worked well for you?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What We&apos;re Exploring
            </label>
            <textarea
              value={getProfileValue('whatWereExploring') as string || ''}
              onChange={(e) => updateProfile('whatWereExploring', e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="New things you want to try, aspects of the lifestyle you're curious about..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turn Ons (comma-separated)
            </label>
            <input
              type="text"
              value={getArrayValue('turnOns')}
              onChange={(e) => updateArrayField('turnOns', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Confidence, Size, Dominance, Chemistry"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turn Offs (comma-separated)
            </label>
            <input
              type="text"
              value={getArrayValue('turnOffs')}
              onChange={(e) => updateArrayField('turnOffs', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Pushiness, Poor hygiene, Disrespect"
            />
          </div>
        </div>
      )}

      {/* Boundaries Tab */}
      {activeTab === 'boundaries' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">🛡️ Boundaries & Limits</h3>
          <p className="text-sm text-gray-600">Clear boundaries are essential for a healthy dynamic</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Our Boundaries
            </label>
            <textarea
              value={getProfileValue('boundaries') as string || ''}
              onChange={(e) => updateProfile('boundaries', e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Describe your rules, what must be respected, communication expectations..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soft Limits (Things we&apos;re hesitant about - comma-separated)
            </label>
            <input
              type="text"
              value={getArrayValue('softLimits')}
              onChange={(e) => updateArrayField('softLimits', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Bareback, Public play, Recording"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hard Limits (Absolute No&apos;s - comma-separated)
            </label>
            <input
              type="text"
              value={getArrayValue('hardLimits')}
              onChange={(e) => updateArrayField('hardLimits', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Pain, Sharing photos, Meeting alone"
            />
          </div>
        </div>
      )}

      {/* Meeting Preferences Tab */}
      {activeTab === 'meeting' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">📍 Meeting Preferences</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Preference
            </label>
            <select
              value={getProfileValue('meetingPreference') as string || ''}
              onChange={(e) => updateProfile('meetingPreference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select</option>
              <option value="online-only">💻 Online Only</option>
              <option value="virtual-first">📹 Virtual First, Then In-Person</option>
              <option value="in-person">👥 In-Person Meetings</option>
              <option value="both">✨ Both Online & In-Person</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={getProfileValue('willingToTravel') as boolean || false}
                onChange={(e) => updateProfile('willingToTravel', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
              />
              <span className="text-sm text-gray-700">Willing to Travel</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={getProfileValue('canHost') as boolean || false}
                onChange={(e) => updateProfile('canHost', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
              />
              <span className="text-sm text-gray-700">Can Host</span>
            </label>
          </div>

          {Boolean(getProfileValue('willingToTravel')) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Travel Distance (km)
              </label>
              <input
                type="number"
                min="0"
                value={getProfileValue('travelDistance') as number || ''}
                onChange={(e) => updateProfile('travelDistance', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="50"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Meeting Times (comma-separated)
            </label>
            <input
              type="text"
              value={getArrayValue('preferredMeetingTimes')}
              onChange={(e) => updateArrayField('preferredMeetingTimes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Weekends, Evenings, Weekday afternoons"
            />
          </div>
        </div>
      )}

      {/* Safety Tab */}
      {activeTab === 'safety' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">✅ Verification & Safety</h3>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={getProfileValue('verified') as boolean || false}
                  onChange={(e) => updateProfile('verified', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
                />
                <span className="text-sm font-medium text-gray-900">Profile is Verified</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={getProfileValue('willingToVerify') as boolean || true}
                  onChange={(e) => updateProfile('willingToVerify', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
                />
                <span className="text-sm text-gray-700">Willing to Verify via Video/Photo</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={getProfileValue('stdTested') as boolean || false}
                  onChange={(e) => updateProfile('stdTested', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
                />
                <span className="text-sm text-gray-700">STD Tested Recently</span>
              </label>
            </div>
          </div>

          {Boolean(getProfileValue('stdTested')) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                STD Test Date
              </label>
              <input
                type="date"
                value={getProfileValue('stdTestDate') as string || ''}
                onChange={(e) => updateProfile('stdTestDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Preferences & Requirements
            </label>
            <textarea
              value={getProfileValue('safetyPreferences') as string || ''}
              onChange={(e) => updateProfile('safetyPreferences', e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Always use protection, require recent test results, need to meet in public first..."
            />
          </div>
        </div>
      )}

      {/* Additional Details Tab */}
      {activeTab === 'additional' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">📝 Additional Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Status</label>
              <select
                value={getProfileValue('smokingStatus') as string || ''}
                onChange={(e) => updateProfile('smokingStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select</option>
                <option value="non-smoker">🚭 Non-Smoker</option>
                <option value="social-smoker">🚬 Social Smoker</option>
                <option value="regular-smoker">🚬 Regular Smoker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drinking Status</label>
              <select
                value={getProfileValue('drinkingStatus') as string || ''}
                onChange={(e) => updateProfile('drinkingStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select</option>
                <option value="non-drinker">🚫 Non-Drinker</option>
                <option value="social-drinker">🍷 Social Drinker</option>
                <option value="regular-drinker">🍺 Regular Drinker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drugs</label>
              <select
                value={getProfileValue('drugsStatus') as string || ''}
                onChange={(e) => updateProfile('drugsStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select</option>
                <option value="no">❌ No</option>
                <option value="cannabis-only">🌿 Cannabis Only</option>
                <option value="occasionally">💊 Occasionally</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ideal Scenario (What&apos;s your perfect encounter?)
            </label>
            <textarea
              value={getProfileValue('idealScenario') as string || ''}
              onChange={(e) => updateProfile('idealScenario', e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Paint a picture of your ideal scenario, how would it unfold?"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t sticky bottom-0 bg-white py-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 font-semibold"
        >
          {loading ? 'Saving...' : '💾 Save Profile'}
        </button>
      </div>
    </form>
  );
}