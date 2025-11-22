export const runtime = 'nodejs';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AddAdminMemberModal from '@/components/AddAdminMemberModal';
import AdminTeamTable from '@/components/AdminTeamTable';

interface AdminMemberData {
  _id: string;
  email: string;
  adminRole: string;
  permissions: {
    manageUsers?: boolean;
    manageProducts?: boolean;
    manageOrders?: boolean;
    manageEvents?: boolean;
    manageCouples?: boolean;
    manageBookings?: boolean;
    viewReports?: boolean;
    manageAdminTeam?: boolean;
  };
  accountStatus: string;
  createdAt: string;
  addedBy?: {
    email: string;
  };
}

interface CurrentUser {
  _id: string;
  email: string;
  adminRole?: string;
}

async function getAdminTeam(): Promise<{ adminTeam: AdminMemberData[], currentUser: CurrentUser }> {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();

  const currentUser = await User.findById(session.user.id).lean();
  
  if (!currentUser || currentUser.role !== 'admin') {
    redirect('/login');
  }

  // Check if user has permission to manage admin team
  if (currentUser.adminRole !== 'super_admin' && !currentUser.permissions?.manageAdminTeam) {
    redirect('/dashboard');
  }

  const adminTeam = await User.find({ role: 'admin' })
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();

  return {
    adminTeam: adminTeam.map((admin) => ({
      _id: String(admin._id),
      email: admin.email,
      adminRole: admin.adminRole || 'super_admin',
      permissions: admin.permissions || {
        manageUsers: false,
        manageProducts: false,
        manageOrders: false,
        manageEvents: false,
        manageCouples: false,
        manageBookings: false,
        viewReports: false,
        manageAdminTeam: false,
      },
      accountStatus: admin.accountStatus || 'approved',
      createdAt: admin.createdAt.toISOString(),
      addedBy: undefined,
    })),
    currentUser: {
      _id: String(currentUser._id),
      email: currentUser.email,
      adminRole: currentUser.adminRole,
    },
  };
}

export default async function AdminTeamPage() {
  const { adminTeam, currentUser } = await getAdminTeam();

  // Calculate stats
  const totalAdmins = adminTeam.length;
  const superAdmins = adminTeam.filter(a => a.adminRole === 'super_admin').length;
  const managers = adminTeam.filter(a => a.adminRole === 'manager').length;
  const supervisors = adminTeam.filter(a => a.adminRole === 'supervisor').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Team Management</h1>
          <p className="text-gray-600 mt-2">Manage your admin team members and their permissions</p>
        </div>
        <AddAdminMemberModal />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalAdmins}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{superAdmins}</p>
            </div>
            <div className="text-3xl">👑</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Managers</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{managers}</p>
            </div>
            <div className="text-3xl">👨‍💼</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Supervisors</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{supervisors}</p>
            </div>
            <div className="text-3xl">👨‍🏫</div>
          </div>
        </div>
      </div>

      {/* Role Descriptions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Roles & Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👑</span>
              <h3 className="font-semibold text-purple-900">Super Admin</h3>
            </div>
            <p className="text-sm text-gray-600">Full access to all features including admin team management</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👨‍💼</span>
              <h3 className="font-semibold text-blue-900">Manager</h3>
            </div>
            <p className="text-sm text-gray-600">Can manage users, products, orders, events, couples, and bookings</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👨‍🏫</span>
              <h3 className="font-semibold text-green-900">Supervisor</h3>
            </div>
            <p className="text-sm text-gray-600">Can manage products, orders, events, and bookings with view-only access to users</p>
          </div>
        </div>
      </div>

      {/* Admin Team Table */}
      <AdminTeamTable adminTeam={adminTeam} currentUserId={currentUser._id} />
    </div>
  );
}