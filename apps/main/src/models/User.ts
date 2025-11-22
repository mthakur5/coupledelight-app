import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  emailVerified: boolean;
  provider: 'email' | 'google' | 'facebook';
  role: 'user' | 'admin';
  accountStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  accountStatusNote?: string;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  profile?: {
    // Basic Information
    coupleName?: string;
    partner1Name?: string;
    partner1Age?: number;
    partner1Gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    partner2Name?: string;
    partner2Age?: number;
    partner2Gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    profilePicture?: string;
    coverPhoto?: string;
    
    // Relationship Details
    relationshipStatus?: 'dating' | 'engaged' | 'married' | 'domestic-partnership' | 'other';
    anniversaryDate?: Date;
    relationshipStartDate?: Date;
    
    // Contact & Location
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    location?: string;
    
    // About
    bio?: string;
    interests?: string[];
    hobbies?: string[];
    favoriteActivities?: string[];
    relationshipGoals?: string;
    
    // Social
    lookingFor?: 'couples' | 'singles' | 'both' | 'groups' | 'friends-only';
    socialLinks?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
    };
    
    // Favorites
    favoriteRestaurants?: string[];
    favoritePlaces?: string[];
    favoriteMovies?: string[];
    favoriteMusic?: string[];
    
    // Lifestyle & Physical Attributes
    lifestyleType?: 'cuckold' | 'hotwife' | 'stag-vixen' | 'swinger' | 'open-relationship' | 'polyamorous' | 'exploring';
    experienceLevel?: 'newbie' | 'experienced' | 'veteran' | 'curious';
    
    // Physical Stats - Partner 1 (Usually Wife/Female)
    partner1Height?: string;
    partner1Weight?: string;
    partner1BodyType?: 'slim' | 'athletic' | 'average' | 'curvy' | 'plus-size' | 'muscular';
    partner1Ethnicity?: string;
    partner1HairColor?: string;
    partner1EyeColor?: string;
    partner1Measurements?: string;
    
    // Physical Stats - Partner 2 (Usually Husband/Male)
    partner2Height?: string;
    partner2Weight?: string;
    partner2BodyType?: 'slim' | 'athletic' | 'average' | 'dad-bod' | 'stocky' | 'muscular';
    partner2Ethnicity?: string;
    partner2HairColor?: string;
    partner2EyeColor?: string;
    
    // What We're Looking For
    seekingGender?: 'male' | 'female' | 'couple' | 'trans' | 'any';
    seekingAgeRange?: {
      min?: number;
      max?: number;
    };
    seekingBodyTypes?: string[];
    seekingEthnicities?: string[];
    
    // Lifestyle Preferences & Interests
    kinks?: string[];
    fantasies?: string;
    boundaries?: string;
    softLimits?: string[];
    hardLimits?: string[];
    
    // Experience & Desires
    whatWeEnjoy?: string;
    whatWereExploring?: string;
    idealScenario?: string;
    turnOns?: string[];
    turnOffs?: string[];
    
    // Meeting Preferences
    meetingPreference?: 'online-only' | 'in-person' | 'both' | 'virtual-first';
    willingToTravel?: boolean;
    travelDistance?: number;
    canHost?: boolean;
    preferredMeetingTimes?: string[];
    
    // Verification & Safety
    verified?: boolean;
    willingToVerify?: boolean;
    stdTested?: boolean;
    stdTestDate?: Date;
    safetyPreferences?: string;
    
    // Additional Details
    smokingStatus?: 'non-smoker' | 'social-smoker' | 'regular-smoker';
    drinkingStatus?: 'non-drinker' | 'social-drinker' | 'regular-drinker';
    drugsStatus?: 'no' | 'occasionally' | 'cannabis-only';
  };
  preferences?: {
    // Notification Preferences
    emailNotifications?: {
      events?: boolean;
      messages?: boolean;
      friendRequests?: boolean;
      eventReminders?: boolean;
      newProducts?: boolean;
      orderUpdates?: boolean;
      weeklyDigest?: boolean;
    };
    smsNotifications?: {
      eventReminders?: boolean;
      orderUpdates?: boolean;
      importantAlerts?: boolean;
    };
    pushNotifications?: {
      enabled?: boolean;
      events?: boolean;
      messages?: boolean;
      friendRequests?: boolean;
    };
    
    // Privacy Settings
    privacy?: {
      profileVisibility?: 'public' | 'friends-only' | 'private';
      showEmail?: boolean;
      showPhone?: boolean;
      showLocation?: boolean;
      showAge?: boolean;
      allowMessagesFrom?: 'everyone' | 'friends-only' | 'none';
      showOnlineStatus?: boolean;
    };
    
    // Event Preferences
    eventPreferences?: {
      interestedCategories?: string[];
      priceRange?: {
        min?: number;
        max?: number;
      };
      preferredDays?: string[];
      maxDistance?: number;
    };
    
    // App Settings
    language?: 'en' | 'hi' | 'es' | 'fr';
    theme?: 'light' | 'dark' | 'auto';
    currency?: 'USD' | 'INR' | 'EUR' | 'GBP';
    timezone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: function(this: IUser) {
        return this.provider === 'email';
      },
      minlength: [6, 'Password must be at least 6 characters'],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ['email', 'google', 'facebook'],
      default: 'email',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    accountStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    accountStatusNote: {
      type: String,
      trim: true,
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    profile: {
      // Basic Information
      coupleName: {
        type: String,
        trim: true,
      },
      partner1Name: {
        type: String,
        trim: true,
      },
      partner1Age: {
        type: Number,
        min: 18,
      },
      partner1Gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say', ''],
      },
      partner2Name: {
        type: String,
        trim: true,
      },
      partner2Age: {
        type: Number,
        min: 18,
      },
      partner2Gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say', ''],
      },
      profilePicture: {
        type: String,
        trim: true,
      },
      coverPhoto: {
        type: String,
        trim: true,
      },
      
      // Relationship Details
      relationshipStatus: {
        type: String,
        enum: ['dating', 'engaged', 'married', 'domestic-partnership', 'other', ''],
      },
      anniversaryDate: {
        type: Date,
      },
      relationshipStartDate: {
        type: Date,
      },
      
      // Contact & Location
      phone: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      
      // About
      bio: {
        type: String,
        maxlength: 1000,
      },
      interests: [{
        type: String,
        trim: true,
      }],
      hobbies: [{
        type: String,
        trim: true,
      }],
      favoriteActivities: [{
        type: String,
        trim: true,
      }],
      relationshipGoals: {
        type: String,
        maxlength: 500,
      },
      
      // Social
      lookingFor: {
        type: String,
        enum: ['couples', 'singles', 'both', 'groups', 'friends-only', ''],
      },
      socialLinks: {
        instagram: String,
        facebook: String,
        twitter: String,
        linkedin: String,
      },
      
      // Favorites
      favoriteRestaurants: [{
        type: String,
        trim: true,
      }],
      favoritePlaces: [{
        type: String,
        trim: true,
      }],
      favoriteMovies: [{
        type: String,
        trim: true,
      }],
      favoriteMusic: [{
        type: String,
        trim: true,
      }],
      
      // Lifestyle & Physical Attributes
      lifestyleType: {
        type: String,
        enum: ['cuckold', 'hotwife', 'stag-vixen', 'swinger', 'open-relationship', 'polyamorous', 'exploring', ''],
      },
      experienceLevel: {
        type: String,
        enum: ['newbie', 'experienced', 'veteran', 'curious', ''],
      },
      
      // Physical Stats - Partner 1
      partner1Height: {
        type: String,
        trim: true,
      },
      partner1Weight: {
        type: String,
        trim: true,
      },
      partner1BodyType: {
        type: String,
        enum: ['slim', 'athletic', 'average', 'curvy', 'plus-size', 'muscular', ''],
      },
      partner1Ethnicity: {
        type: String,
        trim: true,
      },
      partner1HairColor: {
        type: String,
        trim: true,
      },
      partner1EyeColor: {
        type: String,
        trim: true,
      },
      partner1Measurements: {
        type: String,
        trim: true,
      },
      
      // Physical Stats - Partner 2
      partner2Height: {
        type: String,
        trim: true,
      },
      partner2Weight: {
        type: String,
        trim: true,
      },
      partner2BodyType: {
        type: String,
        enum: ['slim', 'athletic', 'average', 'dad-bod', 'stocky', 'muscular', ''],
      },
      partner2Ethnicity: {
        type: String,
        trim: true,
      },
      partner2HairColor: {
        type: String,
        trim: true,
      },
      partner2EyeColor: {
        type: String,
        trim: true,
      },
      
      // What We're Looking For
      seekingGender: {
        type: String,
        enum: ['male', 'female', 'couple', 'trans', 'any', ''],
      },
      seekingAgeRange: {
        min: { type: Number, min: 18 },
        max: { type: Number, min: 18 },
      },
      seekingBodyTypes: [{
        type: String,
        trim: true,
      }],
      seekingEthnicities: [{
        type: String,
        trim: true,
      }],
      
      // Lifestyle Preferences & Interests
      kinks: [{
        type: String,
        trim: true,
      }],
      fantasies: {
        type: String,
        maxlength: 2000,
      },
      boundaries: {
        type: String,
        maxlength: 1000,
      },
      softLimits: [{
        type: String,
        trim: true,
      }],
      hardLimits: [{
        type: String,
        trim: true,
      }],
      
      // Experience & Desires
      whatWeEnjoy: {
        type: String,
        maxlength: 1000,
      },
      whatWereExploring: {
        type: String,
        maxlength: 1000,
      },
      idealScenario: {
        type: String,
        maxlength: 1000,
      },
      turnOns: [{
        type: String,
        trim: true,
      }],
      turnOffs: [{
        type: String,
        trim: true,
      }],
      
      // Meeting Preferences
      meetingPreference: {
        type: String,
        enum: ['online-only', 'in-person', 'both', 'virtual-first', ''],
      },
      willingToTravel: {
        type: Boolean,
        default: false,
      },
      travelDistance: {
        type: Number,
        min: 0,
      },
      canHost: {
        type: Boolean,
        default: false,
      },
      preferredMeetingTimes: [{
        type: String,
        trim: true,
      }],
      
      // Verification & Safety
      verified: {
        type: Boolean,
        default: false,
      },
      willingToVerify: {
        type: Boolean,
        default: true,
      },
      stdTested: {
        type: Boolean,
        default: false,
      },
      stdTestDate: {
        type: Date,
      },
      safetyPreferences: {
        type: String,
        maxlength: 500,
      },
      
      // Additional Details
      smokingStatus: {
        type: String,
        enum: ['non-smoker', 'social-smoker', 'regular-smoker', ''],
      },
      drinkingStatus: {
        type: String,
        enum: ['non-drinker', 'social-drinker', 'regular-drinker', ''],
      },
      drugsStatus: {
        type: String,
        enum: ['no', 'occasionally', 'cannabis-only', ''],
      },
    },
    preferences: {
      // Notification Preferences
      emailNotifications: {
        events: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
        friendRequests: { type: Boolean, default: true },
        eventReminders: { type: Boolean, default: true },
        newProducts: { type: Boolean, default: false },
        orderUpdates: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false },
      },
      smsNotifications: {
        eventReminders: { type: Boolean, default: false },
        orderUpdates: { type: Boolean, default: false },
        importantAlerts: { type: Boolean, default: false },
      },
      pushNotifications: {
        enabled: { type: Boolean, default: true },
        events: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
        friendRequests: { type: Boolean, default: true },
      },
      
      // Privacy Settings
      privacy: {
        profileVisibility: {
          type: String,
          enum: ['public', 'friends-only', 'private'],
          default: 'public',
        },
        showEmail: { type: Boolean, default: false },
        showPhone: { type: Boolean, default: false },
        showLocation: { type: Boolean, default: true },
        showAge: { type: Boolean, default: true },
        allowMessagesFrom: {
          type: String,
          enum: ['everyone', 'friends-only', 'none'],
          default: 'everyone',
        },
        showOnlineStatus: { type: Boolean, default: true },
      },
      
      // Event Preferences
      eventPreferences: {
        interestedCategories: [{
          type: String,
          trim: true,
        }],
        priceRange: {
          min: { type: Number, min: 0 },
          max: { type: Number, min: 0 },
        },
        preferredDays: [{
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        }],
        maxDistance: { type: Number, min: 0 },
      },
      
      // App Settings
      language: {
        type: String,
        enum: ['en', 'hi', 'es', 'fr'],
        default: 'en',
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light',
      },
      currency: {
        type: String,
        enum: ['USD', 'INR', 'EUR', 'GBP'],
        default: 'INR',
      },
      timezone: {
        type: String,
        default: 'Asia/Kolkata',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes are created automatically by MongoDB for unique fields
// Manual indexes can be added later in production via MongoDB directly

const User: Model<IUser> = (mongoose.models && mongoose.models.User)
  ? mongoose.models.User
  : mongoose.model<IUser>('User', UserSchema);

export default User;