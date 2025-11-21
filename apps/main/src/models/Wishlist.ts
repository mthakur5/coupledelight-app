import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Prevent duplicate wishlist items
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Indexes for better query performance
wishlistSchema.index({ userId: 1, addedAt: -1 });

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;