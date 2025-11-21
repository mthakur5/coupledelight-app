import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['restaurant', 'adventure', 'romantic', 'entertainment', 'spa', 'outdoor', 'cultural'],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  location: {
    name: String,
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  images: [String],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: String,
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 1,
  },
  amenities: [String],
  availability: [{
    date: Date,
    slots: [{
      time: String,
      available: Boolean,
      booked: {
        type: Number,
        default: 0,
      },
    }],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
eventSchema.index({ category: 1, isActive: 1 });
eventSchema.index({ 'location.city': 1 });
eventSchema.index({ price: 1 });
eventSchema.index({ isFeatured: 1 });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;