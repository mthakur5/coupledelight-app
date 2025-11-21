import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, profile } = body;

    // Validate input
    if (!email || !password) {
      console.error("Registration validation failed: Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.error("Registration validation failed: Password too short");
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Connect to database
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected successfully");

    // Check if user already exists
    console.log("Checking for existing user:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("User already exists:", email);
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    console.log("Creating new user...");
    const user = await User.create({
      email,
      password: hashedPassword,
      provider: "email",
      role: "user",
      emailVerified: false,
      profile: profile || {},
    });
    console.log("User created successfully:", user._id);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Check if it's a MongoDB duplicate key error
    interface MongoError extends Error {
      code?: number;
    }
    
    if (error instanceof Error && 'code' in error && (error as MongoError).code === 11000) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}