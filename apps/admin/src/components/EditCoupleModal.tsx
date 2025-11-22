'use client';

import { useState } from 'react';

interface CoupleData {
  _id: string;
  coupleName?: string;
  displayName?: string;
  location?: string;
  city?: string;
  state?: string;
  bio?: string;
  status: string;
  relationshipStartDate: string;
  anniversaryDate?: string;
  relationshipType?: string;
  lifestyleType?: string[];
  partner1?: {
    name?: string;
    age?: number;
    occupation?: string;
  };
  partner2?: {
    name?: string;
    age?: number;
    occupation?: string;
  };
}

interface Props {
  couple: CoupleData;
  onClose: () => void;
}

export default function EditCoupleModal({ couple, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    coupleName: couple.coupleName || '',
    displayName: couple.displayName || '',
    location: couple.location || '',
    city: couple.city || '',
    state: couple.state || '',
    bio: couple.bio || '',
    status: couple.status || 'active',
    relationshipType: couple.relationshipType || 'simple',
    lifestyleType: couple.lifestyleType || [],
    relationshipStartDate: couple.relationshipStartDate ? new Date(couple.relationshipStartDate).toISOString().split('T')[0] : '',
    anniversaryDate: couple.anniversaryDate ? new Date(couple.anniversaryDate).toISOString().split('T')[0] : '',
    partner1Name: couple.partner1?.name || '',
    partner1Age: couple.partner1?.age?.toString() || '',
    partner1Occupation: couple.partner1?.occupation || '',
    partner2Name: couple.partner2?.name || '',
    partner2Age: couple.partner2?.age?.toString() || '',
    partner2Occupation: couple.partner2?.occupation || '',
  });

  const lifestyleOptions = [
    { value: 'cuckold', label: '👥 Cuckold', color: 'purple' },
    { value: 'wife_swap', label: '🔄 Wife Swap', color: 'blue' },
    { value: 'shop', label: '🛍️ Shop', color: 'pink' },
    { value: 'threesome', label: '3️⃣ Threesome', color: 'green' },
    { value: 'group_play', label: '👨‍👩‍👧‍👦 Group Play', color: 'orange' },
    { value: 'soft_swap', label: '💋 Soft Swap', color: 'yellow' },
    { value: 'full_swap', label: '🔥 Full Swap', color: 'red' },
    { value: 'same_room', label: '🏠 Same Room', color: 'indigo' },
  ];

  const toggleLifestyleType = (value: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyleType: prev.lifestyleType.includes(value)
        ? prev.lifestyleType.filter((item: string) => item !== value)
        : [...prev.lifestyleType, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        coupleName: formData.coupleName,
        displayName: formData.displayName,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        bio: formData.bio,
        status: formData.status,
        relationshipType: formData.relationshipType,
        lifestyleType: formData.lifestyleType,
        relationshipStartDate: formData.relationshipStartDate,
        anniversaryDate: formData.anniversaryDate || undefined,
        partner1: {
          name: formData.partner1Name,
          age: formData.partner1Age ? Number(formData.partner1Age) : undefined,
          occupation: formData.partner1Occupation,
        },
        partner2: {
          name: formData.partner2Name,
          age: formData.partner2Age ? Number(formData.partner2Age) : undefined,
          occupation: formData.partner2Occupation,
        },
      };

      const response = await fetch(`/api/couples/${couple._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update couple');
      }

      setSuccess('Couple profile updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Couple Profile</h2>
            <p className="text-sm text-gray-600 mt-1">Update couple information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Basic Information</h3>
            
            {/* Couple Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Couple Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.relationshipType === 'simple' 
                    ? 'border-pink-500 bg-pink-50' 
                    : 'border-gray-300 hover:border-pink-300'
                }`}>
                  <input
                    type="radio"
                    name="relationshipType"
                    value="simple"
                    checked={formData.relationshipType === 'simple'}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationshipType: e.target.value }))}
                    className="w-4 h-4 text-pink-500"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">💑 Simple Couple</div>
                    <div className="text-xs text-gray-600">Regular couple profile</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.relationshipType === 'cuckold' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-300'
                }`}>
                  <input
                    type="radio"
                    name="relationshipType"
                    value="cuckold"
                    checked={formData.relationshipType === 'cuckold'}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationshipType: e.target.value }))}
                    className="w-4 h-4 text-purple-500"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">👥 Cuckold Couple</div>
                    <div className="text-xs text-gray-600">Cuckold lifestyle couple</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Couple Name
                </label>
                <input
                  type="text"
                  value={formData.coupleName}
                  onChange={(e) => setFormData(prev => ({ ...prev, coupleName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., The Smiths"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="Public display name"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="Full location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="State"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                placeholder="Tell us about yourselves..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Relationship Start Date
                </label>
                <input
                  type="date"
                  value={formData.relationshipStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationshipStartDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Anniversary Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.anniversaryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, anniversaryDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Lifestyle Preferences</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                What lifestyle preferences do they have? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {lifestyleOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.lifestyleType.includes(option.value)
                        ? `border-${option.color}-500 bg-${option.color}-50`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.lifestyleType.includes(option.value)}
                      onChange={() => toggleLifestyleType(option.value)}
                      className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Partner 1 Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b flex items-center gap-2">
              <span>👤</span> Partner 1 Information
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.partner1Name}
                  onChange={(e) => setFormData(prev => ({ ...prev, partner1Name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="Partner 1 name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.partner1Age}
                  onChange={(e) => setFormData(prev => ({ ...prev, partner1Age: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="Age"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.partner1Occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, partner1Occupation: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="Occupation"
                />
              </div>
            </div>
          </div>

          {/* Partner 2 Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b flex items-center gap-2">
              <span>👤</span> Partner 2 Information
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.partner2Name}
                  onChange={(e) => setFormData(prev => ({ ...prev, partner2Name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="Partner 2 name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.partner2Age}
                  onChange={(e) => setFormData(prev => ({ ...prev, partner2Age: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="Age"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.partner2Occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, partner2Occupation: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  placeholder="Occupation"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}