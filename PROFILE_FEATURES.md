# Profile Features Documentation

## Overview
The CoupleDelight profile system now includes comprehensive profile management with multiple sections for detailed information and preferences.

## Features Implemented

### 1. Enhanced User Model
**File**: `apps/main/src/models/User.ts`

The User model has been expanded with the following sections:

#### Profile Information
- **Basic Information**
  - Couple Name
  - Partner 1: Name, Age, Gender
  - Partner 2: Name, Age, Gender
  - Profile Picture & Cover Photo URLs

- **Relationship Details**
  - Relationship Status (dating, engaged, married, domestic-partnership, other)
  - Anniversary Date
  - Relationship Start Date

- **Contact & Location**
  - Phone Number
  - City, State, Country
  - General Location

- **About Section**
  - Bio (max 1000 characters)
  - Interests (array)
  - Hobbies (array)
  - Favorite Activities (array)
  - Relationship Goals (max 500 characters)

- **Social**
  - Looking For (couples, singles, both, groups, friends-only)
  - Social Links (Instagram, Facebook, Twitter, LinkedIn)

- **Favorites**
  - Favorite Restaurants (array)
  - Favorite Places (array)
  - Favorite Movies (array)
  - Favorite Music (array)

#### Preferences
- **Notification Preferences**
  - Email Notifications (events, messages, friend requests, event reminders, new products, order updates, weekly digest)
  - SMS Notifications (event reminders, order updates, important alerts)
  - Push Notifications (enabled, events, messages, friend requests)

- **Privacy Settings**
  - Profile Visibility (public, friends-only, private)
  - Show Email, Phone, Location, Age, Online Status
  - Allow Messages From (everyone, friends-only, none)

- **Event Preferences**
  - Interested Categories (array)
  - Price Range (min/max)
  - Preferred Days (array)
  - Max Distance

- **App Settings**
  - Language (en, hi, es, fr)
  - Theme (light, dark, auto)
  - Currency (USD, INR, EUR, GBP)
  - Timezone

### 2. Profile API Endpoint
**File**: `apps/main/src/app/api/profile/route.ts`

Three HTTP methods are supported:

- **GET** - Fetch user profile
  - Authentication required
  - Returns user data without password

- **PUT** - Full update of profile/preferences
  - Updates profile and preferences sections
  - Merges new data with existing data
  - Returns updated user data

- **PATCH** - Partial update for specific sections
  - Allows granular updates to specific fields
  - Supports nested field updates
  - Runs MongoDB validators

### 3. Profile Edit Form Component
**File**: `apps/main/src/components/ProfileEditForm.tsx`

A comprehensive form component with:
- **9 Tabbed Sections**: Basic Info, Relationship, Contact & Location, About Us, Social, Favorites, Notifications, Privacy, Preferences
- **Input Validation**: Client-side validation for all fields
- **Error Handling**: Display errors and success messages
- **Array Field Support**: Comma-separated input for array fields (interests, hobbies, etc.)
- **Checkbox Groups**: For notification and privacy settings
- **Select Dropdowns**: For predefined options

### 4. Updated Profile Page
**File**: `apps/main/src/app/profile/page.tsx`

Features:
- **View Mode**: Display all profile information in organized sections
- **Edit Mode**: Toggle to edit form with all fields
- **Real-time Updates**: Fetch and display current profile data
- **Success Messages**: Confirmation when profile is updated
- **Error Handling**: Display error messages when operations fail
- **Loading States**: Show loading indicator during data fetch
- **Responsive Design**: Mobile-friendly layout

## Usage

### Accessing the Profile Page
1. Navigate to `/profile` in the main app
2. Must be logged in to access
3. Click "Edit Profile" button to modify information

### Editing Profile Information
1. Click "Edit Profile" button
2. Navigate through tabs to different sections
3. Fill in desired fields
4. Click "Save Changes" to update
5. Click "Cancel" to discard changes

### API Usage Examples

#### Fetch Profile
```typescript
const response = await fetch('/api/profile', {
  method: 'GET'
});
const { user } = await response.json();
```

#### Update Profile
```typescript
const response = await fetch('/api/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    profile: {
      coupleName: 'John & Jane',
      bio: 'We love traveling together!'
    },
    preferences: {
      language: 'en',
      theme: 'dark'
    }
  })
});
```

#### Partial Update
```typescript
const response = await fetch('/api/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    profile: {
      bio: 'Updated bio'
    },
    preferences: {
      privacy: {
        profileVisibility: 'friends-only'
      }
    }
  })
});
```

## Field Validations

### Profile Fields
- **Ages**: Minimum 18 years
- **Bio**: Maximum 1000 characters
- **Relationship Goals**: Maximum 500 characters
- **Phone**: Standard phone format
- **Email**: Valid email format (from User model)
- **Gender**: Predefined options (male, female, other, prefer-not-to-say)
- **Relationship Status**: Predefined options

### Preferences
- **Language**: en, hi, es, fr
- **Theme**: light, dark, auto
- **Currency**: USD, INR, EUR, GBP
- **Profile Visibility**: public, friends-only, private
- **Allow Messages From**: everyone, friends-only, none

## Security Features

1. **Authentication Required**: All profile operations require valid session
2. **User-Specific Data**: Users can only access/modify their own profile
3. **Password Excluded**: Password field is never returned in API responses
4. **Input Validation**: Server-side validation using Mongoose validators
5. **Sanitization**: Trimming and lowercasing where appropriate

## Default Values

### Preferences Defaults
- Language: 'en'
- Theme: 'light'
- Currency: 'INR'
- Timezone: 'Asia/Kolkata'
- Email Notifications: Most enabled by default
- SMS Notifications: All disabled by default
- Push Notifications: Most enabled by default
- Profile Visibility: 'public'
- Show Location: true
- Show Age: true
- Allow Messages From: 'everyone'
- Show Online Status: true

## Database Schema

All profile and preference data is stored in the User collection with proper indexes and validation. The schema supports:
- Optional fields (most profile fields)
- Array fields (interests, hobbies, etc.)
- Nested objects (socialLinks, preferences subsections)
- Date fields (anniversaryDate, relationshipStartDate)
- Enum validation (gender, relationship status, etc.)

## Future Enhancements

Potential improvements:
1. Profile picture upload functionality
2. Cover photo upload functionality
3. Email verification process
4. Password change functionality
5. Two-factor authentication
6. Activity log/history
7. Account deletion flow
8. Data export feature
9. Privacy policy acknowledgment
10. Partner linking/invitation system

## Testing Checklist

- [ ] Profile page loads correctly
- [ ] Edit mode toggles properly
- [ ] All tabs display correct fields
- [ ] Form validation works
- [ ] Data saves successfully
- [ ] Error messages display properly
- [ ] Success messages display properly
- [ ] Array fields (comma-separated) work correctly
- [ ] Date fields work correctly
- [ ] Checkbox groups work correctly
- [ ] Profile data displays correctly in view mode
- [ ] API endpoints return correct data
- [ ] Authentication is enforced
- [ ] Responsive design works on mobile

## Related Files

- User Model: `apps/main/src/models/User.ts`
- Profile API: `apps/main/src/app/api/profile/route.ts`
- Profile Page: `apps/main/src/app/profile/page.tsx`
- Edit Form Component: `apps/main/src/components/ProfileEditForm.tsx`
- Auth Config: `apps/main/src/lib/auth.ts`
- Database Config: `apps/main/src/lib/db.ts`