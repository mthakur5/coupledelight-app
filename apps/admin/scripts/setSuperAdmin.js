/* eslint-disable @typescript-eslint/no-require-imports */
// Script to set specific admin user as Super Admin
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read MongoDB URI from .env.local file
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) {
      MONGODB_URI = match[1].trim();
    }
  } catch (error) {
    console.log('⚠️  Could not read .env.local file');
  }
}

// Fallback to default
if (!MONGODB_URI) {
  MONGODB_URI = 'mongodb://localhost:27017/coupledelight';
  console.log('⚠️  Using default MongoDB URI');
}

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  emailVerified: Boolean,
  provider: String,
  role: String,
  adminRole: String,
  permissions: {
    manageUsers: Boolean,
    manageProducts: Boolean,
    manageOrders: Boolean,
    manageEvents: Boolean,
    manageCouples: Boolean,
    manageBookings: Boolean,
    viewReports: Boolean,
    manageAdminTeam: Boolean,
  },
  accountStatus: String,
  accountStatusNote: String,
  approvedAt: Date,
  approvedBy: mongoose.Schema.Types.ObjectId,
  addedBy: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  updatedAt: Date,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function setSuperAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@coupledelight.com';
    
    // Find the admin user
    const admin = await User.findOne({ email: email });

    if (!admin) {
      console.log(`❌ Admin user not found: ${email}`);
      console.log('💡 Please make sure this admin account exists first.');
      await mongoose.disconnect();
      return;
    }

    console.log(`\n🔧 Updating admin: ${admin.email}`);

    // Set role to admin if not already
    admin.role = 'admin';

    // Set adminRole to super_admin
    admin.adminRole = 'super_admin';

    // Set full permissions
    admin.permissions = {
      manageUsers: true,
      manageProducts: true,
      manageOrders: true,
      manageEvents: true,
      manageCouples: true,
      manageBookings: true,
      viewReports: true,
      manageAdminTeam: true,
    };

    // Ensure admin is approved
    admin.accountStatus = 'approved';
    admin.emailVerified = true;
    if (!admin.approvedAt) {
      admin.approvedAt = new Date();
    }

    await admin.save();
    
    console.log(`✅ Successfully set ${email} as Super Admin!`);
    console.log('\n📋 Admin Details:');
    console.log(`   Role: ${admin.role}`);
    console.log(`   Admin Role: ${admin.adminRole}`);
    console.log(`   Account Status: ${admin.accountStatus}`);
    console.log(`   Email Verified: ${admin.emailVerified}`);
    console.log('\n🎉 Permissions granted:');
    Object.entries(admin.permissions).forEach(([key, value]) => {
      console.log(`   ${value ? '✅' : '❌'} ${key}`);
    });

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Failed to set super admin:', error);
    process.exit(1);
  }
}

// Run the script
setSuperAdmin();