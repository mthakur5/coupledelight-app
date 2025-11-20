# CoupleDelight Platform

A Next.js-based platform for couples to connect, interact, and shop for adult products.

## 📋 Project Overview

**CoupleDelight** is a comprehensive web platform consisting of two separate applications:

1. **Main Application** - User-facing platform where couples can:
   - Create profiles with photos and preferences
   - Discover other couples based on interests and location
   - Send and receive connection requests
   - Chat with connected couples in real-time
   - Browse and purchase adult products
   - Track orders and manage purchases

2. **Admin Panel** - Separate backend management system for:
   - Managing users and couple profiles
   - Product catalog management (CRUD operations)
   - Order fulfillment and tracking
   - Analytics and platform statistics

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: NextAuth.js v5 (Email/Password + Google + Facebook OAuth)
- **Styling**: Tailwind CSS
- **Real-time Chat**: Socket.io
- **Image Storage**: Cloudinary/AWS S3
- **Email**: Nodemailer or SendGrid
- **Payment**: COD (Cash on Delivery) initially

## 📁 Project Structure

```
coupledelight/
├── apps/
│   ├── main/          # Main user application
│   └── admin/         # Admin panel (separate subdomain)
├── packages/
│   └── shared/        # Shared code (models, types, utils)
├── ARCHITECTURE.md    # Detailed architecture documentation
├── IMPLEMENTATION_GUIDE.md  # Step-by-step implementation guide
└── README.md          # This file
```

## 🗄️ Database Schema

### Core Collections:
- **Users** - Authentication and basic user info
- **Couples** - Couple profiles with photos, bio, preferences
- **Connections** - Connection requests and status
- **Messages** - Chat messages between connected couples
- **Products** - Product catalog with images and details
- **Orders** - Order history and tracking

## 🔐 Authentication

- **Email/Password**: Traditional registration with email verification
- **Google OAuth**: Sign in with Google account
- **Facebook OAuth**: Sign in with Facebook account
- **Admin Auth**: Separate authentication for admin panel

## 🚀 Key Features

### User Features
- ✅ User registration and authentication
- ✅ Couple profile creation with photos
- ✅ Advanced search and filtering
- ✅ Connection request system
- ✅ Real-time chat messaging
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ COD checkout and order tracking
- ✅ Privacy settings and content moderation

### Admin Features
- ✅ Dashboard with analytics
- ✅ User management
- ✅ Product CRUD operations
- ✅ Order management and fulfillment
- ✅ Platform statistics and reports

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB access (connection string provided)
- npm or yarn package manager

### Installation

See [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) for detailed setup instructions.

Quick start:
```bash
# Create main app
npx create-next-app@latest apps/main --typescript --tailwind --app --src-dir

# Create admin panel
npx create-next-app@latest apps/admin --typescript --tailwind --app --src-dir

# Install dependencies (see IMPLEMENTATION_GUIDE.md)
```

## 🔒 Security & Privacy

- Password hashing with bcrypt
- Secure session management
- Age verification (18+)
- Profile visibility controls
- Content moderation
- Rate limiting on APIs
- Input validation and sanitization

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (320px - 767px)

## 🗺️ Implementation Roadmap

### Phase 1: Foundation (Week 1)
- Project setup and structure
- Database schemas
- Authentication system

### Phase 2: User Features (Week 2-3)
- Profile management
- Couple discovery
- Search and filters

### Phase 3: Connection System (Week 4)
- Connection requests
- Real-time chat
- Notifications

### Phase 4: E-commerce (Week 5-6)
- Product catalog
- Shopping cart
- Checkout and orders

### Phase 5: Admin Panel (Week 7)
- Admin dashboard
- User management
- Product & order management

### Phase 6: Polish & Deploy (Week 8)
- Testing and bug fixes
- Performance optimization
- Production deployment

## 📚 Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Complete system architecture, database schemas, and API documentation
- [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) - Phase-by-phase implementation guide with code examples

## 🌐 MongoDB Connection

```
mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin
```

## 🚀 Deployment

### Development
- Main App: `http://localhost:3000`
- Admin Panel: `http://localhost:3001`

### Production
- Main App: `https://coupledelight.com`
- Admin Panel: `https://admin.coupledelight.com`

## 📝 Environment Variables

Create `.env.local` files in both apps. See [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) for complete list.

## 🤝 Contributing

This is a private project. Development will be done in phases as outlined in the implementation guide.

## 📄 License

Private/Proprietary

---

**Ready to start building?** Switch to Code mode to begin implementation!