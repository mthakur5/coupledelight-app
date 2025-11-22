# Admin Team Management System

This document describes the role-based admin team management system implemented in the CoupleDelight admin application.

## Overview

The admin panel now supports a hierarchical role-based access control system that separates regular users from admin team members. Admin team members can have different roles with varying levels of permissions.

## Admin Roles

### 1. Super Admin 👑
**Full system access with all permissions enabled**

Permissions:
- ✅ Manage Users
- ✅ Manage Products
- ✅ Manage Orders
- ✅ Manage Events
- ✅ Manage Couples
- ✅ Manage Bookings
- ✅ View Reports
- ✅ Manage Admin Team

Super Admins can:
- Add, edit, and remove admin team members
- Assign roles and permissions to other admins
- Access all features and sections
- Cannot delete themselves or the last super admin

### 2. Manager 👨‍💼
**Comprehensive management access (cannot manage admin team)**

Permissions:
- ✅ Manage Users
- ✅ Manage Products
- ✅ Manage Orders
- ✅ Manage Events
- ✅ Manage Couples
- ✅ Manage Bookings
- ✅ View Reports
- ❌ Manage Admin Team

Managers can:
- Handle day-to-day operations
- Manage all customer-facing features
- View analytics and reports
- Cannot add or modify admin team members

### 3. Supervisor 👨‍🏫
**Limited operational access**

Permissions:
- ❌ Manage Users
- ✅ Manage Products
- ✅ Manage Orders
- ✅ Manage Events
- ❌ Manage Couples
- ✅ Manage Bookings
- ✅ View Reports
- ❌ Manage Admin Team

Supervisors can:
- Manage products and inventory
- Process orders and bookings
- Handle event management
- View reports and analytics
- Cannot modify users or admin team

## Features

### 1. Separate User Management
- Regular users are managed in `/dashboard/users`
- Admin team members are managed in `/dashboard/admin-team`
- Clear separation prevents confusion and accidental modifications

### 2. Role-Based Navigation
- Dashboard sidebar shows only accessible features based on permissions
- Admin Team link is highlighted and only visible to those with permission
- User's role badge displayed in top navigation

### 3. Admin Team Management Page
Features include:
- View all admin team members
- Add new admin members with role selection
- View detailed permissions for each member
- Remove admin members (with safety checks)
- Statistics dashboard showing team composition

### 4. Custom Permissions
While each role has default permissions, Super Admins can:
- Override default permissions for individual team members
- Create custom permission sets
- Fine-tune access control as needed

### 5. Safety Features
- Cannot delete yourself
- Cannot delete the last Super Admin
- Cannot modify your own admin account
- Password requirements enforced (minimum 6 characters)
- Email uniqueness validation

## API Endpoints

### Get All Admin Team Members
```
GET /api/admin-team
```
Returns list of all admin team members (requires Super Admin or manageAdminTeam permission)

### Add New Admin Member
```
POST /api/admin-team
Body: {
  email: string,
  password: string,
  adminRole: 'super_admin' | 'manager' | 'supervisor',
  permissions?: {
    manageUsers?: boolean,
    manageProducts?: boolean,
    manageOrders?: boolean,
    manageEvents?: boolean,
    manageCouples?: boolean,
    manageBookings?: boolean,
    viewReports?: boolean,
    manageAdminTeam?: boolean
  }
}
```

### Get Single Admin Member
```
GET /api/admin-team/[id]
```

### Update Admin Member
```
PATCH /api/admin-team/[id]
Body: {
  adminRole?: string,
  permissions?: object,
  password?: string
}
```

### Delete Admin Member
```
DELETE /api/admin-team/[id]
```

## Database Schema Updates

### User Model Additions
```typescript
interface IUser {
  // ... existing fields
  adminRole?: 'super_admin' | 'manager' | 'supervisor';
  permissions?: {
    manageUsers?: boolean;
    manageProducts?: boolean;
    manageOrders?: boolean;
    manageEvents?: boolean;
    manageCouples?: boolean;
    manageBookings?: boolean;
    viewReports?: boolean;
    manageAdminTeam?: boolean;
  };
  addedBy?: mongoose.Types.ObjectId; // Tracks who added this admin
}
```

### Indexes
- `adminRole` - For efficient role-based queries
- `role` - For separating users from admins

## Migration

### For Existing Admins
Run the migration script to update existing admin accounts:

```bash
cd apps/admin
node scripts/migrateAdmins.js
```

This script will:
- Find all admin users without an adminRole
- Assign them Super Admin role
- Grant full permissions
- Ensure their account status is approved

## Usage Examples

### Adding a New Manager
1. Navigate to `/dashboard/admin-team`
2. Click "Add Admin Member"
3. Enter email and password
4. Select "Manager" role
5. Review default permissions (customize if needed)
6. Click "Add Admin Member"

### Checking Your Permissions
- Your role badge is displayed in the top-right corner
- Sidebar shows only features you have access to
- "Your Access" panel at bottom of sidebar shows your access level

### Viewing Team Member Permissions
1. Go to `/dashboard/admin-team`
2. Click on the permission count (e.g., "6/8 permissions")
3. Modal shows detailed permission breakdown with visual indicators

## Security Considerations

1. **Authentication**: All admin team management endpoints require authentication
2. **Authorization**: Most operations require Super Admin role or manageAdminTeam permission
3. **Self-Protection**: Users cannot modify or delete their own admin account
4. **Last Admin Protection**: Cannot delete the last Super Admin
5. **Password Security**: Passwords are hashed using bcrypt before storage
6. **Auto-Approval**: Admin team members are automatically approved upon creation

## Components

### AddAdminMemberModal
- Modal component for adding new admin members
- Role selection with visual descriptions
- Custom permission toggles
- Real-time validation

### AdminTeamTable
- Displays all admin team members
- Shows role badges with emojis
- Permission count with click-to-view details
- Remove action with confirmation
- Cannot remove yourself

## Best Practices

1. **Principle of Least Privilege**: Assign the minimum role necessary for job function
2. **Regular Audits**: Periodically review admin team members and their permissions
3. **Strong Passwords**: Enforce strong passwords for all admin accounts
4. **Separation of Duties**: Use Managers and Supervisors for day-to-day operations
5. **Backup Super Admin**: Always maintain at least 2 Super Admins

## Troubleshooting

### Cannot Access Admin Team Page
- Check if your account has `manageAdminTeam` permission or is a Super Admin
- Verify you're logged in with an admin account
- Check session expiration

### Cannot Add New Admin Member
- Ensure email is unique and not already in use
- Verify password meets minimum requirements (6+ characters)
- Check that you have Super Admin role or manageAdminTeam permission

### Permission Not Working
- Clear browser cache and reload
- Re-login to refresh session with updated permissions
- Verify permissions were saved correctly in database

## Future Enhancements

Potential improvements for future versions:
- Activity logging for admin actions
- Time-based access restrictions
- IP whitelist for admin access
- Two-factor authentication
- Bulk permission updates
- Role templates for quick setup
- Permission inheritance and role hierarchies

## Support

For questions or issues:
1. Check this documentation first
2. Review the migration script if upgrading
3. Check console logs for error messages
4. Verify database connection and schema