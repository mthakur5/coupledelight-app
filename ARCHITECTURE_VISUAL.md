# CoupleDelight - Visual Architecture

## Complete System Architecture

```mermaid
graph TB
    subgraph Users
        WebUser[Web Users - Couples]
        AdminUser[Admin Users]
    end
    
    subgraph Frontend Applications
        MainApp[Main Next.js App<br/>Port: 3000]
        AdminApp[Admin Next.js App<br/>Port: 3001]
    end
    
    subgraph API Layer
        MainAPI[Main API Routes<br/>REST APIs]
        AdminAPI[Admin API Routes<br/>REST APIs]
        SocketServer[Socket.io Server<br/>Real-time Chat]
    end
    
    subgraph Authentication
        NextAuth[NextAuth.js<br/>Session Management]
        Google[Google OAuth]
        Facebook[Facebook OAuth]
    end
    
    subgraph Database
        MongoDB[(MongoDB<br/>22 Collections)]
    end
    
    subgraph External Services
        CloudStorage[Cloud Storage<br/>Cloudinary/S3]
        EmailService[Email Service<br/>Nodemailer/SendGrid]
        SMS[SMS Service<br/>OTP Verification]
    end
    
    WebUser --> MainApp
    AdminUser --> AdminApp
    
    MainApp --> MainAPI
    MainApp --> SocketServer
    AdminApp --> AdminAPI
    
    MainAPI --> NextAuth
    AdminAPI --> NextAuth
    NextAuth --> Google
    NextAuth --> Facebook
    
    MainAPI --> MongoDB
    AdminAPI --> MongoDB
    SocketServer --> MongoDB
    
    MainAPI --> CloudStorage
    AdminAPI --> CloudStorage
    MainAPI --> EmailService
    AdminAPI --> EmailService
    MainAPI --> SMS
```

## Feature Architecture Map

```mermaid
graph LR
    subgraph Core Platform
        Auth[Authentication]
        Profile[Couple Profiles]
        Discovery[Couple Discovery]
        Connection[Connections]
        Chat[Real-time Chat]
    end
    
    subgraph E-commerce
        Products[Product Catalog]
        Cart[Shopping Cart]
        Wishlist[Wishlist]
        Checkout[Checkout]
        Orders[Order Management]
    end
    
    subgraph Events
        EventCatalog[Event Catalog]
        Booking[Event Booking]
        Calendar[Calendar View]
    end
    
    subgraph Social
        Reviews[Reviews & Ratings]
        Feed[Community Feed]
        Albums[Photo Albums]
        Share[Social Sharing]
    end
    
    subgraph Engagement
        Badges[Verification Badges]
        Achievements[Achievements]
        Referrals[Referral Program]
        Milestones[Milestones]
        Notifications[Notifications]
    end
    
    subgraph Admin
        Dashboard[Analytics Dashboard]
        UserMgmt[User Management]
        ContentMod[Content Moderation]
        ProductMgmt[Product Management]
        EventMgmt[Event Management]
    end
    
    Auth --> Profile
    Profile --> Discovery
    Discovery --> Connection
    Connection --> Chat
    
    Profile --> Products
    Products --> Cart
    Cart --> Wishlist
    Cart --> Checkout
    Checkout --> Orders
    
    Profile --> EventCatalog
    EventCatalog --> Booking
    Booking --> Calendar
    
    Products --> Reviews
    Profile --> Feed
    Feed --> Albums
    Feed --> Share
    
    Profile --> Badges
    Profile --> Achievements
    Profile --> Referrals
    Profile --> Milestones
    Reviews --> Notifications
    Feed --> Notifications
    
    Dashboard --> UserMgmt
    Dashboard --> ContentMod
    Dashboard --> ProductMgmt
    Dashboard --> EventMgmt
```

## Database Schema Relationships

```mermaid
erDiagram
    USER ||--o{ COUPLE : creates
    USER ||--o{ ADMIN_ACTION : performs
    
    COUPLE ||--o{ CONNECTION : initiates
    COUPLE ||--o{ MESSAGE : sends
    COUPLE ||--o{ ORDER : places
    COUPLE ||--o{ WISHLIST : maintains
    COUPLE ||--o{ BOOKING : makes
    COUPLE ||--o{ REVIEW : writes
    COUPLE ||--o{ POST : creates
    COUPLE ||--o{ ALBUM : creates
    COUPLE ||--o{ NOTIFICATION : receives
    COUPLE ||--o{ COUPLE_BADGE : earns
    COUPLE ||--o{ COUPLE_ACHIEVEMENT : unlocks
    COUPLE ||--o{ REFERRAL : refers
    COUPLE ||--o{ MILESTONE : tracks
    
    PRODUCT ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ WISHLIST : listed_in
    PRODUCT ||--o{ REVIEW : reviewed_by
    
    EVENT ||--o{ BOOKING : booked_by
    EVENT ||--o{ REVIEW : reviewed_by
    
    POST ||--o{ COMMENT : has
    POST ||--o{ LIKE : receives
    
    ALBUM ||--o{ PHOTO : contains
    
    CONNECTION ||--o{ MESSAGE : enables
    
    BADGE ||--o{ COUPLE_BADGE : awarded_as
    ACHIEVEMENT ||--o{ COUPLE_ACHIEVEMENT : tracked_as
```

