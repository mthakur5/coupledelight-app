import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { User as NextAuthUser } from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Dynamic import to avoid Edge Runtime issues
          const { default: dbConnect } = await import('./db');
          const { default: User } = await import('@/models/User');
          const bcrypt = await import('bcryptjs');

          await dbConnect();

          // Find user by email
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          // Check if user is admin
          if (user.role !== 'admin') {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isPasswordValid) {
            return null;
          }

          // Admins should always be approved, but check status
          if (user.accountStatus && user.accountStatus !== 'approved') {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            adminRole: user.adminRole,
            permissions: user.permissions,
          } as NextAuthUser;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.adminRole = user.adminRole;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.adminRole = token.adminRole as string | undefined;
        session.user.permissions = token.permissions;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
});