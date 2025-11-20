# CoupleDelight - Implementation Guide

## Quick Start Commands

### Initial Setup
```bash
# Create main application
cd /Users/manmohankumar/Desktop/coupledelight
npx create-next-app@latest apps/main --typescript --tailwind --app --src-dir

# Create admin panel
npx create-next-app@latest apps/admin --typescript --tailwind --app --src-dir

# Create shared package directory
mkdir -p packages/shared/models
mkdir -p packages/shared/types
mkdir -p packages/shared/utils
```

### Install Dependencies

#### Main Application
```bash
cd apps/main
npm install mongoose
npm install next-auth@beta
npm install bcryptjs
npm install socket.io-client
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install zod
npm install react-hook-form @hookform/resolvers
npm install -D @types/bcryptjs
```

#### Admin Panel
```bash
cd apps/admin
npm install mongoose
npm install next-auth@beta
npm install bcryptjs
npm install recharts
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install zod
npm install react-hook-form @hookform/resolvers
npm install -D @types/bcryptjs
```

## Phase 1: Foundation (Week 1)

### Tasks:
1. Set up project structure
2. Configure MongoDB connection
3. Create database schemas
4. Set up authentication with NextAuth
5. Create basic UI components

### Key Files to Create:

**Main App:**
- `apps/main/src/lib/db.ts` - MongoDB connection
- `apps/main/src/lib/auth.ts` - NextAuth configuration
- `apps/main/.env.local` - Environment variables
- `packages/shared/models/User.ts` - User schema
- `packages/shared/models/Couple.ts` - Couple schema

**Admin Panel:**
- `apps/admin/src/lib/db.ts` - MongoDB connection
- `apps/admin/src/lib/auth.ts` - Admin auth
- `apps/admin/.env.local` - Environment variables

## Phase 2: User Features (Week 2-3)

### Tasks:
1. Build registration and login pages
2. Create couple profile setup
3. Implement profile management
4. Build couple discovery page
5. Add search and filter functionality

### Key Pages:
- `apps/main/src/app/auth/register/page.tsx`
- `apps/main/src/app/auth/login/page.tsx`
- `apps/main/src/app/profile/create/page.tsx`
- `apps/main/src/app/discover/page.tsx`

## Phase 3: Connection System (Week 4)

### Tasks:
1. Create connection request API
2. Build connection management UI
3. Implement accept/reject functionality
4. Add notification system
5. Create chat interface

### Key Components:
- Connection request card
- Connection list
- Chat window
- Message bubble component

## Phase 4: E-commerce (Week 5-6)

### Tasks:
1. Create product catalog
2. Build product detail pages
3. Implement shopping cart
4. Create checkout flow
5. Build order management

### Database Collections:
- Products
- Cart items
- Orders

## Phase 5: Admin Panel (Week 7)

### Tasks:
1. Build admin dashboard
2. Create user management
3. Implement product CRUD
4. Add order management
5. Create analytics views

### Admin Pages:
- Dashboard with stats
- User list and details
- Product management
- Order fulfillment
- Settings

## Phase 6: Polish & Deploy (Week 8)

### Tasks:
1. Add responsive design
2. Implement error handling
3. Set up email notifications
4. Add image upload
5. Testing and bug fixes
6. Deploy to production

## Database Schema Implementation

### Example: User Model
```typescript
// packages/shared/models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
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
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

## API Route Structure

### Example: Connection Request API
```typescript
// apps/main/src/app/api/connections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Connection from '@/models/Connection';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  const { toCoupleId, message } = await req.json();
  
  const connection = await Connection.create({
    fromCoupleId: session.user.coupleId,
    toCoupleId,
    message,
    status: 'pending'
  });
  
  return NextResponse.json(connection);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  const connections = await Connection.find({
    $or: [
      { fromCoupleId: session.user.coupleId },
      { toCoupleId: session.user.coupleId }
    ]
  }).populate('fromCoupleId toCoupleId');
  
  return NextResponse.json(connections);
}
```

## Component Examples

### Couple Card Component
```typescript
// apps/main/src/components/couples/CoupleCard.tsx
interface CoupleCardProps {
  couple: {
    _id: string;
    coupleName: string;
    profilePhoto: string;
    bio: string;
    location: {
      city: string;
      state: string;
    };
  };
  onConnect: (id: string) => void;
}

export function CoupleCard({ couple, onConnect }: CoupleCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <img 
        src={couple.profilePhoto} 
        alt={couple.coupleName}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="text-xl font-bold mt-2">{couple.coupleName}</h3>
      <p className="text-sm text-gray-600">
        {couple.location.city}, {couple.location.state}
      </p>
      <p className="mt-2 text-sm line-clamp-2">{couple.bio}</p>
      <button 
        onClick={() => onConnect(couple._id)}
        className="mt-4 w-full bg-pink-600 text-white py-2 rounded-md"
      >
        Connect
      </button>
    </div>
  );
}
```

## Testing Strategy

### Unit Tests
- Model validation
- API route logic
- Utility functions

### Integration Tests
- Authentication flow
- Connection request flow
- Order placement flow

### E2E Tests
- User registration
- Profile creation
- Shopping journey

## Security Checklist

- [ ] Environment variables secured
- [ ] Password hashing implemented
- [ ] JWT tokens secure
- [ ] OAuth configured correctly
- [ ] API rate limiting added
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] CORS configured properly
- [ ] Age verification implemented
- [ ] Content moderation in place

## Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Lazy load images
   - Compress uploads

2. **Database Queries**
   - Index frequently queried fields
   - Use pagination
   - Implement caching

3. **API Responses**
   - Minimize payload size
   - Use HTTP caching headers
   - Implement CDN

## Monitoring & Analytics

- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Server metrics

## Deployment Checklist

- [ ] Environment variables set
- [ ] Database connection tested
- [ ] OAuth credentials configured
- [ ] Image storage configured
- [ ] Email service configured
- [ ] Domain DNS configured
- [ ] SSL certificates installed
- [ ] Build process tested
- [ ] Error pages customized
- [ ] Robots.txt configured

---

This guide will be updated as development progresses.