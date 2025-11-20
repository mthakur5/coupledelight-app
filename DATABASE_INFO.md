# CoupleDelight - Database Information

## Database: MongoDB

### Why MongoDB?
MongoDB is a **NoSQL document database** that is perfect for this project because:

1. **Flexible Schema** - Can easily add new fields without migrations
2. **Scalable** - Handles millions of users and data
3. **Fast** - Quick read/write operations
4. **JSON-like Documents** - Works perfectly with JavaScript/TypeScript
5. **Rich Queries** - Powerful filtering and searching

---

## Your MongoDB Connection

### Connection String
```
mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin
```

### Connection Details Breakdown:
- **Username**: `manmohandb`
- **Password**: `Manmohan89@#` (URL encoded as `Manmohan89%40%23`)
- **Host**: `103.225.188.18`
- **Port**: `27017`
- **Database Name**: `coupledelight`
- **Auth Source**: `admin`

---

## Database Structure

### Total Collections: 22

#### 1. Core Collections
1. **users** - User accounts (authentication)
2. **couples** - Couple profiles
3. **connections** - Connection requests between couples
4. **messages** - Chat messages

#### 2. E-commerce Collections
5. **products** - Product catalog
6. **orders** - Order history
7. **wishlists** - Saved products

#### 3. Events Collections
8. **events** - Event catalog (restaurants, activities, etc.)
9. **bookings** - Event bookings

#### 4. Social Collections
10. **reviews** - Product & event reviews
11. **posts** - Community feed posts
12. **comments** - Comments on posts
13. **albums** - Photo albums

#### 5. Gamification Collections
14. **badges** - Badge definitions
15. **couplebadges** - Badges earned by couples
16. **achievements** - Achievement definitions
17. **coupleachievements** - Achievement progress
18. **milestones** - Important dates

#### 6. Engagement Collections
19. **notifications** - User notifications
20. **referrals** - Referral tracking
21. **credits** - Account credits
22. **reports** - Content reports

---

## Database Setup in Code

### Step 1: Install Mongoose
```bash
npm install mongoose
```

### Step 2: Create Connection File
**File**: `apps/main/src/lib/db.ts`

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

### Step 3: Environment Variable
**File**: `apps/main/.env.local`

```env
MONGODB_URI=mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin
```

---

## Example: User Schema

```typescript
// packages/shared/models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  provider: {
    type: String,
    enum: ['email', 'google', 'facebook'],
    default: 'email'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

---

## Example: Couple Schema

```typescript
// packages/shared/models/Couple.ts
import mongoose from 'mongoose';

const CoupleSchema = new mongoose.Schema({
  user1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coupleName: {
    type: String,
    required: true
  },
  bio: String,
  age1: Number,
  age2: Number,
  location: {
    city: String,
    state: String,
    country: String
  },
  interests: [String],
  photos: [String],
  profilePhoto: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Couple || mongoose.model('Couple', CoupleSchema);
```

---

## Using Database in API Routes

### Example: Create User API
**File**: `apps/main/src/app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get data from request
    const { email, password } = await req.json();
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

---

## Database Operations

### 1. Create (Insert)
```typescript
// Create one document
const user = await User.create({
  email: 'test@example.com',
  password: 'hashedpassword'
});

// Create multiple documents
const products = await Product.insertMany([
  { name: 'Product 1', price: 100 },
  { name: 'Product 2', price: 200 }
]);
```

### 2. Read (Find)
```typescript
// Find all
const users = await User.find();

// Find with filter
const activeUsers = await User.find({ isActive: true });

// Find one
const user = await User.findOne({ email: 'test@example.com' });

// Find by ID
const user = await User.findById(userId);

// Find with population (joins)
const couple = await Couple.findById(coupleId)
  .populate('user1Id')
  .populate('user2Id');
```

### 3. Update
```typescript
// Update one
await User.updateOne(
  { _id: userId },
  { $set: { emailVerified: true } }
);

// Update many
await Product.updateMany(
  { category: 'toys' },
  { $set: { isActive: true } }
);

// Find and update
const updatedUser = await User.findByIdAndUpdate(
  userId,
  { emailVerified: true },
  { new: true } // Return updated document
);
```

### 4. Delete
```typescript
// Delete one
await User.deleteOne({ _id: userId });

// Delete many
await Product.deleteMany({ isActive: false });

// Find and delete
await User.findByIdAndDelete(userId);
```

### 5. Advanced Queries
```typescript
// Search with regex
const couples = await Couple.find({
  coupleName: { $regex: 'john', $options: 'i' }
});

// Filter with conditions
const products = await Product.find({
  price: { $gte: 100, $lte: 500 }, // Between 100-500
  inStock: true
});

// Sort
const products = await Product.find()
  .sort({ price: -1 }) // Descending
  .limit(10);

// Pagination
const page = 1;
const limit = 20;
const products = await Product.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

---

## Database Indexing (for Performance)

```typescript
// Add indexes to frequently queried fields
CoupleSchema.index({ coupleName: 1 });
CoupleSchema.index({ 'location.city': 1 });
CoupleSchema.index({ isActive: 1 });
CoupleSchema.index({ createdAt: -1 });

ProductSchema.index({ name: 'text' }); // Text search
ProductSchema.index({ category: 1, price: 1 }); // Compound index
```

---

## Database Backup Strategy

### Manual Backup
```bash
# Backup entire database
mongodump --uri="mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin" --out=/backup/

# Restore database
mongorestore --uri="mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin" /backup/coupledelight/
```

### Automated Backup (Recommended)
- Set up daily automatic backups
- Keep backups for 30 days
- Store in secure location (AWS S3, Google Cloud Storage)

---

## MongoDB GUI Tools

### Option 1: MongoDB Compass (Official)
- Download: https://www.mongodb.com/products/compass
- Connect using your connection string
- Visual interface to browse data

### Option 2: Studio 3T
- Download: https://studio3t.com/
- More features than Compass
- SQL query support

### Option 3: NoSQLBooster
- Download: https://nosqlbooster.com/
- Lightweight and fast
- Good for developers

---

## Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use environment variables** for connection strings
3. **Enable authentication** (already done)
4. **Use SSL/TLS** for production
5. **Regular backups** daily
6. **Monitor database** for suspicious activity
7. **Limit IP access** if possible
8. **Use read-only users** for analytics

---

## Database Monitoring

### Key Metrics to Monitor
- **Connections**: Current active connections
- **Query Performance**: Slow queries
- **Storage Size**: Database size growth
- **Memory Usage**: RAM utilization
- **CPU Usage**: Processing power

### Monitoring Tools
- MongoDB Atlas (if migrating to cloud)
- MongoDB Compass
- Custom dashboards using Grafana

---

## Migration to Production (Future)

### MongoDB Atlas (Recommended for Production)
1. Create MongoDB Atlas account
2. Create cluster
3. Get new connection string
4. Migrate data
5. Update environment variables

**Atlas Benefits:**
- Automatic backups
- Better security
- Scaling made easy
- Monitoring included
- 99.99% uptime

---

## Summary

✅ **Database**: MongoDB (NoSQL Document Database)  
✅ **Your Connection**: Already provided and ready to use  
✅ **Collections**: 22 collections for all features  
✅ **Library**: Mongoose for easy schema management  
✅ **Performance**: Indexing for fast queries  
✅ **Security**: Authentication enabled  

**Your database is ready! Just need to connect it in the code.** 🚀