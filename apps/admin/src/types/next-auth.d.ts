import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role: string;
    adminRole?: string;
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
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      adminRole?: string;
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
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    adminRole?: string;
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
  }
}