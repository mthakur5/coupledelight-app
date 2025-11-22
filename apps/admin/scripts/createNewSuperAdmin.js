/* eslint-disable @typescript-eslint/no-require-imports */
// Script to create a new Super Admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

async function createNewSuperAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'superadmin@coupledelight.com';
    const password = 'SuperAdmin123!';

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log(`⚠️  User already exists: ${email}`);
      console.log('💡 Updating existing user to Super Admin...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update existing user
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      existingUser.adminRole = 'super_admin';
      existingUser.permissions = {
        manageUsers: true,
        manageProducts: true,
        manageOrders: true,
        manageEvents: true,
        manageCouples: true,
        manageBookings: true,
        viewReports: true,
        manageAdminTeam: true,
      };
      existingUser.accountStatus = 'approved';
      existingUser.emailVerified = true;
      existingUser.approvedAt = new Date();
      
      await existingUser.save();
      console.log('✅ User updated to Super Admin!');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new super admin
      const newAdmin = await User.create({
        email: email,
        password: hashedPassword,
        emailVerified: true,
        provider: 'email',
        role: 'admin',
        adminRole: 'super_admin',
        permissions: {
          manageUsers: true,
          manageProducts: true,
          manageOrders: true,
          manageEvents: true,
          manageCouples: true,
          manageBookings: true,
          viewReports: true,
          manageAdminTeam: true,
        },
        accountStatus: 'approved',
        approvedAt: new Date(),
      });

      console.log('✅ New Super Admin created successfully!');
    }

    console.log('\n🎉 Super Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    superadmin@coupledelight.com');
    console.log('🔑 Password: SuperAdmin123!');
    console.log('👑 Role:     Super Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ Full Permissions:');
    console.log('   ✅ Manage Users');
    console.log('   ✅ Manage Products');
    console.log('   ✅ Manage Orders');
    console.log('   ✅ Manage Events');
    console.log('   ✅ Manage Couples');
    console.log('   ✅ Manage Bookings');
    console.log('   ✅ View Reports');
    console.log('   ✅ Manage Admin Team');
    console.log('\n🌐 Login at: http://localhost:3001/login');

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Failed to create super admin:', error);
    process.exit(1);
  }
}

// Run the script
createNewSuperAdmin();