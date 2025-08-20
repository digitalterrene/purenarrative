//app/api/auth/update/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

interface UpdateData {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const updateData: UpdateData = await request.json();
    const users = await getUserCollection();

    // Update user
    const result = await users.updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 400 }
      );
    }

    // Get updated user
    const updatedUser = await users.findOne({
      _id: new ObjectId(decoded.userId),
    });
    const { password, ...userWithoutPassword } = updatedUser || {};

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
