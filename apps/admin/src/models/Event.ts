import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  coupleId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  category: string;
  status: 'upcoming' | 'completed' | 'planned' | 'cancelled';
  location?: string;
  attendees: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    coupleId: {
      type: Schema.Types.ObjectId,
      ref: 'Couple',
      required: true,
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
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
EventSchema.index({ coupleId: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ category: 1 });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;