import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  emailVerified: boolean;
  provider: 'email' | 'google' | 'facebook';
  role: 'user' | 'admin';
  profile?: {
    coupleName?: string;
    partner1Name?: string;
    partner1Age?: number;
    partner2Name?: string;
    partner2Age?: number;
    location?: string;
    bio?: string;
    interests?: string;
    lookingFor?: string;
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
    profile: {
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
      partner2Name: {
        type: String,
        trim: true,
      },
      partner2Age: {
        type: Number,
        min: 18,
      },
      location: {
        type: String,
        trim: true,
      },
      bio: {
        type: String,
        maxlength: 1000,
      },
      interests: {
        type: String,
        maxlength: 500,
      },
      lookingFor: {
        type: String,
        enum: ['couples', 'singles', 'both', 'groups', ''],
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