## User Journey: Complete Flow

```mermaid
graph TD
    Start[New User Visits] --> Register[Register Account]
    Register --> Verify[Verify Email]
    Verify --> CreateProfile[Create Couple Profile]
    CreateProfile --> Welcome[Welcome Dashboard]
    
    Welcome --> Discover[Discover Couples]
    Welcome --> Shop[Browse Products]
    Welcome --> Events[Browse Events]
    Welcome --> Social[Community Feed]
    
    Discover --> SendRequest[Send Connection Request]
    SendRequest --> AcceptRequest[Request Accepted]
    AcceptRequest --> StartChat[Start Chatting]
    
    Shop --> AddCart[Add to Cart]
    Shop --> AddWishlist[Add to Wishlist]
    AddCart --> CheckoutFlow[Checkout]
    CheckoutFlow --> PlaceOrder[Place Order COD]
    PlaceOrder --> TrackOrder[Track Order]
    TrackOrder --> WriteReview[Write Review]
    
    Events --> ViewEvent[View Event Details]
    ViewEvent --> CheckAvail[Check Availability]
    CheckAvail --> BookEvent[Book Event]
    BookEvent --> GetConfirm[Receive Confirmation]
    GetConfirm --> AttendEvent[Attend Event]
    AttendEvent --> RateEvent[Rate Event]
    
    Social --> CreatePost[Create Post]
    Social --> LikePost[Like Posts]
    Social --> Comment[Comment on Posts]
    CreatePost --> GetLikes[Receive Likes]
    GetLikes --> EarnBadge[Earn Achievement Badge]
    
    WriteReview --> EarnPoints[Earn Points]
    RateEvent --> EarnPoints
    EarnBadge --> LevelUp[Level Up]
    EarnPoints --> LevelUp
    
    Welcome --> InviteFriends[Invite Friends]
    InviteFriends --> EarnReward[Earn Referral Reward]
```

## API Architecture

```mermaid
graph TB
    subgraph Client Requests
        WebReq[Web Browser Request]
        MobileReq[Mobile App Request]
    end
    
    subgraph API Gateway
        Router[Next.js API Router]
    end
    
    subgraph Middleware
        Auth[Authentication Check]
        RateLimit[Rate Limiting]
        Validation[Input Validation]
        Logging[Request Logging]
    end
    
    subgraph API Endpoints - Main App
        AuthAPI[/api/auth/*]
        CoupleAPI[/api/couples/*]
        ConnAPI[/api/connections/*]
        MsgAPI[/api/messages/*]
        ProdAPI[/api/products/*]
        CartAPI[/api/cart/*]
        WishAPI[/api/wishlist/*]
        OrderAPI[/api/orders/*]
        EventAPI[/api/events/*]
        BookAPI[/api/bookings/*]
        ReviewAPI[/api/reviews/*]
        PostAPI[/api/posts/*]
        AlbumAPI[/api/albums/*]
        NotifAPI[/api/notifications/*]
        BadgeAPI[/api/badges/*]
        AchieveAPI[/api/achievements/*]
        ReferAPI[/api/referrals/*]
    end
    
    subgraph API Endpoints - Admin
        AdminAuth[/api/admin/auth/*]
        AdminUser[/api/admin/users/*]
        AdminProd[/api/admin/products/*]
        AdminEvent[/api/admin/events/*]
        AdminOrder[/api/admin/orders/*]
        AdminBook[/api/admin/bookings/*]
        AdminMod[/api/admin/moderation/*]
    end
    
    subgraph Business Logic
        Controllers[Controllers]
        Services[Services]
        Validators[Validators]
    end
    
    subgraph Data Access
        Models[Mongoose Models]
        DB[(MongoDB)]
    end
    
    WebReq --> Router
    MobileReq --> Router
    
    Router --> Auth
    Auth --> RateLimit
    RateLimit --> Validation
    Validation --> Logging
    
    Logging --> AuthAPI
    Logging --> CoupleAPI
    Logging --> ConnAPI
    Logging --> MsgAPI
    Logging --> ProdAPI
    Logging --> CartAPI
    Logging --> WishAPI
    Logging --> OrderAPI
    Logging --> EventAPI
    Logging --> BookAPI
    Logging --> ReviewAPI
    Logging --> PostAPI
    Logging --> AlbumAPI
    Logging --> NotifAPI
    Logging --> BadgeAPI
    Logging --> AchieveAPI
    Logging --> ReferAPI
    
    Logging --> AdminAuth
    Logging --> AdminUser
    Logging --> AdminProd
    Logging --> AdminEvent
    Logging --> AdminOrder
    Logging --> AdminBook
    Logging --> AdminMod
    
    AuthAPI --> Controllers
    CoupleAPI --> Controllers
    ProdAPI --> Controllers
    EventAPI --> Controllers
    AdminUser --> Controllers
    
    Controllers --> Services
    Services --> Validators
    Validators --> Models
    Models --> DB
```

