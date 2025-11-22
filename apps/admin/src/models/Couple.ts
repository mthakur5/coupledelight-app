import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICouple extends Document {
  user1Id: mongoose.Types.ObjectId;
  user2Id: mongoose.Types.ObjectId;
  relationshipStartDate: Date;
  status: 'active' | 'inactive' | 'pending';
  anniversaryDate?: Date;
  
  // Basic Profile
  coupleName?: string;
  displayName?: string;
  location?: string;
  city?: string;
  state?: string;
  bio?: string;
  
  // Partner Details
  partner1: {
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
  
  partner2: {
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
  lifestyleType?: string[];  // ['cuckold', 'hotwife', 'wife_swap', 'threesome', 'group', 'soft_swap', 'full_swap']
  experienceLevel?: string;  // 'new', 'beginner', 'intermediate', 'experienced', 'veteran'
  openToMeet?: string[];  // ['couples', 'single_males', 'single_females', 'groups']
  
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
  stdTestingStatus?: string;  // 'recent', 'willing', 'not_tested'
  stdTestDate?: Date;
  condomPreference?: string;  // 'always', 'negotiable', 'not_required'
  vaccinated?: boolean;
  
  // Availability & Logistics
  travelWillingness?: string;  // 'no_travel', 'local_only', 'regional', 'willing_to_travel'
  hostingCapability?: string;  // 'can_host', 'cannot_host', 'hotel_only'
  meetingFrequency?: string;  // 'rarely', 'monthly', 'weekly', 'often'
  availableDays?: string[];  // ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  availableTime?: string;  // 'daytime', 'evenings', 'weekends', 'flexible'
  
  // Privacy & Verification
  privacyLevel?: string;  // 'public', 'discreet', 'very_private'
  facePhotosPublic?: boolean;
  verified?: boolean;
  verificationDate?: Date;
  verificationMethod?: string;  // 'video_call', 'in_person', 'photo_id', 'social_media'
  socialMediaVerified?: boolean;
  
  // Communication Preferences
  preferredContact?: string[];  // ['app', 'email', 'phone', 'telegram', 'kik']
  responseTime?: string;  // 'immediate', 'same_day', 'within_week', 'varies'
  communicationStyle?: string;  // 'direct', 'friendly', 'flirty', 'professional'
  
  // Photos & Media
  profilePhotoUrl?: string;
  photoGallery?: string[];
  photoCount?: number;
  hasPrivatePhotos?: boolean;
  
  // Additional Info
  relationshipType?: string;  // 'married', 'committed', 'open', 'polyamorous'
  languages?: string[];
  smoker?: boolean;
  drinker?: string;  // 'no', 'socially', 'regularly'
  drugs?: string;  // 'no', 'occasionally', '420_friendly'
  
  // Profile Stats
  profileCompleteness?: number;  // 0-100
  lastActive?: Date;
  profileViews?: number;
  favoritedBy?: mongoose.Types.ObjectId[];
  
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
    anniversaryDate: Date,
    
    // Basic Profile
    coupleName: String,
    displayName: String,
    location: String,
    city: String,
    state: String,
    bio: String,
    
    // Partner Details
    partner1: {
      name: String,
      age: Number,
      height: String,
      weight: String,
      bodyType: String,
      ethnicity: String,
      hairColor: String,
      eyeColor: String,
      occupation: String,
    },
    partner2: {
      name: String,
      age: Number,
      height: String,
      weight: String,
      bodyType: String,
      ethnicity: String,
      hairColor: String,
      eyeColor: String,
      occupation: String,
    },
    
    // Lifestyle Preferences
    lifestyleType: [String],
    experienceLevel: String,
    openToMeet: [String],
    
    // What They're Seeking
    seekingDescription: String,
    ageRangePreference: {
      min: Number,
      max: Number,
    },
    
    // Boundaries & Preferences
    boundaries: String,
    interests: [String],
    kinks: [String],
    softLimits: [String],
    hardLimits: [String],
    
    // Safety & Health
    stdTestingStatus: String,
    stdTestDate: Date,
    condomPreference: String,
    vaccinated: Boolean,
    
    // Availability & Logistics
    travelWillingness: String,
    hostingCapability: String,
    meetingFrequency: String,
    availableDays: [String],
    availableTime: String,
    
    // Privacy & Verification
    privacyLevel: String,
    facePhotosPublic: Boolean,
    verified: Boolean,
    verificationDate: Date,
    verificationMethod: String,
    socialMediaVerified: Boolean,
    
    // Communication Preferences
    preferredContact: [String],
    responseTime: String,
    communicationStyle: String,
    
    // Photos & Media
    profilePhotoUrl: String,
    photoGallery: [String],
    photoCount: Number,
    hasPrivatePhotos: Boolean,
    
    // Additional Info
    relationshipType: String,
    languages: [String],
    smoker: Boolean,
    drinker: String,
    drugs: String,
    
    // Profile Stats
    profileCompleteness: Number,
    lastActive: Date,
    profileViews: { type: Number, default: 0 },
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
CoupleSchema.index({ user1Id: 1 });
CoupleSchema.index({ user2Id: 1 });
CoupleSchema.index({ status: 1 });
CoupleSchema.index({ location: 1 });
CoupleSchema.index({ city: 1 });
CoupleSchema.index({ lifestyleType: 1 });
CoupleSchema.index({ verified: 1 });

const Couple: Model<ICouple> = mongoose.models.Couple || mongoose.model<ICouple>('Couple', CoupleSchema);

export default Couple;