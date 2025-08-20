//app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUserCollection } from "@/lib/db";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const registerData: RegisterData = await request.json();

    // Validate input
    if (!registerData.name || !registerData.email || !registerData.password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const users = await getUserCollection();

    // Check if user exists
    const existingUser = await users.findOne({ email: registerData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    // Create new user
    const newUser = {
      name: registerData.name,
      email: registerData.email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    const insertedUser = await users.findOne({ _id: result.insertedId });

    // Create JWT token
    const token = jwt.sign(
      {
        userId: insertedUser?._id.toString(),
        email: insertedUser?.email,
        role: insertedUser?.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    const cookieStore = await cookies();
    // Set cookie
    cookieStore.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    });

    // Return response without password
    const { password, ...userWithoutPassword } = insertedUser || {};
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