## Feature Dependency Graph

```mermaid
graph TD
    Auth[Authentication<br/>MUST HAVE FIRST]
    
    Auth --> Profile[Couple Profiles<br/>Phase 1]
    Auth --> Admin[Admin Panel<br/>Phase 1]
    
    Profile --> Discovery[Discovery<br/>Phase 2]
    Profile --> Connection[Connections<br/>Phase 2]
    Connection --> Chat[Real-time Chat<br/>Phase 2]
    
    Profile --> Products[Products<br/>Phase 3]
    Products --> Cart[Cart<br/>Phase 3]
    Products --> Wishlist[Wishlist<br/>Phase 3]
    Cart --> Checkout[Checkout<br/>Phase 3]
    Checkout --> Orders[Orders<br/>Phase 3]
    
    Profile --> Events[Events<br/>Phase 4]
    Events --> Booking[Booking<br/>Phase 4]
    Booking --> Calendar[Calendar<br/>Phase 4]
    
    Products --> Reviews[Reviews<br/>Phase 5]
    Events --> Reviews
    Profile --> Feed[Community Feed<br/>Phase 5]
    Feed --> Albums[Albums<br/>Phase 5]
    Profile --> Milestones[Milestones<br/>Phase 5]
    
    Profile --> Badges[Badges<br/>Phase 6]
    Profile --> Achievements[Achievements<br/>Phase 6]
    Profile --> Referrals[Referrals<br/>Phase 6]
    Reviews --> Notifications[Notifications<br/>Phase 6]
    Feed --> Notifications
    Connection --> Notifications
    
    Reviews --> Share[Social Share<br/>Phase 6]
    Feed --> Share
    Products --> Share
    Events --> Share
    
    style Auth fill:#ff6b6b
    style Profile fill:#4ecdc4
    style Admin fill:#ffe66d
    style Discovery fill:#95e1d3
    style Connection fill:#95e1d3
    style Chat fill:#95e1d3
    style Products fill:#a8e6cf
    style Cart fill:#a8e6cf
    style Wishlist fill:#a8e6cf
    style Checkout fill:#a8e6cf
    style Orders fill:#a8e6cf
    style Events fill:#dda0dd
    style Booking fill:#dda0dd
    style Calendar fill:#dda0dd
    style Reviews fill:#ffd3b6
    style Feed fill:#ffd3b6
    style Albums fill:#ffd3b6
    style Milestones fill:#ffd3b6
    style Badges fill:#aaffa9
    style Achievements fill:#aaffa9
    style Referrals fill:#aaffa9
    style Notifications fill:#aaffa9
    style Share fill:#aaffa9
```

## Data Flow: Order Processing

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as API
    participant DB as MongoDB
    participant Email as Email Service
    participant Admin as Admin Panel
    
    U->>F: Browse Products
    F->>API: GET /api/products
    API->>DB: Query Products
    DB->>API: Return Products
    API->>F: Display Products
    
    U->>F: Add to Cart
    F->>API: POST /api/cart
    API->>DB: Save Cart Item
    DB->>API: Confirmation
    API->>F: Update Cart
    
    U->>F: Proceed to Checkout
    F->>API: POST /api/orders
    API->>DB: Create Order
    DB->>API: Order Created
    API->>Email: Send Confirmation
    Email->>U: Order Email
    API->>F: Success Page
    
    Admin->>API: View Orders
    API->>DB: Get Orders
    DB->>API: Return Orders
    API->>Admin: Display Orders
    
    Admin->>API: Update Status to Shipped
    API->>DB: Update Order
    DB->>API: Updated
    API->>Email: Send Shipping Email
    Email->>U: Tracking Email
