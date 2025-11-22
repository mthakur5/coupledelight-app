const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = 'mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin';

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  emailVerified: { type: Boolean, default: true },
  provider: { type: String, default: 'email' },
  role: { type: String, default: 'user' },
  accountStatus: { type: String, default: 'approved' },
  profile: {
    coupleName: String,
    partner1Name: String,
    partner1Age: Number,
    partner1Gender: String,
    partner1Height: String,
    partner1BodyType: String,
    partner1Ethnicity: String,
    partner2Name: String,
    partner2Age: Number,
    partner2Gender: String,
    partner2Height: String,
    partner2BodyType: String,
    partner2Ethnicity: String,
    city: String,
    state: String,
    country: String,
    bio: String,
    lifestyleType: String,
    experienceLevel: String,
    seekingGender: String,
    seekingAgeRange: {
      min: Number,
      max: Number
    },
    relationshipStatus: String,
    lookingFor: String,
    interests: [String],
    kinks: [String],
    verified: Boolean,
    meetingPreference: String,
    willingToTravel: Boolean,
    canHost: Boolean
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Sample couples data
const sampleCouples = [
  {
    email: 'couple1@example.com',
    password: 'password123',
    accountStatus: 'approved',
    profile: {
      coupleName: 'HotwifeCouple',
      partner1Name: 'Priya',
      partner1Age: 28,
      partner1Gender: 'female',
      partner1Height: '5\'5"',
      partner1BodyType: 'curvy',
      partner1Ethnicity: 'Indian',
      partner2Name: 'Raj',
      partner2Age: 32,
      partner2Gender: 'male',
      partner2Height: '5\'10"',
      partner2BodyType: 'athletic',
      partner2Ethnicity: 'Indian',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      bio: 'We are an adventurous couple exploring the hotwife lifestyle. Looking for respectful bulls who understand boundaries.',
      lifestyleType: 'hotwife',
      experienceLevel: 'experienced',
      seekingGender: 'male',
      seekingAgeRange: { min: 25, max: 40 },
      relationshipStatus: 'married',
      lookingFor: 'singles',
      interests: ['Traveling', 'Wine tasting', 'Fitness'],
      kinks: ['Cuckolding', 'Hotwifing', 'Watching', 'Group Play'],
      verified: true,
      meetingPreference: 'virtual-first',
      willingToTravel: true,
      canHost: false
    }
  },
  {
    email: 'couple2@example.com',
    password: 'password123',
    accountStatus: 'approved',
    profile: {
      coupleName: 'DelhiExplorers',
      partner1Name: 'Neha',
      partner1Age: 30,
      partner1Gender: 'female',
      partner1Height: '5\'6"',
      partner1BodyType: 'athletic',
      partner1Ethnicity: 'Indian',
      partner2Name: 'Amit',
      partner2Age: 33,
      partner2Gender: 'male',
      partner2Height: '6\'0"',
      partner2BodyType: 'muscular',
      partner2Ethnicity: 'Indian',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      bio: 'Fun-loving couple looking to meet like-minded people. We enjoy good conversations and exploring new experiences together.',
      lifestyleType: 'swinger',
      experienceLevel: 'newbie',
      seekingGender: 'couple',
      seekingAgeRange: { min: 28, max: 45 },
      relationshipStatus: 'married',
      lookingFor: 'couples',
      interests: ['Dancing', 'Music', 'Travel', 'Food'],
      kinks: ['Soft Swap', 'Same Room', 'Exhibitionism'],
      verified: true,
      meetingPreference: 'in-person',
      willingToTravel: false,
      canHost: true
    }
  },
  {
    email: 'couple3@example.com',
    password: 'password123',
    accountStatus: 'approved',
    profile: {
      coupleName: 'BangaloreFreaks',
      partner1Name: 'Ananya',
      partner1Age: 26,
      partner1Gender: 'female',
      partner1Height: '5\'4"',
      partner1BodyType: 'slim',
      partner1Ethnicity: 'Indian',
      partner2Name: 'Karan',
      partner2Age: 29,
      partner2Gender: 'male',
      partner2Height: '5\'9"',
      partner2BodyType: 'average',
      partner2Ethnicity: 'Indian',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      bio: 'Tech couple in Bangalore exploring the lifestyle. We value discretion and genuine connections.',
      lifestyleType: 'exploring',
      experienceLevel: 'curious',
      seekingGender: 'any',
      seekingAgeRange: { min: 24, max: 35 },
      relationshipStatus: 'dating',
      lookingFor: 'both',
      interests: ['Technology', 'Gaming', 'Movies', 'Parties'],
      kinks: ['Threesomes', 'Role Play', 'Voyeurism'],
      verified: false,
      meetingPreference: 'both',
      willingToTravel: true,
      canHost: false
    }
  },
  {
    email: 'couple4@example.com',
    password: 'password123',
    accountStatus: 'approved',
    profile: {
      coupleName: 'Stag&Vixen_Pune',
      partner1Name: 'Sanya',
      partner1Age: 31,
      partner1Gender: 'female',
      partner1Height: '5\'7"',
      partner1BodyType: 'curvy',
      partner1Ethnicity: 'Indian',
      partner2Name: 'Vikram',
      partner2Age: 35,
      partner2Gender: 'male',
      partner2Height: '5\'11"',
      partner2BodyType: 'athletic',
      partner2Ethnicity: 'Indian',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      bio: 'Established stag and vixen couple. He enjoys watching her enjoy herself with confident, well-endowed men.',
      lifestyleType: 'stag-vixen',
      experienceLevel: 'veteran',
      seekingGender: 'male',
      seekingAgeRange: { min: 28, max: 42 },
      relationshipStatus: 'married',
      lookingFor: 'singles',
      interests: ['Fine Dining', 'Luxury Travel', 'Art', 'Music'],
      kinks: ['Stag/Vixen', 'Watching', 'Multiple Partners', 'Exhibitionism'],
      verified: true,
      meetingPreference: 'in-person',
      willingToTravel: true,
      canHost: true
    }
  },
  {
    email: 'couple5@example.com',
    password: 'password123',
    accountStatus: 'approved',
    profile: {
      coupleName: 'Cuckold_Chennai',
      partner1Name: 'Divya',
      partner1Age: 27,
      partner1Gender: 'female',
      partner1Height: '5\'5"',
      partner1BodyType: 'average',
      partner1Ethnicity: 'Indian',
      partner2Name: 'Arun',
      partner2Age: 30,
      partner2Gender: 'male',
      partner2Height: '5\'8"',
      partner2BodyType: 'average',
      partner2Ethnicity: 'Indian',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      bio: 'Genuine cuckold couple. She enjoys being pleasured while he watches and serves. Looking for dominant bulls.',
      lifestyleType: 'cuckold',
      experienceLevel: 'experienced',
      seekingGender: 'male',
      seekingAgeRange: { min: 25, max: 40 },
      relationshipStatus: 'married',
      lookingFor: 'singles',
      interests: ['Reading', 'Yoga', 'Cooking', 'Beach'],
      kinks: ['Cuckolding', 'Humiliation', 'BBC', 'Bareback'],
      verified: true,
      meetingPreference: 'virtual-first',
      willingToTravel: false,
      canHost: true
    }
  }
];

async function addSampleCouples() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Hash passwords and add couples
    for (const coupleData of sampleCouples) {
      // Check if user already exists
      const existing = await User.findOne({ email: coupleData.email });
      
      if (existing) {
        console.log(`User ${coupleData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(coupleData.password, 10);
      coupleData.password = hashedPassword;

      // Create user
      const user = new User(coupleData);
      await user.save();
      
      console.log(`✅ Added couple: ${coupleData.profile.coupleName} (${coupleData.email})`);
    }

    console.log('\n🎉 All sample couples added successfully!');
    console.log('\nYou can login with:');
    console.log('Email: couple1@example.com');
    console.log('Password: password123');
    console.log('\n(Same password for all test accounts)');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
addSampleCouples();