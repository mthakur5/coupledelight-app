# CoupleDelight Platform - Architecture Documentation

## Project Overview

A Next.js-based platform for couples to connect, interact, and shop for adult products. The system consists of two separate applications:
1. **Main Application** - User-facing platform for couples
2. **Admin Panel** - Backend management system

## Technology Stack

### Frontend & Backend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui or similar
- **Authentication**: NextAuth.js v5
- **Social Auth**: Google OAuth, Facebook OAuth

### Database & Storage
- **Database**: MongoDB (provided connection)
- **ORM/ODM**: Mongoose
- **Image Storage**: Cloudinary or AWS S3
- **Session Store**: MongoDB

### Real-time Features
- **Chat System**: Socket.io or Pusher
- **Notifications**: Server-Sent Events or WebSockets

### Email & Notifications
- **Email Service**: Nodemailer with SMTP or SendGrid
- **Email Templates**: React Email

## Project Structure

```
coupledelight/
├── apps/
│   ├── main/                      # Main user-facing application
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/               # Next.js App Router
│   │   │   │   ├── api/           # API routes
│   │   │   │   │   ├── auth/      # Authentication endpoints
│   │   │   │   │   ├── couples/   # Couple management
│   │   │   │   │   ├── connections/ # Connection requests
│   │   │   │   │   ├── messages/  # Chat endpoints
│   │   │   │   │   ├── products/  # Product catalog
│   │   │   │   │   ├── cart/      # Shopping cart
│   │   │   │   │   └── orders/    # Order management
│   │   │   │   ├── auth/          # Auth pages
│   │   │   │   ├── dashboard/     # User dashboard
│   │   │   │   ├── profile/       # Profile management
│   │   │   │   ├── discover/      # Couple discovery
│   │   │   │   ├── connections/   # Connection management
│   │   │   │   ├── messages/      # Chat interface
│   │   │   │   ├── shop/          # Product catalog
│   │   │   │   ├── cart/          # Shopping cart
│   │   │   │   └── orders/        # Order history
│   │   │   ├── components/        # Reusable components
│   │   │   │   ├── ui/            # Base UI components
│   │   │   │   ├── auth/          # Auth-related components
│   │   │   │   ├── profile/       # Profile components
│   │   │   │   ├── chat/          # Chat components
│   │   │   │   └── shop/          # Shopping components
│   │   │   ├── lib/               # Utilities
│   │   │   │   ├── db.ts          # MongoDB connection
│   │   │   │   ├── auth.ts        # NextAuth config
│   │   │   │   ├── socket.ts      # Socket.io setup
│   │   │   │   └── utils.ts       # Helper functions
│   │   │   └── types/             # TypeScript types
│   │   ├── .env.local             # Environment variables
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin/                     # Admin panel application
│       ├── public/
│       ├── src/
│       │   ├── app/               # Next.js App Router
│       │   │   ├── api/           # Admin API routes
│       │   │   │   ├── auth/      # Admin authentication
│       │   │   │   ├── users/     # User management
│       │   │   │   ├── products/  # Product CRUD
│       │   │   │   ├── orders/    # Order management
│       │   │   │   └── analytics/ # Statistics
│       │   │   ├── login/         # Admin login
│       │   │   ├── dashboard/     # Main dashboard
│       │   │   ├── users/         # User management
│       │   │   ├── products/      # Product management
│       │   │   ├── orders/        # Order management
│       │   │   └── settings/      # Admin settings
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   ├── dashboard/
│       │   │   ├── tables/
│       │   │   └── forms/
│       │   ├── lib/
│       │   │   ├── db.ts
│       │   │   └── utils.ts
│       │   └── types/
│       ├── .env.local
│       ├── next.config.js
│       ├── package.json
│       └── tsconfig.json
│
└── packages/
    └── shared/                    # Shared code between apps
        ├── models/                # MongoDB schemas
        │   ├── User.ts
        │   ├── Couple.ts
        │   ├── Connection.ts
        │   ├── Message.ts
        │   ├── Product.ts
        │   └── Order.ts
        ├── types/                 # Shared TypeScript types
        └── utils/                 # Shared utilities
```

## System Architecture

```mermaid
graph TB
    subgraph Client Layer
        WebApp[Main Web App]
        AdminApp[Admin Panel]
    end
    
    subgraph Application Layer
        NextMain[Next.js Main Server]
        NextAdmin[Next.js Admin Server]
        SocketServer[Socket.io Server]
    end
    
    subgraph Authentication
        NextAuth[NextAuth.js]
        GoogleAuth[Google OAuth]
        FacebookAuth[Facebook OAuth]
    end
    
    subgraph Database Layer
        MongoDB[(MongoDB Database)]
    end
    
    subgraph External Services
        CloudStorage[Image Storage]
        EmailService[Email Service]
    end
    
    WebApp --> NextMain
    AdminApp --> NextAdmin
    NextMain --> NextAuth
    NextAdmin --> NextAuth
    NextAuth --> GoogleAuth
    NextAuth --> FacebookAuth
    NextMain --> MongoDB
    NextAdmin --> MongoDB
    NextMain --> SocketServer
    SocketServer --> MongoDB
    NextMain --> CloudStorage
    NextAdmin --> CloudStorage
    NextMain --> EmailService
```