```

## Security Architecture

```mermaid
graph TB
    subgraph User Access
        User[User Request]
    end
    
    subgraph Security Layers
        HTTPS[HTTPS/TLS<br/>Encryption]
        WAF[Web Application Firewall]
        RateLimit[Rate Limiting]
        CORS[CORS Policy]
    end
    
    subgraph Authentication
        JWT[JWT Validation]
        Session[Session Check]
        OAuth[OAuth Tokens]
    end
    
    subgraph Authorization
        RoleCheck[Role-Based Access]
        PermCheck[Permission Check]
        OwnerCheck[Ownership Verification]
    end
    
    subgraph Input Security
        Sanitize[Input Sanitization]
        Validate[Schema Validation]
        XSS[XSS Protection]
        CSRF[CSRF Protection]
    end
    
    subgraph Data Security
        Encrypt[Data Encryption]
        Hash[Password Hashing]
        Audit[Audit Logs]
    end
    
    User --> HTTPS
    HTTPS --> WAF
    WAF --> RateLimit
    RateLimit --> CORS
    
    CORS --> JWT
    JWT --> Session
    Session --> OAuth
    
    OAuth --> RoleCheck
    RoleCheck --> PermCheck
    PermCheck --> OwnerCheck
    
    OwnerCheck --> Sanitize
    Sanitize --> Validate
    Validate --> XSS
    XSS --> CSRF
    
    CSRF --> Encrypt
    Encrypt --> Hash
    Hash --> Audit
    
    Audit --> DB[(Secure Database)]
```

## Deployment Architecture

```mermaid
graph TB
    subgraph Internet
        Users[Users]
    end
    
    subgraph DNS
        Domain[coupledelight.com<br/>admin.coupledelight.com]
    end
    
    subgraph CDN
        Cloudflare[Cloudflare CDN<br/>Static Assets]
    end
    
    subgraph Load Balancer
        LB[Load Balancer<br/>NGINX]
    end
    
    subgraph Application Servers
        App1[Next.js Server 1<br/>Main App]
        App2[Next.js Server 2<br/>Main App]
        Admin1[Admin Server<br/>Admin Panel]
        Socket1[Socket.io Server<br/>Real-time]
    end
    
    subgraph Database Cluster
        Primary[(MongoDB Primary)]
        Secondary1[(MongoDB Secondary 1)]
        Secondary2[(MongoDB Secondary 2)]
    end
    
    subgraph Storage
        S3[AWS S3 / Cloudinary<br/>Image Storage]
    end
    
    subgraph Monitoring
        Monitor[Monitoring<br/>Logs & Analytics]
    end
    
    Users --> Domain
    Domain --> Cloudflare
    Cloudflare --> LB
    
    LB --> App1
    LB --> App2
    LB --> Admin1
    LB --> Socket1
    
    App1 --> Primary
    App2 --> Primary
    Admin1 --> Primary
    Socket1 --> Primary
    
    Primary --> Secondary1
    Primary --> Secondary2
    
    App1 --> S3
    App2 --> S3
    Admin1 --> S3
    
    App1 --> Monitor
    App2 --> Monitor
    Admin1 --> Monitor
    Socket1 --> Monitor
```

## Technology Stack Breakdown

```mermaid
graph LR
    subgraph Frontend
        Next[Next.js 14+]
        React[React 18+]
        TS[TypeScript]
        Tailwind[Tailwind CSS]
        UI[shadcn/ui]
    end
    
    subgraph Backend
        NextAPI[Next.js API Routes]
        NextAuth[NextAuth.js v5]
        Socket[Socket.io]
    end
    
    subgraph Database
        Mongo[MongoDB]
        Mongoose[Mongoose ODM]
    end
    
    subgraph External
        CloudStorage[Cloudinary/S3]
        EmailSvc[SendGrid/Nodemailer]
        OAuth2[Google/Facebook OAuth]
    end
    
    subgraph DevOps
        Docker[Docker]
        Git[Git/GitHub]
        Vercel[Vercel/AWS]
    end
    
    Next --> React
    React --> TS
    TS --> Tailwind
    Tailwind --> UI
    
    NextAPI --> NextAuth
    NextAPI --> Socket
    
    Mongo --> Mongoose
    
    NextAPI --> CloudStorage
    NextAPI --> EmailSvc
    NextAuth --> OAuth2
    
    Next --> Docker
    Docker --> Git
    Git --> Vercel
```

---

## Key Statistics

### Database Collections: **22**
- Users
- Couples
- Connections
- Messages
- Products
- Orders
- Wishlists
- Events
- Bookings
- Reviews
- Badges
- CoupleBadges
- Achievements
- CoupleAchievements
- Posts
- Comments
- Albums
- Milestones
- Notifications
- Referrals
- Credits
- Reports

### API Endpoints: **100+**
- Authentication: 8
- Couples: 12
- Connections: 10
- Messages: 8
- Products: 15
- Cart & Orders: 18
- Wishlist: 8
- Events: 12
- Bookings: 10
- Reviews: 12
- Social Features: 25+
- Admin APIs: 30+

### Features: **70+**
Grouped into 10 major categories

### Implementation Time: **20 weeks**
Divided into 8 phases

---

This visual architecture provides a complete overview of the CoupleDelight platform. Ready to start building? 🚀