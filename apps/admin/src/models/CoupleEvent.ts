import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupleEvent extends Document {
  coupleId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  category: string;
  status: 'upcoming' | 'completed' | 'planned' | 'cancelled';
  location?: string;
  attendees: number;
  isPublic: boolean;
  maxRegistrations?: number;
  registeredCouples: mongoose.Types.ObjectId[];
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CoupleEventSchema: Schema<ICoupleEvent> = new Schema(
  {
    coupleId: {
      type: Schema.Types.ObjectId,
      ref: 'Couple',
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'general',
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'planned', 'cancelled'],
      default: 'planned',
    },
    location: {
      type: String,
    },
    attendees: {
      type: Number,
      default: 2,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    maxRegistrations: {
      type: Number,
      default: 50,
    },
    registeredCouples: [{
      type: Schema.Types.ObjectId,
      ref: 'Couple',
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
CoupleEventSchema.index({ coupleId: 1 });
CoupleEventSchema.index({ status: 1 });
CoupleEventSchema.index({ date: 1 });
CoupleEventSchema.index({ category: 1 });
CoupleEventSchema.index({ isPublic: 1 });
CoupleEventSchema.index({ registeredCouples: 1 });

const CoupleEvent: Model<ICoupleEvent> = mongoose.models.CoupleEvent || mongoose.model<ICoupleEvent>('CoupleEvent', CoupleEventSchema);

export default CoupleEvent;