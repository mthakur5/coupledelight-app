import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  emailVerified: boolean;
  provider: 'email' | 'google' | 'facebook';
  role: 'user' | 'admin';
  adminRole?: 'super_admin' | 'manager' | 'supervisor';
  permissions?: {
    manageUsers?: boolean;
    manageProducts?: boolean;
    manageOrders?: boolean;
    manageEvents?: boolean;
    manageCouples?: boolean;
    manageBookings?: boolean;
    viewReports?: boolean;
    manageAdminTeam?: boolean;
  };
  accountStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  accountStatusNote?: string;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  addedBy?: mongoose.Types.ObjectId;
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
    adminRole: {
      type: String,
      enum: ['super_admin', 'manager', 'supervisor'],
      required: function(this: IUser) {
        return this.role === 'admin';
      },
    },
    permissions: {
      manageUsers: { type: Boolean, default: false },
      manageProducts: { type: Boolean, default: false },
      manageOrders: { type: Boolean, default: false },
      manageEvents: { type: Boolean, default: false },
      manageCouples: { type: Boolean, default: false },
      manageBookings: { type: Boolean, default: false },
      viewReports: { type: Boolean, default: false },
      manageAdminTeam: { type: Boolean, default: false },
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
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ adminRole: 1 });
UserSchema.index({ accountStatus: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;