## Database Schema

### User Schema
```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  emailVerified: boolean,
  provider: 'email' | 'google' | 'facebook',
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Couple Schema
```typescript
{
  _id: ObjectId,
  user1Id: ObjectId (ref: User),
  user2Id: ObjectId (ref: User),
  coupleName: string,
  bio: string,
  age1: number,
  age2: number,
  location: {
    city: string,
    state: string,
    country: string
  },
  interests: string[],
  lookingFor: string[],
  photos: string[],
  profilePhoto: string,
  isVerified: boolean,
  isActive: boolean,
  privacySettings: {
    showLocation: boolean,
    showAge: boolean,
    onlyVerifiedCouples: boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Connection Schema
```typescript
{
  _id: ObjectId,
  fromCoupleId: ObjectId (ref: Couple),
  toCoupleId: ObjectId (ref: Couple),
  status: 'pending' | 'accepted' | 'rejected' | 'blocked',
  message: string,
  createdAt: Date,
  respondedAt: Date,
  updatedAt: Date
}
```

### Message Schema
```typescript
{
  _id: ObjectId,
  connectionId: ObjectId (ref: Connection),
  senderId: ObjectId (ref: Couple),
  message: string,
  type: 'text' | 'image' | 'video',
  mediaUrl: string,
  isRead: boolean,
  readAt: Date,
  createdAt: Date
}
```

### Product Schema
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  category: string,
  subcategory: string,
  price: number,
  discountedPrice: number,
  images: string[],
  inStock: boolean,
  stockQuantity: number,
  tags: string[],
  isActive: boolean,
  isFeatured: boolean,
  ratings: {
    average: number,
    count: number
  },
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```typescript
{
  _id: ObjectId,
  orderNumber: string,
  coupleId: ObjectId (ref: Couple),
  items: [{
    productId: ObjectId (ref: Product),
    name: string,
    price: number,
    quantity: number
  }],
  totalAmount: number,
  shippingAddress: {
    name: string,
    phone: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    pincode: string
  },
  paymentMethod: 'COD',
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  trackingNumber: string,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```
### Wishlist Schema
```typescript
{
  _id: ObjectId,
  coupleId: ObjectId (ref: Couple),
  productId: ObjectId (ref: Product),
  addedAt: Date,
  notes: string
}
```

### Event Schema
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  category: 'restaurant' | 'adventure' | 'romantic' | 'entertainment' | 'spa' | 'outdoor' | 'cultural',
  subcategory: string,
  location: {
    name: string,
    address: string,
    city: string,
    state: string,
    coordinates: {
      lat: number,
      lng: number
    }
  },
  images: string[],
  price: number,
  duration: string,
  maxCapacity: number,
  amenities: string[],
  availability: [{
    date: Date,
    slots: [{
      time: string,
      available: boolean,
      booked: number
    }]
  }],
  isActive: boolean,
  isFeatured: boolean,
  ratings: {
    average: number,
    count: number
  },
  tags: string[],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Schema
```typescript
{
  _id: ObjectId,
  bookingNumber: string,
  coupleId: ObjectId (ref: Couple),
  eventId: ObjectId (ref: Event),
  eventDetails: {
    title: string,
    location: string,
    price: number
  },
  bookingDate: Date,
  bookingTime: string,
  numberOfPeople: number,
  totalAmount: number,
  contactDetails: {
    name: string,
    phone: string,
    email: string
  },
  specialRequests: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  paymentStatus: 'pending' | 'paid' | 'refunded',
  paymentMethod: 'COD' | 'online',
  confirmationSent: boolean,
  reminderSent: boolean,
  createdAt: Date,
  updatedAt: Date
}
```


## User Flow Diagrams

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Next.js App
    participant N as NextAuth
    participant P as OAuth Provider
    participant DB as MongoDB
    
    U->>A: Access Protected Page
    A->>N: Check Session
    N->>A: No Session
    A->>U: Redirect to Login
    U->>A: Click Social Login
    A->>N: Initiate OAuth
    N->>P: Redirect to Provider
    P->>U: Login Prompt
    U->>P: Authenticate
    P->>N: Return Auth Code
    N->>P: Exchange for Token
    P->>N: Return User Info
    N->>DB: Create/Update User
    DB->>N: User Data
    N->>A: Create Session
    A->>U: Redirect to Dashboard
```

### Connection Request Flow

```mermaid
sequenceDiagram
    participant C1 as Couple 1
    participant A as App
    participant API as API
    participant DB as MongoDB
    participant N as Notification
    participant C2 as Couple 2
    
    C1->>A: Browse Couples
    A->>API: Get Couple List
    API->>DB: Query Couples
    DB->>API: Return Results
    API->>A: Display Couples
    C1->>A: Send Connection Request
    A->>API: POST Connection
    API->>DB: Create Connection
    DB->>API: Connection Created
    API->>N: Send Notification

#### Wishlist
- `GET /api/wishlist` - Get wishlist items for couple
- `POST /api/wishlist` - Add product to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

#### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/[id]` - Get event details
- `GET /api/events/categories` - Get event categories
- `GET /api/events/[id]/availability` - Check event availability

#### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]/cancel` - Cancel booking
    N->>C2: Email/Push Notification
    API->>A: Success Response
    A->>C1: Request Sent Confirmation
    
    C2->>A: View Requests
    A->>API: GET Pending Requests
    API->>DB: Query Requests
    DB->>API: Return Requests
    API->>A: Display Requests
    C2->>A: Accept Request
    A->>API: PUT Connection Status
    API->>DB: Update Status
    DB->>API: Updated
    API->>N: Notify Acceptance
    N->>C1: Connection Accepted
```


#### Events
- `GET /api/admin/events` - List all events
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/[id]` - Update event
- `DELETE /api/admin/events/[id]` - Delete event
- `PUT /api/admin/events/[id]/availability` - Update availability

#### Bookings
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/bookings/[id]` - Get booking details
- `PUT /api/admin/bookings/[id]` - Update booking status
- `DELETE /api/admin/bookings/[id]` - Cancel/refund booking
### Shopping Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Shop Page
    participant API as API
    participant DB as MongoDB
    participant C as Cart
    participant O as Order
    
    U->>S: Browse Products
    S->>API: GET Products
    API->>DB: Query Products
    DB->>API: Return Products
    API->>S: Display Products
    U->>S: Add to Cart
    S->>C: Update Cart State
    U->>C: View Cart
    U->>C: Proceed to Checkout
    C->>O: Navigate to Checkout
    U->>O: Enter Shipping Details
    U->>O: Select COD Payment
    O->>API: POST Create Order
    API->>DB: Save Order
    DB->>API: Order Created
    API->>O: Order Confirmation
    O->>U: Success Page
```

## API Structure

### Main Application APIs

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/session` - Get current session
- `POST /api/auth/logout` - Logout user

#### Couples
- `GET /api/couples` - Get all couples (with filters)
- `GET /api/couples/[id]` - Get couple profile
- `POST /api/couples` - Create couple profile
- `PUT /api/couples/[id]` - Update couple profile
- `DELETE /api/couples/[id]` - Delete couple profile

#### Connections
- `GET /api/connections` - Get connections for logged-in couple
- `POST /api/connections` - Send connection request
- `PUT /api/connections/[id]` - Accept/reject request
- `DELETE /api/connections/[id]` - Remove connection

#### Messages
- `GET /api/messages/[connectionId]` - Get conversation
- `POST /api/messages` - Send message
- `PUT /api/messages/[id]/read` - Mark as read

#### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/[id]` - Get product details
- `GET /api/products/categories` - Get categories

#### Cart & Orders
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get order details

### Admin Panel APIs

#### Users
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/[id]` - Get user details
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

#### Products
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

#### Orders
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/orders/[id]` - Get order details
- `PUT /api/admin/orders/[id]` - Update order status

#### Analytics
- `GET /api/admin/analytics/dashboard` - Dashboard stats
- `GET /api/admin/analytics/sales` - Sales analytics
- `GET /api/admin/analytics/users` - User analytics

## Security Considerations

1. **Authentication**: 
   - Secure password hashing with bcrypt
   - JWT tokens for session management
   - OAuth 2.0 for social login

2. **Data Privacy**:
   - Age verification (18+)
   - Profile visibility controls
   - Data encryption at rest

3. **Content Moderation**:
   - Image upload restrictions
   - Profanity filters
   - Reporting system

4. **API Security**:
   - Rate limiting
   - CORS configuration
   - Input validation
   - SQL injection prevention (using Mongoose)

## Environment Variables

### Main Application (.env.local)
```
# Database
MONGODB_URI=mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# Socket.io
SOCKET_SERVER_URL=http://localhost:3001
```

### Admin Panel (.env.local)
```
# Database
MONGODB_URI=mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin

# Admin Auth
ADMIN_SECRET=your-admin-secret

# Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Deployment Strategy

### Development
- Main App: `http://localhost:3000`
- Admin Panel: `http://localhost:3001`
- Socket Server: `http://localhost:3002`

### Production
- Main App: `https://coupledelight.com`
- Admin Panel: `https://admin.coupledelight.com`
- Database: MongoDB Atlas or Self-hosted
- CDN: Cloudflare or AWS CloudFront
- Hosting: Vercel, AWS, or DigitalOcean

## Next Steps

1. Review and approve this architecture
2. Set up development environment
3. Initialize both Next.js projects
4. Implement core features in phases
5. Test and iterate
6. Deploy to production

---

**Note**: This is a comprehensive architecture document. Some features may be implemented in phases based on priority and timeline.