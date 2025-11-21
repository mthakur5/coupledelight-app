import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  eventDetails: {
    title: String,
    location: String,
    price: Number,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: {
    type: String,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
    default: 2,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  contactDetails: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  specialRequests: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'online'],
    default: 'COD',
  },
  confirmationSent: {
    type: Boolean,
    default: false,
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `BK${dateStr}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes for better query performance
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ bookingNumber: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;