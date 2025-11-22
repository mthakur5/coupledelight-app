export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Get single admin team member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const currentUser = await User.findById(session.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const adminMember = await User.findOne({ _id: id, role: 'admin' })
      .select('-password')
      .populate('addedBy', 'email')
      .lean();

    if (!adminMember) {
      return NextResponse.json(
        { error: 'Admin member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ admin: adminMember });
  } catch (error) {
    console.error('Error fetching admin member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin member' },
      { status: 500 }
    );
  }
}

// Update admin team member permissions
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const currentUser = await User.findById(session.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Only super_admin can update admin team members
    if (currentUser.adminRole !== 'super_admin' && !currentUser.permissions?.manageAdminTeam) {
      return NextResponse.json(
        { error: 'Forbidden: Only super admins can update admin team members' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { adminRole, permissions, password } = body;

    const { id } = await params;
    const adminMember = await User.findOne({ _id: id, role: 'admin' });
    if (!adminMember) {
      return NextResponse.json(
        { error: 'Admin member not found' },
        { status: 404 }
      );
    }

    // Prevent users from modifying themselves to avoid lockout
    if (adminMember._id.toString() === currentUser._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot modify your own admin account' },
        { status: 400 }
      );
    }

    // Update admin role if provided
    if (adminRole && ['super_admin', 'manager', 'supervisor'].includes(adminRole)) {
      adminMember.adminRole = adminRole;
      
      // Set default permissions based on new role
      if (adminRole === 'super_admin') {
        adminMember.permissions = {
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
        adminMember.permissions = {
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
        adminMember.permissions = {
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
    }

    // Override with custom permissions if provided
    if (permissions) {
      adminMember.permissions = {
        ...adminMember.permissions,
        ...permissions,
      };
    }

    // Update password if provided
    if (password && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      adminMember.password = hashedPassword;
    }

    await adminMember.save();

    const { password: _, ...adminData } = adminMember.toObject();

    return NextResponse.json({
      message: 'Admin member updated successfully',
      admin: adminData,
    });
  } catch (error) {
    console.error('Error updating admin member:', error);
    return NextResponse.json(
      { error: 'Failed to update admin member' },
      { status: 500 }
    );
  }
}

// Delete admin team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const currentUser = await User.findById(session.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Only super_admin can delete admin team members
    if (currentUser.adminRole !== 'super_admin' && !currentUser.permissions?.manageAdminTeam) {
      return NextResponse.json(
        { error: 'Forbidden: Only super admins can delete admin team members' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const adminMember = await User.findOne({ _id: id, role: 'admin' });
    if (!adminMember) {
      return NextResponse.json(
        { error: 'Admin member not found' },
        { status: 404 }
      );
    }

    // Prevent users from deleting themselves
    if (adminMember._id.toString() === currentUser._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      );
    }

    // Check if this is the last super admin
    if (adminMember.adminRole === 'super_admin') {
      const superAdminCount = await User.countDocuments({ 
        role: 'admin', 
        adminRole: 'super_admin' 
      });
      
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last super admin' },
          { status: 400 }
        );
      }
    }

    await User.deleteOne({ _id: id });

    return NextResponse.json({
      message: 'Admin member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting admin member:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin member' },
      { status: 500 }
    );
  }
}