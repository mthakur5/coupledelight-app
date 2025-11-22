/* eslint-disable @typescript-eslint/no-require-imports */
// Migration script to update existing admin users with new role and permission fields
const mongoose = require('mongoose');

// MongoDB connection string - update with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coupledelight';

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

async function migrateAdmins() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all admin users without adminRole
    const adminsToMigrate = await User.find({
      role: 'admin',
      adminRole: { $exists: false }
    });

    console.log(`📊 Found ${adminsToMigrate.length} admin(s) to migrate`);

    if (adminsToMigrate.length === 0) {
      console.log('✨ No admins need migration. All set!');
      await mongoose.disconnect();
      return;
    }

    // Update each admin
    for (const admin of adminsToMigrate) {
      console.log(`\n🔧 Migrating admin: ${admin.email}`);

      // Set adminRole to super_admin (existing admins get full access)
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
      if (!admin.accountStatus || admin.accountStatus === 'pending') {
        admin.accountStatus = 'approved';
        admin.approvedAt = new Date();
      }

      await admin.save();
      console.log(`✅ Migrated: ${admin.email} -> Super Admin with full permissions`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log(`📈 Summary: ${adminsToMigrate.length} admin(s) migrated to new role system`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateAdmins();