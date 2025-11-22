export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Get all admin team members
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if user has permission to manage admin team
    const currentUser = await User.findById(session.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Only super_admin can view admin team
    if (currentUser.adminRole !== 'super_admin' && !currentUser.permissions?.manageAdminTeam) {
      return NextResponse.json(
        { error: 'Forbidden: Only super admins can manage admin team' },
        { status: 403 }
      );
    }

    // Get all admin users with their details
    const adminTeam = await User.find({ role: 'admin' })
      .select('-password')
      .populate('addedBy', 'email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ adminTeam });
  } catch (error) {
    console.error('Error fetching admin team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin team' },
      { status: 500 }
    );
  }
}

// Add new admin team member
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if user has permission to manage admin team
    const currentUser = await User.findById(session.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Only super_admin can add admin team members
    if (currentUser.adminRole !== 'super_admin' && !currentUser.permissions?.manageAdminTeam) {
      return NextResponse.json(
        { error: 'Forbidden: Only super admins can add admin team members' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, password, adminRole, permissions } = body;

    // Validate required fields
    if (!email || !password || !adminRole) {
      return NextResponse.json(
        { error: 'Email, password, and admin role are required' },
        { status: 400 }
      );
    }

    // Validate admin role
    if (!['super_admin', 'manager', 'supervisor'].includes(adminRole)) {
      return NextResponse.json(
        { error: 'Invalid admin role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set default permissions based on role
    let defaultPermissions = {
      manageUsers: false,
      manageProducts: false,
      manageOrders: false,
      manageEvents: false,
      manageCouples: false,
      manageBookings: false,
      viewReports: false,
      manageAdminTeam: false,
    };

    if (adminRole === 'super_admin') {
      // Super admin gets all permissions
      defaultPermissions = {
        manageUsers: true,
        manageProducts: true,
        manageOrders: true,
        manageEvents: true,
        manageCouples: true,
        manageBookings: true,
        viewReports: true,
        manageAdminTeam: true,
      };
    } else if (adminRole === 'manager') {
      // Manager gets most permissions except admin team management
      defaultPermissions = {
        manageUsers: true,
        manageProducts: true,
        manageOrders: true,
        manageEvents: true,
        manageCouples: true,
        manageBookings: true,
        viewReports: true,
        manageAdminTeam: false,
      };
    } else if (adminRole === 'supervisor') {
      // Supervisor gets view permissions and limited management
      defaultPermissions = {
        manageUsers: false,
        manageProducts: true,
        manageOrders: true,
        manageEvents: true,
        manageCouples: false,
        manageBookings: true,
        viewReports: true,
        manageAdminTeam: false,
      };
    }

    // Merge with custom permissions if provided
    const finalPermissions = permissions ? { ...defaultPermissions, ...permissions } : defaultPermissions;

    // Create new admin user
    const newAdmin = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      emailVerified: true,
      provider: 'email',
      role: 'admin',
      adminRole,
      permissions: finalPermissions,
      accountStatus: 'approved',
      approvedAt: new Date(),
      approvedBy: currentUser._id,
      addedBy: currentUser._id,
    });

    // Return without password
    const { password: _, ...adminData } = newAdmin.toObject();

    return NextResponse.json(
      {
        message: 'Admin team member added successfully',
        admin: adminData
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding admin team member:', error);
    return NextResponse.json(
      { error: 'Failed to add admin team member' },
      { status: 500 }
    );
  }
}