import NextAuth, { NextAuthConfig, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import User from "@/models/User";

interface ExtendedUser extends NextAuthUser {
  id: string;
  role: string;
  emailVerified: boolean;
  accountStatus: string;
}

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Check if account is approved
        if (user.accountStatus !== 'approved') {
          const statusMessages = {
            pending: 'Your account is pending admin approval. Please wait for approval.',
            rejected: 'Your account has been rejected. Please contact support.',
            suspended: 'Your account has been suspended. Please contact support.',
          };
          throw new Error(statusMessages[user.accountStatus as keyof typeof statusMessages] || 'Account not approved');
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in. Check your inbox for verification link.');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          accountStatus: user.accountStatus,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        await dbConnect();

        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user with pending status
          existingUser = await User.create({
            email: user.email,
            emailVerified: true,
            provider: account.provider,
            role: "user",
            accountStatus: "pending",
          });
        }

        // Check if account is approved
        if (existingUser.accountStatus !== 'approved') {
          return false; // Prevent login
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.email = extendedUser.email;
        token.role = extendedUser.role;
        token.emailVerified = extendedUser.emailVerified;
        token.accountStatus = extendedUser.accountStatus;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          emailVerified: token.emailVerified as boolean,
          accountStatus: token.accountStatus as string,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  basePath: '/api/auth',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export { authConfig };