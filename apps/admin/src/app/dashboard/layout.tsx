'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Role badge component
  const getRoleBadge = (adminRole?: string) => {
    if (!adminRole) return null;
    
    switch (adminRole) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded">
            👑 Super Admin
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
            👨‍💼 Manager
          </span>
        );
      case 'supervisor':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">
            👨‍🏫 Supervisor
          </span>
        );
      default:
        return null;
    }
  };

  // Check if user is Super Admin (has full access to everything)
  // Also treat admins without adminRole but with all permissions as super admin (for backward compatibility)
  const isSuperAdmin =
    session?.user?.adminRole === 'super_admin' ||
    (session?.user?.role === 'admin' && !session?.user?.adminRole) ||
    (session?.user?.role === 'admin' && session?.user?.permissions?.manageAdminTeam === true);

  // Check permissions
  const hasPermission = (permission: string) => {
    // Super Admins bypass all permission checks
    if (isSuperAdmin) return true;
    
    if (!session?.user?.permissions) return false;
    return session.user.permissions[permission as keyof typeof session.user.permissions] === true;
  };

  // Define all navigation items with permission requirements
  const allNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', permission: null },
    { name: 'Users', href: '/dashboard/users', icon: '👥', permission: 'manageUsers' },
    { name: 'Couples', href: '/dashboard/couples', icon: '💑', permission: 'manageCouples' },
    { name: 'Events', href: '/dashboard/events', icon: '🎉', permission: 'manageEvents' },
    { name: 'Products', href: '/dashboard/products', icon: '📦', permission: 'manageProducts' },
    { name: 'Orders', href: '/dashboard/orders', icon: '🛒', permission: 'manageOrders' },
    { name: 'Bookings', href: '/dashboard/bookings', icon: '📅', permission: 'manageBookings' },
    { name: 'Reports', href: '/dashboard/reports', icon: '📈', permission: 'viewReports' },
    { name: 'Admin Team', href: '/dashboard/admin-team', icon: '👨‍💼', permission: 'manageAdminTeam', highlight: true },
  ];

  // Filter navigation based on permissions
  // Super Admins see everything, others see based on permissions
  const navigation = isSuperAdmin
    ? allNavigation
    : allNavigation.filter(item => {
        if (!item.permission) return true;
        return hasPermission(item.permission);
      });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                CoupleDelight Admin
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-right">
                <p className="font-medium text-gray-900">{session?.user?.email}</p>
                {getRoleBadge(session?.user?.adminRole)}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : item.highlight
                          ? 'text-purple-700 hover:bg-purple-50 border border-purple-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Permission Info */}
            {session?.user?.adminRole && (
              <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Your Access
                </p>
                <div className="text-xs text-gray-700">
                  {session.user.adminRole === 'super_admin' ? (
                    <p>✓ Full System Access</p>
                  ) : (
                    <p>✓ Limited Access</p>
                  )}
                </div>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}