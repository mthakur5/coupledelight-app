const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

async function createAdminUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@coupledelight.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      
      // Update password if needed
      const hashedPassword = await bcrypt.hash('Manmohan89!', 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin user password updated!');
      
      mongoose.disconnect();
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Manmohan89!', 10);

    // Create admin user
    const adminUser = new User({
      email: 'admin@coupledelight.com',
      password: hashedPassword,
      emailVerified: true,
      provider: 'email',
      role: 'admin',
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@coupledelight.com');
    console.log('🔑 Password: Manmohan89!');
    console.log('👤 Role: admin');
    console.log('');
    console.log('You can now login at: http://localhost:3001/login');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}

createAdminUser();