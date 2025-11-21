import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICouple extends Document {
  user1Id: mongoose.Types.ObjectId;
  user2Id: mongoose.Types.ObjectId;
  relationshipStartDate: Date;
  status: 'active' | 'inactive' | 'pending';
  anniversaryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CoupleSchema: Schema<ICouple> = new Schema(
  {
    user1Id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user2Id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relationshipStartDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    anniversaryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
CoupleSchema.index({ user1Id: 1 });
CoupleSchema.index({ user2Id: 1 });
CoupleSchema.index({ status: 1 });

const Couple: Model<ICouple> = mongoose.models.Couple || mongoose.model<ICouple>('Couple', CoupleSchema);

export default Couple;