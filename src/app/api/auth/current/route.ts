//app/api/auth/current/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const users = await getUserCollection();
    const user = await users.findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Current user error:", error);
    return NextResponse.json({ user: null });
  }
}
