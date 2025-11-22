'use client';

import { useState } from 'react';
import EditCoupleModal from './EditCoupleModal';

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
}

export default function CoupleActions({ couple }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this couple? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/couples/${couple._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete couple');
      }

      alert('Couple deleted successfully');
      window.location.href = '/dashboard/couples';
    } catch (error) {
      alert('Failed to delete couple');
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button 
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-colors"
        >
          ✏️ Edit
        </button>
        <button 
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          🗑️ Delete
        </button>
      </div>

      {showEditModal && (
        <EditCoupleModal
          couple={couple}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}